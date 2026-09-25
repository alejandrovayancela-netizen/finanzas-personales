// Revisión mensual de gastos fijos: por cada uno, preguntar si de verdad
// se usa y conviene, y dar la opción de borrarlo ahí mismo si la respuesta
// es no. Pensado para hacerse una vez al mes, cuando ya cobraste.
import { listarCategorias, borrarCategoria } from '../datos/categorias.js';
import { obtenerConfiguracion, guardarConfiguracion } from '../datos/configuracion.js';
import { obtenerInfoCiclo } from '../logica/motorPresupuesto.js';
import { formatearMoneda } from '../utilidades/dinero.js';

export async function renderSuscripciones(contenedor) {
  const [categorias, config, infoCiclo] = await Promise.all([
    listarCategorias(),
    obtenerConfiguracion(),
    obtenerInfoCiclo(),
  ]);

  const fijas = categorias.filter((c) => c.tipo === 'fija');

  contenedor.innerHTML = `
    <div class="pantalla">
      <p class="eyebrow">Revisión de suscripciones</p>
      <p class="texto-tenue" style="margin-top: 8px; font-size: 14px;">
        Por cada gasto fijo: ¿lo usaste este mes? ¿te ayuda a ganar dinero o a mejorar? Si la
        respuesta es no, bórralo de una vez.
      </p>

      <div style="margin-top: 20px;">
        ${fijas.map(tarjetaSuscripcion).join('') || '<p class="texto-tenue">No tienes categorías fijas todavía.</p>'}
      </div>

      <button class="btn btn-oscuro btn-grande btn-bloque" id="btn-terminar-revision" style="margin-top: 16px;">
        Ya revisé todo esto
      </button>
    </div>
  `;

  contenedor.querySelectorAll('[data-borrar-suscripcion]').forEach((boton) => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.borrarSuscripcion;
      const categoria = fijas.find((c) => c.id === id);
      const confirmado = window.confirm(`¿Borrar "${categoria.nombre}"? Esto cancela el seguimiento de este gasto fijo en la app.`);
      if (!confirmado) return;
      await borrarCategoria(id);
      boton.closest('.tarjeta-oscura').remove();
    });
  });

  contenedor.querySelector('#btn-terminar-revision').addEventListener('click', async () => {
    if (infoCiclo) {
      await guardarConfiguracion({ ultimaRevisionSuscripcionesCicloId: infoCiclo.ciclo.id });
    }
    window.location.hash = '#/resumen';
  });
}

function tarjetaSuscripcion(categoria) {
  return `
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between;">
        <span>${categoria.nombre}</span>
        <span style="font-family: var(--fuente-mono);">${formatearMoneda(categoria.monto)} / mes</span>
      </div>
      <p class="texto-tenue" style="margin-top: 8px; font-size: 13px;">¿La sigues usando y te conviene pagarla?</p>
      <button class="btn btn-peligro btn-bloque" data-borrar-suscripcion="${categoria.id}" style="margin-top: 12px;">
        No, cancelar / borrar esta
      </button>
    </div>
  `;
}
