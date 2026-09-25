// Configuración de Vite. Lo más importante acá es el plugin de PWA:
// genera automáticamente el manifest y el "service worker" que hacen que
// la app se pueda instalar en el celular y funcione sin internet.
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Rutas relativas: así el sitio funciona igual publicado en la raíz
  // (Netlify) o en una subcarpeta (GitHub Pages).
  base: './',

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icono-192.png', 'icono-512.png'],
      manifest: {
        name: 'Mis Finanzas',
        short_name: 'Finanzas',
        description: 'Control diario de tus gastos e ingresos, en dólares.',
        theme_color: '#101010',
        background_color: '#101010',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Guarda en caché todo lo necesario para que la app abra sin internet.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
});
