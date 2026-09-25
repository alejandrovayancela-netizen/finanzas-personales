// Registra qué se decidió hacer con el sobrante de una semana ya cerrada
// (pasarlo a Ahorro o usarlo la semana siguiente), para no volver a
// preguntar por una semana que ya se resolvió.
import { obtenerBD } from './baseDeDatos.js';

function idCierre(cicloId, origenId, semanaNumero) {
  return `${cicloId}__${origenId}__${semanaNumero}`;
}

export async function buscarCierre(cicloId, origenId, semanaNumero) {
  const bd = await obtenerBD();
  return bd.get('cierresSemana', idCierre(cicloId, origenId, semanaNumero));
}

/**
 * @param {{cicloId:string, origenId:string, semanaNumero:number,
 *   sobrante:number, decision:'ahorro'|'siguienteSemana'}} datos
 */
export async function guardarCierre(datos) {
  const bd = await obtenerBD();
  const registro = { id: idCierre(datos.cicloId, datos.origenId, datos.semanaNumero), ...datos };
  await bd.put('cierresSemana', registro);
  return registro;
}

/** Suma de todos los sobrantes que se decidió pasar a la semana siguiente. */
export async function obtenerAjusteSemanaSiguiente(cicloId, origenId, semanaNumeroAnterior) {
  const cierre = await buscarCierre(cicloId, origenId, semanaNumeroAnterior);
  if (cierre && cierre.decision === 'siguienteSemana') {
    return cierre.sobrante;
  }
  return 0;
}
