// Junta los datos guardados (Ahorro acumulado, tus esenciales actuales,
// tus metas) con la lógica pura de la cascada, para pintar la pantalla
// de Metas: el Fondo de Emergencia siempre primero, luego tus metas en
// el orden que tú definas.
import { obtenerBolsillo } from '../datos/bolsillos.js';
import { totalEsencialesMensual } from '../datos/categorias.js';
import { listarMetas } from '../datos/metas.js';
import { calcularCascadaAhorro, calcularFechaEstimada } from './metas.js';
import { hoyISO, diferenciaDias } from '../utilidades/fechas.js';

const ID_FONDO_EMERGENCIA = 'fondo-emergencia';

export async function obtenerMetasConProgreso() {
  const [ahorro, totalEsenciales, metas] = await Promise.all([
    obtenerBolsillo('ahorro'),
    totalEsencialesMensual(),
    listarMetas(),
  ]);

  const buckets = [
    { id: ID_FONDO_EMERGENCIA, objetivo: totalEsenciales },
    ...metas.map((m) => ({ id: m.id, objetivo: m.precioObjetivo })),
  ];

  const cascada = calcularCascadaAhorro(ahorro.saldoAcumulado, buckets, ahorro.monto);
  const hoy = hoyISO();

  return cascada.map((resultado) => {
    const esFondoEmergencia = resultado.id === ID_FONDO_EMERGENCIA;
    const meta = esFondoEmergencia ? null : metas.find((m) => m.id === resultado.id);
    const fechaEstimada = calcularFechaEstimada(hoy, resultado.mesesEstimados);

    let comparacionFecha = null;
    if (!esFondoEmergencia && meta?.fechaObjetivo && fechaEstimada && !resultado.completado) {
      const diferencia = diferenciaDias(meta.fechaObjetivo, fechaEstimada);
      comparacionFecha = diferencia <= 0 ? 'a-tiempo' : 'atrasado';
    }

    return {
      ...resultado,
      esFondoEmergencia,
      nombre: esFondoEmergencia ? 'Fondo de emergencia' : meta.nombre,
      fechaObjetivoUsuario: esFondoEmergencia ? null : meta.fechaObjetivo,
      fechaEstimada,
      comparacionFecha,
      ahorroMensual: ahorro.monto,
    };
  });
}
