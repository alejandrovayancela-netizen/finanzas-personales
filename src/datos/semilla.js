// Datos iniciales precargados, tal como los pidió Alejandro.
// Todo esto se puede editar después desde la app (categorías, montos,
// ingreso, día de cobro, etc.) — esto es solo el punto de partida.
import { obtenerBD } from './baseDeDatos.js';
import { generarId } from '../utilidades/id.js';
import { hoyISO } from '../utilidades/fechas.js';

const CATEGORIAS_INICIALES = [
  { nombre: 'Internet', monto: 25, tipo: 'fija' },
  { nombre: 'Suscripción Claude', monto: 20, tipo: 'fija' },
  { nombre: 'Pasajes / transporte', monto: 20, tipo: 'variable' },
  { nombre: 'Comida', monto: 150, tipo: 'variable' },
  { nombre: 'Almuerzos en el trabajo', monto: 60, tipo: 'variable' },
];

// Los 4 "bolsillos" en los que se reparte el ingreso, aparte de lo esencial.
// "acumula" define si lo que no se gasta pasa al mes siguiente (colchón que
// crece) o si se reinicia cada mes (como Gustos, que tiene tope mensual duro).
const BOLSILLOS_INICIALES = [
  { id: 'ahorro', nombre: 'Ahorro', monto: 200, acumula: true, saldoAcumulado: 0 },
  { id: 'imprevistos', nombre: 'Imprevistos', monto: 60, acumula: true, saldoAcumulado: 0 },
  { id: 'gustos', nombre: 'Gustos', monto: 50, acumula: false, saldoAcumulado: 0 },
  { id: 'reserva', nombre: 'Reserva', monto: 15, acumula: true, saldoAcumulado: 0 },
];

/**
 * Si es la primera vez que se abre la app (no hay configuración guardada),
 * crea la configuración y las categorías/bolsillos de ejemplo que pidió
 * Alejandro. Si ya existen datos, no hace nada.
 */
export async function sembrarDatosInicialesSiHaceFalta() {
  const bd = await obtenerBD();
  const configuracionExistente = await bd.get('configuracion', 'principal');
  if (configuracionExistente) {
    return; // Ya se sembraron los datos antes, no repetir.
  }

  const transaccion = bd.transaction(
    ['configuracion', 'categorias', 'bolsillos'],
    'readwrite'
  );

  await transaccion.objectStore('configuracion').put({
    id: 'principal',
    ingresoMensual: 600,
    diaCobroEsperado: 12,
    umbralHormiga: 5, // gastos menores a $5 se consideran "gasto hormiga"
    fechaPrimerUso: hoyISO(),
  });

  for (const categoria of CATEGORIAS_INICIALES) {
    await transaccion.objectStore('categorias').put({
      id: generarId(),
      ...categoria,
    });
  }

  for (const bolsillo of BOLSILLOS_INICIALES) {
    await transaccion.objectStore('bolsillos').put(bolsillo);
  }

  await transaccion.done;
}
