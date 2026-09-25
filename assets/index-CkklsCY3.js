(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t)=>t.some(t=>e instanceof t),t,n;function r(){return t||=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]}function i(){return n||=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey]}var a=new WeakMap,o=new WeakMap,s=new WeakMap;function c(e){let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`success`,i),e.removeEventListener(`error`,a)},i=()=>{t(d(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener(`success`,i),e.addEventListener(`error`,a)});return s.set(t,e),t}function l(e){if(a.has(e))return;let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`complete`,i),e.removeEventListener(`error`,a),e.removeEventListener(`abort`,a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException(`AbortError`,`AbortError`)),r()};e.addEventListener(`complete`,i),e.addEventListener(`error`,a),e.addEventListener(`abort`,a)});a.set(e,t)}var u={get(e,t,n){if(e instanceof IDBTransaction){if(t===`done`)return a.get(e);if(t===`store`)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return d(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t===`done`||t===`store`)||t in e}};function ee(e){u=e(u)}function te(e){return i().includes(e)?function(...t){return e.apply(f(this),t),d(this.request)}:function(...t){return d(e.apply(f(this),t))}}function ne(t){return typeof t==`function`?te(t):(t instanceof IDBTransaction&&l(t),e(t,r())?new Proxy(t,u):t)}function d(e){if(e instanceof IDBRequest)return c(e);if(o.has(e))return o.get(e);let t=ne(e);return t!==e&&(o.set(e,t),s.set(t,e)),t}var f=e=>s.get(e);function re(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=d(o);return r&&o.addEventListener(`upgradeneeded`,e=>{r(d(o.result),e.oldVersion,e.newVersion,d(o.transaction),e)}),n&&o.addEventListener(`blocked`,e=>n(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener(`close`,()=>a()),i&&e.addEventListener(`versionchange`,e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}var ie=[`get`,`getKey`,`getAll`,`getAllKeys`,`count`],ae=[`put`,`add`,`delete`,`clear`],p=new Map;function oe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t==`string`))return;if(p.get(t))return p.get(t);let n=t.replace(/FromIndex$/,``),r=t!==n,i=ae.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ie.includes(n)))return;let a=async function(e,...t){let a=this.transaction(e,i?`readwrite`:`readonly`),o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]};return p.set(t,a),a}ee(e=>({...e,get:(t,n,r)=>oe(t,n)||e.get(t,n,r),has:(t,n)=>!!oe(t,n)||e.has(t,n)}));var se=[`continue`,`continuePrimaryKey`,`advance`],ce={},m=new WeakMap,le=new WeakMap,ue={get(e,t){if(!se.includes(t))return e[t];let n=ce[t];return n||=ce[t]=function(...e){m.set(this,le.get(this)[t](...e))},n}};async function*de(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;let n=new Proxy(t,ue);for(le.set(n,t),s.set(n,f(t));t;)yield n,t=await(m.get(n)||t.continue()),m.delete(n)}function fe(t,n){return n===Symbol.asyncIterator&&e(t,[IDBIndex,IDBObjectStore,IDBCursor])||n===`iterate`&&e(t,[IDBIndex,IDBObjectStore])}ee(e=>({...e,get(t,n,r){return fe(t,n)?de:e.get(t,n,r)},has(t,n){return fe(t,n)||e.has(t,n)}}));var pe=`finanzas-personales`,me=3,he;function h(){return he||=re(pe,me,{upgrade(e){if(e.objectStoreNames.contains(`configuracion`)||e.createObjectStore(`configuracion`,{keyPath:`id`}),e.objectStoreNames.contains(`categorias`)||e.createObjectStore(`categorias`,{keyPath:`id`}),e.objectStoreNames.contains(`bolsillos`)||e.createObjectStore(`bolsillos`,{keyPath:`id`}),!e.objectStoreNames.contains(`transacciones`)){let t=e.createObjectStore(`transacciones`,{keyPath:`id`});t.createIndex(`porFecha`,`fecha`),t.createIndex(`porOrigen`,`origenId`)}e.objectStoreNames.contains(`ciclos`)||e.createObjectStore(`ciclos`,{keyPath:`id`}),e.objectStoreNames.contains(`cierresSemana`)||e.createObjectStore(`cierresSemana`,{keyPath:`id`}),e.objectStoreNames.contains(`metas`)||e.createObjectStore(`metas`,{keyPath:`id`})}}),he}function g(){return crypto.randomUUID()}function _(){return v(new Date)}function v(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function y(e){let[t,n,r]=e.split(`-`).map(Number);return new Date(t,n-1,r)}function b(e,t){let n=y(e),r=y(t);return Math.round((r.getTime()-n.getTime())/864e5)}function x(e,t){let n=y(e);return n.setDate(n.getDate()+t),v(n)}function ge(e,t){let n=y(e),r=n.getDate();return n.setMonth(n.getMonth()+t),n.getDate()!==r&&n.setDate(0),v(n)}function S(e){let t=y(e);return`${String(t.getDate()).padStart(2,`0`)}/${String(t.getMonth()+1).padStart(2,`0`)}/${t.getFullYear()}`}var _e=[{nombre:`Internet`,monto:25,tipo:`fija`},{nombre:`Suscripción Claude`,monto:20,tipo:`fija`},{nombre:`Pasajes / transporte`,monto:20,tipo:`variable`},{nombre:`Comida`,monto:150,tipo:`variable`},{nombre:`Almuerzos en el trabajo`,monto:60,tipo:`variable`}],ve=[{id:`ahorro`,nombre:`Ahorro`,monto:200,acumula:!0,saldoAcumulado:0},{id:`imprevistos`,nombre:`Imprevistos`,monto:60,acumula:!0,saldoAcumulado:0},{id:`gustos`,nombre:`Gustos`,monto:50,acumula:!1,saldoAcumulado:0},{id:`reserva`,nombre:`Reserva`,monto:15,acumula:!0,saldoAcumulado:0}];async function ye(){let e=await h();if(await e.get(`configuracion`,`principal`))return;let t=e.transaction([`configuracion`,`categorias`,`bolsillos`],`readwrite`);await t.objectStore(`configuracion`).put({id:`principal`,ingresoMensual:600,diaCobroEsperado:12,umbralHormiga:5,fechaPrimerUso:_()});for(let e of _e)await t.objectStore(`categorias`).put({id:g(),...e});for(let e of ve)await t.objectStore(`bolsillos`).put(e);await t.done}function C(e){let t=Number.isFinite(e)?e:0,n=t.toFixed(2).split(`.`),r=n[0].replace(`-`,``),i=n[1],a=r.replace(/\B(?=(\d{3})+(?!\d))/g,`.`);return`${t<0?`-`:``}$${a},${i}`}function w(e){return Math.round((e+2**-52)*100)/100}var be=[`ahorro`,`imprevistos`,`gustos`,`reserva`];async function T(){return(await(await h()).getAll(`bolsillos`)).sort((e,t)=>be.indexOf(e.id)-be.indexOf(t.id))}async function xe(e){return(await h()).get(`bolsillos`,e)}async function Se(e,t){let n=await h(),r=await n.get(`bolsillos`,e);if(!r)throw Error(`El bolsillo no existe`);let i={...r,monto:t};return await n.put(`bolsillos`,i),i}async function Ce(e,t){let n=await h(),r=await n.get(`bolsillos`,e);if(!r)throw Error(`El bolsillo no existe`);let i={...r,saldoAcumulado:w(r.saldoAcumulado+t)};return await n.put(`bolsillos`,i),i}async function E(){return(await(await h()).getAll(`ciclos`)).find(e=>e.fechaFin===null)||null}async function we(){return await E()===null}async function Te(){return(await(await h()).getAll(`ciclos`)).sort((e,t)=>e.fechaInicio<t.fechaInicio?1:-1)}async function Ee(e){let t=await h(),n=await E();if(n){let r=x(e,-1);await t.put(`ciclos`,{...n,fechaFin:r})}let r={id:g(),fechaInicio:e,fechaFin:null};await t.put(`ciclos`,r);let i=await T();for(let e of i)e.acumula&&await Ce(e.id,e.monto);return r}async function D(){return(await h()).get(`configuracion`,`principal`)}async function De(e){let t=await h(),n={...await t.get(`configuracion`,`principal`),...e};return await t.put(`configuracion`,n),n}async function O(){return(await(await h()).getAll(`categorias`)).sort((e,t)=>e.nombre.localeCompare(t.nombre,`es`))}async function Oe(e){let t=await h(),n={id:g(),...e};return await t.put(`categorias`,n),n}async function ke(e,t){let n=await h(),r=await n.get(`categorias`,e);if(!r)throw Error(`La categoría no existe`);let i={...r,...t};return await n.put(`categorias`,i),i}async function Ae(e){await(await h()).delete(`categorias`,e)}async function k(){return(await O()).reduce((e,t)=>e+t.monto,0)}async function A(e,t){if(!e||e.origenTipo!==`bolsillo`)return;let n=await xe(e.origenId);n&&n.acumula&&await Ce(n.id,t*e.monto)}async function je(e){if(!e.origenTipo||!e.origenId)throw Error(`Toda transacción necesita un origen (categoría o bolsillo)`);if(!(e.monto>0))throw Error(`El monto debe ser mayor a cero`);if(e.origenTipo===`bolsillo`&&e.origenId===`ahorro`&&!e.confirmoRetiroAhorro)throw Error(`Un retiro de Ahorro necesita confirmación explícita`);let t={id:g(),fecha:e.fecha||_(),monto:w(e.monto),nota:e.nota||``,origenTipo:e.origenTipo,origenId:e.origenId,creadoEn:Date.now()};return await(await h()).put(`transacciones`,t),await A(t,-1),t}async function Me(e,t){let n=await h(),r=await n.get(`transacciones`,e);if(!r)throw Error(`La transacción no existe`);let i={...r,...t};return t.monto!==void 0&&(i.monto=w(t.monto)),await A(r,1),await n.put(`transacciones`,i),await A(i,-1),i}async function Ne(e){let t=await h(),n=await t.get(`transacciones`,e);await t.delete(`transacciones`,e),await A(n,1)}async function j(e={}){let t=await(await h()).getAll(`transacciones`);return e.desde&&(t=t.filter(t=>t.fecha>=e.desde)),e.hasta&&(t=t.filter(t=>t.fecha<=e.hasta)),e.origenId&&(t=t.filter(t=>t.origenId===e.origenId)),t.sort((e,t)=>e.fecha===t.fecha?t.creadoEn-e.creadoEn:e.fecha<t.fecha?1:-1)}async function M(e,t,n){return w((await j({origenId:e,desde:t,hasta:n})).reduce((e,t)=>e+t.monto,0))}async function Pe(){let e=await E();return e?{inicio:e.fechaInicio,fin:_(),enModoSeguimiento:!1,ciclo:e}:{inicio:(await D()).fechaPrimerUso,fin:_(),enModoSeguimiento:!0,ciclo:null}}async function Fe(){let{inicio:e,fin:t,enModoSeguimiento:n}=await Pe(),[r,i,a]=await Promise.all([O(),T(),j({desde:e,hasta:t})]),o=e=>w(a.filter(t=>t.origenId===e).reduce((e,t)=>e+t.monto,0));return{categorias:r.map(e=>({tipo:`categoria`,id:e.id,nombre:e.nombre,monto:e.monto,tipoGasto:e.tipo,gastado:o(e.id)})),bolsillos:i.map(e=>({tipo:`bolsillo`,id:e.id,nombre:e.nombre,monto:e.monto,acumula:e.acumula,saldoAcumulado:e.saldoAcumulado,gastado:o(e.id)})),inicio:e,fin:t,enModoSeguimiento:n}}function Ie(e,t,n){return`${e}__${t}__${n}`}async function Le(e,t,n){return(await h()).get(`cierresSemana`,Ie(e,t,n))}async function Re(e){let t=await h(),n={id:Ie(e.cicloId,e.origenId,e.semanaNumero),...e};return await t.put(`cierresSemana`,n),n}async function ze(e,t,n){let r=await Le(e,t,n);return r&&r.decision===`siguienteSemana`?r.sobrante:0}function Be(e){return x(ge(e,1),-1)}function Ve(e,t){let n=b(e,t)+1,r=Math.max(1,Math.ceil(n/7)),i=[];for(let n=0;n<r;n++){let r=x(e,n*7),a=x(r,6),o=a>t?t:a,s=b(r,o)+1;i.push({numero:n+1,inicio:r,fin:o,dias:s})}return i}function He(e,t){return e.find(e=>t>=e.inicio&&t<=e.fin)||(t<e[0].inicio?e[0]:e[e.length-1])}function Ue(e,t,n){return n<=0?0:w(e*t.dias/n)}var We=90,Ge=75,Ke=20;function N({presupuesto:e,gastado:t,diasTranscurridos:n,diasTotales:r}){let i=w(e-t),a=Math.max(r-n,0);if(e<=0)return{estado:t>0?`pasado`:`verde`,restante:i,diasRestantes:a,montoPorDia:i,porcentajeGastado:t>0?100:0,porcentajeTiempo:0};let o=t/e*100,s=r>0?n/r*100:100,c=a>0?w(i/a):i,l;return l=t>=e?`pasado`:o>=We?`rojo`:o>=Ge||o-s>Ke?`amarillo`:`verde`,{estado:l,restante:i,diasRestantes:a,montoPorDia:c,porcentajeGastado:o,porcentajeTiempo:s}}function P(e,t){let{estado:n,restante:r,diasRestantes:i,montoPorDia:a}=t,o=`${i} día${i===1?``:`s`}`;return n===`pasado`?`Te excediste en ${e} por ${C(Math.abs(r))}. Puedes cubrirlo con Gustos, Reserva o Imprevistos — nunca con tu Ahorro sin confirmarlo antes.`:n===`rojo`?`Cuidado con ${e}: te quedan ${C(r)} para ${o} (~${C(a)}/día). Frena el resto del período.`:n===`amarillo`?`Vas rápido en ${e}: te quedan ${C(r)} para ${o} (~${C(a)}/día).`:`Vas bien en ${e}: te quedan ${C(r)} para ${o}.`}var F=`gustos`;async function I(){let e=await E();if(!e)return null;let t=_(),n=e.fechaFin||Be(e.fechaInicio),r=b(e.fechaInicio,n)+1,i=Ve(e.fechaInicio,n);return{ciclo:e,fechaFin:n,totalDias:r,semanas:i,semanaActual:He(i,t),hoy:t}}async function qe(e,t){let{ciclo:n,totalDias:r,semanaActual:i}=t,[a,o]=await Promise.all([M(e.id,i.inicio,i.fin),i.numero>1?ze(n.id,e.id,i.numero-1):Promise.resolve(0)]),s=w(Ue(e.monto,i,r)+o),c=N({presupuesto:s,gastado:a,diasTranscurridos:Math.min(Math.max(b(i.inicio,t.hoy)+1,0),i.dias),diasTotales:i.dias});return{...c,presupuesto:s,gastado:a,mensaje:P(e.nombre,c)}}async function Je(e,t){let{ciclo:n,totalDias:r,hoy:i}=t,a=await M(e.id,n.fechaInicio,i),o=Math.min(Math.max(b(n.fechaInicio,i)+1,0),r),s=N({presupuesto:e.monto,gastado:a,diasTranscurridos:o,diasTotales:r});return{...s,presupuesto:e.monto,gastado:a,mensaje:P(e.nombre,s)}}async function Ye(){let e=await I(),[t,n]=await Promise.all([O(),T()]);if(!e)return{enModoSeguimiento:!0,infoCiclo:null,conSemaforo:[],sinSemaforo:{categorias:t,bolsillos:n}};let r=t.filter(e=>e.tipo===`fija`),i=t.filter(e=>e.tipo===`variable`),a=n.find(e=>e.id===F),o=n.filter(e=>e.id!==F);return{enModoSeguimiento:!1,infoCiclo:e,conSemaforo:await Promise.all([...i.map(async t=>({tipo:`categoria`,id:t.id,nombre:t.nombre,periodo:`semana`,...await qe(t,e)})),(async()=>({tipo:`bolsillo`,id:a.id,nombre:a.nombre,periodo:`mes`,...await Je(a,e)}))()]),sinSemaforo:{categoriasFijas:r,otrosBolsillos:o}}}async function Xe(e,t,n){let r=await I();if(!r)return null;if(e===`bolsillo`&&t===F){let e=(await T()).find(e=>e.id===F),t=await Je(e,r);return Ze(e.nombre,t,n,r.totalDias,r.totalDias)}if(e===`categoria`){let e=(await O()).find(e=>e.id===t);if(!e||e.tipo!==`variable`)return null;let i=await qe(e,r),a=Math.min(Math.max(b(r.semanaActual.inicio,r.hoy)+1,0),r.semanaActual.dias);return Ze(e.nombre,i,n,a,r.semanaActual.dias)}return null}function Ze(e,t,n,r,i){let a=N({presupuesto:t.presupuesto,gastado:w(t.gastado+n),diasTranscurridos:r,diasTotales:i});return{...a,mensaje:P(e,a)}}async function Qe(){let e=await I();if(!e)return[];let t=(await O()).filter(e=>e.tipo===`variable`),n=[];for(let r of t)for(let t of e.semanaActual.numero>1?e.semanas:[]){if(t.fin>=e.hoy||t.numero>=e.semanaActual.numero||await Le(e.ciclo.id,r.id,t.numero))continue;let i=w(Ue(r.monto,t,e.totalDias)-await M(r.id,t.inicio,t.fin));i>.01&&n.push({cicloId:e.ciclo.id,origenId:r.id,nombre:r.nombre,semanaNumero:t.numero,sobrante:i})}return n}async function $e({cicloId:e,origenId:t,semanaNumero:n,sobrante:r,decision:i}){if(await Re({cicloId:e,origenId:t,semanaNumero:n,sobrante:r,decision:i}),i===`ahorro`){let e=await h(),t=await e.get(`bolsillos`,`ahorro`);await e.put(`bolsillos`,{...t,saldoAcumulado:w(t.saldoAcumulado+r)})}}var et={ahorro:e=>`Pasa ${C(e)} a tu cuenta de Ahorro`,imprevistos:e=>`Aparta ${C(e)} para Imprevistos`,gustos:e=>`Aparta ${C(e)} para Gustos`,reserva:e=>`Aparta ${C(e)} para Reserva`};async function tt(){let[e,t]=await Promise.all([k(),T()]),n=[{id:`esenciales`,texto:`Aparta ${C(e)} para tus Esenciales (Internet, Comida, etc.)`},...t.map(e=>({id:e.id,texto:et[e.id](e.monto)}))],r=document.createElement(`div`);r.className=`panel-fondo`,r.innerHTML=`
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>Págate primero</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-checklist" aria-label="Cerrar">✕</button>
      </div>

      <p class="texto-tenue" style="margin-bottom: 16px;">
        Separa la plata de verdad (transferencias, sobres, lo que uses) y marca cada paso.
      </p>

      <div id="lista-pasos">
        ${n.map(e=>`
              <label class="tarjeta-oscura" style="display:flex; align-items:center; gap:12px; margin-bottom:8px; cursor:pointer;">
                <input type="checkbox" data-paso="${e.id}" style="width:20px; height:20px;" />
                <span>${e.texto}</span>
              </label>
            `).join(``)}
      </div>

      <div class="campo" style="margin-top: 16px;">
        <label>Fecha en la que cobraste</label>
        <input type="date" id="input-fecha-cobro" value="${_()}" />
      </div>

      <button type="button" class="btn btn-claro btn-grande btn-bloque" id="btn-confirmar-cobro" disabled>
        Confirmar cobro
      </button>
    </div>
  `,document.body.appendChild(r);let i=r.querySelectorAll(`input[type="checkbox"]`),a=r.querySelector(`#btn-confirmar-cobro`);i.forEach(e=>{e.addEventListener(`change`,()=>{a.disabled=![...i].every(e=>e.checked)})}),r.querySelector(`#btn-cerrar-checklist`).addEventListener(`click`,()=>r.remove()),r.addEventListener(`click`,e=>{e.target===r&&r.remove()}),a.addEventListener(`click`,async()=>{a.disabled=!0,await Ee(r.querySelector(`#input-fecha-cobro`).value||_()),r.remove(),await J()})}var L=null;async function R(e){L=e;let[t,n,r]=await Promise.all([Fe(),D(),Ye()]),i=new Map([...t.categorias,...t.bolsillos].map(e=>[e.id,e.gastado])),a=t.categorias.reduce((e,t)=>e+t.gastado,0)+t.bolsillos.reduce((e,t)=>e+t.gastado,0),o=r.enModoSeguimiento?[]:await Qe(),s=r.conSemaforo.filter(e=>e.estado!==`verde`);e.innerHTML=`
    <div class="pantalla">
      <p class="eyebrow">${S(_())}</p>

      ${r.enModoSeguimiento?rt():``}
      ${!r.enModoSeguimiento&&nt(r.infoCiclo)?it():``}

      ${s.length>0?`<h3 style="margin-top:16px; margin-bottom:12px; font-size:16px;">Alertas</h3>${s.map(at).join(``)}`:``}

      ${o.map(ot).join(``)}

      <div class="tarjeta-clara" style="margin-top: 16px;">
        <p class="eyebrow" style="color:#4d4947;">Gastado en este período</p>
        <p class="cifra-grande">${C(a)}</p>
        <p style="color:#4d4947; margin-top:4px;">de ${C(n.ingresoMensual)} de ingreso mensual</p>
      </div>

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 18px;">Esenciales</h3>
      ${r.enModoSeguimiento?t.categorias.map(z).join(``):[...r.conSemaforo.filter(e=>e.tipo===`categoria`).map(e=>ut(e,i.get(e.id))),...r.sinSemaforo.categoriasFijas.map(e=>dt(e,i.get(e.id)||0))].join(``)}

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 18px;">Otros bolsillos</h3>
      ${r.enModoSeguimiento?t.bolsillos.filter(e=>e.id!==`ahorro`).map(z).join(``):[r.conSemaforo.filter(e=>e.tipo===`bolsillo`).map(e=>ut(e,i.get(e.id))),r.sinSemaforo.otrosBolsillos.map(e=>z({...e,gastado:i.get(e.id)||0}))].flat().join(``)}

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 18px;">Ahorro</h3>
      ${ft(t.bolsillos.find(e=>e.id===`ahorro`))}
    </div>
  `,pt(e,o)}function nt(e){return e.semanaActual.numero===e.semanas.length}function rt(){return`
    <div class="tarjeta-clara">
      <p class="eyebrow" style="color:#ee6018;">Modo seguimiento</p>
      <p style="margin-top: 8px; color:#101010;">
        Todavía no confirmas tu día de cobro. Sigue registrando tus gastos con normalidad:
        cuando te paguen, toca el botón de abajo y ahí arranca tu presupuesto semanal completo.
      </p>
      <button class="btn btn-oscuro btn-bloque" id="btn-ya-cobre" style="margin-top: 16px;">Ya cobré</button>
    </div>
  `}function it(){return`
    <div class="tarjeta-clara">
      <p class="eyebrow" style="color:#ee6018;">¿Ya cobraste?</p>
      <p style="margin-top: 8px; color:#101010;">
        Estás en la última semana de tu ciclo. En cuanto te paguen, toca aquí para separar tu
        plata y arrancar el nuevo ciclo.
      </p>
      <button class="btn btn-oscuro btn-bloque" id="btn-ya-cobre" style="margin-top: 16px;">Ya cobré</button>
    </div>
  `}function at(e){return`
    <div class="alerta ${e.estado===`amarillo`?`alerta-amarilla`:`alerta-roja`}">
      <p class="alerta__titulo">${e.nombre}</p>
      <p>${e.mensaje}</p>
    </div>
  `}function ot(e){return`
    <div class="alerta alerta-info">
      <p class="alerta__titulo">Te sobró en ${e.nombre} (semana ${e.semanaNumero})</p>
      <p>Te quedaron ${C(e.sobrante)} sin gastar. ¿Qué quieres hacer con eso?</p>
      <div style="display:flex; gap:8px; margin-top: 12px;">
        <button class="btn btn-oscuro" data-sobrante-ahorro="${e.origenId}__${e.semanaNumero}">Pasar a Ahorro</button>
        <button class="btn btn-fantasma" data-sobrante-semana="${e.origenId}__${e.semanaNumero}">Usar la próxima semana</button>
      </div>
    </div>
  `}var st={amarillo:`Amarillo`,rojo:`Rojo`,pasado:`Excedido`,verde:`Verde`},ct={amarillo:`badge-amarillo`,rojo:`badge-rojo`,pasado:`badge-rojo`,verde:`badge-verde`},lt={amarillo:`es-amarillo`,rojo:`es-rojo`,pasado:`es-rojo`,verde:``};function ut(e,t){let n=e.presupuesto>0?Math.min(100,e.gastado/e.presupuesto*100):100,r=e.periodo===`semana`?`esta semana`:`este mes`;return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span>${e.nombre}</span>
        <span class="badge ${ct[e.estado]}">${st[e.estado]}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px;">
        <span>${C(e.gastado)}</span>
        <span class="texto-tenue">de ${C(e.presupuesto)} ${r}</span>
      </div>
      <div class="barra-progreso" style="margin-top: 8px;">
        <div class="barra-progreso__relleno ${lt[e.estado]}" style="width: ${n}%;"></div>
      </div>
      ${t===void 0?``:`<p class="texto-tenue" style="margin-top: 8px; font-size: 12px;">En total este mes: ${C(t)}</p>`}
    </div>
  `}function dt(e,t){let n=t>0;return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span>${e.nombre}</span>
        <span class="badge ${n?`badge-verde`:`badge-gris`}">${n?`Pagado`:`Pendiente`}</span>
      </div>
      <div style="margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px;">
        <span class="texto-tenue">${C(e.monto)} / mes</span>
      </div>
      ${n?``:`<p class="texto-tenue" style="margin-top: 8px; font-size: 12px;">Regístralo desde el botón "+" cuando lo pagues.</p>`}
    </div>
  `}function z(e){let t=e.monto>0?Math.min(100,e.gastado/e.monto*100):0,n=e.tipoGasto===`fija`?`Fija`:e.tipoGasto===`variable`?`Variable`:``;return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span>${e.nombre}</span>
        <span class="eyebrow">${n}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px;">
        <span>${C(e.gastado)}</span>
        <span class="texto-tenue">de ${C(e.monto)}</span>
      </div>
      <div class="barra-progreso" style="margin-top: 8px;">
        <div class="barra-progreso__relleno" style="width: ${t}%;"></div>
      </div>
      ${e.acumula?`<p class="texto-tenue" style="margin-top: 8px; font-size: 12px;">Colchón acumulado: ${C(e.saldoAcumulado)}</p>`:``}
    </div>
  `}function ft(e){return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between;">
        <span>Ahorro (protegido)</span>
        <span>${C(e.monto)} / mes</span>
      </div>
      <p class="texto-tenue" style="margin-top: 8px; font-size: 13px;">
        Este dinero no se gasta directo. Se separa el día de cobro y se guarda para tu fondo
        de emergencia y tus metas.
      </p>
      ${e.saldoAcumulado>0?`<p style="margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px; color: var(--color-verde);">Acumulado: ${C(e.saldoAcumulado)}</p>`:``}
    </div>
  `}function pt(e,t){let n=e.querySelector(`#btn-ya-cobre`);n&&n.addEventListener(`click`,()=>tt()),e.querySelectorAll(`[data-sobrante-ahorro]`).forEach(e=>{e.addEventListener(`click`,async()=>{let[n,r]=e.dataset.sobranteAhorro.split(`__`);await $e({...t.find(e=>e.origenId===n&&String(e.semanaNumero)===r),decision:`ahorro`}),await R(L)})}),e.querySelectorAll(`[data-sobrante-semana]`).forEach(e=>{e.addEventListener(`click`,async()=>{let[n,r]=e.dataset.sobranteSemana.split(`__`);await $e({...t.find(e=>e.origenId===n&&String(e.semanaNumero)===r),decision:`siguienteSemana`}),await R(L)})})}async function mt(e){let t=await O();e.innerHTML=`
    <div class="pantalla">
      <p class="eyebrow">Categorías esenciales</p>
      <p class="cifra-media" style="margin-top: 8px;">${C(t.reduce((e,t)=>e+t.monto,0))} / mes</p>

      <div style="margin-top: 24px;">
        ${t.map(ht).join(``)||`<p class="texto-tenue">Todavía no tienes categorías.</p>`}
      </div>

      <button class="btn btn-fantasma btn-bloque" id="btn-nueva-categoria" style="margin-top: 16px;">
        + Nueva categoría
      </button>
    </div>
  `,e.querySelector(`#btn-nueva-categoria`).addEventListener(`click`,()=>gt(null)),e.querySelectorAll(`[data-editar]`).forEach(e=>{e.addEventListener(`click`,()=>{gt(t.find(t=>t.id===e.dataset.editar))})})}function ht(e){return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span>${e.nombre}</span>
        <span class="eyebrow">${e.tipo===`fija`?`Fija`:`Variable`}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 8px;">
        <span class="cifra-media">${C(e.monto)}</span>
        <button class="btn btn-fantasma" data-editar="${e.id}">Editar</button>
      </div>
    </div>
  `}function gt(e){let t=e!==null,n=document.createElement(`div`);n.className=`panel-fondo`,n.innerHTML=`
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>${t?`Editar categoría`:`Nueva categoría`}</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-form" aria-label="Cerrar">✕</button>
      </div>

      <form id="form-categoria">
        <div class="campo">
          <label>Nombre</label>
          <input type="text" id="campo-nombre" required maxlength="40" value="${t?e.nombre:``}" />
        </div>

        <div class="campo">
          <label>Monto mensual</label>
          <input type="number" id="campo-monto" required min="0" step="0.01" value="${t?e.monto:``}" />
        </div>

        <div class="campo">
          <label>Tipo</label>
          <div class="campo-radios">
            <label>
              <input type="radio" name="tipo" value="fija" ${t&&e.tipo===`fija`?`checked`:``} />
              <span>Fija (pago único)</span>
            </label>
            <label>
              <input type="radio" name="tipo" value="variable" ${!t||e.tipo===`variable`?`checked`:``} />
              <span>Variable (por semana)</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque">Guardar</button>
        ${t?`<button type="button" class="btn btn-peligro btn-bloque" id="btn-borrar-categoria" style="margin-top: 12px;">Borrar categoría</button>`:``}
      </form>
    </div>
  `,document.body.appendChild(n),n.querySelector(`#btn-cerrar-form`).addEventListener(`click`,()=>n.remove()),n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),n.querySelector(`#form-categoria`).addEventListener(`submit`,async r=>{r.preventDefault();let i={nombre:n.querySelector(`#campo-nombre`).value.trim(),monto:parseFloat(n.querySelector(`#campo-monto`).value)||0,tipo:n.querySelector(`input[name="tipo"]:checked`).value};t?await ke(e.id,i):await Oe(i),n.remove(),await J()});let r=n.querySelector(`#btn-borrar-categoria`);r&&r.addEventListener(`click`,async()=>{window.confirm(`¿Borrar la categoría "${e.nombre}"? Esto no se puede deshacer.`)&&(await Ae(e.id),n.remove(),await J())})}async function B(){return(await(await h()).getAll(`metas`)).sort((e,t)=>e.orden-t.orden)}async function _t(e){let t=await h(),n=await B(),r={id:g(),nombre:e.nombre,precioObjetivo:e.precioObjetivo,fechaObjetivo:e.fechaObjetivo||null,orden:n.length,creadaEn:Date.now()};return await t.put(`metas`,r),r}async function vt(e,t){let n=await h(),r=await n.get(`metas`,e);if(!r)throw Error(`La meta no existe`);let i={...r,...t};return await n.put(`metas`,i),i}async function yt(e){await(await h()).delete(`metas`,e)}async function bt(e,t){let n=await h(),r=await B(),i=r.findIndex(t=>t.id===e),a=t===`arriba`?i-1:i+1;if(i===-1||a<0||a>=r.length)return;let o=r[i].orden;r[i].orden=r[a].orden,r[a].orden=o,await n.put(`metas`,r[i]),await n.put(`metas`,r[a])}function xt(e,t,n){let r=Math.max(e,0),i=0;return t.map(t=>{i=w(i+t.objetivo);let a=w(Math.min(r,t.objetivo));r=w(r-a);let o=w(Math.max(t.objetivo-a,0)),s=o<=0,c=w(Math.max(i-e,0)),l=s||n<=0?s?0:null:Math.ceil(c/n);return{id:t.id,objetivo:t.objetivo,asignado:a,faltante:o,completado:s,mesesEstimados:l}})}function St(e,t){return t==null?null:ge(e,t)}var Ct=`fondo-emergencia`;async function wt(){let[e,t,n]=await Promise.all([xe(`ahorro`),k(),B()]),r=[{id:Ct,objetivo:t},...n.map(e=>({id:e.id,objetivo:e.precioObjetivo}))],i=xt(e.saldoAcumulado,r,e.monto),a=_();return i.map(t=>{let r=t.id===Ct,i=r?null:n.find(e=>e.id===t.id),o=St(a,t.mesesEstimados),s=null;return!r&&i?.fechaObjetivo&&o&&!t.completado&&(s=b(i.fechaObjetivo,o)<=0?`a-tiempo`:`atrasado`),{...t,esFondoEmergencia:r,nombre:r?`Fondo de emergencia`:i.nombre,fechaObjetivoUsuario:r?null:i.fechaObjetivo,fechaEstimada:o,comparacionFecha:s,ahorroMensual:e.monto}})}async function Tt(e){let t=await wt();e.innerHTML=`
    <div class="pantalla">
      <p class="eyebrow">Metas de ahorro</p>
      <p class="cifra-media" style="margin-top: 8px;">${C(t[0]?.ahorroMensual??0)} / mes</p>
      <p class="texto-tenue" style="margin-top: 4px; font-size: 13px;">
        Tu ahorro llena primero la meta de arriba; cuando se completa, empieza a llenar la siguiente.
      </p>

      <div style="margin-top: 24px;">
        ${t.map((e,n)=>Et(e,n,t.length)).join(``)}
      </div>

      <button class="btn btn-fantasma btn-bloque" id="btn-nueva-meta" style="margin-top: 16px;">
        + Nueva meta
      </button>
    </div>
  `,e.querySelector(`#btn-nueva-meta`).addEventListener(`click`,()=>Dt(null)),e.querySelectorAll(`[data-editar-meta]`).forEach(e=>{e.addEventListener(`click`,()=>{Dt(t.find(t=>t.id===e.dataset.editarMeta))})}),e.querySelectorAll(`[data-mover]`).forEach(e=>{e.addEventListener(`click`,async()=>{await bt(e.dataset.mover,e.dataset.direccion),await J()})})}function Et(e,t,n){let r=e.objetivo>0?Math.min(100,e.asignado/e.objetivo*100):0,i=!e.esFondoEmergencia;return`
    <div class="tarjeta-clara" style="margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="eyebrow" style="color:#4d4947;">${e.esFondoEmergencia?`Prioridad 1 · recomendado`:`Prioridad ${t+1}`}</span>
        ${e.completado?`<span class="badge badge-verde">Completado</span>`:``}
      </div>
      <p style="font-size: 20px; margin-top: 4px;">${e.nombre}</p>

      <div class="barra-progreso" style="margin-top: 12px; background: #d8d5d2;">
        <div class="barra-progreso__relleno" style="width: ${r}%;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 8px; font-family: var(--fuente-mono); font-size: 13px; color:#4d4947;">
        <span>${C(e.asignado)}</span>
        <span>de ${C(e.objetivo)}</span>
      </div>

      ${e.completado?``:`<p style="margin-top: 8px; color:#101010;">
              ${e.mesesEstimados===null?`Configura tu ahorro mensual para estimar una fecha.`:e.mesesEstimados===0?`Ya está financiada.`:`Faltan ${C(e.faltante)} · lo completarías en ${e.mesesEstimados} mes${e.mesesEstimados===1?``:`es`} (${S(e.fechaEstimada)})`}
            </p>`}

      ${e.fechaObjetivoUsuario?`<p style="margin-top: 4px; font-size: 13px; color:#4d4947;">
              Tu fecha objetivo: ${S(e.fechaObjetivoUsuario)}
              ${e.comparacionFecha===`a-tiempo`?` — vas a tiempo ✓`:``}
              ${e.comparacionFecha===`atrasado`?` — al ritmo actual llegarías tarde`:``}
            </p>`:``}

      <div style="display:flex; gap:8px; margin-top: 16px;">
        ${i?`<button class="btn btn-fantasma" data-editar-meta="${e.id}" style="color:#101010; border-color:#4d4947;">Editar</button>`:``}
        ${i&&t>0?`<button class="btn btn-fantasma" data-mover="${e.id}" data-direccion="arriba" style="color:#101010; border-color:#4d4947;">▲</button>`:``}
        ${i&&t<n-1?`<button class="btn btn-fantasma" data-mover="${e.id}" data-direccion="abajo" style="color:#101010; border-color:#4d4947;">▼</button>`:``}
      </div>
    </div>
  `}function Dt(e){let t=e!==null,n=document.createElement(`div`);n.className=`panel-fondo`,n.innerHTML=`
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>${t?`Editar meta`:`Nueva meta`}</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-form" aria-label="Cerrar">✕</button>
      </div>

      <form id="form-meta">
        <div class="campo">
          <label>Nombre</label>
          <input type="text" id="campo-nombre" required maxlength="40" value="${t?e.nombre:``}" placeholder="Ej: Laptop para trabajar" />
        </div>

        <div class="campo">
          <label>Precio</label>
          <input type="number" id="campo-precio" required min="0" step="0.01" value="${t?e.precioObjetivo:``}" />
        </div>

        <div class="campo">
          <label>Fecha objetivo (opcional)</label>
          <input type="date" id="campo-fecha" value="${t&&e.fechaObjetivo?e.fechaObjetivo:``}" />
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque">Guardar</button>
        ${t?`<button type="button" class="btn btn-peligro btn-bloque" id="btn-borrar-meta" style="margin-top: 12px;">Borrar meta</button>`:``}
      </form>
    </div>
  `,document.body.appendChild(n),n.querySelector(`#btn-cerrar-form`).addEventListener(`click`,()=>n.remove()),n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),n.querySelector(`#form-meta`).addEventListener(`submit`,async r=>{r.preventDefault();let i={nombre:n.querySelector(`#campo-nombre`).value.trim(),precioObjetivo:parseFloat(n.querySelector(`#campo-precio`).value)||0,fechaObjetivo:n.querySelector(`#campo-fecha`).value||null};t?await vt(e.id,i):await _t(i),n.remove(),await J()});let r=n.querySelector(`#btn-borrar-meta`);r&&r.addEventListener(`click`,async()=>{window.confirm(`¿Borrar la meta "${e.nombre}"? Esto no se puede deshacer.`)&&(await yt(e.id),n.remove(),await J())})}async function Ot(){return(await Te()).find(e=>e.fechaFin!==null)||null}async function kt(e){let[t,n,r]=await Promise.all([O(),T(),Ot()]),i=[...t.map(e=>({id:e.id,nombre:e.nombre,monto:e.monto})),...n.filter(e=>e.id!==`ahorro`).map(e=>({id:e.id,nombre:e.nombre,monto:e.monto}))],a=await Promise.all(i.map(async t=>{let n=await M(t.id,e.ciclo.fechaInicio,_()),i=r?await M(t.id,r.fechaInicio,r.fechaFin):null,a=w(n-t.monto),o=i===null?null:w(n-i);return{...t,presupuestado:t.monto,real:n,anterior:i,sobregasto:a,delta:o}}));return a.sort((e,t)=>t.sobregasto-e.sobregasto),{filas:a,hayCicloAnterior:r!==null}}function At(e){let t=e.filter(e=>e.sobregasto>0).sort((e,t)=>t.sobregasto-e.sobregasto);if(t.length===0){let t=w(e.reduce((e,t)=>e+t.presupuestado,0)-e.reduce((e,t)=>e+t.real,0));return t>0?`Vas dentro de todos tus presupuestos. Te quedan ${C(t)} sin gastar este mes — considera pasarlos a tu Ahorro.`:`Vas dentro de todos tus presupuestos este mes. Sigue así.`}let n=t[0];return t.length===1?`Tu único sobregasto este mes es en ${n.nombre}: te pasaste por ${C(n.sobregasto)}. Revisa esa categoría la próxima semana.`:`Donde más te pasaste este mes es en ${n.nombre} (${C(n.sobregasto)} de más), seguido de ${t[1].nombre} (${C(t[1].sobregasto)} de más). Empieza por ahí.`}function jt(e,t){let n=e.filter(e=>e.monto<t),r=w(n.reduce((e,t)=>e+t.monto,0)),i=w(r*12);return{cantidad:n.length,totalMes:r,proyeccionAnual:i}}var V=`mes`;async function Mt(e){let t=await I();if(!t){e.innerHTML=`
      <div class="pantalla">
        <p class="eyebrow">Resumen</p>
        <div class="tarjeta-clara" style="margin-top: 16px;">
          <p style="color:#101010;">
            Todavía estás en modo seguimiento. Confirma tu primer día de cobro desde "Hoy"
            para empezar a ver tu resumen semanal y mensual.
          </p>
        </div>
      </div>
    `;return}e.innerHTML=`<div class="pantalla" id="contenido-resumen"></div>`,await Nt(e.querySelector(`#contenido-resumen`),t)}async function Nt(e,t){e.innerHTML=`
    <p class="eyebrow">Resumen</p>
    <div class="segmentado" style="margin-top: 12px;">
      <button data-vista="semana" class="${V===`semana`?`activo`:``}">Esta semana</button>
      <button data-vista="mes" class="${V===`mes`?`activo`:``}">Este mes</button>
    </div>
    <div id="cuerpo-resumen" style="margin-top: 20px;"></div>
  `,e.querySelectorAll(`[data-vista]`).forEach(n=>{n.addEventListener(`click`,async()=>{V=n.dataset.vista,await Nt(e,t)})});let n=e.querySelector(`#cuerpo-resumen`);V===`semana`?await Pt(n,t):await Ft(n,t)}async function Pt(e,t){let n=await Ye(),r=e=>e.gastado-e.presupuesto,i=[...n.conSemaforo].sort((e,t)=>r(t)-r(e));e.innerHTML=`
    <p class="texto-tenue" style="font-size: 13px; margin-bottom: 12px;">
      Semana ${t.semanaActual.numero} de ${t.semanas.length} · presupuestado vs. gastado
    </p>
    ${i.map(e=>It(e.nombre,e.presupuesto,e.gastado)).join(``)}
  `}async function Ft(e,t){let[{filas:n,hayCicloAnterior:r},i,a]=await Promise.all([kt(t),D(),j({desde:t.ciclo.fechaInicio,hasta:_()})]),o=At(n),s=jt(a,i.umbralHormiga);e.innerHTML=`
    <div class="alerta alerta-info">
      <p class="alerta__titulo">Tu consejo de este mes</p>
      <p>${o}</p>
    </div>

    <p class="texto-tenue" style="font-size: 13px; margin: 20px 0 12px;">
      Presupuestado vs. real · de mayor a menor sobregasto
    </p>
    ${n.map(e=>It(e.nombre,e.presupuestado,e.real)).join(``)}

    ${r?Lt(n):``}

    ${zt(s,i.umbralHormiga)}

    <div style="display:flex; flex-direction: column; gap: 8px; margin-top: 24px;">
      <a href="#/historial" class="btn btn-fantasma btn-bloque" style="text-decoration:none; text-align:center;">Ver historial completo</a>
      <a href="#/suscripciones" class="btn btn-fantasma btn-bloque" style="text-decoration:none; text-align:center;">
        Revisar mis suscripciones${i.ultimaRevisionSuscripcionesCicloId===t.ciclo.id?``:` (pendiente este mes)`}
      </a>
    </div>
  `}function It(e,t,n){let r=t>0?n/t:+(n>0),i=r>=1||r>=.9?`es-rojo`:r>=.75?`es-amarillo`:``,a=Math.min(100,r*100);return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between;">
        <span>${e}</span>
        <span class="texto-tenue" style="font-family: var(--fuente-mono); font-size: 13px;">
          ${C(n)} / ${C(t)}
        </span>
      </div>
      <div class="barra-progreso" style="margin-top: 8px;">
        <div class="barra-progreso__relleno ${i}" style="width: ${a}%;"></div>
      </div>
    </div>
  `}function Lt(e){let t=e.filter(e=>e.anterior!==null);return t.length===0?``:`
    <p class="texto-tenue" style="font-size: 13px; margin: 24px 0 12px;">Comparado con el mes anterior</p>
    <div class="dumbbell-leyenda">
      <span><span class="punto" style="background: var(--color-warm-granite);"></span>Mes anterior</span>
      <span><span class="punto" style="background: var(--color-bone);"></span>Este mes</span>
    </div>
    ${t.map(Rt).join(``)}
  `}function Rt(e){let t=Math.max(e.anterior,e.real,1)*1.15,n=e.anterior/t*100,r=e.real/t*100,i=Math.min(n,r),a=Math.abs(r-n),o=e.real>e.anterior,s=o?`var(--color-rojo)`:`var(--color-verde)`,c=e.delta>0?`+`:e.delta<0?`−`:``;return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span>${e.nombre}</span>
        <span style="font-family: var(--fuente-mono); font-size: 12px; color:${o?`var(--color-rojo)`:`var(--color-verde)`};">
          ${c}${C(Math.abs(e.delta))}
        </span>
      </div>
      <div class="dumbbell-track">
        <div class="dumbbell-linea" style="left:${i}%; width:${a}%; background:${s};"></div>
        <div class="dumbbell-punto dumbbell-punto--anterior" style="left:${n}%;"></div>
        <div class="dumbbell-punto dumbbell-punto--actual" style="left:${r}%;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 6px; font-size: 11px;" class="texto-tenue">
        <span>${C(e.anterior)}</span>
        <span>${C(e.real)}</span>
      </div>
    </div>
  `}function zt(e,t){return e.cantidad===0?``:`
    <div class="alerta alerta-info" style="margin-top: 24px;">
      <p class="alerta__titulo">Gastos hormiga (menores a ${C(t)})</p>
      <p>
        Llevas ${e.cantidad} gasto${e.cantidad===1?``:`s`} pequeño${e.cantidad===1?``:`s`} este mes
        = ${C(e.totalMes)}. Al año, eso son ${C(e.proyeccionAnual)}.
      </p>
    </div>
  `}function H({titulo:e,mensaje:t,claseAlerta:n=`alerta-info`,textoConfirmar:r=`Continuar`,textoCancelar:i=`Cancelar`}){return new Promise(a=>{let o=document.createElement(`div`);o.className=`panel-fondo`,o.innerHTML=`
      <div class="panel-hoja">
        <div class="alerta ${n}">
          <p class="alerta__titulo">${e}</p>
          <p>${t}</p>
        </div>
        <div style="display:flex; flex-direction: column; gap: 8px;">
          <button class="btn btn-claro btn-grande btn-bloque" id="btn-confirmar">${r}</button>
          <button class="btn btn-fantasma btn-bloque" id="btn-cancelar">${i}</button>
        </div>
      </div>
    `;let s=e=>{o.remove(),a(e)};o.querySelector(`#btn-confirmar`).addEventListener(`click`,()=>s(!0)),o.querySelector(`#btn-cancelar`).addEventListener(`click`,()=>s(!1)),o.addEventListener(`click`,e=>{e.target===o&&s(!1)}),document.body.appendChild(o)})}var U={busqueda:``,origenId:``,desde:``,hasta:``};async function W(e){let[t,n,r]=await Promise.all([j(),O(),T()]),i=[...n.map(e=>({...e,_origenTipo:`categoria`})),...r.map(e=>({...e,_origenTipo:`bolsillo`}))],a=new Map(i.map(e=>[e.id,e.nombre])),o=t.filter(e=>{let t=a.get(e.origenId)||``,n=!U.busqueda||e.nota.toLowerCase().includes(U.busqueda.toLowerCase())||t.toLowerCase().includes(U.busqueda.toLowerCase()),r=!U.origenId||e.origenId===U.origenId,i=!U.desde||e.fecha>=U.desde,o=!U.hasta||e.fecha<=U.hasta;return n&&r&&i&&o}),s=o.reduce((e,t)=>e+t.monto,0);e.innerHTML=`
    <div class="pantalla">
      <p class="eyebrow">Historial</p>

      <div class="campo" style="margin-top: 16px;">
        <input type="text" id="input-busqueda" placeholder="Buscar por nota o categoría" value="${U.busqueda}" />
      </div>

      <div class="campo">
        <select id="select-origen">
          <option value="">Todas las categorías y bolsillos</option>
          ${i.map(e=>`<option value="${e.id}" ${U.origenId===e.id?`selected`:``}>${e.nombre}</option>`).join(``)}
        </select>
      </div>

      <div style="display:flex; gap:8px;">
        <div class="campo" style="flex:1;">
          <label>Desde</label>
          <input type="date" id="input-desde" value="${U.desde}" />
        </div>
        <div class="campo" style="flex:1;">
          <label>Hasta</label>
          <input type="date" id="input-hasta" value="${U.hasta}" />
        </div>
      </div>

      <p class="texto-tenue" style="margin-bottom: 12px;">
        ${o.length} gasto${o.length===1?``:`s`} · total ${C(s)}
      </p>

      ${o.map(e=>Bt(e,a.get(e.origenId))).join(``)||`<p class="texto-tenue">No hay gastos con estos filtros.</p>`}
    </div>
  `,e.querySelector(`#input-busqueda`).addEventListener(`input`,t=>{U.busqueda=t.target.value,W(e)}),e.querySelector(`#select-origen`).addEventListener(`change`,t=>{U.origenId=t.target.value,W(e)}),e.querySelector(`#input-desde`).addEventListener(`change`,t=>{U.desde=t.target.value,W(e)}),e.querySelector(`#input-hasta`).addEventListener(`change`,t=>{U.hasta=t.target.value,W(e)}),e.querySelectorAll(`[data-editar-transaccion]`).forEach(e=>{e.addEventListener(`click`,()=>{Vt(t.find(t=>t.id===e.dataset.editarTransaccion),i)})})}function Bt(e,t){return`
    <div class="tarjeta-oscura" data-editar-transaccion="${e.id}" style="cursor:pointer;">
      <div style="display:flex; justify-content:space-between;">
        <span>${t||`Categoría eliminada`}</span>
        <span style="font-family: var(--fuente-mono);">${C(e.monto)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top: 6px;" class="texto-tenue">
        <span style="font-size: 13px;">${e.nota||`Sin nota`}</span>
        <span class="eyebrow">${S(e.fecha)}</span>
      </div>
    </div>
  `}function Vt(e,t){let n=document.createElement(`div`);n.className=`panel-fondo`,n.innerHTML=`
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>Editar gasto</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-form" aria-label="Cerrar">✕</button>
      </div>

      <form id="form-transaccion">
        <div class="campo">
          <label>Monto</label>
          <input type="number" id="campo-monto" required min="0.01" step="0.01" value="${e.monto}" />
        </div>

        <div class="campo">
          <label>Categoría / bolsillo</label>
          <select id="campo-origen">
            ${t.map(t=>`<option value="${t.id}" ${t.id===e.origenId?`selected`:``}>${t.nombre}</option>`).join(``)}
          </select>
        </div>

        <div class="campo">
          <label>Fecha</label>
          <input type="date" id="campo-fecha" required max="${_()}" value="${e.fecha}" />
        </div>

        <div class="campo">
          <label>Nota</label>
          <input type="text" id="campo-nota" maxlength="80" value="${e.nota||``}" />
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque">Guardar</button>
        <button type="button" class="btn btn-peligro btn-bloque" id="btn-borrar-transaccion" style="margin-top: 12px;">Borrar gasto</button>
      </form>
    </div>
  `,document.body.appendChild(n),n.querySelector(`#btn-cerrar-form`).addEventListener(`click`,()=>n.remove()),n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),n.querySelector(`#form-transaccion`).addEventListener(`submit`,async r=>{r.preventDefault();let i=t.find(e=>e.id===n.querySelector(`#campo-origen`).value);(i.id!==`ahorro`||e.origenId===`ahorro`||await H({titulo:`Estás por tocar tu Ahorro`,mensaje:`Vas a mover este gasto para que salga de tu Ahorro. ¿Seguro?`,claseAlerta:`alerta-roja`,textoConfirmar:`Sí, mover a Ahorro`,textoCancelar:`Mejor no`}))&&(await Me(e.id,{monto:parseFloat(n.querySelector(`#campo-monto`).value)||0,fecha:n.querySelector(`#campo-fecha`).value,nota:n.querySelector(`#campo-nota`).value.trim(),origenId:i.id,origenTipo:i._origenTipo}),n.remove(),await J())}),n.querySelector(`#btn-borrar-transaccion`).addEventListener(`click`,async()=>{window.confirm(`¿Borrar este gasto? Esto no se puede deshacer.`)&&(await Ne(e.id),n.remove(),await J())})}async function Ht(e){let[t,n,r]=await Promise.all([O(),D(),I()]),i=t.filter(e=>e.tipo===`fija`);e.innerHTML=`
    <div class="pantalla">
      <p class="eyebrow">Revisión de suscripciones</p>
      <p class="texto-tenue" style="margin-top: 8px; font-size: 14px;">
        Por cada gasto fijo: ¿lo usaste este mes? ¿te ayuda a ganar dinero o a mejorar? Si la
        respuesta es no, bórralo de una vez.
      </p>

      <div style="margin-top: 20px;">
        ${i.map(Ut).join(``)||`<p class="texto-tenue">No tienes categorías fijas todavía.</p>`}
      </div>

      <button class="btn btn-oscuro btn-grande btn-bloque" id="btn-terminar-revision" style="margin-top: 16px;">
        Ya revisé todo esto
      </button>
    </div>
  `,e.querySelectorAll(`[data-borrar-suscripcion]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.borrarSuscripcion,n=i.find(e=>e.id===t);window.confirm(`¿Borrar "${n.nombre}"? Esto cancela el seguimiento de este gasto fijo en la app.`)&&(await Ae(t),e.closest(`.tarjeta-oscura`).remove())})}),e.querySelector(`#btn-terminar-revision`).addEventListener(`click`,async()=>{r&&await De({ultimaRevisionSuscripcionesCicloId:r.ciclo.id}),window.location.hash=`#/resumen`})}function Ut(e){return`
    <div class="tarjeta-oscura">
      <div style="display:flex; justify-content:space-between;">
        <span>${e.nombre}</span>
        <span style="font-family: var(--fuente-mono);">${C(e.monto)} / mes</span>
      </div>
      <p class="texto-tenue" style="margin-top: 8px; font-size: 13px;">¿La sigues usando y te conviene pagarla?</p>
      <button class="btn btn-peligro btn-bloque" data-borrar-suscripcion="${e.id}" style="margin-top: 12px;">
        No, cancelar / borrar esta
      </button>
    </div>
  `}var G=[`configuracion`,`categorias`,`bolsillos`,`transacciones`,`ciclos`,`cierresSemana`,`metas`],Wt=1;async function Gt(){let e=await h(),t={};for(let n of G)t[n]=await e.getAll(n);return{version:Wt,generadoEn:new Date().toISOString(),app:`finanzas-personales`,datos:t}}async function Kt(e){if(!e||typeof e!=`object`||!e.datos)throw Error(`El archivo no tiene el formato de un respaldo válido`);let t=(await h()).transaction(G,`readwrite`);for(let n of G){let r=t.objectStore(n);await r.clear();let i=e.datos[n]||[];for(let e of i)await r.put(e)}await t.done}function qt(e,t,n){let r=new Blob([e],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(i)}async function Jt(){let e=await Gt(),t=new Date().toISOString().slice(0,10);qt(JSON.stringify(e,null,2),`respaldo-finanzas-${t}.json`,`application/json`)}function Yt(e){let t=String(e??``);return t.includes(`,`)||t.includes(`"`)||t.includes(`
`)?`"${t.replace(/"/g,`""`)}"`:t}async function Xt(){let[e,t,n]=await Promise.all([j(),O(),T()]),r=new Map([...t,...n].map(e=>[e.id,e.nombre]));qt(`﻿`+[[`Fecha`,`Categoria`,`Monto`,`Nota`],...e.map(e=>[S(e.fecha),r.get(e.origenId)||`Categoría eliminada`,C(e.monto),e.nota||``])].map(e=>e.map(Yt).join(`,`)).join(`\r
`),`historial-finanzas-${new Date().toISOString().slice(0,10)}.csv`,`text/csv;charset=utf-8`)}async function Zt(e){let[t,n,r,i]=await Promise.all([D(),T(),k(),we()]),a=r+n.reduce((e,t)=>e+t.monto,0),o=t.ingresoMensual-a;e.innerHTML=`
    <div class="pantalla">
      <p class="eyebrow">Ajustes</p>

      <form id="form-ajustes">
        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Ingreso y cobro</h3>
        <div class="campo">
          <label>Ingreso mensual</label>
          <input type="number" id="campo-ingreso" min="0" step="0.01" value="${t.ingresoMensual}" />
        </div>
        <div class="campo">
          <label>Día de cobro esperado (1-31)</label>
          <input type="number" id="campo-dia-cobro" min="1" max="31" value="${t.diaCobroEsperado}" />
        </div>

        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Reparto: págate primero</h3>
        <div class="tarjeta-oscura" style="margin-bottom: 16px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Esenciales (suma de tus categorías)</span>
            <span>${C(r)}</span>
          </div>
        </div>

        ${n.map(e=>`
              <div class="campo">
                <label>${e.nombre}</label>
                <input type="number" min="0" step="0.01" data-bolsillo="${e.id}" value="${e.monto}" />
              </div>
            `).join(``)}

        <div class="tarjeta-oscura" style="border-color: ${o<0?`var(--color-rojo)`:`var(--color-borde)`};">
          <div style="display:flex; justify-content:space-between;">
            <span>${o<0?`Te pasaste del ingreso por`:`Sin asignar`}</span>
            <span>${C(Math.abs(o))}</span>
          </div>
        </div>

        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Gastos hormiga</h3>
        <div class="campo">
          <label>Considerar "gasto hormiga" si es menor a</label>
          <input type="number" id="campo-umbral-hormiga" min="0" step="0.01" value="${t.umbralHormiga}" />
        </div>

        <button type="submit" class="btn btn-claro btn-grande btn-bloque" style="margin-top: 16px;">
          Guardar cambios
        </button>
      </form>

      ${i?``:`
            <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 16px;">Ciclo de pago</h3>
            <button class="btn btn-fantasma btn-bloque" id="btn-confirmar-nuevo-cobro">
              ¿Te pagaron antes de lo esperado? Confirmar nuevo cobro
            </button>
          `}

      <h3 style="margin-top: 32px; margin-bottom: 12px; font-size: 16px;">Respaldo de tus datos</h3>
      <p class="texto-tenue" style="font-size: 13px; margin-bottom: 12px;">
        Todo vive solo en este dispositivo. Descarga un respaldo de vez en cuando, sobre todo
        antes de cambiar de celular o borrar el navegador.
      </p>
      <div style="display:flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-fantasma btn-bloque" id="btn-descargar-respaldo">Descargar respaldo completo (JSON)</button>
        <button class="btn btn-fantasma btn-bloque" id="btn-restaurar-respaldo">Restaurar desde un respaldo</button>
        <input type="file" id="input-restaurar" accept="application/json" class="oculto" />
        <button class="btn btn-fantasma btn-bloque" id="btn-exportar-csv">Exportar historial a Excel (CSV)</button>
      </div>
    </div>
  `;let s=e.querySelector(`#btn-confirmar-nuevo-cobro`);s&&s.addEventListener(`click`,()=>tt()),e.querySelector(`#btn-descargar-respaldo`).addEventListener(`click`,()=>Jt()),e.querySelector(`#btn-exportar-csv`).addEventListener(`click`,()=>Xt());let c=e.querySelector(`#input-restaurar`);e.querySelector(`#btn-restaurar-respaldo`).addEventListener(`click`,()=>c.click()),c.addEventListener(`change`,async()=>{let e=c.files[0];if(!e)return;let t=await H({titulo:`Vas a reemplazar todos tus datos`,mensaje:`Se borrará todo lo que tienes ahora en la app y se reemplazará por lo que hay en "${e.name}". Esto no se puede deshacer.`,claseAlerta:`alerta-roja`,textoConfirmar:`Sí, restaurar este respaldo`,textoCancelar:`Cancelar`});if(c.value=``,t)try{let t=await e.text();await Kt(JSON.parse(t)),alert(`Respaldo restaurado. La app se va a recargar.`),window.location.hash=``,window.location.reload()}catch(e){alert(`No se pudo restaurar el respaldo: ${e.message}`)}}),e.querySelector(`#form-ajustes`).addEventListener(`submit`,async t=>{t.preventDefault(),await De({ingresoMensual:parseFloat(e.querySelector(`#campo-ingreso`).value)||0,diaCobroEsperado:parseInt(e.querySelector(`#campo-dia-cobro`).value,10)||1,umbralHormiga:parseFloat(e.querySelector(`#campo-umbral-hormiga`).value)||0});let n=e.querySelectorAll(`[data-bolsillo]`);for(let e of n)await Se(e.dataset.bolsillo,parseFloat(e.value)||0);await J()})}var Qt=[{id:`hoy`,href:`#`,icono:`◆`,etiqueta:`Hoy`},{id:`categorias`,href:`#/categorias`,icono:`▤`,etiqueta:`Categorías`},{id:`metas`,href:`#/metas`,icono:`●`,etiqueta:`Metas`},{id:`resumen`,href:`#/resumen`,icono:`▲`,etiqueta:`Resumen`},{id:`ajustes`,href:`#/ajustes`,icono:`⚙`,etiqueta:`Ajustes`}];function $t(e){let t=document.getElementById(`nav-inferior`);t&&(t.innerHTML=Qt.map(t=>`
      <a
        class="nav-inferior__item ${t.id===e?`activo`:``}"
        href="${t.href}"
      >
        <span class="nav-inferior__icono">${t.icono}</span>
        <span>${t.etiqueta}</span>
      </a>
    `).join(``))}var K={"":{render:R,id:`hoy`},"#/categorias":{render:mt,id:`categorias`},"#/metas":{render:Tt,id:`metas`},"#/resumen":{render:Mt,id:`resumen`},"#/historial":{render:W,id:`resumen`},"#/suscripciones":{render:Ht,id:`resumen`},"#/ajustes":{render:Zt,id:`ajustes`}},en;function tn(){return K[window.location.hash]||K[``]}async function q(){let e=tn();$t(e.id),await e.render(en)}async function J(){await q()}function nn(e){en=e,window.addEventListener(`hashchange`,q),q()}var Y=`0`,X=null,Z=!1;function rn(){return`$${Y}`}function an(){return parseFloat(Y.replace(`,`,`.`))||0}function on(){Y=`0`,X=null,Z=!1}async function sn(){on();let e=await Fe(),t=document.createElement(`div`);t.className=`panel-fondo`,t.innerHTML=`
    <div class="panel-hoja">
      <div class="panel-hoja__cabecera">
        <h2>Registrar gasto</h2>
        <button class="btn btn-fantasma" id="btn-cerrar-registro" aria-label="Cerrar">✕</button>
      </div>

      <div class="monto-mostrado" id="monto-mostrado">${rn()}</div>

      <div class="teclado-numerico" id="teclado-numerico">
        ${[`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`,`,`0`,`⌫`].map(e=>`<button type="button" data-tecla="${e}">${e}</button>`).join(``)}
      </div>

      <div class="campo" style="margin-top: 24px;">
        <label>¿De dónde sale?</label>
        <div class="selector-categorias" id="selector-origenes">
          ${[...e.categorias,...e.bolsillos.filter(e=>e.id!==`ahorro`)].map(e=>`
                <button
                  type="button"
                  class="chip-categoria"
                  data-tipo="${e.tipo}"
                  data-id="${e.id}"
                  data-nombre="${e.nombre}"
                >
                  <span class="chip-categoria__nombre">${e.nombre}</span>
                  <span class="chip-categoria__saldo">${C(e.gastado)} / ${C(e.monto)}</span>
                </button>
              `).join(``)}
        </div>
        <button type="button" class="btn btn-fantasma btn-bloque" id="btn-retirar-ahorro" style="margin-top: 8px;">
          Retirar de tu Ahorro (necesita confirmación)
        </button>
      </div>

      <div class="campo">
        <label>Nota (opcional)</label>
        <input type="text" id="input-nota" placeholder="Ej: almuerzo con cliente" maxlength="80" />
      </div>

      <div class="campo">
        <label>Fecha</label>
        <input type="date" id="input-fecha" max="${_()}" value="${_()}" />
      </div>

      <button type="button" class="btn btn-claro btn-grande btn-bloque" id="btn-guardar-gasto" disabled>
        Guardar
      </button>
    </div>
  `,document.body.appendChild(t),fn(t)}function Q(e){e.remove()}var cn={amarillo:`alerta-amarilla`,rojo:`alerta-roja`,pasado:`alerta-roja`},ln={amarillo:`Vas rápido`,rojo:`Cuidado`,pasado:`Te vas a exceder`};async function un(e){let t=await Xe(X.tipo,X.id,e);return!t||t.estado===`verde`||H({titulo:ln[t.estado],mensaje:t.mensaje,claseAlerta:cn[t.estado],textoConfirmar:`Registrar de todas formas`,textoCancelar:`Mejor no`})}function $(e){let t=e.querySelector(`#btn-guardar-gasto`);t.disabled=!(an()>0&&X!==null)}function dn(e,t){e.querySelectorAll(`.chip-categoria`).forEach(e=>e.classList.remove(`activo`)),t.classList.add(`activo`),X={tipo:t.dataset.tipo,id:t.dataset.id,nombre:t.dataset.nombre},Z=!1,$(e)}function fn(e){e.querySelector(`#btn-cerrar-registro`).addEventListener(`click`,()=>Q(e)),e.addEventListener(`click`,t=>{t.target===e&&Q(e)}),e.querySelector(`#teclado-numerico`).addEventListener(`click`,t=>{let n=t.target.closest(`button[data-tecla]`);if(!n)return;let r=n.dataset.tecla;if(r===`⌫`)Y=Y.length>1?Y.slice(0,-1):`0`;else if(r===`,`)Y.includes(`,`)||(Y+=`,`);else{let[,e]=Y.split(`,`);if(e!==void 0&&e.length>=2)return;Y=Y===`0`?r:Y+r}e.querySelector(`#monto-mostrado`).textContent=rn(),$(e)}),e.querySelector(`#selector-origenes`).addEventListener(`click`,t=>{let n=t.target.closest(`.chip-categoria`);n&&dn(e,n)}),e.querySelector(`#btn-retirar-ahorro`).addEventListener(`click`,async()=>{await H({titulo:`Estás por tocar tu Ahorro`,mensaje:`Este dinero es tu fondo de emergencia y tus metas. ¿Seguro que quieres retirar de ahí?`,claseAlerta:`alerta-roja`,textoConfirmar:`Sí, retirar de mi Ahorro`,textoCancelar:`Mejor no`})&&(Z=!0,e.querySelectorAll(`.chip-categoria`).forEach(e=>e.classList.remove(`activo`)),X={tipo:`bolsillo`,id:`ahorro`,nombre:`Ahorro`},$(e))}),e.querySelector(`#btn-guardar-gasto`).addEventListener(`click`,async()=>{let t=e.querySelector(`#btn-guardar-gasto`);t.disabled=!0;let n=an();if(!await un(n)){t.disabled=!1;return}try{await je({monto:n,origenTipo:X.tipo,origenId:X.id,nota:e.querySelector(`#input-nota`).value.trim(),fecha:e.querySelector(`#input-fecha`).value||_(),confirmoRetiroAhorro:Z}),Q(e),await J()}catch(e){alert(`No se pudo guardar el gasto: ${e.message}`),t.disabled=!1}})}function pn(){let e=e=>e.preventDefault();document.addEventListener(`gesturestart`,e),document.addEventListener(`gesturechange`,e),document.addEventListener(`gestureend`,e)}async function mn(){pn(),await ye();let e=document.getElementById(`app`);e.innerHTML=`
    <main id="vista"></main>
    <button id="fab-registro" class="fab-registro" aria-label="Registrar gasto">+</button>
    <nav id="nav-inferior" class="nav-inferior"></nav>
  `,document.getElementById(`fab-registro`).addEventListener(`click`,sn),nn(document.getElementById(`vista`))}mn();