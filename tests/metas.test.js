// Pruebas de la cascada de ahorro: fondo de emergencia primero, luego
// las metas personalizadas en orden, tal como lo pidió Alejandro.
import { describe, it, expect } from 'vitest';
import { calcularCascadaAhorro, calcularFechaEstimada } from '../src/logica/metas.js';

const BUCKETS = [
  { id: 'fondo-emergencia', objetivo: 275 },
  { id: 'laptop', objetivo: 500 },
];

describe('calcularCascadaAhorro', () => {
  it('sin nada ahorrado, todo el faltante recae en el fondo de emergencia primero', () => {
    const [fondo, laptop] = calcularCascadaAhorro(0, BUCKETS, 200);
    expect(fondo).toMatchObject({ asignado: 0, faltante: 275, completado: false, mesesEstimados: 2 });
    expect(laptop).toMatchObject({ asignado: 0, faltante: 500, completado: false, mesesEstimados: 4 });
  });

  it('con el fondo de emergencia exacto, la meta empieza a recibir aportes', () => {
    const [fondo, laptop] = calcularCascadaAhorro(275, BUCKETS, 200);
    expect(fondo).toMatchObject({ asignado: 275, faltante: 0, completado: true, mesesEstimados: 0 });
    expect(laptop).toMatchObject({ asignado: 0, faltante: 500, completado: false, mesesEstimados: 3 });
  });

  it('con el fondo lleno y algo en la meta, reparte el sobrante a la meta', () => {
    const [fondo, laptop] = calcularCascadaAhorro(400, BUCKETS, 200);
    expect(fondo.completado).toBe(true);
    expect(laptop).toMatchObject({ asignado: 125, faltante: 375, completado: false, mesesEstimados: 2 });
  });

  it('con todo completo, ninguna meta queda pendiente', () => {
    const [fondo, laptop] = calcularCascadaAhorro(1000, BUCKETS, 200);
    expect(fondo.completado).toBe(true);
    expect(laptop).toMatchObject({ asignado: 500, faltante: 0, completado: true, mesesEstimados: 0 });
  });

  it('sin ahorro mensual configurado, no se puede estimar fecha para lo pendiente', () => {
    const [fondo] = calcularCascadaAhorro(0, BUCKETS, 0);
    expect(fondo.mesesEstimados).toBeNull();
  });

  it('nunca asigna más de lo que realmente hay ahorrado', () => {
    const [fondo, laptop] = calcularCascadaAhorro(100, BUCKETS, 200);
    expect(fondo.asignado + laptop.asignado).toBeLessThanOrEqual(100);
  });
});

describe('calcularFechaEstimada', () => {
  it('suma los meses estimados a la fecha de hoy', () => {
    expect(calcularFechaEstimada('2026-09-24', 3)).toBe('2026-12-24');
  });

  it('devuelve null si no hay una estimación de meses', () => {
    expect(calcularFechaEstimada('2026-09-24', null)).toBeNull();
  });
});
