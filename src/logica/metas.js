// Lógica pura de las metas de ahorro: cómo se reparte el saldo acumulado
// entre el fondo de emergencia y las metas personalizadas, en cascada
// (primero se llena la que está más arriba en la fila, luego la siguiente).
import { redondearMonto } from '../utilidades/dinero.js';
import { sumarMeses } from '../utilidades/fechas.js';

/**
 * Reparte el saldo total ahorrado entre una fila de "cofres" (buckets) en
 * orden de prioridad: el primero se llena por completo antes de que algo
 * le toque al segundo, y así sucesivamente.
 *
 * @param {number} saldoTotal cuánto hay realmente ahorrado ahora mismo
 * @param {{id:string, objetivo:number}[]} buckets en orden de prioridad
 * @param {number} ahorroMensual cuánto se aparta cada mes (para estimar fechas)
 * @returns {Array<{id:string, objetivo:number, asignado:number, faltante:number,
 *   completado:boolean, mesesEstimados:number|null}>}
 */
export function calcularCascadaAhorro(saldoTotal, buckets, ahorroMensual) {
  let saldoRestante = Math.max(saldoTotal, 0);
  let objetivoAcumulado = 0;

  return buckets.map((bucket) => {
    objetivoAcumulado = redondearMonto(objetivoAcumulado + bucket.objetivo);

    const asignado = redondearMonto(Math.min(saldoRestante, bucket.objetivo));
    saldoRestante = redondearMonto(saldoRestante - asignado);

    const faltante = redondearMonto(Math.max(bucket.objetivo - asignado, 0));
    const completado = faltante <= 0;

    const faltanteHastaAqui = redondearMonto(Math.max(objetivoAcumulado - saldoTotal, 0));
    const mesesEstimados =
      completado || ahorroMensual <= 0 ? (completado ? 0 : null) : Math.ceil(faltanteHastaAqui / ahorroMensual);

    return { id: bucket.id, objetivo: bucket.objetivo, asignado, faltante, completado, mesesEstimados };
  });
}

/** Convierte una cantidad de meses estimados en una fecha ISO aproximada. */
export function calcularFechaEstimada(hoyISOActual, mesesEstimados) {
  if (mesesEstimados === null || mesesEstimados === undefined) return null;
  return sumarMeses(hoyISOActual, mesesEstimados);
}
