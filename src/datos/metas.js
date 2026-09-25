// CRUD de metas de ahorro personalizadas (equipo de trabajo, cursos, etc.)
// El Fondo de Emergencia NO se guarda aquí: es especial y siempre va primero
// (ver src/logica/metas.js), su objetivo se calcula solo a partir de tus
// gastos esenciales actuales.
import { obtenerBD } from './baseDeDatos.js';
import { generarId } from '../utilidades/id.js';

export async function listarMetas() {
  const bd = await obtenerBD();
  const metas = await bd.getAll('metas');
  return metas.sort((a, b) => a.orden - b.orden);
}

/**
 * Crea una meta nueva, al final de la fila (se financia después de las
 * que ya existen).
 * @param {{nombre:string, precioObjetivo:number, fechaObjetivo?:string}} datos
 */
export async function crearMeta(datos) {
  const bd = await obtenerBD();
  const existentes = await listarMetas();
  const meta = {
    id: generarId(),
    nombre: datos.nombre,
    precioObjetivo: datos.precioObjetivo,
    fechaObjetivo: datos.fechaObjetivo || null,
    orden: existentes.length,
    creadaEn: Date.now(),
  };
  await bd.put('metas', meta);
  return meta;
}

export async function editarMeta(id, cambios) {
  const bd = await obtenerBD();
  const actual = await bd.get('metas', id);
  if (!actual) throw new Error('La meta no existe');
  const actualizada = { ...actual, ...cambios };
  await bd.put('metas', actualizada);
  return actualizada;
}

export async function borrarMeta(id) {
  const bd = await obtenerBD();
  await bd.delete('metas', id);
}

/**
 * Cambia la prioridad de una meta, intercambiando su posición con la
 * meta vecina (arriba = se financia antes, abajo = se financia después).
 */
export async function moverMeta(id, direccion) {
  const bd = await obtenerBD();
  const metas = await listarMetas();
  const indice = metas.findIndex((m) => m.id === id);
  const indiceVecino = direccion === 'arriba' ? indice - 1 : indice + 1;
  if (indice === -1 || indiceVecino < 0 || indiceVecino >= metas.length) return;

  const ordenActual = metas[indice].orden;
  metas[indice].orden = metas[indiceVecino].orden;
  metas[indiceVecino].orden = ordenActual;

  await bd.put('metas', metas[indice]);
  await bd.put('metas', metas[indiceVecino]);
}
