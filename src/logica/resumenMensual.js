// Arma el resumen mensual: presupuestado vs. real por cada categoría y
// bolsillo, comparado con el ciclo anterior, y un consejo concreto basado
// en los propios datos de Alejandro (no un mensaje genérico).
import { listarCategorias } from '../datos/categorias.js';
import { listarBolsillos } from '../datos/bolsillos.js';
import { listarCiclos } from '../datos/ciclos.js';
import { totalGastadoEnRango } from '../datos/transacciones.js';
import { redondearMonto, formatearMoneda } from '../utilidades/dinero.js';
import { hoyISO } from '../utilidades/fechas.js';

/** Busca el ciclo justo antes del activo (el "mes anterior" ya cerrado). */
async function obtenerCicloAnterior() {
  const ciclos = await listarCiclos(); // ordenados: el activo (fechaFin null) primero
  return ciclos.find((c) => c.fechaFin !== null) || null;
}

/**
 * Arma la lista de origenes (categorías + Gustos/Imprevistos/Reserva) con
 * presupuestado, real y lo gastado el ciclo anterior, ordenada de mayor a
 * menor sobregasto (para responder "¿dónde me pasé más?").
 */
export async function calcularResumenMensual(infoCiclo) {
  const [categorias, bolsillos, cicloAnterior] = await Promise.all([
    listarCategorias(),
    listarBolsillos(),
    obtenerCicloAnterior(),
  ]);

  const origenes = [
    ...categorias.map((c) => ({ id: c.id, nombre: c.nombre, monto: c.monto })),
    ...bolsillos.filter((b) => b.id !== 'ahorro').map((b) => ({ id: b.id, nombre: b.nombre, monto: b.monto })),
  ];

  const filas = await Promise.all(
    origenes.map(async (origen) => {
      const real = await totalGastadoEnRango(origen.id, infoCiclo.ciclo.fechaInicio, hoyISO());
      const anterior = cicloAnterior
        ? await totalGastadoEnRango(origen.id, cicloAnterior.fechaInicio, cicloAnterior.fechaFin)
        : null;
      const sobregasto = redondearMonto(real - origen.monto);
      const delta = anterior !== null ? redondearMonto(real - anterior) : null;

      return { ...origen, presupuestado: origen.monto, real, anterior, sobregasto, delta };
    })
  );

  filas.sort((a, b) => b.sobregasto - a.sobregasto);

  return { filas, hayCicloAnterior: cicloAnterior !== null };
}

/** Genera un consejo concreto, basado en el propio resumen, no genérico. */
export function generarConsejo(filas) {
  const conSobregasto = filas.filter((f) => f.sobregasto > 0).sort((a, b) => b.sobregasto - a.sobregasto);

  if (conSobregasto.length === 0) {
    const totalPresupuestado = filas.reduce((s, f) => s + f.presupuestado, 0);
    const totalReal = filas.reduce((s, f) => s + f.real, 0);
    const disponible = redondearMonto(totalPresupuestado - totalReal);
    if (disponible > 0) {
      return `Vas dentro de todos tus presupuestos. Te quedan ${formatearMoneda(disponible)} sin gastar este mes — considera pasarlos a tu Ahorro.`;
    }
    return 'Vas dentro de todos tus presupuestos este mes. Sigue así.';
  }

  const peor = conSobregasto[0];
  if (conSobregasto.length === 1) {
    return `Tu único sobregasto este mes es en ${peor.nombre}: te pasaste por ${formatearMoneda(peor.sobregasto)}. Revisa esa categoría la próxima semana.`;
  }

  return `Donde más te pasaste este mes es en ${peor.nombre} (${formatearMoneda(peor.sobregasto)} de más), seguido de ${conSobregasto[1].nombre} (${formatearMoneda(conSobregasto[1].sobregasto)} de más). Empieza por ahí.`;
}
