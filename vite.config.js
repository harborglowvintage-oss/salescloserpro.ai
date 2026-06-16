import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  plugins: [react()],
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
