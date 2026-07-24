import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api';
import { PageHeader, LoadingScreen } from '../../components/common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const NOTIF_ICONS = {
  attendance_boarded:    '✅',
  attendance_absent:     '❌',
  attendance_dropped_off:'🏠',
  trip_started:          '🚌',
  incident:              '🚨',
  invoice:               '💰',
  default:               '🔔',
};

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);

  const fetch = async (p = 1) => {
    setLoading(true);
    try {
      const r = await parentApi.getNotifications({ page: p, limit: 20 });
      setNotifs(prev => p === 1 ? r.data.data.data : [...prev, ...r.data.data.data]);
      setTotal(r.data.data.total);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(1); }, []);

  const markRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await parentApi.markRead(id);
      setNotifs(ns => ns.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await parentApi.markAllRead();
      setNotifs(ns => ns.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const unread = notifs.filter(n => !n.is_read).length;

  if (loading && notifs.length === 0) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Thông báo" subtitle={unread > 0 ? `${unread} chưa đọc` : 'Tất cả đã đọc'}
        action={unread > 0 && <button onClick={markAllRead} className="btn-secondary text-sm">✓ Đọc tất cả</button>} />

      <div className="space-y-2">
        {notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id, n.is_read)}
            className={`card cursor-pointer transition-all hover:shadow-md border-l-4
              ${n.is_read ? 'border-l-gray-200 opacity-80' : 'border-l-primary-500 bg-primary-50/30'}`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0 mt-0.5">
                {NOTIF_ICONS[n.type] || NOTIF_ICONS.default}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${n.is_read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">{dayjs(n.sent_at).fromNow()}</p>
              </div>
            </div>
          </div>
        ))}

        {notifs.length === 0 && !loading && (
          <div className="card text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🔔</p>
            <p>Chưa có thông báo nào</p>
          </div>
        )}

        {notifs.length < total && (
          <div className="text-center pt-2">
            <button onClick={() => { const next = page + 1; setPage(next); fetch(next); }}
              disabled={loading} className="btn-secondary">
              {loading ? 'Đang tải...' : 'Xem thêm'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
