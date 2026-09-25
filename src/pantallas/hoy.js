// Pantalla principal: "Hoy". Muestra las alertas activas arriba de todo,
// el semáforo semanal de cada categoría variable y de Gustos, y los
// totales simples de lo demás (fijas, Imprevistos, Reserva, Ahorro).
import { calcularResumenOrigenes } from '../logica/resumenPeriodo.js';
import { obtenerConfiguracion } from '../datos/configuracion.js';
import { obtenerEstadoCompleto, obtenerSobrantesPendientes, resolverSobrante } from '../logica/motorPresupuesto.js';
import { abrirChecklistCobro } from '../componentes/checklistCobro.js';
import { formatearMoneda } from '../utilidades/dinero.js';
import { formatearFechaLarga, hoyISO } from '../utilidades/fechas.js';
import { colorParaOrigen } from '../utilidades/colorOrigen.js';

let contenedorActual = null;

export async function renderHoy(contenedor) {
  contenedorActual = contenedor;
  const [resumen, config, estadoCompleto] = await Promise.all([
    calcularResumenOrigenes(),
    obtenerConfiguracion(),
    obtenerEstadoCompleto(),
  ]);

  const gastadoPorId = new Map(
    [...resumen.categorias, ...resumen.bolsillos].map((o) => [o.id, o.gastado])
  );

  const totalGastado = resumen.categorias.reduce((s, c) => s + c.gastado, 0) + resumen.bolsillos.reduce((s, b) => s + b.gastado, 0);
  const sobrantesPendientes = estadoCompleto.enModoSeguimiento ? [] : await obtenerSobrantesPendientes();
  const alertasActivas = estadoCompleto.conSemaforo.filter((e) => e.estado !== 'verde');

  contenedor.innerHTML = `
    <div class="pantalla">
      <p class="eyebrow">${formatearFechaLarga(hoyISO())}</p>

      ${estadoCompleto.enModoSeguimiento ? bloqueModoSeguimiento() : ''}
      ${!estadoCompleto.enModoSeguimiento && esUltimaSemana(estadoCompleto.infoCiclo) ? bloqueProximoCobro() : ''}

      ${alertasActivas.length > 0 ? `<h3 style="margin-top:16px; margin-bottom:12px; font-size:16px;">Alertas</h3>${alertasActivas.map(bloqueAlerta).join('')}` : ''}

      ${sobrantesPendientes.map(bloqueSobrante).join('')}

      <div class="tarjeta-clara" style="margin-top: 16px;">
        <p class="eyebrow" style="color:#4d4947;">Gastado en este período</p>
        <p class="cifra-grande">${formatearMoneda(totalGastado)}</p>
        <p style="color:#4d4947; margin-top:4px;">de ${formatearMoneda(config.ingresoMensual)} de ingreso mensual</p>
      </div>

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 18px;">Esenciales</h3>
      ${
        estadoCompleto.enModoSeguimiento
          ? resumen.categorias.map(filaSimple).join('')
          : [
              ...estadoCompleto.conSemaforo
                .filter((e) => e.tipo === 'categoria')
                .map((e) => filaConSemaforo(e, gastadoPorId.get(e.id))),
              ...estadoCompleto.sinSemaforo.categoriasFijas.map((c) => filaFija(c, gastadoPorId.get(c.id) || 0)),
            ].join('')
      }

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 18px;">Otros bolsillos</h3>
      ${
        estadoCompleto.enModoSeguimiento
          ? resumen.bolsillos.filter((b) => b.id !== 'ahorro').map(filaSimple).join('')
          : [
              estadoCompleto.conSemaforo.filter((e) => e.tipo === 'bolsillo').map((e) => filaConSemaforo(e, gastadoPorId.get(e.id))),
              estadoCompleto.sinSemaforo.otrosBolsillos.map((b) => filaSimple({ ...b, gastado: gastadoPorId.get(b.id) || 0 })),
            ].flat().join('')
      }

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 18px;">Ahorro</h3>
      ${bloqueAhorro(resumen.bolsillos.find((b) => b.id === 'ahorro'))}
    </div>
  `;

  wireEventos(contenedor, sobrantesPendientes);
}

function esUltimaSemana(infoCiclo) {
  return infoCiclo.semanaActual.numero === infoCiclo.semanas.length;
}

function bloqueModoSeguimiento() {
  return `
    <div class="tarjeta-clara">
      <p class="eyebrow" style="color:#ee6018;">Modo seguimiento</p>
      <p style="margin-top: 8px; color:#101010;">
        Todavía no confirmas tu día de cobro. Sigue registrando tus gastos con normalidad:
        cuando te paguen, toca el botón de abajo y ahí arranca tu presupuesto semanal completo.
      </p>
      <button class="btn btn-oscuro btn-bloque" id="btn-ya-cobre" style="margin-top: 16px;">Ya cobré</button>
    </div>
  `;
}

function bloqueProximoCobro() {
  return `
    <div class="tarjeta-clara">
      <p class="eyebrow" style="color:#ee6018;">¿Ya cobraste?</p>
      <p style="margin-top: 8px; color:#101010;">
        Estás en la última semana de tu ciclo. En cuanto te paguen, toca aquí para separar tu
        plata y arrancar el nuevo ciclo.
      </p>
      <button class="btn btn-oscuro btn-bloque" id="btn-ya-cobre" style="margin-top: 16px;">Ya cobré</button>
    </div>
  `;
}

function bloqueAlerta(estado) {
  const clase = estado.estado === 'amarillo' ? 'alerta-amarilla' : 'alerta-roja';
  return `
    <div class="alerta ${clase}">
      <p class="alerta__titulo">${estado.nombre}</p>
      <p>${estado.mensaje}</p>
    </div>
  `;
}

function bloqueSobrante(sobrante) {
  return `
    <div class="alerta alerta-info">
      <p class="alerta__titulo">Te sobró en ${sobrante.nombre} (semana ${sobrante.semanaNumero})</p>
      <p>Te quedaron ${formatearMoneda(sobrante.sobrante)} sin gastar. ¿Qué quieres hacer con eso?</p>
      <div style="display:flex; gap:8px; margin-top: 12px;">
        <button class="btn btn-oscuro" data-sobrante-ahorro="${sobrante.origenId}__${sobrante.semanaNumero}">Pasar a Ahorro</button>
        <button class="btn btn-fantasma" data-sobrante-semana="${sobrante.origenId}__${sobrante.semanaNumero}">Usar la próxima semana</button>
      </div>
    </div>
  `;
}

const NOMBRE_ESTADO = { amarillo: 'Amarillo', rojo: 'Rojo', pasado: 'Excedido', verde: 'Verde' };
const CLASE_BADGE = { amarillo: 'badge-amarillo', rojo: 'badge-rojo', pasado: 'badge-rojo', verde: 'badge-verde' };
const CLASE_BARRA = { amarillo: 'es-amarillo', rojo: 'es-rojo', pasado: 'es-rojo', verde: '' };

function filaConSemaforo(estado, gastadoTotalCiclo) {
  const porcentaje = estado.presupuesto > 0 ? Math.min(100, (estado.gastado / estado.presupuesto) * 100) : 100;
  const etiquetaPeriodo = estado.periodo === 'semana' ? 'esta semana' : 'este mes';
  const color = colorParaOrigen(estado.id);
  // El color de identidad solo manda cuando vas bien (verde); si hay alerta,
  // manda el color de alerta — eso es información de seguridad, no de marca.
  const claseBarra = estado.estado === 'verde' ? 'es-identidad' : CLASE_BARRA[estado.estado];
  return `
    <div class="tarjeta-oscura" style="--color-identidad: ${color};">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="nombre-con-color"><span class="punto-identidad"></span>${estado.nombre}</span>
        <span class="badge ${CLASE_BADGE[estado.estado]}">${NOMBRE_ESTADO[estado.estado]}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px;">
        <span>${formatearMoneda(estado.gastado)}</span>
        <span class="texto-tenue">de ${formatearMoneda(estado.presupuesto)} ${etiquetaPeriodo}</span>
      </div>
      <div class="barra-progreso" style="margin-top: 8px;">
        <div class="barra-progreso__relleno ${claseBarra}" style="width: ${porcentaje}%;"></div>
      </div>
      ${gastadoTotalCiclo !== undefined ? `<p class="texto-tenue" style="margin-top: 8px; font-size: 12px;">En total este mes: ${formatearMoneda(gastadoTotalCiclo)}</p>` : ''}
    </div>
  `;
}

function filaFija(categoria, gastado) {
  const pagado = gastado > 0;
  const color = colorParaOrigen(categoria.id);
  return `
    <div class="tarjeta-oscura" style="--color-identidad: ${color};">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="nombre-con-color"><span class="punto-identidad"></span>${categoria.nombre}</span>
        <span class="badge ${pagado ? 'badge-verde' : 'badge-gris'}">${pagado ? 'Pagado' : 'Pendiente'}</span>
      </div>
      <div style="margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px;">
        <span class="texto-tenue">${formatearMoneda(categoria.monto)} / mes</span>
      </div>
      ${pagado ? '' : `<p class="texto-tenue" style="margin-top: 8px; font-size: 12px;">Regístralo desde el botón "+" cuando lo pagues.</p>`}
    </div>
  `;
}

function filaSimple(origen) {
  const porcentaje = origen.monto > 0 ? Math.min(100, (origen.gastado / origen.monto) * 100) : 0;
  const etiquetaTipo = origen.tipoGasto === 'fija' ? 'Fija' : origen.tipoGasto === 'variable' ? 'Variable' : '';
  const color = colorParaOrigen(origen.id);
  return `
    <div class="tarjeta-oscura" style="--color-identidad: ${color};">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="nombre-con-color"><span class="punto-identidad"></span>${origen.nombre}</span>
        <span class="eyebrow">${etiquetaTipo}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px;">
        <span>${formatearMoneda(origen.gastado)}</span>
        <span class="texto-tenue">de ${formatearMoneda(origen.monto)}</span>
      </div>
      <div class="barra-progreso" style="margin-top: 8px;">
        <div class="barra-progreso__relleno es-identidad" style="width: ${porcentaje}%;"></div>
      </div>
      ${
        origen.acumula
          ? `<p class="texto-tenue" style="margin-top: 8px; font-size: 12px;">Colchón acumulado: ${formatearMoneda(origen.saldoAcumulado)}</p>`
          : ''
      }
    </div>
  `;
}

function bloqueAhorro(ahorro) {
  return `
    <div class="tarjeta-oscura" style="--color-identidad: ${colorParaOrigen(ahorro.id)};">
      <div style="display:flex; justify-content:space-between;">
        <span class="nombre-con-color"><span class="punto-identidad"></span>Ahorro (protegido)</span>
        <span>${formatearMoneda(ahorro.monto)} / mes</span>
      </div>
      <p class="texto-tenue" style="margin-top: 8px; font-size: 13px;">
        Este dinero no se gasta directo. Se separa el día de cobro y se guarda para tu fondo
        de emergencia y tus metas.
      </p>
      ${
        ahorro.saldoAcumulado > 0
          ? `<p style="margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px; color: var(--color-verde);">Acumulado: ${formatearMoneda(ahorro.saldoAcumulado)}</p>`
          : ''
      }
    </div>
  `;
}

function wireEventos(contenedor, sobrantesPendientes) {
  const btnYaCobre = contenedor.querySelector('#btn-ya-cobre');
  if (btnYaCobre) {
    btnYaCobre.addEventListener('click', () => abrirChecklistCobro());
  }

  contenedor.querySelectorAll('[data-sobrante-ahorro]').forEach((boton) => {
    boton.addEventListener('click', async () => {
      const [origenId, semanaNumero] = boton.dataset.sobranteAhorro.split('__');
      const info = sobrantesPendientes.find((s) => s.origenId === origenId && String(s.semanaNumero) === semanaNumero);
      await resolverSobrante({ ...info, decision: 'ahorro' });
      await renderHoy(contenedorActual);
    });
  });

  contenedor.querySelectorAll('[data-sobrante-semana]').forEach((boton) => {
    boton.addEventListener('click', async () => {
      const [origenId, semanaNumero] = boton.dataset.sobranteSemana.split('__');
      const info = sobrantesPendientes.find((s) => s.origenId === origenId && String(s.semanaNumero) === semanaNumero);
      await resolverSobrante({ ...info, decision: 'siguienteSemana' });
      await renderHoy(contenedorActual);
    });
  });
}
