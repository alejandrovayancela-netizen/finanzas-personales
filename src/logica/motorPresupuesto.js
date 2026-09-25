// El "motor" que junta los datos guardados (ciclo activo, categorías,
// transacciones) con la lógica pura de semanas.js y semaforo.js, para
// entregarle a las pantallas todo lo que necesitan mostrar.
import { obtenerCicloActivo } from '../datos/ciclos.js';
import { listarCategorias } from '../datos/categorias.js';
import { listarBolsillos } from '../datos/bolsillos.js';
import { listarTransacciones, totalGastadoEnRango } from '../datos/transacciones.js';
import { buscarCierre, guardarCierre, obtenerAjusteSemanaSiguiente } from '../datos/cierresSemana.js';
import { obtenerBD } from '../datos/baseDeDatos.js';
import { hoyISO, diferenciaDias } from '../utilidades/fechas.js';
import { redondearMonto } from '../utilidades/dinero.js';
import { estimarFinDeCiclo, calcularSemanas, obtenerSemanaDe, calcularPresupuestoSemana } from './semanas.js';
import { calcularEstadoSemaforo, generarMensajeAlerta } from './semaforo.js';

// Categorías/bolsillos a los que SÍ se les aplica el semáforo de ritmo:
// las categorías esenciales variables (por semana) y Gustos (por mes,
// tope duro). Imprevistos y Reserva son colchones que se van acumulando,
// así que no tiene sentido "apurarlos" con un semáforo de ritmo.
const ID_GUSTOS = 'gustos';

/**
 * Arma toda la información del ciclo activo: fechas, semanas y en cuál
 * semana estamos hoy. Devuelve null si todavía estamos en modo seguimiento.
 */
export async function obtenerInfoCiclo() {
  const ciclo = await obtenerCicloActivo();
  if (!ciclo) return null;

  const hoy = hoyISO();
  const fechaFin = ciclo.fechaFin || estimarFinDeCiclo(ciclo.fechaInicio);
  const totalDias = diferenciaDias(ciclo.fechaInicio, fechaFin) + 1;
  const semanas = calcularSemanas(ciclo.fechaInicio, fechaFin);
  const semanaActual = obtenerSemanaDe(semanas, hoy);

  return { ciclo, fechaFin, totalDias, semanas, semanaActual, hoy };
}

/**
 * Estado de semáforo de una categoría esencial variable, calculado sobre
 * la semana actual (con el ajuste de sobrante de la semana pasada, si
 * Alejandro decidió pasarlo para acá).
 */
async function calcularEstadoSemanal(origen, infoCiclo) {
  const { ciclo, totalDias, semanaActual } = infoCiclo;

  const [gastado, ajuste] = await Promise.all([
    totalGastadoEnRango(origen.id, semanaActual.inicio, semanaActual.fin),
    semanaActual.numero > 1
      ? obtenerAjusteSemanaSiguiente(ciclo.id, origen.id, semanaActual.numero - 1)
      : Promise.resolve(0),
  ]);

  const presupuestoBase = calcularPresupuestoSemana(origen.monto, semanaActual, totalDias);
  const presupuesto = redondearMonto(presupuestoBase + ajuste);
  const diasTranscurridos = Math.min(
    Math.max(diferenciaDias(semanaActual.inicio, infoCiclo.hoy) + 1, 0),
    semanaActual.dias
  );

  const resultado = calcularEstadoSemaforo({
    presupuesto,
    gastado,
    diasTranscurridos,
    diasTotales: semanaActual.dias,
  });

  return { ...resultado, presupuesto, gastado, mensaje: generarMensajeAlerta(origen.nombre, resultado) };
}

/** Estado de semáforo de Gustos: tope mensual duro, sobre el ciclo completo. */
async function calcularEstadoMensual(origen, infoCiclo) {
  const { ciclo, totalDias, hoy } = infoCiclo;
  const gastado = await totalGastadoEnRango(origen.id, ciclo.fechaInicio, hoy);
  const diasTranscurridos = Math.min(Math.max(diferenciaDias(ciclo.fechaInicio, hoy) + 1, 0), totalDias);

  const resultado = calcularEstadoSemaforo({
    presupuesto: origen.monto,
    gastado,
    diasTranscurridos,
    diasTotales: totalDias,
  });

  return { ...resultado, presupuesto: origen.monto, gastado, mensaje: generarMensajeAlerta(origen.nombre, resultado) };
}

/**
 * Reúne el estado completo para pintar la pantalla "Hoy": el semáforo de
 * cada categoría variable y de Gustos, más los totales simples del resto.
 */
export async function obtenerEstadoCompleto() {
  const infoCiclo = await obtenerInfoCiclo();
  const [categorias, bolsillos] = await Promise.all([listarCategorias(), listarBolsillos()]);

  if (!infoCiclo) {
    // Todavía en modo seguimiento: no hay semáforo, solo totales simples.
    return { enModoSeguimiento: true, infoCiclo: null, conSemaforo: [], sinSemaforo: { categorias, bolsillos } };
  }

  const categoriasFijas = categorias.filter((c) => c.tipo === 'fija');
  const categoriasVariables = categorias.filter((c) => c.tipo === 'variable');
  const gustos = bolsillos.find((b) => b.id === ID_GUSTOS);
  const otrosBolsillos = bolsillos.filter((b) => b.id !== ID_GUSTOS);

  const conSemaforo = await Promise.all([
    ...categoriasVariables.map(async (c) => ({
      tipo: 'categoria',
      id: c.id,
      nombre: c.nombre,
      periodo: 'semana',
      ...(await calcularEstadoSemanal(c, infoCiclo)),
    })),
    (async () => ({
      tipo: 'bolsillo',
      id: gustos.id,
      nombre: gustos.nombre,
      periodo: 'mes',
      ...(await calcularEstadoMensual(gustos, infoCiclo)),
    }))(),
  ]);

  return {
    enModoSeguimiento: false,
    infoCiclo,
    conSemaforo,
    sinSemaforo: { categoriasFijas, otrosBolsillos },
  };
}

/**
 * Antes de guardar un gasto nuevo, calcula a qué estado de semáforo pasaría
 * ese origen SI se guardara. Se usa para la alerta "antes de guardar".
 * Devuelve null si el origen no tiene semáforo (fijas, imprevistos, reserva, ahorro).
 */
export async function simularEstadoConNuevoGasto(origenTipo, origenId, montoNuevo) {
  const infoCiclo = await obtenerInfoCiclo();
  if (!infoCiclo) return null;

  if (origenTipo === 'bolsillo' && origenId === ID_GUSTOS) {
    const bolsillos = await listarBolsillos();
    const gustos = bolsillos.find((b) => b.id === ID_GUSTOS);
    const estadoActual = await calcularEstadoMensual(gustos, infoCiclo);
    return recalcularConGastoExtra(gustos.nombre, estadoActual, montoNuevo, infoCiclo.totalDias, infoCiclo.totalDias);
  }

  if (origenTipo === 'categoria') {
    const categorias = await listarCategorias();
    const categoria = categorias.find((c) => c.id === origenId);
    if (!categoria || categoria.tipo !== 'variable') return null;
    const estadoActual = await calcularEstadoSemanal(categoria, infoCiclo);
    const diasTranscurridos = Math.min(
      Math.max(diferenciaDias(infoCiclo.semanaActual.inicio, infoCiclo.hoy) + 1, 0),
      infoCiclo.semanaActual.dias
    );
    return recalcularConGastoExtra(
      categoria.nombre,
      estadoActual,
      montoNuevo,
      diasTranscurridos,
      infoCiclo.semanaActual.dias
    );
  }

  return null;
}

function recalcularConGastoExtra(nombre, estadoActual, montoNuevo, diasTranscurridos, diasTotales) {
  const resultado = calcularEstadoSemaforo({
    presupuesto: estadoActual.presupuesto,
    gastado: redondearMonto(estadoActual.gastado + montoNuevo),
    diasTranscurridos,
    diasTotales,
  });
  return { ...resultado, mensaje: generarMensajeAlerta(nombre, resultado) };
}

/**
 * Busca semanas ya terminadas (de categorías variables) que tuvieron
 * sobrante y todavía no se ha decidido qué hacer con ese dinero.
 */
export async function obtenerSobrantesPendientes() {
  const infoCiclo = await obtenerInfoCiclo();
  if (!infoCiclo) return [];

  const categorias = (await listarCategorias()).filter((c) => c.tipo === 'variable');
  const pendientes = [];

  for (const categoria of categorias) {
    for (const semana of infoCiclo.semanaActual.numero > 1 ? infoCiclo.semanas : []) {
      if (semana.fin >= infoCiclo.hoy) continue; // todavía no termina
      if (semana.numero >= infoCiclo.semanaActual.numero) continue;

      const yaResuelto = await buscarCierre(infoCiclo.ciclo.id, categoria.id, semana.numero);
      if (yaResuelto) continue;

      const presupuesto = calcularPresupuestoSemana(categoria.monto, semana, infoCiclo.totalDias);
      const gastado = await totalGastadoEnRango(categoria.id, semana.inicio, semana.fin);
      const sobrante = redondearMonto(presupuesto - gastado);

      if (sobrante > 0.01) {
        pendientes.push({
          cicloId: infoCiclo.ciclo.id,
          origenId: categoria.id,
          nombre: categoria.nombre,
          semanaNumero: semana.numero,
          sobrante,
        });
      }
    }
  }

  return pendientes;
}

/** Guarda la decisión de Alejandro sobre un sobrante semanal pendiente. */
export async function resolverSobrante({ cicloId, origenId, semanaNumero, sobrante, decision }) {
  await guardarCierre({ cicloId, origenId, semanaNumero, sobrante, decision });

  if (decision === 'ahorro') {
    const bd = await obtenerBD();
    const ahorro = await bd.get('bolsillos', 'ahorro');
    await bd.put('bolsillos', { ...ahorro, saldoAcumulado: redondearMonto(ahorro.saldoAcumulado + sobrante) });
  }
}
