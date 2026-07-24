import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth, useSocket } from '../../context';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
dayjs.extend(relativeTime);
dayjs.locale('vi');

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
              <span className="text-2xl">🚌</span>
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
    approved: ['badge-green', 'Đã duyệt'],
    rejected: ['badge-red', 'Từ chối'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return <span className={cls}>{label}</span>;
}

// ============================================================
// PRIORITY BADGE — 🔵 Normal / 🟡 Important / 🔴 Urgent
// ============================================================
export function PriorityBadge({ priority }) {
  const map = {
    normal:    { cls: 'bg-blue-50 text-blue-700 border-blue-200',   dot: 'bg-blue-500',   label: 'Bình thường' },
    important: { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', label: 'Quan trọng' },
    urgent:    { cls: 'bg-red-50 text-red-700 border-red-200',      dot: 'bg-red-500',    label: 'Khẩn cấp' },
  };
  const p = map[priority] || map.normal;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${p.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
      {p.label}
    </span>
  );
}

const TARGET_ROLE_LABEL = { driver: '🚐 Tài xế', student: '🎒 Học sinh', parent: '👨‍👩‍👧 Phụ huynh', all: '📢 Tất cả' };
export function TargetRoleBadge({ targetRole }) {
  return <span className="badge-gray">{TARGET_ROLE_LABEL[targetRole] || targetRole}</span>;
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
// NOTIFICATION BELL — chuông thông báo real-time (Admin/Manager)
// ============================================================
export function NotificationBell({ role, absentRequestsPath }) {
  const socket = useSocket();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const wrapRef = useRef(null);

  const timeAgo = (iso) => {
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return 'Vừa xong';
    if (min < 60) return `${min} phút trước`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} giờ trước`;
    return `${Math.floor(hr / 24)} ngày trước`;
  };

  useEffect(() => {
    adminApi.getMyNotifications({ limit: 10 })
      .then(r => { setItems(r.data.data.data || []); setUnread(r.data.data.unread || 0); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = (payload) => {
      setItems(prev => [{ id: `tmp-${Date.now()}`, ...payload, sent_at: payload.sentAt, is_read: false }, ...prev].slice(0, 10));
      setUnread(u => u + 1);
      toast(`🔔 ${payload.title}`, { duration: 4500 });
    };
    socket.on('notification:new', onNew);
    return () => socket.off('notification:new', onNew);
  }, [socket]);

  useEffect(() => {
    const onClickOutside = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await adminApi.markAllNotificationsRead();
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {}
  };

  const handleClickItem = async (n) => {
    if (!n.is_read && !String(n.id).startsWith('tmp-')) {
      try { await adminApi.markNotificationRead(n.id); } catch {}
    }
    setItems(prev => prev.map(x => x === n ? { ...x, is_read: true } : x));
    setUnread(u => Math.max(0, u - (n.is_read ? 0 : 1)));
    setOpen(false);
    if (n.type === 'absent_request' && absentRequestsPath) navigate(absentRequestsPath);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button onClick={() => setOpen(v => !v)} className="relative p-2 hover:bg-white/10 rounded-lg text-white/80">
        <span className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-sm">Thông báo</p>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:underline">Đánh dấu đã đọc hết</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Không có thông báo</p>
            ) : items.map((n, i) => (
              <button key={n.id || i} onClick={() => handleClickItem(n)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-start gap-2">
                  {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[11px] text-gray-350 mt-1">{timeAgo(n.sent_at)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
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

// ============================================================
// NOTIFICATIONS INBOX — dùng chung cho Student / Driver / Parent
// api phải có: getNotifications({page,limit,search}), markRead(id), markAllRead()
// ============================================================
const NOTIF_ICONS = {
  broadcast:              '📢',
  attendance_boarded:     '✅',
  attendance_absent:      '❌',
  attendance_dropped_off: '🏠',
  trip_started:           '🚌',
  incident:               '🚨',
  invoice:                '💰',
  absent_request:         '📋',
  default:                '🔔',
};

export function NotificationsInbox({ api, title = 'Thông báo' }) {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [detail, setDetail]   = useState(null);

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const r = await api.getNotifications({ page: p, limit: 15, search: search || undefined });
      const payload = r.data.data;
      setNotifs(p === 1 ? payload.data : prev => [...prev, ...payload.data]);
      if (p === 1) setNotifs(payload.data);
      setTotal(payload.total);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); setPage(1); }, [search]);

  const markRead = async (n) => {
    if (!n.is_read) {
      try {
        await api.markRead(n.id);
        setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      } catch {}
    }
    setDetail({ ...n, is_read: true });
  };

  const markAllRead = async () => {
    try {
      await api.markAllRead();
      setNotifs(ns => ns.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const unread = notifs.filter(n => !n.is_read).length;
  const senders = [...new Set(notifs.map(n => n.sender_name).filter(Boolean))];
  const filtered = senderFilter ? notifs.filter(n => n.sender_name === senderFilter) : notifs;

  if (loading && notifs.length === 0) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title={title} subtitle={unread > 0 ? `${unread} chưa đọc` : 'Tất cả đã đọc'}
        action={unread > 0 && <button onClick={markAllRead} className="btn-secondary text-sm">✓ Đọc tất cả</button>} />

      <div className="flex flex-wrap gap-3 mb-4">
        <input className="input flex-1 min-w-[200px]" placeholder="🔍 Tìm kiếm thông báo..."
          value={search} onChange={e => setSearch(e.target.value)} />
        {senders.length > 1 && (
          <select className="input w-auto" value={senderFilter} onChange={e => setSenderFilter(e.target.value)}>
            <option value="">Tất cả người gửi</option>
            {senders.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      <div className="space-y-2">
        {filtered.map(n => (
          <div key={n.id} onClick={() => markRead(n)}
            className={`card cursor-pointer transition-all hover:shadow-md border-l-4
              ${n.pinned ? 'border-l-amber-400 bg-amber-50/40' : n.is_read ? 'border-l-gray-200 opacity-80' : 'border-l-primary-500 bg-primary-50/30'}`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0 mt-0.5">{NOTIF_ICONS[n.type] || NOTIF_ICONS.default}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {n.pinned && <span title="Đã ghim">📌</span>}
                    <p className={`text-sm font-medium truncate ${n.is_read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.body}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {n.priority && n.priority !== 'normal' && <PriorityBadge priority={n.priority} />}
                  {n.sender_name && <span className="text-xs text-gray-400">Từ {n.sender_name}</span>}
                  <span className="text-xs text-gray-400">· {dayjs(n.sent_at).fromNow()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="card text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🔔</p>
            <p>Chưa có thông báo nào</p>
          </div>
        )}

        {notifs.length < total && (
          <div className="text-center pt-2">
            <button onClick={() => { const next = page + 1; setPage(next); fetchData(next); }}
              disabled={loading} className="btn-secondary">
              {loading ? 'Đang tải...' : 'Xem thêm'}
            </button>
          </div>
        )}
      </div>

      {/* Modal xem chi tiết */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title} size="sm">
        {detail && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {detail.priority && <PriorityBadge priority={detail.priority} />}
              {detail.pinned && <span className="badge-yellow">📌 Đã ghim</span>}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{detail.body}</p>
            <div className="text-xs text-gray-400 pt-2 border-t">
              {detail.sender_name && <p>Người gửi: {detail.sender_name}</p>}
              <p>Gửi lúc: {dayjs(detail.sent_at).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// SEND NOTIFICATION CENTER — dùng chung cho Admin / Manager
// api phải có: sendNotification, getNotificationHistory, recallNotification,
//              editNotification, togglePinNotification
// ============================================================
export function SendNotificationCenter({ api }) {
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null); // batch đang sửa (null = tạo mới)
  const [form, setForm]       = useState({ title: '', body: '', targetRole: 'student', priority: 'normal' });
  const [saving, setSaving]   = useState(false);

  const [history, setHistory] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [confirmRecall, setConfirmRecall] = useState(null);

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    try {
      const r = await api.getNotificationHistory({ page: p, limit: 10, search: search || undefined, targetRole: targetFilter || undefined });
      setHistory(r.data.data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchHistory(page); }, [page]);
  useEffect(() => { setPage(1); fetchHistory(1); }, [search, targetFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', body: '', targetRole: 'student', priority: 'normal' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, body: item.body, targetRole: item.target_role, priority: item.priority });
    setModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.body.trim()) return toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung');
    setSaving(true);
    try {
      if (editing) {
        await api.editNotification(editing.batch_id, { title: form.title, body: form.body, priority: form.priority });
        toast.success('Đã cập nhật thông báo');
      } else {
        const r = await api.sendNotification(form);
        toast.success(`Đã gửi tới ${r.data.data.sent} người nhận`);
      }
      setModal(false);
      fetchHistory(1);
      setPage(1);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  const handleRecall = async (item) => {
    try {
      await api.recallNotification(item.batch_id);
      toast.success('Đã thu hồi thông báo');
      fetchHistory(page);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Không thể thu hồi');
    }
  };

  const handleTogglePin = async (item) => {
    try {
      await api.togglePinNotification(item.batch_id);
      fetchHistory(page);
    } catch {}
  };

  const TARGET_OPTIONS = [
    { value: 'driver',  label: '🚐 Tài xế' },
    { value: 'student', label: '🎒 Học sinh' },
    { value: 'parent',  label: '👨‍👩‍👧 Phụ huynh' },
    { value: 'all',     label: '📢 Tất cả đối tượng' },
  ];
  const PRIORITY_OPTIONS = [
    { value: 'normal',    label: '🔵 Bình thường' },
    { value: 'important', label: '🟡 Quan trọng' },
    { value: 'urgent',    label: '🔴 Khẩn cấp' },
  ];

  return (
    <div>
      <PageHeader title="Gửi thông báo" subtitle={`${history.total} thông báo đã gửi`}
        action={<button onClick={openCreate} className="btn-primary">+ Gửi thông báo mới</button>} />

      {/* Bộ lọc lịch sử */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input className="input flex-1 min-w-[200px]" placeholder="🔍 Tìm kiếm tiêu đề, nội dung..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-auto" value={targetFilter} onChange={e => setTargetFilter(e.target.value)}>
          <option value="">Tất cả đối tượng</option>
          {TARGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? <LoadingScreen /> : (
        <>
          <div className="space-y-3">
            {history.data.map(item => {
              const canManage = item.read_count === 0 && !item.recalled_at;
              return (
                <div key={item.batch_id} className={`card ${item.pinned ? 'border-amber-300 bg-amber-50/30' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {item.pinned ? <span title="Đã ghim">📌</span> : null}
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <PriorityBadge priority={item.priority} />
                        <TargetRoleBadge targetRole={item.target_role} />
                        {item.recalled_at && <span className="badge-red">Đã thu hồi</span>}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.body}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Gửi bởi {item.sender_name} · {dayjs(item.sent_at).format('DD/MM/YYYY HH:mm')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-700">{item.read_count}/{item.total_recipients}</p>
                      <p className="text-xs text-gray-400">đã đọc</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <button onClick={() => handleTogglePin(item)} className="btn-secondary text-xs">
                      {item.pinned ? '📌 Bỏ ghim' : '📌 Ghim'}
                    </button>
                    {canManage && (
                      <>
                        <button onClick={() => openEdit(item)} className="btn-secondary text-xs">✏️ Sửa</button>
                        <button onClick={() => setConfirmRecall(item)}
                          className="text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1 text-xs font-medium transition">
                          ↩️ Thu hồi
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {history.data.length === 0 && (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📨</p>
                <p>Chưa gửi thông báo nào</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary">← Trước</button>
            <span className="flex items-center text-sm text-gray-600 px-3">Trang {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={history.data.length < 10} className="btn-secondary">Sau →</button>
          </div>
        </>
      )}

      {/* Modal Gửi / Sửa */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? '✏️ Chỉnh sửa thông báo' : '+ Gửi thông báo mới'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
            <input className="input" placeholder="VD: Thông báo nghỉ lễ"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
            <textarea className="input" rows={4} placeholder="Nội dung chi tiết..."
              value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
          </div>

          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đối tượng nhận</label>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_OPTIONS.map(o => (
                  <button key={o.value} type="button" onClick={() => setForm(f => ({ ...f, targetRole: o.value }))}
                    className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                      ${form.targetRole === o.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Chỉ chọn được 1 nhóm cho mỗi lần gửi (hoặc "Tất cả đối tượng").</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map(o => (
                <button key={o.value} type="button" onClick={() => setForm(f => ({ ...f, priority: o.value }))}
                  className={`p-2 rounded-xl border-2 text-xs font-medium transition-all
                    ${form.priority === o.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Đang xử lý...' : editing ? 'Lưu thay đổi' : '📤 Gửi thông báo'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmRecall} onClose={() => setConfirmRecall(null)}
        onConfirm={() => handleRecall(confirmRecall)}
        title="Thu hồi thông báo"
        message={`Bạn có chắc muốn thu hồi thông báo "${confirmRecall?.title}"? Người nhận sẽ không còn thấy thông báo này nữa.`}
        danger
      />
    </div>
  );
}
