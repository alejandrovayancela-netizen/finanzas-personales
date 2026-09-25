import { describe, it, expect } from 'vitest';
import { calcularGastosHormiga } from '../src/logica/gastosHormiga.js';

describe('calcularGastosHormiga', () => {
  it('suma solo los gastos por debajo del umbral y proyecta a un año', () => {
    const transacciones = [{ monto: 2 }, { monto: 3 }, { monto: 1.5 }, { monto: 35.5 }];
    const resultado = calcularGastosHormiga(transacciones, 5);
    expect(resultado.cantidad).toBe(3);
    expect(resultado.totalMes).toBe(6.5);
    expect(resultado.proyeccionAnual).toBe(78);
  });

  it('el ejemplo del documento: $42 al mes son $504 al año', () => {
    const transacciones = [{ monto: 42 }];
    const resultado = calcularGastosHormiga(transacciones, 100);
    expect(resultado.totalMes).toBe(42);
    expect(resultado.proyeccionAnual).toBe(504);
  });

  it('da cero si no hay gastos por debajo del umbral', () => {
    const resultado = calcularGastosHormiga([{ monto: 20 }], 5);
    expect(resultado.cantidad).toBe(0);
    expect(resultado.totalMes).toBe(0);
  });
});
