// El semáforo: compara cuánto llevas gastado contra cuánto tiempo del
// período ya pasó, y clasifica el resultado en verde/amarillo/rojo/pasado.
// Son funciones puras — sin esto no se puede confiar en las alertas, así
// que están cubiertas con pruebas exhaustivas (ver tests/semaforo.test.js).
import { redondearMonto, formatearMoneda } from '../utilidades/dinero.js';

const UMBRAL_ROJO = 90; // % gastado
const UMBRAL_AMARILLO_GASTO = 75; // % gastado
const UMBRAL_AMARILLO_ADELANTO = 20; // puntos por encima del ritmo esperado

/**
 * Calcula el estado del semáforo para un período (una semana, o el mes
 * completo si se trata de un origen sin sub-división semanal, como Gustos).
 *
 * @param {{presupuesto:number, gastado:number, diasTranscurridos:number, diasTotales:number}} datos
 * @returns {{estado:'verde'|'amarillo'|'rojo'|'pasado', restante:number,
 *   diasRestantes:number, montoPorDia:number, porcentajeGastado:number, porcentajeTiempo:number}}
 */
export function calcularEstadoSemaforo({ presupuesto, gastado, diasTranscurridos, diasTotales }) {
  const restante = redondearMonto(presupuesto - gastado);
  const diasRestantes = Math.max(diasTotales - diasTranscurridos, 0);

  // Sin presupuesto asignado: solo importa si ya se gastó algo o no.
  if (presupuesto <= 0) {
    const estado = gastado > 0 ? 'pasado' : 'verde';
    return { estado, restante, diasRestantes, montoPorDia: restante, porcentajeGastado: gastado > 0 ? 100 : 0, porcentajeTiempo: 0 };
  }

  const porcentajeGastado = (gastado / presupuesto) * 100;
  const porcentajeTiempo = diasTotales > 0 ? (diasTranscurridos / diasTotales) * 100 : 100;
  const montoPorDia = diasRestantes > 0 ? redondearMonto(restante / diasRestantes) : restante;

  let estado;
  if (gastado >= presupuesto) {
    estado = 'pasado';
  } else if (porcentajeGastado >= UMBRAL_ROJO) {
    estado = 'rojo';
  } else if (
    porcentajeGastado >= UMBRAL_AMARILLO_GASTO ||
    porcentajeGastado - porcentajeTiempo > UMBRAL_AMARILLO_ADELANTO
  ) {
    estado = 'amarillo';
  } else {
    estado = 'verde';
  }

  return { estado, restante, diasRestantes, montoPorDia, porcentajeGastado, porcentajeTiempo };
}

/**
 * Convierte el resultado del semáforo en un mensaje claro y accionable,
 * como pidió Alejandro: "que me diga qué hacer, no solo que avise".
 * @param {string} nombreOrigen
 * @param {ReturnType<typeof calcularEstadoSemaforo>} resultado
 */
export function generarMensajeAlerta(nombreOrigen, resultado) {
  const { estado, restante, diasRestantes, montoPorDia } = resultado;
  const dias = `${diasRestantes} día${diasRestantes === 1 ? '' : 's'}`;

  if (estado === 'pasado') {
    const exceso = formatearMoneda(Math.abs(restante));
    return `Te excediste en ${nombreOrigen} por ${exceso}. Puedes cubrirlo con Gustos, Reserva o Imprevistos — nunca con tu Ahorro sin confirmarlo antes.`;
  }

  if (estado === 'rojo') {
    return `Cuidado con ${nombreOrigen}: te quedan ${formatearMoneda(restante)} para ${dias} (~${formatearMoneda(montoPorDia)}/día). Frena el resto del período.`;
  }

  if (estado === 'amarillo') {
    return `Vas rápido en ${nombreOrigen}: te quedan ${formatearMoneda(restante)} para ${dias} (~${formatearMoneda(montoPorDia)}/día).`;
  }

  return `Vas bien en ${nombreOrigen}: te quedan ${formatearMoneda(restante)} para ${dias}.`;
}
