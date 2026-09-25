// Pruebas del semáforo de ritmo de gasto: la lógica más crítica de la app.
// Incluye el ejemplo exacto del documento de Alejandro para Comida.
import { describe, it, expect } from 'vitest';
import { calcularEstadoSemaforo, generarMensajeAlerta } from '../src/logica/semaforo.js';

describe('calcularEstadoSemaforo', () => {
  it('da verde cuando el gasto va igual o por debajo del ritmo esperado', () => {
    // Día 2 de 7 (29% del tiempo), gastado $5 de $37 (14%) -> vas bien
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 5,
      diasTranscurridos: 2,
      diasTotales: 7,
    });
    expect(resultado.estado).toBe('verde');
  });

  it('da amarillo al pasar el 75% del presupuesto semanal', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 28, // 75.7%
      diasTranscurridos: 3,
      diasTotales: 7,
    });
    expect(resultado.estado).toBe('amarillo');
  });

  it('da amarillo si vas más de 20 puntos por encima del ritmo, aunque no llegues al 75%', () => {
    // Día 1 de 7 (14% del tiempo), pero ya gastado el 40% del presupuesto
    const resultado = calcularEstadoSemaforo({
      presupuesto: 100,
      gastado: 40,
      diasTranscurridos: 1,
      diasTotales: 7,
    });
    expect(resultado.estado).toBe('amarillo');
  });

  it('da rojo al llegar al 90% del presupuesto', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 34, // 91.9%
      diasTranscurridos: 5,
      diasTotales: 7,
    });
    expect(resultado.estado).toBe('rojo');
  });

  it('da pasado cuando el gasto llega o supera el presupuesto', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 37,
      diasTranscurridos: 6,
      diasTotales: 7,
    });
    expect(resultado.estado).toBe('pasado');
    expect(resultado.restante).toBe(0);

    const excedido = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 45,
      diasTranscurridos: 7,
      diasTotales: 7,
    });
    expect(excedido.estado).toBe('pasado');
    expect(excedido.restante).toBe(-8);
  });

  it('el ejemplo exacto de Comida: jueves (día 4 de 7), $33 de $37', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 33,
      diasTranscurridos: 4,
      diasTotales: 7,
    });
    // 33/37 = 89.2% -> por debajo del 90% de rojo, pero sobre el 75% de amarillo
    expect(resultado.estado).toBe('amarillo');
    expect(resultado.restante).toBe(4);
    expect(resultado.diasRestantes).toBe(3);
    expect(resultado.montoPorDia).toBeCloseTo(1.33, 2);
  });

  it('no revienta si el presupuesto es cero y no se ha gastado nada', () => {
    const resultado = calcularEstadoSemaforo({ presupuesto: 0, gastado: 0, diasTranscurridos: 2, diasTotales: 7 });
    expect(resultado.estado).toBe('verde');
  });

  it('marca "pasado" si se gastó algo sin tener presupuesto asignado', () => {
    const resultado = calcularEstadoSemaforo({ presupuesto: 0, gastado: 5, diasTranscurridos: 2, diasTotales: 7 });
    expect(resultado.estado).toBe('pasado');
  });
});

describe('generarMensajeAlerta', () => {
  it('genera el mensaje esperado para el ejemplo de Comida (amarillo)', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 33,
      diasTranscurridos: 4,
      diasTotales: 7,
    });
    const mensaje = generarMensajeAlerta('Comida', resultado);
    expect(mensaje).toBe('Vas rápido en Comida: te quedan $4,00 para 3 días (~$1,33/día).');
  });

  it('el mensaje de "pasado" sugiere de dónde cubrir, nunca del ahorro', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 37,
      gastado: 45,
      diasTranscurridos: 7,
      diasTotales: 7,
    });
    const mensaje = generarMensajeAlerta('Comida', resultado);
    expect(mensaje).toContain('Te excediste en Comida por $8,00');
    expect(mensaje).toContain('Gustos, Reserva o Imprevistos');
    expect(mensaje.toLowerCase()).toContain('nunca con tu ahorro');
  });

  it('usa singular cuando queda un solo día', () => {
    const resultado = calcularEstadoSemaforo({
      presupuesto: 10,
      gastado: 8,
      diasTranscurridos: 6,
      diasTotales: 7,
    });
    const mensaje = generarMensajeAlerta('Pasajes', resultado);
    expect(mensaje).toContain('1 día ');
    expect(mensaje).not.toContain('1 días');
  });
});
