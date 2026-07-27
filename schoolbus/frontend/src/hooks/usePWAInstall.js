import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, triggerInstall } from '../lib/pwaInstall';

// ============================================================
// usePWAInstall — đọc trạng thái từ store toàn cục (src/lib/pwaInstall.js)
// thay vì tự gắn listener `beforeinstallprompt` ngay trong hook.
//
// Vì sao: hook này chỉ chạy khi component dùng nó MOUNT (vd: nút trong
// Sidebar chỉ mount sau khi đăng nhập). Nếu Chrome bắn sự kiện trước đó,
// hook sẽ bỏ lỡ vĩnh viễn. Store toàn cục được import sớm nhất có thể
// trong main.jsx nên không bao giờ bỏ lỡ sự kiện.
// ============================================================
export function usePWAInstall() {
  const { canInstall, isInstalled } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  return { canInstall, isInstalled, isIOS, promptInstall: triggerInstall };
}
