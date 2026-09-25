// Pruebas del generador de consejos del resumen mensual.
import { describe, it, expect } from 'vitest';
import { generarConsejo } from '../src/logica/resumenMensual.js';

describe('generarConsejo', () => {
  it('felicita y sugiere pasar el sobrante a Ahorro si nadie se pasó', () => {
    const filas = [
      { nombre: 'Comida', presupuestado: 150, real: 100, sobregasto: -50 },
      { nombre: 'Pasajes', presupuestado: 20, real: 10, sobregasto: -10 },
    ];
    const consejo = generarConsejo(filas);
    expect(consejo).toContain('$60,00');
    expect(consejo.toLowerCase()).toContain('ahorro');
  });

  it('señala la única categoría con sobregasto', () => {
    const filas = [
      { nombre: 'Comida', presupuestado: 150, real: 180, sobregasto: 30 },
      { nombre: 'Pasajes', presupuestado: 20, real: 15, sobregasto: -5 },
    ];
    const consejo = generarConsejo(filas);
    expect(consejo).toContain('Comida');
    expect(consejo).toContain('$30,00');
  });

  it('menciona las dos peores categorías cuando hay varios sobregastos', () => {
    const filas = [
      { nombre: 'Comida', presupuestado: 150, real: 180, sobregasto: 30 },
      { nombre: 'Gustos', presupuestado: 50, real: 90, sobregasto: 40 },
      { nombre: 'Pasajes', presupuestado: 20, real: 15, sobregasto: -5 },
    ];
    const consejo = generarConsejo(filas);
    expect(consejo).toContain('Gustos');
    expect(consejo).toContain('Comida');
    // La peor (Gustos, $40) debe mencionarse primero que Comida ($30)
    expect(consejo.indexOf('Gustos')).toBeLessThan(consejo.indexOf('Comida'));
  });
});
