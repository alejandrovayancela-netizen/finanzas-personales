// Genera identificadores únicos para guardar registros nuevos en la base
// de datos (categorías, transacciones, ciclos, etc.)
export function generarId() {
  return crypto.randomUUID();
}
