import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://smart-expense-tracker-yhyq.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});