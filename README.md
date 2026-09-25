# Mis Finanzas

App web de finanzas personales para uso diario. Todo se guarda en tu propio
celular o computador (no hay servidor ni cuentas), pensada para que sepas
exactamente a dónde va cada dólar y sigas un plan de ahorro estricto.

## Correr la app en tu computador

Necesitas tener [Node.js](https://nodejs.org) instalado (versión 18 o más nueva).

```bash
npm install       # solo la primera vez
npm run dev       # abre la app en http://localhost:5173
```

## Correr las pruebas automáticas

La lógica de presupuestos y alertas (la parte más importante) tiene pruebas
automáticas. Para correrlas:

```bash
npm test
```

## Publicada en GitHub Pages

La app ya está publicada en:

**https://alejandrovayancela-netizen.github.io/finanzas-personales/**

El repositorio es público (`github.com/alejandrovayancela-netizen/finanzas-personales`)
porque GitHub Pages gratis lo requiere — pero eso solo expone el **código**.
Tus datos reales (gastos, ingresos, metas) nunca salen de tu dispositivo.

### Cómo publicar una actualización

Cada vez que quieras subir cambios nuevos a la app publicada:

```bash
npm run deploy
```

Esto construye la app y la sube a la rama `gh-pages`, que es la que GitHub Pages
sirve. En 1-2 minutos el link de arriba ya tiene la versión nueva.

Si además quieres guardar el historial de cambios del código (recomendado),
antes de `npm run deploy` haz:

```bash
git add -A
git commit -m "describe aquí qué cambiaste"
git push
```

## Instalar la app en tu celular

Abre el link de arriba en el navegador de tu celular:

**Android (Chrome):**
1. Abre el link.
2. Toca el menú (⋮, arriba a la derecha) → **"Instalar app"** o **"Agregar a pantalla de inicio"**.
3. Listo: te va a aparecer un ícono como cualquier otra app, y funciona sin internet.

**iPhone (Safari):**
1. Abre el link en Safari (tiene que ser Safari, no Chrome).
2. Toca el ícono de compartir (el cuadrito con la flecha hacia arriba).
3. Elige **"Agregar a pantalla de inicio"**.
4. Listo.

## Haz respaldos de tus datos seguido

Como todo se guarda solo en tu dispositivo, ve a **Ajustes → Respaldo de tus
datos** y descarga el respaldo (JSON) de vez en cuando — sobre todo antes de
cambiar de celular, o si vas a borrar datos del navegador. Si algo sale mal,
ese mismo archivo te permite restaurar todo desde la misma pantalla.
