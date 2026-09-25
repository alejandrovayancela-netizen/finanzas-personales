// Funciones para trabajar con fechas.
// Importante: trabajamos siempre con fechas "locales" (el día del celular
// del usuario), nunca con UTC, para evitar que un gasto registrado a las
// 11pm termine contado en el día siguiente por un desfase de huso horario.

const NOMBRES_MES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/**
 * Fecha de hoy en formato "YYYY-MM-DD", usando la hora local del dispositivo.
 * @returns {string}
 */
export function hoyISO() {
  return fechaAISO(new Date());
}

/**
 * Convierte un objeto Date a texto "YYYY-MM-DD" en hora local.
 * @param {Date} fecha
 * @returns {string}
 */
export function fechaAISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/**
 * Convierte un texto "YYYY-MM-DD" a un objeto Date a medianoche local.
 * @param {string} iso
 * @returns {Date}
 */
export function isoAFecha(iso) {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

/**
 * Cantidad de días completos entre dos fechas ISO (fin - inicio).
 * @param {string} inicioISO
 * @param {string} finISO
 * @returns {number}
 */
export function diferenciaDias(inicioISO, finISO) {
  const msPorDia = 24 * 60 * 60 * 1000;
  const inicio = isoAFecha(inicioISO);
  const fin = isoAFecha(finISO);
  return Math.round((fin.getTime() - inicio.getTime()) / msPorDia);
}

/**
 * Suma (o resta, con número negativo) días a una fecha ISO.
 * @param {string} iso
 * @param {number} dias
 * @returns {string}
 */
export function sumarDias(iso, dias) {
  const fecha = isoAFecha(iso);
  fecha.setDate(fecha.getDate() + dias);
  return fechaAISO(fecha);
}

/**
 * Suma (o resta) meses calendario a una fecha ISO. Si el día no existe en el
 * mes de destino (ej. 31 de enero + 1 mes), se ajusta al último día de ese
 * mes en vez de "desbordarse" al mes siguiente.
 * @param {string} iso
 * @param {number} meses
 * @returns {string}
 */
export function sumarMeses(iso, meses) {
  const fecha = isoAFecha(iso);
  const diaOriginal = fecha.getDate();
  fecha.setMonth(fecha.getMonth() + meses);
  if (fecha.getDate() !== diaOriginal) {
    fecha.setDate(0); // Se pasó de mes: retrocede al último día del mes correcto
  }
  return fechaAISO(fecha);
}

/**
 * Texto corto y amigable para mostrar en pantalla, ej: "24 sep".
 * @param {string} iso
 * @returns {string}
 */
export function formatearFechaCorta(iso) {
  const fecha = isoAFecha(iso);
  return `${fecha.getDate()} ${NOMBRES_MES[fecha.getMonth()]}`;
}

/**
 * Texto de fecha completa, ej: "24/09/2026".
 * @param {string} iso
 * @returns {string}
 */
export function formatearFechaLarga(iso) {
  const fecha = isoAFecha(iso);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}
