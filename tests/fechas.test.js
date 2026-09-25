// Pruebas de las funciones de fechas. La fase 2 (semanas y alertas) depende
// totalmente de que estos cálculos de días sean correctos.
import { describe, it, expect } from 'vitest';
import {
  fechaAISO,
  isoAFecha,
  diferenciaDias,
  sumarDias,
  formatearFechaLarga,
} from '../src/utilidades/fechas.js';

describe('fechaAISO / isoAFecha', () => {
  it('convierte una fecha a texto YYYY-MM-DD y de vuelta sin perder el día', () => {
    const fecha = new Date(2026, 8, 24); // 24 de septiembre de 2026
    expect(fechaAISO(fecha)).toBe('2026-09-24');
    expect(isoAFecha('2026-09-24').getDate()).toBe(24);
  });
});

describe('diferenciaDias', () => {
  it('cuenta los días completos entre dos fechas', () => {
    expect(diferenciaDias('2026-09-12', '2026-09-19')).toBe(7);
  });

  it('da 0 cuando es el mismo día', () => {
    expect(diferenciaDias('2026-09-12', '2026-09-12')).toBe(0);
  });

  it('cruza correctamente el fin de mes', () => {
    expect(diferenciaDias('2026-09-28', '2026-10-02')).toBe(4);
  });
});

describe('sumarDias', () => {
  it('suma días sin salirse del mes', () => {
    expect(sumarDias('2026-09-12', 5)).toBe('2026-09-17');
  });

  it('resta días (número negativo) cruzando de mes', () => {
    expect(sumarDias('2026-10-01', -1)).toBe('2026-09-30');
  });
});

describe('formatearFechaLarga', () => {
  it('da formato DD/MM/AAAA', () => {
    expect(formatearFechaLarga('2026-01-05')).toBe('05/01/2026');
  });
});
