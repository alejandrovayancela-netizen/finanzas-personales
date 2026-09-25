// CRUD de transacciones: cada gasto (o retiro) que registra Alejandro.
// Una transacción siempre tiene un "origen": una categoría esencial
// (ej. Comida) o un bolsillo (ej. Gustos, Imprevistos, Reserva, Ahorro).
import { obtenerBD } from './baseDeDatos.js';
import { generarId } from '../utilidades/id.js';
import { hoyISO } from '../utilidades/fechas.js';
import { redondearMonto } from '../utilidades/dinero.js';
import { obtenerBolsillo, ajustarSaldoAcumulado } from './bolsillos.js';

/**
 * Ahorro, Imprevistos y Reserva funcionan como una libreta: registrar un
 * gasto contra ellos resta de su saldo apartado en el momento, y borrar o
 * editar ese gasto revierte el efecto. Gustos y las categorías esenciales
 * no llevan este saldo (Gustos se controla por su tope mensual, no acumula).
 */
async function ajustarSaldoPorTransaccion(transaccion, signo) {
  if (!transaccion || transaccion.origenTipo !== 'bolsillo') return;
  const bolsillo = await obtenerBolsillo(transaccion.origenId);
  if (!bolsillo || !bolsillo.acumula) return;
  await ajustarSaldoAcumulado(bolsillo.id, signo * transaccion.monto);
}

/**
 * Registra un gasto nuevo.
 * @param {{monto:number, origenTipo:'categoria'|'bolsillo', origenId:string,
 *   nota?:string, fecha?:string, confirmoRetiroAhorro?:boolean}} datos
 */
export async function crearTransaccion(datos) {
  if (!datos.origenTipo || !datos.origenId) {
    throw new Error('Toda transacción necesita un origen (categoría o bolsillo)');
  }
  if (!(datos.monto > 0)) {
    throw new Error('El monto debe ser mayor a cero');
  }
  // Regla explícita de Alejandro: nunca tocar el Ahorro sin confirmación.
  if (datos.origenTipo === 'bolsillo' && datos.origenId === 'ahorro' && !datos.confirmoRetiroAhorro) {
    throw new Error('Un retiro de Ahorro necesita confirmación explícita');
  }

  const transaccion = {
    id: generarId(),
    fecha: datos.fecha || hoyISO(),
    monto: redondearMonto(datos.monto),
    nota: datos.nota || '',
    origenTipo: datos.origenTipo,
    origenId: datos.origenId,
    creadoEn: Date.now(),
  };

  const bd = await obtenerBD();
  await bd.put('transacciones', transaccion);
  await ajustarSaldoPorTransaccion(transaccion, -1); // resta del saldo apartado
  return transaccion;
}

export async function editarTransaccion(id, cambios) {
  const bd = await obtenerBD();
  const actual = await bd.get('transacciones', id);
  if (!actual) throw new Error('La transacción no existe');
  const actualizada = { ...actual, ...cambios };
  if (cambios.monto !== undefined) {
    actualizada.monto = redondearMonto(cambios.monto);
  }
  await ajustarSaldoPorTransaccion(actual, 1); // revierte el efecto de la versión anterior
  await bd.put('transacciones', actualizada);
  await ajustarSaldoPorTransaccion(actualizada, -1); // aplica el efecto de la nueva versión
  return actualizada;
}

export async function borrarTransaccion(id) {
  const bd = await obtenerBD();
  const actual = await bd.get('transacciones', id);
  await bd.delete('transacciones', id);
  await ajustarSaldoPorTransaccion(actual, 1); // revierte el efecto sobre el saldo apartado
}

export async function obtenerTransaccion(id) {
  const bd = await obtenerBD();
  return bd.get('transacciones', id);
}

/**
 * Lista transacciones, opcionalmente filtradas por rango de fechas
 * (ambas incluidas) y/o por origen (categoría o bolsillo).
 * @param {{desde?:string, hasta?:string, origenId?:string}} filtros
 */
export async function listarTransacciones(filtros = {}) {
  const bd = await obtenerBD();
  let transacciones = await bd.getAll('transacciones');

  if (filtros.desde) {
    transacciones = transacciones.filter((t) => t.fecha >= filtros.desde);
  }
  if (filtros.hasta) {
    transacciones = transacciones.filter((t) => t.fecha <= filtros.hasta);
  }
  if (filtros.origenId) {
    transacciones = transacciones.filter((t) => t.origenId === filtros.origenId);
  }

  return transacciones.sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha < b.fecha ? 1 : -1;
    return b.creadoEn - a.creadoEn;
  });
}

/** Suma cuánto se ha gastado en un origen dentro de un rango de fechas. */
export async function totalGastadoEnRango(origenId, desde, hasta) {
  const transacciones = await listarTransacciones({ origenId, desde, hasta });
  return redondearMonto(transacciones.reduce((suma, t) => suma + t.monto, 0));
}
