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
  resolve:{
    alias: {
      '@styles': Path.resolve(__dirname, './src/Styles'),
      '@components': Path.resolve(__dirname, './src/Components'),
      '@pages': Path.resolve(__dirname, './src/Pages')
    }
  }
});
