// src/lib/pwaInstall.js
// ============================================================
// Store toàn cục cho PWA install — QUAN TRỌNG: module này phải được
// import ở dòng ĐẦU TIÊN của main.jsx, TRƯỚC khi React render, để
// đảm bảo lắng nghe sự kiện `beforeinstallprompt` sớm nhất có thể.
//
// Lý do cần tách riêng (không gắn listener trong component/hook):
// `beforeinstallprompt` chỉ bắn ra ĐÚNG 1 LẦN trong vòng đời trang,
// thường ngay sau khi trang tải xong. Nếu component chứa nút "Cài đặt"
// (nằm sâu trong Sidebar, chỉ mount SAU khi đăng nhập + load xong)
// gắn listener trễ hơn thời điểm sự kiện bắn ra, nó sẽ bỏ lỡ vĩnh viễn
// sự kiện đó dù mọi thứ khác đều đúng.
// ============================================================

let deferredPrompt = null;
let isInstalled =
  (typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true)) ||
  false;

// ⚠️ QUAN TRỌNG: useSyncExternalStore yêu cầu getSnapshot() trả về CÙNG 1
// tham chiếu object nếu giá trị chưa đổi — nếu không React sẽ nghĩ state
// luôn thay đổi mỗi lần render → vòng lặp vô hạn → "Maximum update depth exceeded".
// Nên phải cache lại snapshot, chỉ tạo object mới khi giá trị thực sự đổi.
let cachedSnapshot = { canInstall: false, isInstalled };

const listeners = new Set();
const notify = () => {
  cachedSnapshot = { canInstall: !!deferredPrompt, isInstalled };
  listeners.forEach((fn) => fn());
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    isInstalled = true;
    deferredPrompt = null;
    notify();
  });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return cachedSnapshot;
}

export async function triggerInstall() {
  if (!deferredPrompt) return null;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice; // { outcome: 'accepted' | 'dismissed' }
  deferredPrompt = null;
  notify();
  return choice;
}
