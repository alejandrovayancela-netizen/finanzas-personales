// Cálculo de las "semanas" del ciclo de pago. Son funciones puras (no leen
// ni escriben la base de datos), por eso son fáciles de probar: reciben
// fechas y números, y devuelven fechas y números.
import { diferenciaDias, sumarDias, sumarMeses } from '../utilidades/fechas.js';
import { redondearMonto } from '../utilidades/dinero.js';

/**
 * Como el día de cobro real varía (Alejandro cobra entre el 11 y el 13),
 * mientras no se confirme el siguiente cobro asumimos que el ciclo dura
 * un mes calendario completo desde que empezó. Esto es una estimación de
 * planificación: si el próximo cobro llega un día antes o después, el
 * ciclo simplemente se cierra ahí y el pequeño desfase no rompe nada.
 * @param {string} fechaInicio
 * @returns {string} fecha estimada del último día del ciclo
 */
export function estimarFinDeCiclo(fechaInicio) {
  const inicioSiguienteCiclo = sumarMeses(fechaInicio, 1);
  return sumarDias(inicioSiguienteCiclo, -1);
}

/**
 * Divide un rango de fechas en bloques de 7 días ("semanas"). El último
 * bloque puede quedar más corto que 7 días si el ciclo no es múltiplo
 * exacto de una semana — así se reparte proporcionalmente cada día del mes.
 * @param {string} fechaInicio
 * @param {string} fechaFin
 * @returns {{numero:number, inicio:string, fin:string, dias:number}[]}
 */
export function calcularSemanas(fechaInicio, fechaFin) {
  const totalDias = diferenciaDias(fechaInicio, fechaFin) + 1;
  const numeroDeSemanas = Math.max(1, Math.ceil(totalDias / 7));
  const semanas = [];

  for (let i = 0; i < numeroDeSemanas; i++) {
    const inicio = sumarDias(fechaInicio, i * 7);
    const finPropuesto = sumarDias(inicio, 6);
    const fin = finPropuesto > fechaFin ? fechaFin : finPropuesto;
    const dias = diferenciaDias(inicio, fin) + 1;
    semanas.push({ numero: i + 1, inicio, fin, dias });
  }

  return semanas;
}

/**
 * Encuentra en qué semana cae una fecha (normalmente "hoy"). Si la fecha
 * queda fuera del rango calculado, devuelve la semana más cercana.
 * @param {{inicio:string, fin:string}[]} semanas
 * @param {string} fechaISO
 */
export function obtenerSemanaDe(semanas, fechaISO) {
  const encontrada = semanas.find((s) => fechaISO >= s.inicio && fechaISO <= s.fin);
  if (encontrada) return encontrada;
  return fechaISO < semanas[0].inicio ? semanas[0] : semanas[semanas.length - 1];
}

/**
 * Presupuesto proporcional de una semana: monto mensual repartido según
 * cuántos días de esa semana caen dentro del ciclo, sobre el total de días
 * del ciclo completo.
 * @param {number} montoMensual
 * @param {{dias:number}} semana
 * @param {number} totalDiasCiclo
 */
export function calcularPresupuestoSemana(montoMensual, semana, totalDiasCiclo) {
  if (totalDiasCiclo <= 0) return 0;
  return redondearMonto((montoMensual * semana.dias) / totalDiasCiclo);
}
