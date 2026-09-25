// Lectura y escritura de la configuración general de la app
// (ingreso mensual, día de cobro esperado, umbral de gasto hormiga, etc.)
import { obtenerBD } from './baseDeDatos.js';

export async function obtenerConfiguracion() {
  const bd = await obtenerBD();
  return bd.get('configuracion', 'principal');
}

/**
 * Actualiza solo los campos indicados en `cambios`, sin tocar el resto.
 * @param {Partial<{ingresoMensual:number, diaCobroEsperado:number, umbralHormiga:number}>} cambios
 */
export async function guardarConfiguracion(cambios) {
  const bd = await obtenerBD();
  const actual = await bd.get('configuracion', 'principal');
  const actualizada = { ...actual, ...cambios };
  await bd.put('configuracion', actualizada);
  return actualizada;
}
