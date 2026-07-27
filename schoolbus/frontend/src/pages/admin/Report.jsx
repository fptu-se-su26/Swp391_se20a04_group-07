// src/pages/admin/Report.jsx
import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { PageHeader, LoadingScreen } from '../../components/common';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiDollarSign, FiFileText, FiUserCheck, FiUserX } from 'react-icons/fi';

const formatVND = (n) => (Number(n) || 0).toLocaleString('vi-VN') + ' đ';

const formatMonth = (m) => {
  if (!m) return '';
  const [y, mo] = m.split('-');
  return `Th.${mo}/${y}`;
};

/* ============================================================
   TAB 1: BÁO CÁO ĐIỂM DANH (giữ nguyên logic cũ, không đổi)
   ============================================================ */
function AttendanceReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; });
  const [end, setEnd] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchReport = async () => {
    setLoading(true);
    try { const r = await adminApi.getReport({ startDate: start, endDate: end }); setData(r.data.data); }
    catch { /* noop */ } finally { setLoading(false); }
  };
  useEffect(() => { fetchReport(); }, []);

  return (
    <div>
      <div className="card mb-5 flex gap-3 items-end">
        <div><label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
          <input type="date" className="input" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
          <input type="date" className="input" value={end} onChange={e => setEnd(e.target.value)} /></div>
        <button onClick={fetchReport} className="btn-primary">Xem báo cáo</button>
      </div>
      {loading ? <LoadingScreen /> : (
        <div className="card">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="scheduled_date" tickFormatter={d => new Date(d).toLocaleDateString('vi-VN')} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={d => new Date(d).toLocaleDateString('vi-VN')} />
              <Bar dataKey="boarded" name="Đã lên xe" fill="#22c55e" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="absent" name="Vắng" fill="#ef4444" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50">
                {['Ngày', 'Loại', 'Tổng', 'Đã lên', 'Vắng', 'Chờ'].map(h => <th key={h} className="table-header">{h}</th>)}
              </tr></thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="table-cell">{new Date(row.scheduled_date).toLocaleDateString('vi-VN')}</td>
                    <td className="table-cell">{row.trip_type}</td>
                    <td className="table-cell font-medium">{row.total}</td>
                    <td className="table-cell text-green-600">{row.boarded}</td>
                    <td className="table-cell text-red-600">{row.absent}</td>
                    <td className="table-cell text-yellow-600">{row.waiting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Thẻ KPI dùng chung
   ============================================================ */
function StatCard({ icon, label, value, colorClass }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-xl ${colorClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500 truncate">{label}</div>
        <div className="text-xl font-semibold text-gray-800 truncate">{value}</div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB 2: BÁO CÁO LỢI NHUẬN (mới)
   - Chỉ tính hóa đơn status = 'paid'
   - Thống kê theo kỳ thanh toán hàng tháng (due_date)
   - Lọc theo khoảng thời gian + tuyến xe
   ============================================================ */
function RevenueReport() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mặc định KHÔNG chọn ngày -> hiển thị toàn bộ dữ liệu ngay từ đầu
  // (đồng bộ với cách trang "Quản lý hóa đơn" của Manager mặc định "Mọi tháng/Mọi năm").
  // Chỉ áp dụng lọc khi Admin tự chọn ngày.
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [routeId, setRouteId] = useState('');

  useEffect(() => {
    // Giả định adminApi.getRoutes() đã tồn tại (dùng chung với trang "Tuyến đường").
    // Nếu tên hàm khác trong file api của bạn, đổi lại dòng dưới cho khớp.
    adminApi.getRoutes()
      .then(r => setRoutes(r.data.data || []))
      .catch(() => setRoutes([]));
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const r = await adminApi.getRevenueReport({
        startDate: start || undefined,
        endDate: end || undefined,
        routeId: routeId || undefined,
      });
      setSummary(r.data.data.summary);
      setMonthly(r.data.data.monthly || []);
    } catch { /* noop */ } finally { setLoading(false); }
  };
  useEffect(() => { fetchReport(); }, []);

  const resetFilters = () => { setStart(''); setEnd(''); setRouteId(''); };

  return (
    <div>
      <div className="card mb-5 flex flex-wrap gap-3 items-end">
        <div><label className="block text-xs text-gray-600 mb-1">Từ ngày <span className="text-gray-400">(để trống = từ đầu)</span></label>
          <input type="date" className="input" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><label className="block text-xs text-gray-600 mb-1">Đến ngày <span className="text-gray-400">(để trống = không giới hạn)</span></label>
          <input type="date" className="input" value={end} onChange={e => setEnd(e.target.value)} /></div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Tuyến xe</label>
          <select className="input" value={routeId} onChange={e => setRouteId(e.target.value)}>
            <option value="">Tất cả tuyến</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
          </select>
        </div>
        <button onClick={fetchReport} className="btn-primary">Xem báo cáo</button>
        <button onClick={() => { resetFilters(); }} className="btn-secondary">↺ Làm mới</button>
      </div>

      {loading ? <LoadingScreen /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <StatCard
              icon={<FiDollarSign />}
              label="Tổng doanh thu"
              value={formatVND(summary?.total_revenue)}
              colorClass="bg-green-100 text-green-600"
            />
            <StatCard
              icon={<FiFileText />}
              label="Hóa đơn đã thanh toán"
              value={summary?.total_paid_invoices || 0}
              colorClass="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={<FiUserCheck />}
              label="Phụ huynh đã thanh toán"
              value={summary?.parents_paid || 0}
              colorClass="bg-emerald-100 text-emerald-600"
            />
            <StatCard
              icon={<FiUserX />}
              label="Phụ huynh chưa thanh toán"
              value={summary?.parents_unpaid || 0}
              colorClass="bg-red-100 text-red-600"
            />
          </div>

          <div className="card mb-5">
            <div className="font-medium text-gray-700 mb-3">Doanh thu theo tháng</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'tr'} />
                <Tooltip formatter={(v) => formatVND(v)} labelFormatter={formatMonth} />
                <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="font-medium text-gray-700 mb-3">Chi tiết theo tháng</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50">
                  {['Tháng', 'Tổng HĐ', 'Đã thanh toán', 'Chưa thanh toán', 'Doanh thu', 'PH đã đóng', 'PH chưa đóng'].map(h =>
                    <th key={h} className="table-header">{h}</th>)}
                </tr></thead>
                <tbody>
                  {monthly.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="table-cell font-medium">{formatMonth(row.month)}</td>
                      <td className="table-cell">{row.total_invoices}</td>
                      <td className="table-cell text-green-600">{row.paid_invoices}</td>
                      <td className="table-cell text-red-600">{row.unpaid_invoices}</td>
                      <td className="table-cell font-medium">{formatVND(row.revenue)}</td>
                      <td className="table-cell text-emerald-600">{row.parents_paid}</td>
                      <td className="table-cell text-amber-600">{row.parents_unpaid}</td>
                    </tr>
                  ))}
                  {monthly.length === 0 && (
                    <tr><td colSpan={7} className="table-cell text-center text-gray-400 py-6">
                      Không có dữ liệu trong khoảng thời gian này
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   TRANG BÁO CÁO (tab switcher)
   ============================================================ */
export default function Report() {
  const [tab, setTab] = useState('attendance');

  const tabBtn = (key, label) => (
    <button
      onClick={() => setTab(key)}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <PageHeader title="Báo cáo" />
      <div className="flex gap-2 mb-5 border-b border-gray-200">
        {tabBtn('attendance', 'Điểm danh')}
        {tabBtn('revenue', 'Doanh thu')}
      </div>
      {tab === 'attendance' ? <AttendanceReport /> : <RevenueReport />}
    </div>
  );
}
