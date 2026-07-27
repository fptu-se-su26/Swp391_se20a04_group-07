// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Đăng ký Service Worker cho PWA (chỉ chạy khi build production hoặc qua HTTPS/ngrok)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Service Worker đã đăng ký'))
      .catch((err) => console.error('❌ Lỗi đăng ký Service Worker:', err));
  });
}