import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        // Silences the specific warnings Bootstrap triggers
        silenceDeprecations: [
          'import',
          'global-builtin',
          'color-functions',
          'if-function'
        ]
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  }
})
