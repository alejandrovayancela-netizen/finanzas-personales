// Pantalla de Resumen: a dónde se fue la plata. Alterna entre "Semana"
// (las categorías con presupuesto semanal, tal cual las vive el semáforo)
// y "Mes" (todo el ciclo, con comparación contra el mes anterior).
import { obtenerInfoCiclo, obtenerEstadoCompleto } from '../logica/motorPresupuesto.js';
import { calcularResumenMensual, generarConsejo } from '../logica/resumenMensual.js';
import { calcularGastosHormiga } from '../logica/gastosHormiga.js';
import { listarTransacciones } from '../datos/transacciones.js';
import { obtenerConfiguracion } from '../datos/configuracion.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { hoyISO } from '../utilidades/fechas.js';

let vistaActual = 'mes'; // 'semana' | 'mes'

export async function renderResumen(contenedor) {
  const infoCiclo = await obtenerInfoCiclo();

  if (!infoCiclo) {
    contenedor.innerHTML = `
      <div class="pantalla">
        <p class="eyebrow">Resumen</p>
        <div class="tarjeta-clara" style="margin-top: 16px;">
          <p style="color:#101010;">
            Todavía estás en modo seguimiento. Confirma tu primer día de cobro desde "Hoy"
            para empezar a ver tu resumen semanal y mensual.
          </p>
        </div>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = `<div class="pantalla" id="contenido-resumen"></div>`;
  await pintarContenido(contenedor.querySelector('#contenido-resumen'), infoCiclo);
}

async function pintarContenido(contenedor, infoCiclo) {
  contenedor.innerHTML = `
    <p class="eyebrow">Resumen</p>
    <div class="segmentado" style="margin-top: 12px;">
      <button data-vista="semana" class="${vistaActual === 'semana' ? 'activo' : ''}">Esta semana</button>
      <button data-vista="mes" class="${vistaActual === 'mes' ? 'activo' : ''}">Este mes</button>
    </div>
    <div id="cuerpo-resumen" style="margin-top: 20px;"></div>
  `;

  contenedor.querySelectorAll('[data-vista]').forEach((boton) => {
    boton.addEventListener('click', async () => {
      vistaActual = boton.dataset.vista;
      await pintarContenido(contenedor, infoCiclo);
    });
  });

  const cuerpo = contenedor.querySelector('#cuerpo-resumen');
  if (vistaActual === 'semana') {
    await pintarVistaSemana(cuerpo, infoCiclo);
  } else {
    await pintarVistaMes(cuerpo, infoCiclo);
  }
}

async function pintarVistaSemana(cuerpo, infoCiclo) {
  const estadoCompleto = await obtenerEstadoCompleto();
  const sobregasto = (f) => f.gastado - f.presupuesto;
  const filas = [...estadoCompleto.conSemaforo].sort((a, b) => sobregasto(b) - sobregasto(a));

  cuerpo.innerHTML = `
    <p class="texto-tenue" style="font-size: 13px; margin-bottom: 12px;">
      Semana ${infoCiclo.semanaActual.numero} de ${infoCiclo.semanas.length} · presupuestado vs. gastado
    </p>
    ${filas.map((f) => barraPresupuesto(f.nombre, f.presupuesto, f.gastado)).join('')}
  `;
}

async function pintarVistaMes(cuerpo, infoCiclo) {
  const [{ filas, hayCicloAnterior }, config, transaccionesDelMes] = await Promise.all([
    calcularResumenMensual(infoCiclo),
    obtenerConfiguracion(),
    listarTransacciones({ desde: infoCiclo.ciclo.fechaInicio, hasta: hoyISO() }),
  ]);

  const consejo = generarConsejo(filas);
  const hormiga = calcularGastosHormiga(transaccionesDelMes, config.umbralHormiga);

  cuerpo.innerHTML = `
    <div class="alerta alerta-info">
      <p class="alerta__titulo">Tu consejo de este mes</p>
      <p>${consejo}</p>
    </div>

    <p class="texto-tenue" style="font-size: 13px; margin: 20px 0 12px;">
      Presupuestado vs. real · de mayor a menor sobregasto
    </p>
    ${filas.map((f) => barraPresupuesto(f.nombre, f.presupuestado, f.real)).join('')}

    ${hayCicloAnterior ? bloqueComparacionMesAnterior(filas) : ''}

    ${bloqueGastosHormiga(hormiga, config.umbralHormiga)}

    <div style="display:flex; flex-direction: column; gap: 8px; margin-top: 24px;">
      <a href="#/historial" class="btn btn-fantasma btn-bloque" style="text-decoration:none; text-align:center;">Ver historial completo</a>
      <a href="#/suscripciones" class="btn btn-fantasma btn-bloque" style="text-decoration:none; text-align:center;">
        Revisar mis suscripciones${config.ultimaRevisionSuscripcionesCicloId !== infoCiclo.ciclo.id ? ' (pendiente este mes)' : ''}
      </a>
    </div>
  `;
}

function barraPresupuesto(nombre, presupuestado, real) {
  const pct = presupuestado > 0 ? real / presupuestado : real > 0 ? 1 : 0;
  const clase = pct >= 1 ? 'es-rojo' : pct >= 0.9 ? 'es-rojo' : pct >= 0.75 ? 'es-amarillo' : '';
  const anchoRelleno = Math.min(100, pct * 100);

  return `
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between;">
        <span>${nombre}</span>
        <span class="texto-tenue" style="font-family: var(--fuente-mono); font-size: 13px;">
          ${formatearMoneda(real)} / ${formatearMoneda(presupuestado)}
        </span>
      </div>
      <div class="barra-progreso" style="margin-top: 8px;">
        <div class="barra-progreso__relleno ${clase}" style="width: ${anchoRelleno}%;"></div>
      </div>
    </div>
  `;
}

function bloqueComparacionMesAnterior(filas) {
  const conAnterior = filas.filter((f) => f.anterior !== null);
  if (conAnterior.length === 0) return '';

  return `
    <p class="texto-tenue" style="font-size: 13px; margin: 24px 0 12px;">Comparado con el mes anterior</p>
    <div class="dumbbell-leyenda">
      <span><span class="punto" style="background: var(--color-warm-granite);"></span>Mes anterior</span>
      <span><span class="punto" style="background: var(--color-bone);"></span>Este mes</span>
    </div>
    ${conAnterior.map(filaDumbbell).join('')}
  `;
}

function filaDumbbell(fila) {
  const maximo = Math.max(fila.anterior, fila.real, 1) * 1.15;
  const posAnterior = (fila.anterior / maximo) * 100;
  const posActual = (fila.real / maximo) * 100;
  const izquierda = Math.min(posAnterior, posActual);
  const ancho = Math.abs(posActual - posAnterior);
  const gastoMayor = fila.real > fila.anterior;
  const colorLinea = gastoMayor ? 'var(--color-rojo)' : 'var(--color-verde)';
  const signoDelta = fila.delta > 0 ? '+' : fila.delta < 0 ? '−' : '';

  return `
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span>${fila.nombre}</span>
        <span style="font-family: var(--fuente-mono); font-size: 12px; color:${gastoMayor ? 'var(--color-rojo)' : 'var(--color-verde)'};">
          ${signoDelta}${formatearMoneda(Math.abs(fila.delta))}
        </span>
      </div>
      <div class="dumbbell-track">
        <div class="dumbbell-linea" style="left:${izquierda}%; width:${ancho}%; background:${colorLinea};"></div>
        <div class="dumbbell-punto dumbbell-punto--anterior" style="left:${posAnterior}%;"></div>
        <div class="dumbbell-punto dumbbell-punto--actual" style="left:${posActual}%;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 6px; font-size: 11px;" class="texto-tenue">
        <span>${formatearMoneda(fila.anterior)}</span>
        <span>${formatearMoneda(fila.real)}</span>
      </div>
    </div>
  `;
}

function bloqueGastosHormiga(hormiga, umbral) {
  if (hormiga.cantidad === 0) return '';
  return `
    <div class="alerta alerta-info" style="margin-top: 24px;">
      <p class="alerta__titulo">Gastos hormiga (menores a ${formatearMoneda(umbral)})</p>
      <p>
        Llevas ${hormiga.cantidad} gasto${hormiga.cantidad === 1 ? '' : 's'} pequeño${hormiga.cantidad === 1 ? '' : 's'} este mes
        = ${formatearMoneda(hormiga.totalMes)}. Al año, eso son ${formatearMoneda(hormiga.proyeccionAnual)}.
      </p>
    </div>
  `;
}
