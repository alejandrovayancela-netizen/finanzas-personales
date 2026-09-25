// CRUD de categorías de gasto esencial (Internet, Comida, etc.)
import { obtenerBD } from './baseDeDatos.js';
import { generarId } from '../utilidades/id.js';

/** Lista todas las categorías, ordenadas por nombre. */
export async function listarCategorias() {
  const bd = await obtenerBD();
  const categorias = await bd.getAll('categorias');
  return categorias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export async function obtenerCategoria(id) {
  const bd = await obtenerBD();
  return bd.get('categorias', id);
}

/**
 * Crea una categoría nueva.
 * @param {{nombre:string, monto:number, tipo:'fija'|'variable', diaPago?:number}} datos
 */
export async function crearCategoria(datos) {
  const bd = await obtenerBD();
  const categoria = { id: generarId(), ...datos };
  await bd.put('categorias', categoria);
  return categoria;
}

/** Edita una categoría existente (nombre, monto, tipo, etc.) */
export async function editarCategoria(id, cambios) {
  const bd = await obtenerBD();
  const actual = await bd.get('categorias', id);
  if (!actual) throw new Error('La categoría no existe');
  const actualizada = { ...actual, ...cambios };
  await bd.put('categorias', actualizada);
  return actualizada;
}

export async function borrarCategoria(id) {
  const bd = await obtenerBD();
  await bd.delete('categorias', id);
}

/** Suma cuánto cuestan en total las categorías esenciales al mes. */
export async function totalEsencialesMensual() {
  const categorias = await listarCategorias();
  return categorias.reduce((suma, categoria) => suma + categoria.monto, 0);
}
