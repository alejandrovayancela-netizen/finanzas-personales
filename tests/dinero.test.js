// Pruebas de las funciones de dinero: son la base de todos los cálculos
// de presupuesto, así que tienen que ser exactas.
import { describe, it, expect } from 'vitest';
import { formatearMoneda, redondearMonto } from '../src/utilidades/dinero.js';

describe('formatearMoneda', () => {
  it('usa coma para los decimales y siempre muestra 2 decimales', () => {
    expect(formatearMoneda(37)).toBe('$37,00');
    expect(formatearMoneda(37.5)).toBe('$37,50');
  });

  it('usa punto como separador de miles', () => {
    expect(formatearMoneda(1234.5)).toBe('$1.234,50');
  });

  it('redondea a 2 decimales', () => {
    expect(formatearMoneda(37.567)).toBe('$37,57');
  });

  it('trata valores no numéricos como cero', () => {
    expect(formatearMoneda(NaN)).toBe('$0,00');
    expect(formatearMoneda(undefined)).toBe('$0,00');
  });

  it('muestra el signo negativo antes del símbolo de dólar', () => {
    expect(formatearMoneda(-15)).toBe('-$15,00');
  });
});

describe('redondearMonto', () => {
  it('evita errores de coma flotante al sumar', () => {
    expect(redondearMonto(0.1 + 0.2)).toBe(0.3);
  });
});
