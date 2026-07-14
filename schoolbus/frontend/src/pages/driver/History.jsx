import React, { useEffect, useState, useCallback } from 'react';
import { driverApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge, StatCard } from '../../components/common';

const STATUS_OPTIONS = [
  { value: '',            label: 'Tất cả trạng thái' },
  { value: 'completed',   label: 'Hoàn thành' },
  { value: 'in_progress', label: 'Đang chạy' },
  { value: 'pending',     label: 'Chờ khởi hành' },
  { value: 'cancelled',   label: 'Đã hủy' },
];

function formatScheduledTime(scheduledStart) {
  if (!scheduledStart) return '--:--';
  const d = new Date(scheduledStart);
  if (isNaN(d.getTime())) return '--:--';
  // Cột TIME từ MSSQL luôn serialize kèm ngày giả 1970-01-01 dạng UTC
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

function formatTimeRange(t) {
  const fmt = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
  if (t.actual_start && t.actual_end) return `${fmt(t.actual_start)} - ${fmt(t.actual_end)}`;
  if (t.scheduled_start) return formatScheduledTime(t.scheduled_start);
  return '--:--';
}

export default function DriverHistory() {
  const [data, setData]       = useState({ total: 0, data: [] });
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]     = useState('');

  const fetchData = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const r = await driverApi.getTripHistory({
        page: p, limit: 15, search: search || undefined, status: status || undefined,
        fromDate: fromDate || undefined, toDate: toDate || undefined,
      });
      setData(r.data.data);
    } catch {} finally { setLoading(false); }
  }, [search, status, fromDate, toDate]);

  const fetchStats = useCallback(async () => {
    try { const r = await driverApi.getTripHistoryStats(); setStats(r.data.data); } catch {}
  }, []);

  useEffect(() => { fetchData(page); }, [page, fetchData]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData(1);
  };

  const completedPct = stats?.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0.0';
  const progressPct  = stats?.total > 0 ? ((stats.in_progress / stats.total) * 100).toFixed(1) : '0.0';
  const cancelledPct = stats?.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <PageHeader
        title="Lịch sử chuyến"
        subtitle="Danh sách các chuyến đi đã hoàn thành"
        action={<button className="btn-secondary">⬇️ Xuất báo cáo</button>}
      />

      {/* ── Bộ lọc ── */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 mb-5">
        <input
          className="input flex-1 min-w-[220px]"
          placeholder="🔍 Tìm kiếm tuyến đường, địa điểm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input w-auto" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" className="input w-auto" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" className="input w-auto" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button type="submit" className="btn-primary">Lọc</button>
      </form>

      {/* ── 4 thẻ thống kê ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Tổng số chuyến" value={stats.total} icon="📅" color="blue" sub="Trong khoảng thời gian" />
          <StatCard label="Đã hoàn thành" value={stats.completed} icon="✅" color="green" sub={`${completedPct}%`} />
          <StatCard label="Đang xử lý" value={stats.in_progress} icon="⏱️" color="yellow" sub={`${progressPct}%`} />
          <StatCard label="Đã hủy" value={stats.cancelled} icon="❌" color="red" sub={`${cancelledPct}%`} />
        </div>
      )}

      {loading ? <LoadingScreen /> : (
        <>
          <div className="space-y-3">
            {data.data.map(t => (
              <div key={t.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-[220px] flex-1">
                  <h3 className="font-semibold text-gray-800">{t.Route?.route_name}</h3>
                  {(t.start_point || t.end_point) && (
                    <div className="text-xs text-gray-500 mt-0.5 space-y-0.5">
                      {t.start_point && <p>Điểm đầu: {t.start_point}</p>}
                      {t.end_point && <p>Điểm cuối: {t.end_point}</p>}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.trip_type === 'morning_pickup' ? '🌅 Sáng' : '🌇 Chiều'}
                  </p>
                </div>

                <div className="text-sm text-gray-600 min-w-[120px]">
                  <p className="font-medium">{formatTimeRange(t)}</p>
                  <p className="text-xs text-gray-400">{new Date(t.scheduled_date).toLocaleDateString('vi-VN')}</p>
                </div>

                <div className="text-sm text-gray-600 min-w-[90px]">
                  <p className="font-medium">{t.boarded_count} / {t.total_students}</p>
                  <p className="text-xs text-gray-400">Học sinh</p>
                </div>

                <div className="text-sm text-gray-600 min-w-[110px]">
                  <p className="font-medium">{t.distance_km != null ? `${t.distance_km} km` : '—'}</p>
                  <p className="text-xs text-gray-400">{t.duration_min != null ? `${t.duration_min} phút` : '—'}</p>
                </div>

                <div className="min-w-[120px]">
                  <StatusBadge status={t.status} />
                  {t.status === 'completed' && t.on_time != null && (
                    <p className="text-xs text-gray-400 mt-1">{t.on_time ? 'Đúng giờ' : 'Trễ giờ'}</p>
                  )}
                  {t.status === 'cancelled' && t.cancellation_reason && (
                    <p className="text-xs text-gray-400 mt-1">{t.cancellation_reason}</p>
                  )}
                </div>
              </div>
            ))}
            {data.data.length === 0 && (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📂</p>
                <p>Không tìm thấy chuyến nào</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary">← Trước</button>
            <span className="flex items-center text-sm text-gray-600 px-3">Trang {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={data.data.length < 15} className="btn-secondary">Sau →</button>
          </div>
        </>
      )}
    </div>
  );
}
