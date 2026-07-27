import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { parentApi } from '../../api';
import { PageHeader, LoadingScreen, Modal } from '../../components/common';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

// ============================================================
// CẤU HÌNH TRẠNG THÁI — màu sắc, nhãn, icon đồng bộ 1 chỗ duy nhất
// ============================================================
const STATUS_CONFIG = {
  pending: {
    label: 'Chưa thanh toán',
    badge: 'bg-school-yellow/15 text-yellow-700',
    bar: 'border-l-school-yellow',
    dot: 'bg-school-yellow',
    icon: '📄',
    iconBg: 'bg-yellow-50 text-yellow-600',
  },
  awaiting_confirmation: {
    label: 'Chờ xác nhận',
    badge: 'bg-blue-100 text-blue-700',
    bar: 'border-l-blue-400',
    dot: 'bg-blue-400',
    icon: '⏳',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  paid: {
    label: 'Đã thanh toán',
    badge: 'bg-school-green/15 text-green-700',
    bar: 'border-l-school-green',
    dot: 'bg-school-green',
    icon: '✅',
    iconBg: 'bg-green-50 text-green-600',
  },
  overdue: {
    label: 'Quá hạn',
    badge: 'bg-school-red/15 text-red-700',
    bar: 'border-l-school-red',
    dot: 'bg-school-red',
    icon: '⚠️',
    iconBg: 'bg-red-50 text-red-600',
  },
};

const TABS = [
  { key: 'all',                   label: 'Tất cả' },
  { key: 'pending',                label: 'Chưa thanh toán' },
  { key: 'awaiting_confirmation',  label: 'Chờ xác nhận' },
  { key: 'paid',                   label: 'Đã thanh toán' },
  { key: 'overdue',                label: 'Quá hạn' },
];

const SORT_OPTIONS = [
  { key: 'due_desc',    label: 'Hạn nộp: mới nhất' },
  { key: 'due_asc',     label: 'Hạn nộp: cũ nhất' },
  { key: 'amount_desc', label: 'Số tiền: cao → thấp' },
  { key: 'amount_asc',  label: 'Số tiền: thấp → cao' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const POLL_INTERVAL_MS = 15000;

const money = (v) => parseFloat(v || 0).toLocaleString('vi-VN') + 'đ';

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, badge: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot || 'bg-gray-400'}`} />
      {cfg.label}
    </span>
  );
}

// Diễn giải hạn nộp thành "còn N ngày" / "quá hạn N ngày" — giúp phụ huynh nắm ngay mức độ khẩn cấp
function dueDateLabel(dueDate, status) {
  const diff = dayjs(dueDate).startOf('day').diff(dayjs().startOf('day'), 'day');
  if (status === 'paid') return null;
  if (diff < 0)  return { text: `quá hạn ${Math.abs(diff)} ngày`, className: 'text-red-600 font-medium' };
  if (diff === 0) return { text: 'hạn hôm nay', className: 'text-red-600 font-medium' };
  if (diff <= 3)  return { text: `còn ${diff} ngày`, className: 'text-orange-600 font-medium' };
  return { text: `còn ${diff} ngày`, className: 'text-gray-400' };
}

export default function ParentInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [detail, setDetail]     = useState(null);
  const pollRef = useRef(null);

  // ── Bộ lọc ────────────────────────────────────────────────
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('all');
  const [month, setMonth]       = useState('all');
  const [year, setYear]         = useState('all');
  const [sort, setSort]         = useState('due_desc');
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchInvoices = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const r = await parentApi.getInvoices();
      setInvoices(r.data.data);
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  // Polling nhẹ khi còn hóa đơn chưa xử lý xong
  useEffect(() => {
    const hasPending = invoices.some(i => i.status === 'pending' || i.status === 'awaiting_confirmation');
    clearInterval(pollRef.current);
    if (hasPending) pollRef.current = setInterval(() => fetchInvoices(true), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [invoices, fetchInvoices]);

  const handleOpenCheckout = (inv) => {
    if (!inv?.checkout_url) return;
    window.open(inv.checkout_url, '_blank', 'noopener,noreferrer');
  };

  const notReady = () => toast('Tính năng đang được phát triển, sẽ sớm ra mắt.', { icon: '🚧' });

  // ── Danh sách năm / tháng có mặt trong dữ liệu (để đổ vào dropdown) ──
  const availableYears = useMemo(() => {
    const ys = new Set(invoices.map(i => dayjs(i.due_date).year()));
    return Array.from(ys).sort((a, b) => b - a);
  }, [invoices]);

  // ── Áp dụng filter + search + sort ───────────────────────────
  const filtered = useMemo(() => {
    let list = [...invoices];

    if (tab !== 'all') list = list.filter(i => i.display_status === tab);
    if (year !== 'all') list = list.filter(i => dayjs(i.due_date).year() === Number(year));
    if (month !== 'all') list = list.filter(i => dayjs(i.due_date).month() + 1 === Number(month));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i =>
        i.student?.full_name?.toLowerCase().includes(q) ||
        i.payment_code?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sort === 'due_desc')    return dayjs(b.due_date).valueOf() - dayjs(a.due_date).valueOf();
      if (sort === 'due_asc')     return dayjs(a.due_date).valueOf() - dayjs(b.due_date).valueOf();
      if (sort === 'amount_desc') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sort === 'amount_asc')  return parseFloat(a.amount) - parseFloat(b.amount);
      return 0;
    });

    return list;
  }, [invoices, tab, year, month, search, sort]);

  // ── Phân trang (client-side) ─────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [tab, year, month, search, sort, pageSize]);

  const resetFilters = () => {
    setSearch(''); setTab('all'); setMonth('all'); setYear('all'); setSort('due_desc');
  };

  // ── Số liệu tổng quan ─────────────────────────────────────────
  const stats = useMemo(() => {
    const by = (s) => invoices.filter(i => i.display_status === s);
    const sumOf = (arr) => arr.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
    const unpaid = [...by('pending'), ...by('overdue'), ...by('awaiting_confirmation')];
    return {
      total: invoices.length,
      pending:  { count: by('pending').length,               sum: sumOf(by('pending')) },
      awaiting: { count: by('awaiting_confirmation').length,  sum: sumOf(by('awaiting_confirmation')) },
      paid:     { count: by('paid').length,                   sum: sumOf(by('paid')) },
      overdue:  { count: by('overdue').length,                sum: sumOf(by('overdue')) },
      dueSum: sumOf([...by('pending'), ...by('overdue')]),
    };
  }, [invoices]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Hóa đơn của tôi" subtitle="Thanh toán học phí xe đưa đón" />

      {/* ── 6 thẻ tổng quan ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <SummaryCard icon="📄" iconBg="bg-primary-50 text-primary-600" label="Tổng hóa đơn"
          value={stats.total} sub="Tất cả thời gian" />
        <SummaryCard icon="📄" iconBg="bg-yellow-50 text-yellow-600" label="Chưa thanh toán"
          value={stats.pending.count} sub={`${money(stats.pending.sum)}`} />
        <SummaryCard icon="⏳" iconBg="bg-blue-50 text-blue-600" label="Chờ xác nhận"
          value={stats.awaiting.count} sub={`${money(stats.awaiting.sum)}`} />
        <SummaryCard icon="✅" iconBg="bg-green-50 text-green-600" label="Đã thanh toán"
          value={stats.paid.count} sub={`${money(stats.paid.sum)}`} />
        <SummaryCard icon="⚠️" iconBg="bg-red-50 text-red-600" label="Quá hạn"
          value={stats.overdue.count} sub={`${money(stats.overdue.sum)}`} />
        <SummaryCard icon="💼" iconBg="bg-purple-50 text-purple-600" label="Tổng cần thanh toán"
          value={money(stats.dueSum)} sub="Còn phải thanh toán" isMoney />
      </div>

      {/* ── Thanh filter ─────────────────────────────────────── */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên học sinh, mã hóa đơn..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <select value={month} onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200">
            <option value="all">Tháng: Tất cả</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200">
            <option value="all">Năm: Tất cả</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200">
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ↺ Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* ── Tabs trạng thái ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map(t => {
          const count = t.key === 'all' ? invoices.length : invoices.filter(i => i.display_status === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                active ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 rounded-full ${active ? 'bg-white/20' : 'bg-gray-100'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Danh sách hóa đơn ────────────────────────────────── */}
      <div className="space-y-3">
        {pageItems.map(inv => {
          const cfg = STATUS_CONFIG[inv.display_status] || STATUS_CONFIG.pending;
          const dueInfo = dueDateLabel(inv.due_date, inv.display_status);
          const monthLabel = dayjs(inv.due_date).format('M/YYYY');

          return (
            <div key={inv.id} className={`card border-l-4 ${cfg.bar} hover:shadow-md transition-shadow`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${cfg.iconBg}`}>
                  {cfg.icon}
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {inv.payment_code || `HD-${inv.id?.slice(0, 8)}`}
                    </h3>
                    <StatusBadge status={inv.display_status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    Học phí xe bus tháng {monthLabel}
                    {inv.student?.full_name && <> · {inv.student.full_name}</>}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    {inv.created_at && <span>📅 Ngày tạo: {dayjs(inv.created_at).format('DD/MM/YYYY')}</span>}
                    <span>
                      ⏰ Hạn nộp: {dayjs(inv.due_date).format('DD/MM/YYYY')}
                      {dueInfo && <span className={`ml-1 ${dueInfo.className}`}>({dueInfo.text})</span>}
                    </span>
                    {inv.paid_at && <span className="text-green-600">✅ Đã thanh toán {dayjs(inv.paid_at).format('DD/MM/YYYY HH:mm')}</span>}
                  </div>
                </div>

                {/* Số tiền */}
                <div className="text-right shrink-0 md:w-32">
                  <p className="text-xs text-gray-400">Số tiền</p>
                  <p className={`text-lg font-bold ${
                    inv.display_status === 'overdue' ? 'text-red-600' :
                    inv.display_status === 'paid'    ? 'text-green-600' : 'text-gray-800'
                  }`}>
                    {money(inv.amount)}
                  </p>
                </div>

                {/* Hành động */}
                <div className="flex md:flex-col gap-2 shrink-0 md:w-36">
                  <button onClick={() => setDetail(inv)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex-1 flex items-center justify-center gap-1.5">
                    👁 Chi tiết
                  </button>
                  {inv.display_status === 'paid' ? (
                    <button onClick={notReady} className="btn-primary bg-green-600 hover:bg-green-700 text-sm flex-1 flex items-center justify-center gap-1.5">
                      ⬇ Tải biên lai
                    </button>
                  ) : inv.display_status === 'awaiting_confirmation' ? (
                    <button disabled className="text-sm flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 text-blue-500 bg-blue-50 py-2 cursor-not-allowed">
                      ✓ Đã chuyển khoản
                    </button>
                  ) : (
                    <button
                      onClick={() => setDetail(inv)}
                      className={`btn-primary text-sm flex-1 flex items-center justify-center gap-1.5 ${
                        inv.display_status === 'overdue' ? 'bg-red-600 hover:bg-red-700' : ''
                      }`}
                    >
                      💳 {inv.display_status === 'overdue' ? 'Thanh toán ngay' : 'Thanh toán'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card text-center py-14 text-gray-400">
            <p className="text-4xl mb-2">💰</p>
            <p>{invoices.length === 0 ? 'Chưa có hóa đơn nào' : 'Không tìm thấy hóa đơn phù hợp với bộ lọc'}</p>
          </div>
        )}
      </div>

      {/* ── Phân trang ───────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Hiển thị</span>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-gray-200 rounded-lg text-sm px-2 py-1">
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>· {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} của {filtered.length} hóa đơn</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
            >←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm ${page === n ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
              >{n}</button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
            >→</button>
          </div>
        </div>
      )}

      {/* ── Modal chi tiết / thanh toán ──────────────────────── */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Chi tiết hóa đơn" size="sm">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{detail.student?.full_name}</h3>
                <p className="text-xs text-gray-400">{detail.payment_code}</p>
              </div>
              <StatusBadge status={detail.display_status} />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span><strong className="text-primary-600">{money(detail.amount)}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Hạn nộp:</span><span>{dayjs(detail.due_date).format('DD/MM/YYYY')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Mã giao dịch:</span><span className="font-mono">{detail.payment_code}</span></div>
              {detail.paid_at && (
                <div className="flex justify-between"><span className="text-gray-500">Thanh toán lúc:</span><span>{dayjs(detail.paid_at).format('DD/MM/YYYY HH:mm')}</span></div>
              )}
            </div>

            {detail.status === 'paid' ? (
              <div className="text-center py-4">
                <p className="text-4xl mb-2">🎉</p>
                <p className="text-green-600 font-medium">Hóa đơn này đã được thanh toán thành công</p>
              </div>
            ) : detail.checkout_url ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center text-sm text-blue-700">
                  Bấm nút bên dưới để mở trang thanh toán (có sẵn mã QR + thông tin chuyển khoản).
                  Hệ thống sẽ <strong>tự động cập nhật trạng thái ngay khi thanh toán thành công</strong>, không cần thao tác gì thêm.
                </div>
                <button onClick={() => handleOpenCheckout(detail)} className="btn-primary w-full">
                  💳 Thanh toán ngay
                </button>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center text-sm text-yellow-700">
                Hóa đơn này chưa có link thanh toán. Vui lòng liên hệ nhà trường để được hỗ trợ.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Thẻ tổng quan tái sử dụng cho 6 ô đầu trang ────────────────
function SummaryCard({ icon, iconBg, label, value, sub }) {
  return (
    <div className="card flex flex-col gap-1.5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${iconBg}`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 leading-tight">{label}</p>
      <p className="text-xl font-bold text-gray-800 leading-tight">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 leading-tight">{sub}</p>}
    </div>
  );
}
