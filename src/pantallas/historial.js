// Pantalla de Historial: todos los gastos registrados, con búsqueda, filtro
// por categoría/bolsillo y por fecha, y la opción de editar o borrar cada uno.
import { listarTransacciones, editarTransaccion, borrarTransaccion } from '../datos/transacciones.js';
import { listarCategorias } from '../datos/categorias.js';
import { listarBolsillos } from '../datos/bolsillos.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { formatearFechaLarga, hoyISO } from '../utilidades/fechas.js';
import { refrescar } from '../router.js';
import { mostrarConfirmacion } from '../componentes/confirmacion.js';

let filtros = { busqueda: '', origenId: '', desde: '', hasta: '' };

export async function renderHistorial(contenedor) {
  const [transacciones, categorias, bolsillos] = await Promise.all([
    listarTransacciones(),
    listarCategorias(),
    listarBolsillos(),
  ]);

  const origenes = [
    ...categorias.map((c) => ({ ...c, _origenTipo: 'categoria' })),
    ...bolsillos.map((b) => ({ ...b, _origenTipo: 'bolsillo' })),
  ];
  const nombrePorId = new Map(origenes.map((o) => [o.id, o.nombre]));

  const filtradas = transacciones.filter((t) => {
    const nombreOrigen = nombrePorId.get(t.origenId) || '';
    const coincideBusqueda =
      !filtros.busqueda ||
      t.nota.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      nombreOrigen.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const coincideOrigen = !filtros.origenId || t.origenId === filtros.origenId;
    const coincideDesde = !filtros.desde || t.fecha >= filtros.desde;
    const coincideHasta = !filtros.hasta || t.fecha <= filtros.hasta;
    return coincideBusqueda && coincideOrigen && coincideDesde && coincideHasta;
  });

  const totalFiltrado = filtradas.reduce((s, t) => s + t.monto, 0);

  contenedor.innerHTML = `
    <div class="pantalla">
      <p class="eyebrow">Historial</p>

      <div class="campo" style="margin-top: 16px;">
        <input type="text" id="input-busqueda" placeholder="Buscar por nota o categoría" value="${filtros.busqueda}" />
      </div>

      <div class="campo">
        <select id="select-origen">
          <option value="">Todas las categorías y bolsillos</option>
          ${origenes.map((o) => `<option value="${o.id}" ${filtros.origenId === o.id ? 'selected' : ''}>${o.nombre}</option>`).join('')}
        </select>
      </div>

      <div style="display:flex; gap:8px;">
        <div class="campo" style="flex:1;">
          <label>Desde</label>
          <input type="date" id="input-desde" value="${filtros.desde}" />
        </div>
        <div class="campo" style="flex:1;">
          <label>Hasta</label>
          <input type="date" id="input-hasta" value="${filtros.hasta}" />
        </div>
      </div>

      <p class="texto-tenue" style="margin-bottom: 12px;">
        ${filtradas.length} gasto${filtradas.length === 1 ? '' : 's'} · total ${formatearMoneda(totalFiltrado)}
      </p>

      ${filtradas.map((t) => filaTransaccion(t, nombrePorId.get(t.origenId))).join('') || '<p class="texto-tenue">No hay gastos con estos filtros.</p>'}
    </div>
  `;

  contenedor.querySelector('#input-busqueda').addEventListener('input', (e) => {
    filtros.busqueda = e.target.value;
    renderHistorial(contenedor);
  });
  contenedor.querySelector('#select-origen').addEventListener('change', (e) => {
    filtros.origenId = e.target.value;
    renderHistorial(contenedor);
  });
  contenedor.querySelector('#input-desde').addEventListener('change', (e) => {
    filtros.desde = e.target.value;
    renderHistorial(contenedor);
  });
  contenedor.querySelector('#input-hasta').addEventListener('change', (e) => {
    filtros.hasta = e.target.value;
    renderHistorial(contenedor);
  });

  contenedor.querySelectorAll('[data-editar-transaccion]').forEach((fila) => {
    fila.addEventListener('click', () => {
      const transaccion = transacciones.find((t) => t.id === fila.dataset.editarTransaccion);
      abrirFormularioEdicion(transaccion, origenes);
    });
  });
}

function filaTransaccion(t, nombreOrigen) {
  return `
    <div class="tarjeta-oscura" data-editar-transaccion="${t.id}" style="cursor:pointer;">
      <div style="display:flex; justify-content:space-between;">
        <span>${nombreOrigen || 'Categoría eliminada'}</span>
        <span style="font-family: var(--fuente-mono);">${formatearMoneda(t.monto)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 6px;" class="texto-tenue">
        <span style="font-size: 13px;">${t.nota || 'Sin nota'}</span>
        <span class="eyebrow">${formatearFechaLarga(t.fecha)}</span>
      </div>
    </div>
  `;
}

function abrirFormularioEdicion(transaccion, origenes) {
  const fondo = document.createElement('div');
  fondo.className = 'panel-fondo';
  fondo.innerHTML = `
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>Editar gasto</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-form" aria-label="Cerrar">✕</button>
      </div>

      <form id="form-transaccion">
        <div class="campo">
          <label>Monto</label>
          <input type="number" id="campo-monto" required min="0.01" step="0.01" value="${transaccion.monto}" />
        </div>

        <div class="campo">
          <label>Categoría / bolsillo</label>
          <select id="campo-origen">
            ${origenes.map((o) => `<option value="${o.id}" ${o.id === transaccion.origenId ? 'selected' : ''}>${o.nombre}</option>`).join('')}
          </select>
        </div>

        <div class="campo">
          <label>Fecha</label>
          <input type="date" id="campo-fecha" required max="${hoyISO()}" value="${transaccion.fecha}" />
        </div>

        <div class="campo">
          <label>Nota</label>
          <input type="text" id="campo-nota" maxlength="80" value="${transaccion.nota || ''}" />
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque">Guardar</button>
        <button type="button" class="btn btn-peligro btn-bloque" id="btn-borrar-transaccion" style="margin-top: 12px;">Borrar gasto</button>
      </form>
    </div>
  `;

  document.body.appendChild(fondo);
  fondo.querySelector('#btn-cerrar-form').addEventListener('click', () => fondo.remove());
  fondo.addEventListener('click', (evento) => {
    if (evento.target === fondo) fondo.remove();
  });

  fondo.querySelector('#form-transaccion').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const nuevoOrigen = origenes.find((o) => o.id === fondo.querySelector('#campo-origen').value);

    if (nuevoOrigen.id === 'ahorro' && transaccion.origenId !== 'ahorro') {
      const confirmado = await mostrarConfirmacion({
        titulo: 'Estás por tocar tu Ahorro',
        mensaje: 'Vas a mover este gasto para que salga de tu Ahorro. ¿Seguro?',
        claseAlerta: 'alerta-roja',
        textoConfirmar: 'Sí, mover a Ahorro',
        textoCancelar: 'Mejor no',
      });
      if (!confirmado) return;
    }

    await editarTransaccion(transaccion.id, {
      monto: parseFloat(fondo.querySelector('#campo-monto').value) || 0,
      fecha: fondo.querySelector('#campo-fecha').value,
      nota: fondo.querySelector('#campo-nota').value.trim(),
      origenId: nuevoOrigen.id,
      origenTipo: nuevoOrigen._origenTipo,
    });
    fondo.remove();
    await refrescar();
  });

  fondo.querySelector('#btn-borrar-transaccion').addEventListener('click', async () => {
    const confirmado = window.confirm('¿Borrar este gasto? Esto no se puede deshacer.');
    if (!confirmado) return;
    await borrarTransaccion(transaccion.id);
    fondo.remove();
    await refrescar();
  });
}
