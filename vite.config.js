import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@styles': Path.resolve(__dirname, './src/Styles'),
      '@components': Path.resolve(__dirname, './src/Components'),
      '@pages': Path.resolve(__dirname, './src/Pages')
    }
  },
  build: {
    rollupOptions: {
      external: ['react-player']
    }
  }
});
