// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
      // ✅ FIX: thiếu proxy này khiến io('/') cố kết nối WebSocket
      // thẳng tới Vite dev server (port 5173) thay vì backend (port 3000)
      // -> "Socket error: timeout" liên tục.
      '/socket.io': { target: 'http://localhost:3000', ws: true, changeOrigin: true }
    }
  }
});
