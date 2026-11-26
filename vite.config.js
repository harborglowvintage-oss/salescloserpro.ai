import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // Expose the package version to the app (Help footer, Legal page)
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // Absolute paths for Cloudflare Pages / web
  base: '/',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      // The build-time page renderer (scripts/site/build.mjs) loads packages from node_modules,
      // so vendor chunks only apply to the browser build.
      output: isSsrBuild ? {} : {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-pdf':   ['jspdf', 'jspdf-autotable'],
          'vendor-db':    ['dexie'],
          'vendor-ui':    ['lucide-react'],
        }
      }
    }
  }
}))
