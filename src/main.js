// Punto de entrada de la app. Arma el "esqueleto" en pantalla (la vista,
// el botón de registro rápido y la barra de navegación) y arranca el router.
import './estilos/variables.css';
import './estilos/base.css';
import './estilos/componentes.css';

import { sembrarDatosInicialesSiHaceFalta } from './datos/semilla.js';
import { iniciarRouter } from './router.js';
import { abrirRegistroRapido } from './componentes/registro.js';

async function iniciar() {
  await sembrarDatosInicialesSiHaceFalta();

  const app = document.getElementById('app');
  app.innerHTML = `
    <main id="vista"></main>
    <button id="fab-registro" class="fab-registro" aria-label="Registrar gasto">+</button>
    <nav id="nav-inferior" class="nav-inferior"></nav>
  `;

  document.getElementById('fab-registro').addEventListener('click', abrirRegistroRapido);

  iniciarRouter(document.getElementById('vista'));
}

iniciar();
