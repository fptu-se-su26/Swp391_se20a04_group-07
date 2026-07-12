// ============================================================
// ABSENT REQUESTS PAGE — dùng chung cho Admin & Manager
// (src/pages/common/AbsentRequestsPage.jsx)
// Tab riêng, không hiển thị chung với các thông báo khác.
// ============================================================
import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import dayjs from 'dayjs';

const STATUS_OPTIONS = [
  { value: '',         label: 'Tất cả trạng thái' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
];

export default function AbsentRequestsPage() {
  const [data, setData]       = useState({ data: [], total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [date, setDate]       = useState('');
  const [page, setPage]       = useState(1);

  const fetchData = () => {
    setLoading(true);
    adminApi.getAbsentRequests({ search: search || undefined, status: status || undefined, date: date || undefined, page, limit: 20 })
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleReset = () => {
    setSearch(''); setStatus(''); setDate(''); setPage(1);
    setTimeout(fetchData, 0);
  };

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / (data.limit || 20)));

  return (
    <div>
      <PageHeader
        title="📋 Đơn xin vắng học"
        subtitle={data.total ? `${data.total} đơn` : 'Danh sách đơn xin vắng học từ phụ huynh'}
      />

      {/* Bộ lọc */}
      <form onSubmit={handleFilter} className="card mb-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Tìm kiếm</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tên học sinh, mã HS, tên phụ huynh..."
            className="input"
          />
        </div>
        <div className="w-44">
          <label className="block text-xs font-medium text-gray-500 mb-1">Ngày nghỉ</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" />
        </div>
        <div className="w-48">
          <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="input">
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary">Lọc</button>
        <button type="button" onClick={handleReset} className="btn-secondary">Xóa lọc</button>
      </form>

      {loading ? (
        <LoadingScreen />
      ) : data.data.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p>Không có đơn xin vắng học nào phù hợp</p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Tên học sinh</th>
                <th className="table-header">Lớp</th>
                <th className="table-header">Mã HS</th>
                <th className="table-header">Phụ huynh</th>
                <th className="table-header">Lý do</th>
                <th className="table-header">Ngày nghỉ</th>
                <th className="table-header">Thời gian gửi</th>
                <th className="table-header">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map(r => (
                <tr key={r.id}>
                  <td className="table-cell font-medium">{r.student?.full_name || '—'}</td>
                  <td className="table-cell">{r.student?.classInfo?.class_name || '—'}</td>
                  <td className="table-cell">{r.student?.student_id || '—'}</td>
                  <td className="table-cell">
                    <p>{r.student?.parent_name || '—'}</p>
                    <p className="text-xs text-gray-400">{r.student?.parent_gmail || ''}</p>
                  </td>
                  <td className="table-cell max-w-[220px]">
                    <p className="truncate" title={r.reason}>{r.reason || '—'}</p>
                  </td>
                  <td className="table-cell whitespace-nowrap">{dayjs(r.absent_date).format('DD/MM/YYYY')}</td>
                  <td className="table-cell whitespace-nowrap">{dayjs(r.created_at).format('DD/MM/YYYY HH:mm')}</td>
                  <td className="table-cell"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">◀ Trước</button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">Sau ▶</button>
        </div>
      )}
    </div>
  );
}
