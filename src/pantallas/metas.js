// Pantalla de Metas de ahorro: el Fondo de Emergencia siempre va primero
// (se calcula solo, como 1 mes de tus esenciales actuales), y debajo tus
// metas personalizadas en el orden en que se van a financiar.
import { obtenerMetasConProgreso } from '../logica/motorMetas.js';
import { crearMeta, editarMeta, borrarMeta, moverMeta } from '../datos/metas.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { formatearFechaLarga } from '../utilidades/fechas.js';
import { refrescar } from '../router.js';

export async function renderMetas(contenedor) {
  const metas = await obtenerMetasConProgreso();
  const ahorroMensual = metas[0]?.ahorroMensual ?? 0;

  contenedor.innerHTML = `
    <div class="pantalla">
      <p class="eyebrow">Metas de ahorro</p>
      <p class="cifra-media" style="margin-top: 8px;">${formatearMoneda(ahorroMensual)} / mes</p>
      <p class="texto-tenue" style="margin-top: 4px; font-size: 13px;">
        Tu ahorro llena primero la meta de arriba; cuando se completa, empieza a llenar la siguiente.
      </p>

      <div style="margin-top: 24px;">
        ${metas.map((meta, indice) => tarjetaMeta(meta, indice, metas.length)).join('')}
      </div>

      <button class="btn btn-fantasma btn-bloque" id="btn-nueva-meta" style="margin-top: 16px;">
        + Nueva meta
      </button>
    </div>
  `;

  contenedor.querySelector('#btn-nueva-meta').addEventListener('click', () => abrirFormulario(null));

  contenedor.querySelectorAll('[data-editar-meta]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const meta = metas.find((m) => m.id === boton.dataset.editarMeta);
      abrirFormulario(meta);
    });
  });

  contenedor.querySelectorAll('[data-mover]').forEach((boton) => {
    boton.addEventListener('click', async () => {
      await moverMeta(boton.dataset.mover, boton.dataset.direccion);
      await refrescar();
    });
  });
}

function tarjetaMeta(meta, indice, total) {
  const porcentaje = meta.objetivo > 0 ? Math.min(100, (meta.asignado / meta.objetivo) * 100) : 0;
  const esMovible = !meta.esFondoEmergencia;

  return `
    <div class="tarjeta-clara" style="margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="eyebrow" style="color:#4d4947;">${meta.esFondoEmergencia ? 'Prioridad 1 · recomendado' : `Prioridad ${indice + 1}`}</span>
        ${meta.completado ? '<span class="badge badge-verde">Completado</span>' : ''}
      </div>
      <p style="font-size: 20px; margin-top: 4px;">${meta.nombre}</p>

      <div class="barra-progreso" style="margin-top: 12px; background: #d8d5d2;">
        <div class="barra-progreso__relleno" style="width: ${porcentaje}%;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px; color:#4d4947;">
        <span>${formatearMoneda(meta.asignado)}</span>
        <span>de ${formatearMoneda(meta.objetivo)}</span>
      </div>

      ${
        !meta.completado
          ? `<p style="margin-top: 8px; color:#101010;">
              ${meta.mesesEstimados === null ? 'Configura tu ahorro mensual para estimar una fecha.' : meta.mesesEstimados === 0 ? 'Ya está financiada.' : `Faltan ${formatearMoneda(meta.faltante)} · lo completarías en ${meta.mesesEstimados} mes${meta.mesesEstimados === 1 ? '' : 'es'} (${formatearFechaLarga(meta.fechaEstimada)})`}
            </p>`
          : ''
      }

      ${
        meta.fechaObjetivoUsuario
          ? `<p style="margin-top: 4px; font-size: 13px; color:#4d4947;">
              Tu fecha objetivo: ${formatearFechaLarga(meta.fechaObjetivoUsuario)}
              ${meta.comparacionFecha === 'a-tiempo' ? ' — vas a tiempo ✓' : ''}
              ${meta.comparacionFecha === 'atrasado' ? ' — al ritmo actual llegarías tarde' : ''}
            </p>`
          : ''
      }

      <div style="display:flex; gap:8px; margin-top: 16px;">
        ${esMovible ? `<button class="btn btn-fantasma" data-editar-meta="${meta.id}" style="color:#101010; border-color:#4d4947;">Editar</button>` : ''}
        ${esMovible && indice > 0 ? `<button class="btn btn-fantasma" data-mover="${meta.id}" data-direccion="arriba" style="color:#101010; border-color:#4d4947;">▲</button>` : ''}
        ${esMovible && indice < total - 1 ? `<button class="btn btn-fantasma" data-mover="${meta.id}" data-direccion="abajo" style="color:#101010; border-color:#4d4947;">▼</button>` : ''}
      </div>
    </div>
  `;
}

function abrirFormulario(metaExistente) {
  const esEdicion = metaExistente !== null;
  const fondo = document.createElement('div');
  fondo.className = 'panel-fondo';
  fondo.innerHTML = `
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>${esEdicion ? 'Editar meta' : 'Nueva meta'}</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-form" aria-label="Cerrar">✕</button>
      </div>

      <form id="form-meta">
        <div class="campo">
          <label>Nombre</label>
          <input type="text" id="campo-nombre" required maxlength="40" value="${esEdicion ? metaExistente.nombre : ''}" placeholder="Ej: Laptop para trabajar" />
        </div>

        <div class="campo">
          <label>Precio</label>
          <input type="number" id="campo-precio" required min="0" step="0.01" value="${esEdicion ? metaExistente.precioObjetivo : ''}" />
        </div>

        <div class="campo">
          <label>Fecha objetivo (opcional)</label>
          <input type="date" id="campo-fecha" value="${esEdicion && metaExistente.fechaObjetivo ? metaExistente.fechaObjetivo : ''}" />
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque">Guardar</button>
        ${
          esEdicion
            ? `<button type="button" class="btn btn-peligro btn-bloque" id="btn-borrar-meta" style="margin-top: 12px;">Borrar meta</button>`
            : ''
        }
      </form>
    </div>
  `;

  document.body.appendChild(fondo);

  fondo.querySelector('#btn-cerrar-form').addEventListener('click', () => fondo.remove());
  fondo.addEventListener('click', (evento) => {
    if (evento.target === fondo) fondo.remove();
  });

  fondo.querySelector('#form-meta').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = {
      nombre: fondo.querySelector('#campo-nombre').value.trim(),
      precioObjetivo: parseFloat(fondo.querySelector('#campo-precio').value) || 0,
      fechaObjetivo: fondo.querySelector('#campo-fecha').value || null,
    };

    if (esEdicion) {
      await editarMeta(metaExistente.id, datos);
    } else {
      await crearMeta(datos);
    }

    fondo.remove();
    await refrescar();
  });

  const btnBorrar = fondo.querySelector('#btn-borrar-meta');
  if (btnBorrar) {
    btnBorrar.addEventListener('click', async () => {
      const confirmado = window.confirm(`¿Borrar la meta "${metaExistente.nombre}"? Esto no se puede deshacer.`);
      if (!confirmado) return;
      await borrarMeta(metaExistente.id);
      fondo.remove();
      await refrescar();
    });
  }
}
