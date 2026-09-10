import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig(() => ({
  plugins: [react()],
  // Expose the package version to the app (Help footer, Legal page)
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // Absolute paths for Cloudflare Pages / web
  base: '/',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
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
