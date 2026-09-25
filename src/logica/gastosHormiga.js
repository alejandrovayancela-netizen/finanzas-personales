// Detector de "gastos hormiga": compras pequeñas y frecuentes que, juntas,
// pesan mucho más de lo que parece. Son funciones puras sobre una lista de
// transacciones ya filtrada por el período que se quiera analizar.
import { redondearMonto } from '../utilidades/dinero.js';

/**
 * @param {{monto:number}[]} transacciones del período (normalmente, el mes)
 * @param {number} umbral cualquier gasto por debajo de este monto cuenta como "hormiga"
 */
export function calcularGastosHormiga(transacciones, umbral) {
  const hormigas = transacciones.filter((t) => t.monto < umbral);
  const totalMes = redondearMonto(hormigas.reduce((suma, t) => suma + t.monto, 0));
  const proyeccionAnual = redondearMonto(totalMes * 12);

  return { cantidad: hormigas.length, totalMes, proyeccionAnual };
}
