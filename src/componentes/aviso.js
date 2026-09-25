// Aviso breve ("toast"): confirma que una acción sí funcionó (guardar,
// borrar, etc.) y desaparece solo. Se usa cuando la pantalla no cambia de
// por sí después de la acción, así que hace falta una señal clara.
export function mostrarAviso(mensaje) {
  const existente = document.getElementById('aviso-flotante');
  if (existente) existente.remove();

  const aviso = document.createElement('div');
  aviso.id = 'aviso-flotante';
  aviso.className = 'aviso-flotante';
  aviso.textContent = mensaje;
  document.body.appendChild(aviso);

  // Un frame después, para que la transición de entrada sí se note.
  requestAnimationFrame(() => aviso.classList.add('visible'));

  setTimeout(() => {
    aviso.classList.remove('visible');
    setTimeout(() => aviso.remove(), 250);
  }, 1800);
}
