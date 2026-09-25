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

## Publicar la app gratis (paso a paso)

### Opción recomendada: Netlify

1. Crea una cuenta gratis en [netlify.com](https://netlify.com) (puedes entrar con tu cuenta de GitHub).
2. Sube este proyecto a GitHub (ver sección de abajo si nunca lo has hecho).
3. En Netlify, toca **"Add new site" → "Import an existing project"** y conecta tu cuenta de GitHub.
4. Elige el repositorio `finanzas-personales`.
5. Netlify va a detectar automáticamente que es un proyecto Vite. Confirma estos valores (normalmente ya vienen así):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Toca **"Deploy site"**. En un par de minutos tendrás un link público (algo como `tu-app-123.netlify.app`).
7. Desde ahí, cada vez que subas un cambio a GitHub, Netlify va a publicar la nueva versión sola.

### Subir el proyecto a GitHub (si no lo has hecho)

1. Crea una cuenta gratis en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo, vacío, llamado `finanzas-personales` (no marques "Add a README").
3. En tu terminal, dentro de esta carpeta:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/finanzas-personales.git
   git branch -M main
   git push -u origin main
   ```
4. Refresca la página de tu repositorio en GitHub: deberías ver todos los archivos.

### Alternativa: GitHub Pages

1. Sube el proyecto a GitHub (pasos de arriba).
2. En tu terminal: `npm install -D gh-pages` y agrega a `package.json`, dentro de `"scripts"`, la línea `"deploy": "npm run build && npx gh-pages -d dist"`.
3. Corre `npm run deploy`.
4. En GitHub, ve a **Settings → Pages** y confirma que la fuente sea la rama `gh-pages`.
5. Tu app va a quedar en `https://TU-USUARIO.github.io/finanzas-personales/`.

## Instalar la app en tu celular

Una vez que tengas el link público (de Netlify o GitHub Pages), ábrelo en el
navegador de tu celular:

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
