// Le da un color de identidad a cada categoría/bolsillo (como en un
// dashboard de salud: cada métrica tiene su propio color). Se usan tonos
// fríos (azules, morados, rosas, turquesas) a propósito, para que nunca se
// confundan con los colores del semáforo (verde/naranja/rojo), que son de
// alerta, no de identidad.
const PALETA = [
  '#61e5c4', // turquesa
  '#61bee5', // celeste
  '#6175e5', // azul-índigo
  '#9661e5', // púrpura
  '#df61e5', // magenta
  '#e561a3', // rosa
];

/** Siempre da el mismo color para el mismo id (estable aunque cambie el orden). */
export function colorParaOrigen(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETA[hash % PALETA.length];
}
