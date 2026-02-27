import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  plugins: [react()],
  // Relative paths for Electron (file://), absolute for Cloudflare Pages / web
  base: process.env.VITE_ELECTRON === 'true' ? './' : '/',
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
