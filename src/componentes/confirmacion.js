// Panel de confirmación genérico, usado para las alertas "antes de guardar"
// y otras decisiones importantes (como retirar del Ahorro). Devuelve una
// promesa que se resuelve en true (confirmó) o false (canceló).
export function mostrarConfirmacion({ titulo, mensaje, claseAlerta = 'alerta-info', textoConfirmar = 'Continuar', textoCancelar = 'Cancelar' }) {
  return new Promise((resolver) => {
    const fondo = document.createElement('div');
    fondo.className = 'panel-fondo';
    fondo.innerHTML = `
      <div class="panel-hoja">
        <div class="alerta ${claseAlerta}">
          <p class="alerta__titulo">${titulo}</p>
          <p>${mensaje}</p>
        </div>
        <div style="display:flex; flex-direction: column; gap: 8px;">
          <button class="btn btn-claro btn-grande btn-bloque" id="btn-confirmar">${textoConfirmar}</button>
          <button class="btn btn-fantasma btn-bloque" id="btn-cancelar">${textoCancelar}</button>
        </div>
      </div>
    `;

    const cerrar = (resultado) => {
      fondo.remove();
      resolver(resultado);
    };

    fondo.querySelector('#btn-confirmar').addEventListener('click', () => cerrar(true));
    fondo.querySelector('#btn-cancelar').addEventListener('click', () => cerrar(false));
    fondo.addEventListener('click', (evento) => {
      if (evento.target === fondo) cerrar(false);
    });

    document.body.appendChild(fondo);
  });
}
