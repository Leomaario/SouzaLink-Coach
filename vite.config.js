import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Path from 'path';
import { fileURLToPath } from 'url';
// Importa o plugin React para Vite
// Importa o Path para resolver caminhos de diretórios
// Importa o fileURLToPath para converter URLs de arquivo em caminhos de sistema de arquivos
// Vite configuration file
// Define a configuração do Vite para o projeto React
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Define a porta do servidor de desenvolvimento
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Proxy para o backend
        changeOrigin: true, // Muda a origem do host para o destino
        secure: false, // Desativa a verificação de certificado SSL
      },
    },
  },
  resolve:{
    alias: {
      '@styles': Path.resolve(__dirname, './src/Styles'),
      '@components': Path.resolve(__dirname, './src/Components'),
      '@pages': Path.resolve(__dirname, './src/Pages')
    }
  }
});
