// Pantalla de Categorías: crear, editar y borrar las categorías de gasto
// esencial (Internet, Comida, etc.), y marcarlas como Fija o Variable.
import {
  listarCategorias,
  crearCategoria,
  editarCategoria,
  borrarCategoria,
} from '../datos/categorias.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { refrescar } from '../router.js';
import { colorParaOrigen } from '../utilidades/colorOrigen.js';

let contenedorActual = null;

export async function renderCategorias(contenedor) {
  contenedorActual = contenedor;
  const categorias = await listarCategorias();
  const totalMensual = categorias.reduce((s, c) => s + c.monto, 0);

  contenedor.innerHTML = `
    <div class="pantalla">
      <p class="eyebrow">Categorías esenciales</p>
      <p class="cifra-media" style="margin-top: 8px;">${formatearMoneda(totalMensual)} / mes</p>

      <div style="margin-top: 24px;">
        ${categorias.map(filaCategoria).join('') || '<p class="texto-tenue">Todavía no tienes categorías.</p>'}
      </div>

      <button class="btn btn-fantasma btn-bloque" id="btn-nueva-categoria" style="margin-top: 16px;">
        + Nueva categoría
      </button>
    </div>
  `;

  contenedor.querySelector('#btn-nueva-categoria').addEventListener('click', () => abrirFormulario(null));
  contenedor.querySelectorAll('[data-editar]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const categoria = categorias.find((c) => c.id === boton.dataset.editar);
      abrirFormulario(categoria);
    });
  });
}

function filaCategoria(categoria) {
  return `
    <div class="tarjeta-oscura" style="--color-identidad: ${colorParaOrigen(categoria.id)};">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="nombre-con-color"><span class="punto-identidad"></span>${categoria.nombre}</span>
        <span class="eyebrow">${categoria.tipo === 'fija' ? 'Fija' : 'Variable'}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 8px;">
        <span class="cifra-media">${formatearMoneda(categoria.monto)}</span>
        <button class="btn btn-fantasma" data-editar="${categoria.id}">Editar</button>
      </div>
    </div>
  `;
}

function abrirFormulario(categoriaExistente) {
  const esEdicion = categoriaExistente !== null;
  const fondo = document.createElement('div');
  fondo.className = 'panel-fondo';
  fondo.innerHTML = `
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>${esEdicion ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-form" aria-label="Cerrar">✕</button>
      </div>

      <form id="form-categoria">
        <div class="campo">
          <label>Nombre</label>
          <input type="text" id="campo-nombre" required maxlength="40" value="${esEdicion ? categoriaExistente.nombre : ''}" />
        </div>

        <div class="campo">
          <label>Monto mensual</label>
          <input type="number" id="campo-monto" required min="0" step="0.01" value="${esEdicion ? categoriaExistente.monto : ''}" />
        </div>

        <div class="campo">
          <label>Tipo</label>
          <div class="campo-radios">
            <label>
              <input type="radio" name="tipo" value="fija" ${esEdicion && categoriaExistente.tipo === 'fija' ? 'checked' : ''} />
              <span>Fija (pago único)</span>
            </label>
            <label>
              <input type="radio" name="tipo" value="variable" ${!esEdicion || categoriaExistente.tipo === 'variable' ? 'checked' : ''} />
              <span>Variable (por semana)</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque">Guardar</button>
        ${
          esEdicion
            ? `<button type="button" class="btn btn-peligro btn-bloque" id="btn-borrar-categoria" style="margin-top: 12px;">Borrar categoría</button>`
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

  fondo.querySelector('#form-categoria').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = {
      nombre: fondo.querySelector('#campo-nombre').value.trim(),
      monto: parseFloat(fondo.querySelector('#campo-monto').value) || 0,
      tipo: fondo.querySelector('input[name="tipo"]:checked').value,
    };

    if (esEdicion) {
      await editarCategoria(categoriaExistente.id, datos);
    } else {
      await crearCategoria(datos);
    }

    fondo.remove();
    await refrescar();
  });

  const btnBorrar = fondo.querySelector('#btn-borrar-categoria');
  if (btnBorrar) {
    btnBorrar.addEventListener('click', async () => {
      const confirmado = window.confirm(`¿Borrar la categoría "${categoriaExistente.nombre}"? Esto no se puede deshacer.`);
      if (!confirmado) return;
      await borrarCategoria(categoriaExistente.id);
      fondo.remove();
      await refrescar();
    });
  }
}
