// Pantalla de Ajustes: ingreso mensual, día de cobro esperado, el reparto
// del "págate primero" (Ahorro / Imprevistos / Gustos / Reserva) y el
// umbral de gasto hormiga.
import { obtenerConfiguracion, guardarConfiguracion } from '../datos/configuracion.js';
import { listarBolsillos, editarMontoBolsillo } from '../datos/bolsillos.js';
import { totalEsencialesMensual } from '../datos/categorias.js';
import { estaEnModoSeguimiento } from '../datos/ciclos.js';
import { abrirChecklistCobro } from '../componentes/checklistCobro.js';
import { descargarRespaldoJSON, descargarHistorialCSV, restaurarRespaldo } from '../datos/respaldo.js';
import { reiniciarTodo } from '../datos/semilla.js';
import { mostrarConfirmacion } from '../componentes/confirmacion.js';
import { mostrarAviso } from '../componentes/aviso.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { refrescar } from '../router.js';

export async function renderConfiguracion(contenedor) {
  const [config, bolsillos, esenciales, enModoSeguimiento] = await Promise.all([
    obtenerConfiguracion(),
    listarBolsillos(),
    totalEsencialesMensual(),
    estaEnModoSeguimiento(),
  ]);

  const totalRepartido =
    esenciales + bolsillos.reduce((suma, b) => suma + b.monto, 0);
  const sinAsignar = config.ingresoMensual - totalRepartido;

  contenedor.innerHTML = `
    <div class="pantalla">
      <p class="eyebrow">Ajustes</p>

      <form id="form-ajustes">
        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Ingreso y cobro</h3>
        <div class="campo">
          <label>Ingreso mensual</label>
          <input type="number" id="campo-ingreso" min="0" step="0.01" value="${config.ingresoMensual}" />
        </div>
        <div class="campo">
          <label>Día de cobro esperado (1-31)</label>
          <input type="number" id="campo-dia-cobro" min="1" max="31" value="${config.diaCobroEsperado}" />
        </div>

        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Reparto: págate primero</h3>
        <div class="tarjeta-oscura" style="margin-bottom: 16px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Esenciales (suma de tus categorías)</span>
            <span>${formatearMoneda(esenciales)}</span>
          </div>
        </div>

        ${bolsillos
          .map(
            (b) => `
              <div class="campo">
                <label>${b.nombre}</label>
                <input type="number" min="0" step="0.01" data-bolsillo="${b.id}" value="${b.monto}" />
              </div>
            `
          )
          .join('')}

        <div class="tarjeta-oscura" style="border-color: ${sinAsignar < 0 ? 'var(--color-rojo)' : 'var(--color-borde)'};">
          <div style="display:flex; justify-content:space-between;">
            <span>${sinAsignar < 0 ? 'Te pasaste del ingreso por' : 'Sin asignar'}</span>
            <span>${formatearMoneda(Math.abs(sinAsignar))}</span>
          </div>
        </div>

        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Gastos hormiga</h3>
        <div class="campo">
          <label>Considerar "gasto hormiga" si es menor a</label>
          <input type="number" id="campo-umbral-hormiga" min="0" step="0.01" value="${config.umbralHormiga}" />
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque" style="margin-top: 16px;">
          Guardar cambios
        </button>
      </form>

      ${
        !enModoSeguimiento
          ? `
            <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 16px;">Ciclo de pago</h3>
            <button class="btn btn-fantasma btn-bloque" id="btn-confirmar-nuevo-cobro">
              ¿Te pagaron antes de lo esperado? Confirmar nuevo cobro
            </button>
          `
          : ''
      }

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 16px;">Respaldo de tus datos</h3>
      <p class="texto-tenue" style="font-size: 13px; margin-bottom: 12px;">
        Todo vive solo en este dispositivo. Descarga un respaldo de vez en cuando, sobre todo
        antes de cambiar de celular o borrar el navegador.
      </p>
      <div style="display:flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-fantasma btn-bloque" id="btn-descargar-respaldo">Descargar respaldo completo (JSON)</button>
        <button class="btn btn-fantasma btn-bloque" id="btn-restaurar-respaldo">Restaurar desde un respaldo</button>
        <input type="file" id="input-restaurar" accept="application/json" class="oculto" />
        <button class="btn btn-fantasma btn-bloque" id="btn-exportar-csv">Exportar historial a Excel (CSV)</button>
      </div>

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 16px;">Zona de peligro</h3>
      <p class="texto-tenue" style="font-size: 13px; margin-bottom: 12px;">
        ¿Estuviste probando la app y quieres borrar todo para empezar de cero? Esto borra
        gastos, ciclos y metas, y deja las categorías como al instalar la app.
      </p>
      <button class="btn btn-peligro btn-bloque" id="btn-reiniciar-todo">Borrar todos mis datos y empezar de cero</button>
    </div>
  `;

  const btnNuevoCobro = contenedor.querySelector('#btn-confirmar-nuevo-cobro');
  if (btnNuevoCobro) {
    btnNuevoCobro.addEventListener('click', () => abrirChecklistCobro());
  }

  contenedor.querySelector('#btn-descargar-respaldo').addEventListener('click', () => descargarRespaldoJSON());
  contenedor.querySelector('#btn-exportar-csv').addEventListener('click', () => descargarHistorialCSV());

  contenedor.querySelector('#btn-reiniciar-todo').addEventListener('click', async () => {
    const primeraConfirmacion = await mostrarConfirmacion({
      titulo: 'Vas a borrar TODO',
      mensaje: 'Se borran todos tus gastos, ciclos, metas y bolsillos acumulados. Las categorías vuelven a los valores de ejemplo. Esto no se puede deshacer.',
      claseAlerta: 'alerta-roja',
      textoConfirmar: 'Sí, quiero borrar todo',
      textoCancelar: 'Cancelar',
    });
    if (!primeraConfirmacion) return;

    const segundaConfirmacion = await mostrarConfirmacion({
      titulo: '¿Estás totalmente seguro?',
      mensaje: 'Última confirmación: no hay forma de recuperar estos datos después, salvo que tengas un respaldo descargado.',
      claseAlerta: 'alerta-roja',
      textoConfirmar: 'Borrar todo definitivamente',
      textoCancelar: 'Mejor no',
    });
    if (!segundaConfirmacion) return;

    await reiniciarTodo();
    window.location.hash = '';
    window.location.reload();
  });

  const inputRestaurar = contenedor.querySelector('#input-restaurar');
  contenedor.querySelector('#btn-restaurar-respaldo').addEventListener('click', () => inputRestaurar.click());
  inputRestaurar.addEventListener('change', async () => {
    const archivo = inputRestaurar.files[0];
    if (!archivo) return;

    const confirmado = await mostrarConfirmacion({
      titulo: 'Vas a reemplazar todos tus datos',
      mensaje: `Se borrará todo lo que tienes ahora en la app y se reemplazará por lo que hay en "${archivo.name}". Esto no se puede deshacer.`,
      claseAlerta: 'alerta-roja',
      textoConfirmar: 'Sí, restaurar este respaldo',
      textoCancelar: 'Cancelar',
    });
    inputRestaurar.value = '';
    if (!confirmado) return;

    try {
      const texto = await archivo.text();
      await restaurarRespaldo(JSON.parse(texto));
      alert('Respaldo restaurado. La app se va a recargar.');
      window.location.hash = '';
      window.location.reload();
    } catch (error) {
      alert(`No se pudo restaurar el respaldo: ${error.message}`);
    }
  });

  contenedor.querySelector('#form-ajustes').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    await guardarConfiguracion({
      ingresoMensual: parseFloat(contenedor.querySelector('#campo-ingreso').value) || 0,
      diaCobroEsperado: parseInt(contenedor.querySelector('#campo-dia-cobro').value, 10) || 1,
      umbralHormiga: parseFloat(contenedor.querySelector('#campo-umbral-hormiga').value) || 0,
    });

    const camposBolsillo = contenedor.querySelectorAll('[data-bolsillo]');
    for (const campo of camposBolsillo) {
      await editarMontoBolsillo(campo.dataset.bolsillo, parseFloat(campo.value) || 0);
    }

    await refrescar();
    mostrarAviso('Cambios guardados');
  });
}
