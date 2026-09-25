// Bloqueo extra de zoom por pellizco (pinch), específico para Safari de
// iPhone/iPad. La etiqueta <meta name="viewport"> que pide "no permitir
// zoom" no la respeta ahí (Apple la ignora a propósito, por accesibilidad),
// así que hay que interceptar el gesto directamente. "gesturestart" no es
// un evento estándar de la web — es propio de Safari — pero es la única
// forma confiable de frenar el pellizco en ese navegador.
export function bloquearZoom() {
  const cancelar = (evento) => evento.preventDefault();

  document.addEventListener('gesturestart', cancelar);
  document.addEventListener('gesturechange', cancelar);
  document.addEventListener('gestureend', cancelar);
}
