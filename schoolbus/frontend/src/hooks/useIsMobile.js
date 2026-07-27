import { useState, useEffect } from 'react';

// Breakpoint: dưới 768px (md của Tailwind) coi là điện thoại.
// Dùng matchMedia thay vì chỉ đọc window.innerWidth 1 lần để
// UI chuyển đổi ngay khi xoay ngang/dọc hoặc resize cửa sổ.
const QUERY = '(max-width: 767px)';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    // Safari cũ dùng addListener, trình duyệt mới dùng addEventListener
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    setIsMobile(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
