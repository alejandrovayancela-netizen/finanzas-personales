// Barra de navegación fija de abajo, con 3 pestañas.
// El botón "+" de registro rápido vive aparte (ver registro.js) porque
// tiene que estar visible sin importar en qué pestaña esté el usuario.

const PESTANAS = [
  { id: 'hoy', href: '#', icono: '◆', etiqueta: 'Hoy' },
  { id: 'categorias', href: '#/categorias', icono: '▤', etiqueta: 'Categorías' },
  { id: 'metas', href: '#/metas', icono: '●', etiqueta: 'Metas' },
  { id: 'resumen', href: '#/resumen', icono: '▲', etiqueta: 'Resumen' },
  { id: 'ajustes', href: '#/ajustes', icono: '⚙', etiqueta: 'Ajustes' },
];

export function pintarNavegacion(idActivo) {
  let nav = document.getElementById('nav-inferior');
  if (!nav) return;

  nav.innerHTML = PESTANAS.map(
    (pestana) => `
      <a
        class="nav-inferior__item ${pestana.id === idActivo ? 'activo' : ''}"
        href="${pestana.href}"
      >
        <span class="nav-inferior__icono">${pestana.icono}</span>
        <span>${pestana.etiqueta}</span>
      </a>
    `
  ).join('');
}
