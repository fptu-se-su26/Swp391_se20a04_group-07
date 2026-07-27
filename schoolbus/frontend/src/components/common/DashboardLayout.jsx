import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { Sidebar, MobileLayout } from './Sidebar';

// ============================================================
// LAYOUT WRAPPER
// PC: giữ nguyên giao diện Sidebar dọc như hiện tại.
// Điện thoại: chuyển sang MobileLayout (top bar + bottom tab + drawer).
// ============================================================
export function DashboardLayout({ title, links, roleColor = 'bg-primary-800', notifBell = null, sidebar }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout title={title} links={links} roleColor={roleColor} notifBell={notifBell} />;
  }

  // Tương thích ngược: nếu trang cũ vẫn truyền sẵn `sidebar` (element),
  // dùng luôn; nếu không, tự dựng Sidebar từ props mới.
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebar || <Sidebar title={title} links={links} roleColor={roleColor} notifBell={notifBell} />}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
