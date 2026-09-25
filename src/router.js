// Router muy simple basado en el hash de la URL (#/categorias, #/ajustes...).
// No usamos ninguna librería de rutas: con 3-4 pantallas no hace falta.
import { renderHoy } from './pantallas/hoy.js';
import { renderCategorias } from './pantallas/categorias.js';
import { renderMetas } from './pantallas/metas.js';
import { renderResumen } from './pantallas/resumen.js';
import { renderHistorial } from './pantallas/historial.js';
import { renderSuscripciones } from './pantallas/suscripciones.js';
import { renderConfiguracion } from './pantallas/configuracion.js';
import { pintarNavegacion } from './componentes/navegacion.js';

const RUTAS = {
  '': { render: renderHoy, id: 'hoy' },
  '#/categorias': { render: renderCategorias, id: 'categorias' },
  '#/metas': { render: renderMetas, id: 'metas' },
  '#/resumen': { render: renderResumen, id: 'resumen' },
  '#/historial': { render: renderHistorial, id: 'resumen' },
  '#/suscripciones': { render: renderSuscripciones, id: 'resumen' },
  '#/ajustes': { render: renderConfiguracion, id: 'ajustes' },
};

let contenedorVista;

function obtenerRutaActual() {
  return RUTAS[window.location.hash] || RUTAS[''];
}

async function pintarRutaActual() {
  const ruta = obtenerRutaActual();
  pintarNavegacion(ruta.id);
  await ruta.render(contenedorVista);
}

/** Vuelve a pintar la pantalla actual (usar después de guardar/borrar algo). */
export async function refrescar() {
  await pintarRutaActual();
}

export function iniciarRouter(contenedor) {
  contenedorVista = contenedor;
  window.addEventListener('hashchange', pintarRutaActual);
  pintarRutaActual();
}
