// Configuración de la base de datos local (IndexedDB).
// Todo lo que guarda esta app vive únicamente en este dispositivo:
// no hay servidor, no hay cuentas, no se sube nada a internet.
import { openDB } from 'idb';

const NOMBRE_BD = 'finanzas-personales';
const VERSION_BD = 3;

/**
 * Abre (o crea, la primera vez) la base de datos con todas sus tablas
 * ("object stores" en el vocabulario de IndexedDB).
 */
let promesaBD;
export function obtenerBD() {
  if (!promesaBD) {
    promesaBD = openDB(NOMBRE_BD, VERSION_BD, {
      upgrade(bd) {
        // Configuración general de la app: un solo registro con id "principal"
        if (!bd.objectStoreNames.contains('configuracion')) {
          bd.createObjectStore('configuracion', { keyPath: 'id' });
        }

        // Categorías de gasto esencial (Internet, Comida, etc.)
        if (!bd.objectStoreNames.contains('categorias')) {
          bd.createObjectStore('categorias', { keyPath: 'id' });
        }

        // Los 4 "bolsillos" del reparto: ahorro, imprevistos, gustos, reserva
        if (!bd.objectStoreNames.contains('bolsillos')) {
          bd.createObjectStore('bolsillos', { keyPath: 'id' });
        }

        // Cada gasto o retiro que registra el usuario
        if (!bd.objectStoreNames.contains('transacciones')) {
          const tabla = bd.createObjectStore('transacciones', { keyPath: 'id' });
          tabla.createIndex('porFecha', 'fecha');
          tabla.createIndex('porOrigen', 'origenId');
        }

        // Ciclos de pago (desde un día de cobro hasta el siguiente)
        if (!bd.objectStoreNames.contains('ciclos')) {
          bd.createObjectStore('ciclos', { keyPath: 'id' });
        }

        // Decisiones sobre qué hacer con el sobrante de una semana ya cerrada
        // (pasarlo a Ahorro o usarlo la semana siguiente). Guardamos una por
        // cada combinación de ciclo + origen + número de semana, para no
        // volver a preguntar por una semana que ya se resolvió.
        if (!bd.objectStoreNames.contains('cierresSemana')) {
          bd.createObjectStore('cierresSemana', { keyPath: 'id' });
        }

        // Metas de ahorro personalizadas (equipo de trabajo, cursos, etc.)
        if (!bd.objectStoreNames.contains('metas')) {
          bd.createObjectStore('metas', { keyPath: 'id' });
        }
      },
    });
  }
  return promesaBD;
}
