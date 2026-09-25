// Funciones para trabajar con montos de dinero (siempre en dólares, USD).
// Formato pedido: "$37,00" -> coma para decimales, punto para miles.

/**
 * Convierte un número a texto con formato de dinero: "$1.234,56"
 * @param {number} numero
 * @returns {string}
 */
export function formatearMoneda(numero) {
  const valor = Number.isFinite(numero) ? numero : 0;
  const partes = valor.toFixed(2).split('.');
  const enteros = partes[0].replace('-', '');
  const decimales = partes[1];
  const enterosConPuntos = enteros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const signo = valor < 0 ? '-' : '';
  return `${signo}$${enterosConPuntos},${decimales}`;
}

/**
 * Redondea un monto a 2 decimales evitando errores de coma flotante
 * (ej. 0.1 + 0.2 en JavaScript no da exactamente 0.3).
 * @param {number} numero
 * @returns {number}
 */
export function redondearMonto(numero) {
  return Math.round((numero + Number.EPSILON) * 100) / 100;
}
