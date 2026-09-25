// Un "ciclo" es el período entre un día de cobro y el siguiente.
// Mientras no se haya confirmado el primer cobro, la app está en
// "modo seguimiento": se puede registrar todo con normalidad, pero
// todavía no hay presupuesto semanal ni semáforo (eso empieza con el
// primer ciclo confirmado).
import { obtenerBD } from './baseDeDatos.js';
import { generarId } from '../utilidades/id.js';
import { sumarDias } from '../utilidades/fechas.js';
import { listarBolsillos, ajustarSaldoAcumulado } from './bolsillos.js';

/** Devuelve el ciclo actualmente abierto (fechaFin todavía en null), o null. */
export async function obtenerCicloActivo() {
  const bd = await obtenerBD();
  const ciclos = await bd.getAll('ciclos');
  return ciclos.find((c) => c.fechaFin === null) || null;
}

/** true si todavía no se ha confirmado ningún día de cobro. */
export async function estaEnModoSeguimiento() {
  const ciclo = await obtenerCicloActivo();
  return ciclo === null;
}

export async function listarCiclos() {
  const bd = await obtenerBD();
  const ciclos = await bd.getAll('ciclos');
  return ciclos.sort((a, b) => (a.fechaInicio < b.fechaInicio ? 1 : -1));
}

/**
 * Se llama cuando Alejandro confirma "Ya cobré": es el momento del
 * "págate primero". Cierra el ciclo anterior (si había uno) el día antes
 * de la nueva fecha, abre uno nuevo, y separa de inmediato lo que le toca
 * a Ahorro, Imprevistos y Reserva (Gustos no: tiene tope mensual duro y
 * no se acumula). Cualquier gasto que se registre después contra uno de
 * estos bolsillos resta de ese mismo saldo apartado, en tiempo real.
 * @param {string} fechaISO fecha en la que efectivamente cobró
 */
export async function confirmarCobro(fechaISO) {
  const bd = await obtenerBD();
  const cicloAnterior = await obtenerCicloActivo();

  if (cicloAnterior) {
    const cierre = sumarDias(fechaISO, -1);
    await bd.put('ciclos', { ...cicloAnterior, fechaFin: cierre });
  }

  const nuevoCiclo = {
    id: generarId(),
    fechaInicio: fechaISO,
    fechaFin: null,
  };
  await bd.put('ciclos', nuevoCiclo);

  const bolsillos = await listarBolsillos();
  for (const bolsillo of bolsillos) {
    if (bolsillo.acumula) {
      await ajustarSaldoAcumulado(bolsillo.id, bolsillo.monto);
    }
  }

  return nuevoCiclo;
}
