import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import toast from 'react-hot-toast';

// ============================================================
// PWA INSTALL — modal hướng dẫn thủ công cho iOS Safari
// (Apple không cho web app tự trigger hộp thoại cài đặt như Chrome/Edge)
// ============================================================
function IOSInstallHint({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
        <h3 className="font-semibold text-gray-800 mb-3">📲 Cài đặt ứng dụng trên iPhone/iPad</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Bấm biểu tượng <strong>Chia sẻ</strong> <span className="inline-block">⬆️</span> ở thanh công cụ Safari</li>
          <li>Chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen)</li>
          <li>Bấm <strong>"Thêm"</strong> ở góc trên bên phải</li>
        </ol>
        <button onClick={onClose} className="btn-primary w-full mt-4">Đã hiểu</button>
      </div>
    </div>
  );
}

// Nút "Cài đặt ứng dụng" dùng chung cho Sidebar (PC) và MobileDrawer (mobile).
// Tự ẩn nếu app đã được cài, hoặc trình duyệt không hỗ trợ cài đặt (không phải Chromium/iOS).
export function InstallAppButton({ variant = 'desktop', collapsed = false }) {
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSHint, setShowIOSHint] = useState(false);

  if (isInstalled || (!canInstall && !isIOS)) return null;

  const handleClick = async () => {
    if (canInstall) {
      const choice = await promptInstall();
      if (choice?.outcome === 'accepted') toast.success('Đã cài đặt ứng dụng thành công!');
    } else if (isIOS) {
      setShowIOSHint(true);
    }
  };

  const cls = variant === 'desktop'
    ? 'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm transition-colors'
    : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-700 text-sm transition-colors';

  return (
    <>
      <button onClick={handleClick} className={cls}>
        <span className="text-lg flex-shrink-0">📲</span>
        {!collapsed && <span>Cài đặt ứng dụng</span>}
      </button>
      <IOSInstallHint open={showIOSHint} onClose={() => setShowIOSHint(false)} />
    </>
  );
}

// ============================================================
// MOBILE — DRAWER (menu trượt, hiện khi bấm ☰)
// ============================================================
export function MobileDrawer({ open, onClose, title, links, user, onLogout }) {
  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`}>
      {/* Lớp phủ tối */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Panel trượt từ trái */}
      <div
        className={`absolute inset-y-0 left-0 w-72 max-w-[82%] bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-4 py-4 bg-gray-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SchoolBus System" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            <span className="font-bold">SchoolBus</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">{title}</p>
        </div>

        {user && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`
              }>
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {link.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {link.badge > 9 ? '9+' : link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-100 flex-shrink-0 space-y-1">
          <InstallAppButton variant="mobile" />
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 text-sm transition-colors">
            <span className="text-lg flex-shrink-0">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MOBILE — APP SHELL (top bar + nội dung + bottom tab bar)
// Giao diện riêng dành cho điện thoại: không dùng sidebar dọc
// vì sẽ đè lên nội dung trên màn hình hẹp.
// ============================================================
export function MobileLayout({ title, links, roleColor = 'bg-primary-900', notifBell = null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Chỉ hiện tối đa 3 mục chính dưới thanh tab, phần còn lại vào menu "Thêm"
  const tabLinks = links.slice(0, 3);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden">
      {/* Top bar */}
      <header className={`flex items-center justify-between px-2 h-14 ${roleColor} text-white flex-shrink-0 shadow-sm z-40`}>
        <button onClick={() => setDrawerOpen(true)} className="p-2.5 rounded-lg hover:bg-white/10 active:bg-white/20" aria-label="Mở menu">
          <span className="text-xl leading-none">☰</span>
        </button>
        <span className="text-sm font-bold truncate px-1">{title}</span>
        <div className="w-9 h-9 flex items-center justify-center">{notifBell}</div>
      </header>

      {/* Nội dung trang */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="h-full p-4 pb-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom tab bar */}
      <nav className="flex items-stretch bg-white border-t border-gray-200 flex-shrink-0 z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabLinks.map(link => (
          <NavLink key={link.to} to={link.to} end={link.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition-colors
              ${isActive ? 'text-primary-700 font-medium' : 'text-gray-500'}`
            }>
            <span className="text-xl leading-none">{link.icon}</span>
            <span className="truncate max-w-[70px]">{link.label}</span>
          </NavLink>
        ))}
        <button onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-gray-500 active:bg-gray-50">
          <span className="text-xl leading-none">☰</span>
          <span>Thêm</span>
        </button>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={title} links={links} user={user} onLogout={handleLogout} />
    </div>
  );
}

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
export function Sidebar({ title, links, roleColor = 'bg-primary-800', notifBell = null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`flex h-screen ${collapsed ? 'w-16' : 'w-60'} flex-col ${roleColor} text-white transition-all duration-300 flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SchoolBus System" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              <span className="font-bold text-sm">SchoolBus</span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">{title}</p>
          </div>
        )}
        <div className="flex items-center gap-1">
          {!collapsed && notifBell}
          <button onClick={() => setCollapsed(v => !v)} className="p-1 hover:bg-white/10 rounded text-white/70">
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${isActive ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
            }>
            <span className="text-lg flex-shrink-0">{link.icon}</span>
            {!collapsed && <span className="flex-1">{link.label}</span>}
            {!collapsed && link.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {link.badge > 9 ? '9+' : link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Cài đặt ứng dụng + Logout */}
      <div className="p-2 border-t border-white/10 space-y-1">
        <InstallAppButton variant="desktop" collapsed={collapsed} />
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-white text-sm transition-colors">
          <span className="text-lg flex-shrink-0">🚪</span>
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
