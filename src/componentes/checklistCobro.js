// El checklist de "págate primero": el día de cobro, antes de confirmar,
// Alejandro debe marcar que ya separó cada parte de su plata. Esto es a
// propósito más estricto que un simple botón: la idea es que la plata se
// separe de verdad, no solo que la app lo asuma.
import { totalEsencialesMensual } from '../datos/categorias.js';
import { listarBolsillos } from '../datos/bolsillos.js';
import { confirmarCobro } from '../datos/ciclos.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { hoyISO } from '../utilidades/fechas.js';
import { refrescar } from '../router.js';

const TEXTO_PASO = {
  ahorro: (monto) => `Pasa ${formatearMoneda(monto)} a tu cuenta de Ahorro`,
  imprevistos: (monto) => `Aparta ${formatearMoneda(monto)} para Imprevistos`,
  gustos: (monto) => `Aparta ${formatearMoneda(monto)} para Gustos`,
  reserva: (monto) => `Aparta ${formatearMoneda(monto)} para Reserva`,
};

export async function abrirChecklistCobro() {
  const [totalEsenciales, bolsillos] = await Promise.all([totalEsencialesMensual(), listarBolsillos()]);

  const pasos = [
    { id: 'esenciales', texto: `Aparta ${formatearMoneda(totalEsenciales)} para tus Esenciales (Internet, Comida, etc.)` },
    ...bolsillos.map((b) => ({ id: b.id, texto: TEXTO_PASO[b.id](b.monto) })),
  ];

  const fondo = document.createElement('div');
  fondo.className = 'panel-fondo';
  fondo.innerHTML = `
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>Págate primero</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-checklist" aria-label="Cerrar">✕</button>
      </div>

      <p class="texto-tenue" style="margin-bottom: 16px;">
        Separa la plata de verdad (transferencias, sobres, lo que uses) y marca cada paso.
      </p>

      <div id="lista-pasos">
        ${pasos
          .map(
            (paso) => `
              <label class="tarjeta-oscura" style="display:flex; align-items:center; gap:12px; margin-bottom:8px; cursor:pointer;">
                <input type="checkbox" data-paso="${paso.id}" style="width:20px; height:20px;" />
                <span>${paso.texto}</span>
              </label>
            `
          )
          .join('')}
      </div>

      <div class="campo" style="margin-top: 16px;">
        <label>Fecha en la que cobraste</label>
        <input type="date" id="input-fecha-cobro" value="${hoyISO()}" />
      </div>

      <button type="button" class="btn btn-claro btn-grande btn-bloque" id="btn-confirmar-cobro" disabled>
        Confirmar cobro
      </button>
    </div>
  `;

  document.body.appendChild(fondo);

  const casillas = fondo.querySelectorAll('input[type="checkbox"]');
  const btnConfirmar = fondo.querySelector('#btn-confirmar-cobro');

  casillas.forEach((casilla) => {
    casilla.addEventListener('change', () => {
      btnConfirmar.disabled = ![...casillas].every((c) => c.checked);
    });
  });

  fondo.querySelector('#btn-cerrar-checklist').addEventListener('click', () => fondo.remove());
  fondo.addEventListener('click', (evento) => {
    if (evento.target === fondo) fondo.remove();
  });

  btnConfirmar.addEventListener('click', async () => {
    btnConfirmar.disabled = true;
    const fecha = fondo.querySelector('#input-fecha-cobro').value || hoyISO();
    await confirmarCobro(fecha);
    fondo.remove();
    await refrescar();
  });
}
