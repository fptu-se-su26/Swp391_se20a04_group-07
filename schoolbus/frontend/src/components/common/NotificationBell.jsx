import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

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
