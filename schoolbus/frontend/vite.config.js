// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // lắng nghe trên 0.0.0.0, không chỉ localhost — bắt buộc để ngrok forward được
    // Cho phép mọi domain *.ngrok-free.dev / *.ngrok-free.app / *.ngrok.io truy cập,
    // vì domain ngrok free đổi ngẫu nhiên mỗi lần khởi động lại.
    allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:3000', ws: true, changeOrigin: true }
    }
  }
});