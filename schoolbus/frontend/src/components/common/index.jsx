import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context';

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
export function Sidebar({ title, links, roleColor = 'bg-primary-800' }) {
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
              <span className="text-2xl">🚌</span>
              <span className="font-bold text-sm">SchoolBus</span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">{title}</p>
          </div>
        )}
        <button onClick={() => setCollapsed(v => !v)} className="p-1 hover:bg-white/10 rounded text-white/70">
          {collapsed ? '→' : '←'}
        </button>
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
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/10">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-white text-sm transition-colors">
          <span className="text-lg flex-shrink-0">🚪</span>
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// LAYOUT WRAPPER
// ============================================================
export function DashboardLayout({ sidebar }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebar}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
export function StatCard({ label, value, icon, color = 'blue', sub }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    red:    'bg-red-50 text-red-700 border-red-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <div className={`card border ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
          <p className="text-3xl font-bold mt-1">{value ?? '—'}</p>
          {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// BADGE STATUS
// ============================================================
export function StatusBadge({ status }) {
  const map = {
    active: ['badge-green', 'Hoạt động'],
    inactive: ['badge-gray', 'Không hoạt động'],
    maintenance: ['badge-yellow', 'Bảo trì'],
    pending: ['badge-yellow', 'Chờ xử lý'],
    in_progress: ['badge-blue', 'Đang chạy'],
    completed: ['badge-green', 'Hoàn thành'],
    cancelled: ['badge-red', 'Đã hủy'],
    paid: ['badge-green', 'Đã thanh toán'],
    overdue: ['badge-red', 'Quá hạn'],
    open: ['badge-red', 'Chưa giải quyết'],
    resolved: ['badge-green', 'Đã giải quyết'],
    boarded: ['badge-green', 'Đã lên xe'],
    absent: ['badge-red', 'Vắng mặt'],
    waiting: ['badge-yellow', 'Chờ đón'],
    dropped_off: ['badge-blue', 'Đã xuống xe'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return <span className={cls}>{label}</span>;
}

// ============================================================
// LOADING SPINNER
// ============================================================
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${s[size]} border-3 border-primary-600 border-t-transparent rounded-full animate-spin`} />
  );
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <Spinner size="lg" />
        <p className="text-sm">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE HEADER
// ============================================================
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
export function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-5">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary">Hủy</button>
        <button onClick={() => { onConfirm(); onClose(); }} className={danger ? 'btn-danger' : 'btn-primary'}>Xác nhận</button>
      </div>
    </Modal>
  );
}
