// Los "bolsillos" son las 4 partes del reparto que no son gasto esencial:
// Ahorro, Imprevistos, Gustos y Reserva. A diferencia de las categorías,
// no se crean ni se borran (son parte fija del método "págate primero"),
// pero sí se puede editar cuánto se asigna a cada uno cada mes.
import { obtenerBD } from './baseDeDatos.js';
import { redondearMonto } from '../utilidades/dinero.js';

const ORDEN = ['ahorro', 'imprevistos', 'gustos', 'reserva'];

export async function listarBolsillos() {
  const bd = await obtenerBD();
  const bolsillos = await bd.getAll('bolsillos');
  return bolsillos.sort((a, b) => ORDEN.indexOf(a.id) - ORDEN.indexOf(b.id));
}

export async function obtenerBolsillo(id) {
  const bd = await obtenerBD();
  return bd.get('bolsillos', id);
}

/** Cambia el monto mensual asignado a un bolsillo (ej. subir Gustos a $60). */
export async function editarMontoBolsillo(id, monto) {
  const bd = await obtenerBD();
  const actual = await bd.get('bolsillos', id);
  if (!actual) throw new Error('El bolsillo no existe');
  const actualizado = { ...actual, monto };
  await bd.put('bolsillos', actualizado);
  return actualizado;
}

/**
 * Suma (o resta, con número negativo) al saldo acumulado de un bolsillo.
 * Se usa al "págate primero" (se acredita el monto del mes) y cada vez que
 * se registra o se borra un gasto contra Ahorro/Imprevistos/Reserva (se
 * descuenta o se revierte). No se limita a un mínimo de cero a propósito:
 * si un bolsillo queda en negativo, es una señal honesta de que ese
 * colchón ya se agotó y hay que reponerlo.
 */
export async function ajustarSaldoAcumulado(id, delta) {
  const bd = await obtenerBD();
  const actual = await bd.get('bolsillos', id);
  if (!actual) throw new Error('El bolsillo no existe');
  const actualizado = { ...actual, saldoAcumulado: redondearMonto(actual.saldoAcumulado + delta) };
  await bd.put('bolsillos', actualizado);
  return actualizado;
}

/** Suma total del ingreso que se destina a los 4 bolsillos (sin esenciales). */
export async function totalBolsillosMensual() {
  const bolsillos = await listarBolsillos();
  return bolsillos.reduce((suma, bolsillo) => suma + bolsillo.monto, 0);
}
