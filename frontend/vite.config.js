import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        // Use BACKEND_URL (env) if provided, fall back to default localhost:3000
        target: process.env.BACKEND_URL || process.env.VITE_API_BASE || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
