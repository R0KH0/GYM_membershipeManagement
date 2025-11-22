import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    // Proxy API requests to your backend (optional)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000', // Your backend URL
    //     changeOrigin: true,
    //     secure: false,
    //   }
    // }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});