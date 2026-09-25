// Panel de "Registro rápido": el corazón de la app.
// Flujo pensado para una sola mano: escribir el monto con el teclado,
// tocar una categoría, y guardar. La nota es opcional.
import { calcularResumenOrigenes } from '../logica/resumenPeriodo.js';
import { simularEstadoConNuevoGasto } from '../logica/motorPresupuesto.js';
import { crearTransaccion } from '../datos/transacciones.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { hoyISO } from '../utilidades/fechas.js';
import { colorParaOrigen } from '../utilidades/colorOrigen.js';
import { refrescar } from '../router.js';
import { mostrarConfirmacion } from './confirmacion.js';

// Estado interno del panel mientras está abierto.
let bufferMonto = '0';
let origenSeleccionado = null; // { tipo, id, nombre }
let confirmoRetiroAhorro = false;

function textoMontoVisible() {
  return `$${bufferMonto}`;
}

function convertirBufferANumero() {
  return parseFloat(bufferMonto.replace(',', '.')) || 0;
}

function reiniciarEstado() {
  bufferMonto = '0';
  origenSeleccionado = null;
  confirmoRetiroAhorro = false;
}

/** Abre el panel de registro rápido, ya listo para usarse. */
export async function abrirRegistroRapido() {
  reiniciarEstado();
  const resumen = await calcularResumenOrigenes();

  const fondo = document.createElement('div');
  fondo.className = 'panel-fondo';
  fondo.innerHTML = `
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>Registrar gasto</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-registro" aria-label="Cerrar">✕</button>
      </div>

      <div class="monto-mostrado" id="monto-mostrado">${textoMontoVisible()}</div>

      <div class="teclado-numerico" id="teclado-numerico">
        ${['1','2','3','4','5','6','7','8','9',',','0','⌫']
          .map((tecla) => `<button type="button" data-tecla="${tecla}">${tecla}</button>`)
          .join('')}
      </div>

      <div class="campo" style="margin-top: 24px;">
        <label>¿De dónde sale?</label>
        <div class="selector-categorias" id="selector-origenes">
          ${[...resumen.categorias, ...resumen.bolsillos.filter((b) => b.id !== 'ahorro')]
            .map(
              (origen) => `
                <button
                  type="button"
                  class="chip-categoria"
                  style="--color-identidad: ${colorParaOrigen(origen.id)};"
                  data-tipo="${origen.tipo}"
                  data-id="${origen.id}"
                  data-nombre="${origen.nombre}"
                >
                  <span class="chip-categoria__nombre nombre-con-color"><span class="punto-identidad"></span>${origen.nombre}</span>
                  <span class="chip-categoria__saldo">${formatearMoneda(origen.gastado)} / ${formatearMoneda(origen.monto)}</span>
                </button>
              `
            )
            .join('')}
        </div>
        <button type="button" class="btn btn-fantasma btn-bloque" id="btn-retirar-ahorro" style="margin-top: 8px;">
          Retirar de tu Ahorro (necesita confirmación)
        </button>
      </div>

      <div class="campo">
        <label>Nota (opcional)</label>
        <input type="text" id="input-nota" placeholder="Ej: almuerzo con cliente" maxlength="80" />
      </div>

      <div class="campo">
        <label>Fecha</label>
        <input type="date" id="input-fecha" max="${hoyISO()}" value="${hoyISO()}" />
      </div>

      <button type="button" class="btn btn-claro btn-grande btn-bloque" id="btn-guardar-gasto" disabled>
        Guardar
      </button>
    </div>
  `;

  document.body.appendChild(fondo);
  wireEventos(fondo);
}

function cerrarPanel(fondo) {
  fondo.remove();
}

const CLASE_POR_ESTADO = {
  amarillo: 'alerta-amarilla',
  rojo: 'alerta-roja',
  pasado: 'alerta-roja',
};

const TITULO_POR_ESTADO = {
  amarillo: 'Vas rápido',
  rojo: 'Cuidado',
  pasado: 'Te vas a exceder',
};

/**
 * Antes de guardar, revisa si este gasto empujaría a la categoría a
 * amarillo/rojo/excedido. Si es así, muestra la alerta y deja que
 * Alejandro decida si sigue adelante o cancela. Si va en verde (o el
 * origen no tiene semáforo), guarda directo sin interrumpir.
 */
async function confirmarSiHaceFalta(monto) {
  const simulado = await simularEstadoConNuevoGasto(origenSeleccionado.tipo, origenSeleccionado.id, monto);
  if (!simulado || simulado.estado === 'verde') return true;

  return mostrarConfirmacion({
    titulo: TITULO_POR_ESTADO[simulado.estado],
    mensaje: simulado.mensaje,
    claseAlerta: CLASE_POR_ESTADO[simulado.estado],
    textoConfirmar: 'Registrar de todas formas',
    textoCancelar: 'Mejor no',
  });
}

function actualizarBotonGuardar(fondo) {
  const boton = fondo.querySelector('#btn-guardar-gasto');
  const monto = convertirBufferANumero();
  boton.disabled = !(monto > 0 && origenSeleccionado !== null);
}

function seleccionarOrigen(fondo, elementoChip) {
  fondo.querySelectorAll('.chip-categoria').forEach((chip) => chip.classList.remove('activo'));
  elementoChip.classList.add('activo');
  origenSeleccionado = {
    tipo: elementoChip.dataset.tipo,
    id: elementoChip.dataset.id,
    nombre: elementoChip.dataset.nombre,
  };
  confirmoRetiroAhorro = false;
  actualizarBotonGuardar(fondo);
}

function wireEventos(fondo) {
  fondo.querySelector('#btn-cerrar-registro').addEventListener('click', () => cerrarPanel(fondo));
  fondo.addEventListener('click', (evento) => {
    if (evento.target === fondo) cerrarPanel(fondo);
  });

  fondo.querySelector('#teclado-numerico').addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-tecla]');
    if (!boton) return;
    const tecla = boton.dataset.tecla;

    if (tecla === '⌫') {
      bufferMonto = bufferMonto.length > 1 ? bufferMonto.slice(0, -1) : '0';
    } else if (tecla === ',') {
      if (!bufferMonto.includes(',')) bufferMonto += ',';
    } else {
      const [, decimales] = bufferMonto.split(',');
      if (decimales !== undefined && decimales.length >= 2) return; // máximo 2 decimales
      bufferMonto = bufferMonto === '0' ? tecla : bufferMonto + tecla;
    }

    fondo.querySelector('#monto-mostrado').textContent = textoMontoVisible();
    actualizarBotonGuardar(fondo);
  });

  fondo.querySelector('#selector-origenes').addEventListener('click', (evento) => {
    const chip = evento.target.closest('.chip-categoria');
    if (chip) seleccionarOrigen(fondo, chip);
  });

  fondo.querySelector('#btn-retirar-ahorro').addEventListener('click', async () => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Estás por tocar tu Ahorro',
      mensaje: 'Este dinero es tu fondo de emergencia y tus metas. ¿Seguro que quieres retirar de ahí?',
      claseAlerta: 'alerta-roja',
      textoConfirmar: 'Sí, retirar de mi Ahorro',
      textoCancelar: 'Mejor no',
    });
    if (!confirmado) return;
    confirmoRetiroAhorro = true;
    fondo.querySelectorAll('.chip-categoria').forEach((chip) => chip.classList.remove('activo'));
    origenSeleccionado = { tipo: 'bolsillo', id: 'ahorro', nombre: 'Ahorro' };
    actualizarBotonGuardar(fondo);
  });

  fondo.querySelector('#btn-guardar-gasto').addEventListener('click', async () => {
    const boton = fondo.querySelector('#btn-guardar-gasto');
    boton.disabled = true;
    const monto = convertirBufferANumero();

    const siguioAdelante = await confirmarSiHaceFalta(monto);
    if (!siguioAdelante) {
      boton.disabled = false;
      return;
    }

    try {
      await crearTransaccion({
        monto,
        origenTipo: origenSeleccionado.tipo,
        origenId: origenSeleccionado.id,
        nota: fondo.querySelector('#input-nota').value.trim(),
        fecha: fondo.querySelector('#input-fecha').value || hoyISO(),
        confirmoRetiroAhorro,
      });
      cerrarPanel(fondo);
      await refrescar();
    } catch (error) {
      alert(`No se pudo guardar el gasto: ${error.message}`);
      boton.disabled = false;
    }
  });
}
