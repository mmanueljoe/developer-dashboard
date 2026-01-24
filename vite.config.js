import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
    },
  },
  build: {
    target: 'esnext',
    base: '/',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: 'true',
  },
});
