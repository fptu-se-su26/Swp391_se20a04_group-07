// public/sw.js
const CACHE_NAME = 'schoolbus-v2'; // ← đổi version để buộc trình duyệt cập nhật SW mới
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Cài đặt SW — cache các file tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Kích hoạt — xóa cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — Network first, fallback cache, LUÔN đảm bảo trả về 1 Response hợp lệ
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Chỉ xử lý GET — bỏ qua POST/PUT/DELETE (đăng nhập, submit form, gọi API ghi dữ liệu...)
  // vì các request này không nên bị cache/service worker can thiệp
  if (request.method !== 'GET') return;

  // Bỏ qua API requests — luôn lấy trực tiếp từ network, không cache
  if (request.url.includes('/api/')) return;

  // Bỏ qua request sang domain khác (CDN, Google...) — chỉ xử lý tài nguyên cùng gốc
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        // Cache lại response mới (chỉ cache response hợp lệ)
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(async () => {
        // Network lỗi (mất mạng) → thử lấy từ cache
        const cached = await caches.match(request);
        if (cached) return cached;

        // Điều hướng SPA (vd: F5 thẳng vào /parent, /driver...) khi offline
        // → fallback về index.html để React Router tự xử lý route
        if (request.mode === 'navigate') {
          const fallback = await caches.match('/index.html');
          if (fallback) return fallback;
        }

        // ⚠️ QUAN TRỌNG: không bao giờ để lọt "undefined" xuống respondWith —
        // luôn trả về 1 Response hợp lệ, kể cả khi không có gì để phục vụ
        return new Response('Không có kết nối mạng', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })
  );
});
