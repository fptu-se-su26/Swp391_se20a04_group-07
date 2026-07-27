import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { Modal } from './Modal';
import { PageHeader } from './PageHeader';
import { LoadingScreen } from './Spinner';
import { PriorityBadge } from './StatusBadge';

dayjs.extend(relativeTime);
dayjs.locale('vi');

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
