// Calcula cuánto se ha gastado, en el período actual, en cada categoría
// y cada bolsillo. El "período actual" es:
//   - desde el inicio del ciclo confirmado, si ya hay uno, o
//   - desde el primer uso de la app, si todavía estamos en "modo seguimiento".
// La lógica de presupuesto semanal y semáforo (fase 2) se construye encima
// de estos mismos datos, así que este archivo es la base de todo lo demás.
import { obtenerCicloActivo } from '../datos/ciclos.js';
import { obtenerConfiguracion } from '../datos/configuracion.js';
import { listarCategorias } from '../datos/categorias.js';
import { listarBolsillos } from '../datos/bolsillos.js';
import { listarTransacciones } from '../datos/transacciones.js';
import { hoyISO } from '../utilidades/fechas.js';
import { redondearMonto } from '../utilidades/dinero.js';

/**
 * Determina el rango de fechas del período que está corriendo ahora mismo.
 */
export async function obtenerRangoPeriodoActual() {
  const ciclo = await obtenerCicloActivo();
  if (ciclo) {
    return { inicio: ciclo.fechaInicio, fin: hoyISO(), enModoSeguimiento: false, ciclo };
  }
  const config = await obtenerConfiguracion();
  return {
    inicio: config.fechaPrimerUso,
    fin: hoyISO(),
    enModoSeguimiento: true,
    ciclo: null,
  };
}

/**
 * Arma la lista de categorías y bolsillos con lo gastado en el período
 * actual, para pintar la pantalla "Hoy" y el selector del registro rápido.
 */
export async function calcularResumenOrigenes() {
  const { inicio, fin, enModoSeguimiento } = await obtenerRangoPeriodoActual();
  const [categorias, bolsillos, transacciones] = await Promise.all([
    listarCategorias(),
    listarBolsillos(),
    listarTransacciones({ desde: inicio, hasta: fin }),
  ]);

  const sumarPorOrigen = (id) =>
    redondearMonto(
      transacciones
        .filter((t) => t.origenId === id)
        .reduce((suma, t) => suma + t.monto, 0)
    );

  const filasCategorias = categorias.map((c) => ({
    tipo: 'categoria',
    id: c.id,
    nombre: c.nombre,
    monto: c.monto,
    tipoGasto: c.tipo,
    gastado: sumarPorOrigen(c.id),
  }));

  const filasBolsillos = bolsillos.map((b) => ({
    tipo: 'bolsillo',
    id: b.id,
    nombre: b.nombre,
    monto: b.monto,
    acumula: b.acumula,
    saldoAcumulado: b.saldoAcumulado,
    gastado: sumarPorOrigen(b.id),
  }));

  return { categorias: filasCategorias, bolsillos: filasBolsillos, inicio, fin, enModoSeguimiento };
}
