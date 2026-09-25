// Respaldo completo de los datos: exportar todo a un archivo JSON (para
// guardarlo donde quieras) y volver a importarlo si cambias de celular o
// borras el navegador por error. También exporta el historial a CSV para
// abrirlo en Excel.
import { obtenerBD } from './baseDeDatos.js';
import { listarTransacciones } from './transacciones.js';
import { listarCategorias } from './categorias.js';
import { listarBolsillos } from './bolsillos.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { formatearFechaLarga } from '../utilidades/fechas.js';

const TABLAS = ['configuracion', 'categorias', 'bolsillos', 'transacciones', 'ciclos', 'cierresSemana', 'metas'];
const VERSION_RESPALDO = 1;

/** Junta todas las tablas de la base de datos en un solo objeto. */
export async function generarRespaldo() {
  const bd = await obtenerBD();
  const datos = {};
  for (const tabla of TABLAS) {
    datos[tabla] = await bd.getAll(tabla);
  }
  return {
    version: VERSION_RESPALDO,
    generadoEn: new Date().toISOString(),
    app: 'finanzas-personales',
    datos,
  };
}

/**
 * Reemplaza TODOS los datos actuales por los del respaldo. Es destructivo
 * a propósito (restaurar un respaldo significa "quiero que quede así"),
 * por eso la pantalla que llama a esto debe pedir confirmación antes.
 */
export async function restaurarRespaldo(respaldo) {
  if (!respaldo || typeof respaldo !== 'object' || !respaldo.datos) {
    throw new Error('El archivo no tiene el formato de un respaldo válido');
  }

  const bd = await obtenerBD();
  const transaccion = bd.transaction(TABLAS, 'readwrite');

  for (const tabla of TABLAS) {
    const almacen = transaccion.objectStore(tabla);
    await almacen.clear();
    const registros = respaldo.datos[tabla] || [];
    for (const registro of registros) {
      await almacen.put(registro);
    }
  }

  await transaccion.done;
}

function descargarArchivo(contenido, nombreArchivo, tipoMime) {
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

/** Descarga el respaldo completo como un archivo .json */
export async function descargarRespaldoJSON() {
  const respaldo = await generarRespaldo();
  const fecha = new Date().toISOString().slice(0, 10);
  descargarArchivo(JSON.stringify(respaldo, null, 2), `respaldo-finanzas-${fecha}.json`, 'application/json');
}

function escaparCeldaCSV(valor) {
  const texto = String(valor ?? '');
  if (texto.includes(',') || texto.includes('"') || texto.includes('\n')) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

/** Descarga todo el historial de gastos como un archivo .csv (para Excel). */
export async function descargarHistorialCSV() {
  const [transacciones, categorias, bolsillos] = await Promise.all([
    listarTransacciones(),
    listarCategorias(),
    listarBolsillos(),
  ]);
  const nombrePorId = new Map([...categorias, ...bolsillos].map((o) => [o.id, o.nombre]));

  const encabezado = ['Fecha', 'Categoria', 'Monto', 'Nota'];
  const filas = transacciones.map((t) => [
    formatearFechaLarga(t.fecha),
    nombrePorId.get(t.origenId) || 'Categoría eliminada',
    formatearMoneda(t.monto),
    t.nota || '',
  ]);

  // ﻿ al inicio: para que Excel detecte bien los acentos (UTF-8 con BOM)
  const csv = '﻿' + [encabezado, ...filas].map((fila) => fila.map(escaparCeldaCSV).join(',')).join('\r\n');
  const fecha = new Date().toISOString().slice(0, 10);
  descargarArchivo(csv, `historial-finanzas-${fecha}.csv`, 'text/csv;charset=utf-8');
}
