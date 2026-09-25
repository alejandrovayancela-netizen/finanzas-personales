// Pruebas del reparto de un ciclo de pago en semanas.
import { describe, it, expect } from 'vitest';
import {
  estimarFinDeCiclo,
  calcularSemanas,
  obtenerSemanaDe,
  calcularPresupuestoSemana,
} from '../src/logica/semanas.js';

describe('estimarFinDeCiclo', () => {
  it('estima un mes calendario completo desde el inicio del ciclo', () => {
    // Ciclo que empieza el 12 de septiembre: dura hasta el 11 de octubre.
    expect(estimarFinDeCiclo('2026-09-12')).toBe('2026-10-11');
  });

  it('maneja el caso de un inicio de ciclo a fin de mes', () => {
    // 31 de enero + 1 mes -> febrero no tiene 31, así que se ajusta al 28,
    // y el ciclo termina un día antes: 27 de febrero.
    expect(estimarFinDeCiclo('2026-01-31')).toBe('2026-02-27');
  });
});

describe('calcularSemanas', () => {
  it('divide un ciclo de 28 días en 4 semanas parejas de 7 días', () => {
    const semanas = calcularSemanas('2026-09-12', '2026-10-09'); // 28 días
    expect(semanas).toHaveLength(4);
    expect(semanas.every((s) => s.dias === 7)).toBe(true);
    expect(semanas[0].inicio).toBe('2026-09-12');
    expect(semanas[3].fin).toBe('2026-10-09');
  });

  it('deja la última semana más corta cuando el ciclo no es múltiplo de 7', () => {
    const semanas = calcularSemanas('2026-09-12', '2026-10-11'); // 30 días
    expect(semanas).toHaveLength(5);
    expect(semanas.slice(0, 4).every((s) => s.dias === 7)).toBe(true);
    expect(semanas[4].dias).toBe(2); // 30 = 4*7 + 2
    expect(semanas[4].fin).toBe('2026-10-11');
  });

  it('funciona con un ciclo de un solo día', () => {
    const semanas = calcularSemanas('2026-09-12', '2026-09-12');
    expect(semanas).toHaveLength(1);
    expect(semanas[0].dias).toBe(1);
  });
});

describe('obtenerSemanaDe', () => {
  const semanas = calcularSemanas('2026-09-12', '2026-10-11');

  it('encuentra la semana correcta para una fecha dentro del ciclo', () => {
    expect(obtenerSemanaDe(semanas, '2026-09-15').numero).toBe(1);
    expect(obtenerSemanaDe(semanas, '2026-09-19').numero).toBe(2);
    expect(obtenerSemanaDe(semanas, '2026-10-11').numero).toBe(5);
  });

  it('devuelve la última semana si la fecha ya pasó el fin del ciclo', () => {
    expect(obtenerSemanaDe(semanas, '2026-11-01').numero).toBe(5);
  });

  it('devuelve la primera semana si la fecha es anterior al inicio', () => {
    expect(obtenerSemanaDe(semanas, '2026-01-01').numero).toBe(1);
  });
});

describe('calcularPresupuestoSemana', () => {
  it('reparte proporcionalmente según los días de la semana', () => {
    const semana = { dias: 7 };
    // $150 al mes, ciclo de 30 días, semana de 7 días -> 150 * 7/30 = 35
    expect(calcularPresupuestoSemana(150, semana, 30)).toBe(35);
  });

  it('da un presupuesto menor para la última semana, más corta', () => {
    const semanaCorta = { dias: 2 };
    expect(calcularPresupuestoSemana(150, semanaCorta, 30)).toBe(10);
  });
});
