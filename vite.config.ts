import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Origen (esquema + dominio + puerto) de la API. Si VITE_API_URL es relativa, la API es el mismo sitio.
function apiOrigin(apiUrl: string | undefined) {
  try {
    return new URL(apiUrl || 'http://localhost:3001/api').origin
  } catch {
    return null
  }
}

// Content-Security-Policy solo en el build (en dev rompería la recarga en caliente de Vite).
// Se inyecta como <meta> para que funcione igual en Apache (cPanel) que en nginx (Docker).
// Si se agrega un servicio externo nuevo (otro CDN de imágenes, un mapa embebido, analítica),
// hay que sumarlo aquí o el navegador lo bloqueará.
function contentSecurityPolicy(mode: string): Plugin {
  const api = apiOrigin(loadEnv(mode, process.cwd(), 'VITE_').VITE_API_URL)
  const apiSource = api ? ` ${api}` : ''

  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    // 'unsafe-inline' en estilos: librerías como recharts y sonner inyectan <style> en tiempo de ejecución.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    // Las fotos subidas se sirven desde la API; las de ejemplo vienen de Unsplash.
    `img-src 'self' data: blob: https://images.unsplash.com${apiSource}`,
    `connect-src 'self'${apiSource}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(api?.startsWith('https:') ? ['upgrade-insecure-requests'] : [])
  ].join('; ')

  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler: html => html.replace(
        /<meta charset="UTF-8" \/>/,
        match => `${match}\n      <meta http-equiv="Content-Security-Policy" content="${policy}" />`
      )
    }
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    contentSecurityPolicy(mode),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
}))
