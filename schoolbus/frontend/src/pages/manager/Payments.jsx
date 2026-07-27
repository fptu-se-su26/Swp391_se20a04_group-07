// src/pages/manager/Payments.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { managerApi } from '../../api';
import { PageHeader, Modal, LoadingScreen } from '../../components/common';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

// ── Badge trạng thái hóa đơn (giữ nguyên, không đổi) ──
const STATUS_CONFIG = {
  pending:               { label: 'Chưa thanh toán', className: 'bg-yellow-100 text-yellow-700' },
  awaiting_confirmation: { label: 'Chờ xác nhận',     className: 'bg-blue-100 text-blue-700' },
  paid:                  { label: 'Đã thanh toán',    className: 'bg-green-100 text-green-700' },
  overdue:               { label: 'Quá hạn',          className: 'bg-red-100 text-red-700' },
};

function InvoiceStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

const money = (v) => parseFloat(v || 0).toLocaleString('vi-VN') + 'đ';

// Chip lọc trạng thái - cùng danh sách trạng thái với dropdown gốc, chỉ đổi cách hiển thị
const STATUS_CHIPS = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chưa thanh toán' },
  { value: 'awaiting_confirmation', label: 'Chờ xác nhận' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'overdue', label: 'Quá hạn' },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const PAGE_SIZE = 9;

function StatMini({ label, value, colorClass }) {
  return (
    <div className="card !p-3.5">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}

export default function Payments() {
  // ── Generate modal (giữ nguyên) ──────────────────────────────
  const [genModal, setGenModal] = useState(false);
  const [genForm, setGenForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: 2000000,
  });
  const [generating, setGenerating] = useState(false);

  // ── List / filter (giữ nguyên phần gọi API) ──────────────────
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // ── Bộ lọc mới: Tháng / Năm + phân trang — xử lý HOÀN TOÀN Ở CLIENT,
  //    không đổi tham số gửi lên API (chỉ lọc trên `items` đã tải về). ──
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [page, setPage] = useState(1);

  // ── Detail modal (giữ nguyên) ─────────────────────────────────
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      // limit cao để lấy đủ toàn bộ hóa đơn khớp search/status (BE mặc định limit=20 nếu không truyền)
      // → cần thiết để lọc Tháng/Năm + phân trang phía client tính đúng trên toàn bộ dữ liệu.
      const r = await managerApi.listInvoices({ search: search || undefined, status: status || undefined, limit: 1000 });
      setItems(r.data.data.items);
      setTotal(r.data.data.total);
    } catch {
      // lỗi đã được interceptor toast chung xử lý (nếu có)
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => { fetchList(); }, [fetchList]);

  // Reset về trang 1 mỗi khi bất kỳ bộ lọc nào thay đổi
  useEffect(() => { setPage(1); }, [search, status, monthFilter, yearFilter]);

  const generate = async () => {
    setGenerating(true);
    try {
      const r = await managerApi.generateInvoices(genForm);
      toast.success(`Đã tạo ${r.data.data.count} hóa đơn`);
      setGenModal(false);
      fetchList();
    } catch {}
    finally { setGenerating(false); }
  };

  const openDetail = async (id) => {
    setDetail({ id });
    setDetailLoading(true);
    try {
      const r = await managerApi.getInvoiceDetail(id);
      setDetail(r.data.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const [retrying, setRetrying] = useState(false);
  const retryPayos = async () => {
    if (!detail) return;
    setRetrying(true);
    try {
      const r = await managerApi.retryPayosLink(detail.id);
      setDetail(d => ({ ...d, checkout_url: r.data.data.checkout_url }));
      toast.success('Đã tạo lại link thanh toán');
    } catch {}
    finally { setRetrying(false); }
  };

  const confirmPaid = async () => {
    if (!detail) return;
    setConfirming(true);
    try {
      await managerApi.confirmInvoicePayment(detail.id);
      toast.success('Đã xác nhận thanh toán');
      setDetail(null);
      fetchList();
    } catch {}
    finally { setConfirming(false); }
  };

  // ── Danh sách năm có sẵn để đổ vào dropdown (lấy từ dữ liệu thật) ──
  const yearOptions = useMemo(() => {
    const set = new Set(items.filter(i => i.due_date).map(i => dayjs(i.due_date).year()));
    if (set.size === 0) set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  // ── Lọc theo Tháng/Năm (client-side) trên nền items đã tải theo search/status ──
  const filteredItems = useMemo(() => {
    return items.filter((inv) => {
      if (!inv.due_date) return true;
      const d = dayjs(inv.due_date);
      if (monthFilter && d.month() + 1 !== +monthFilter) return false;
      if (yearFilter && d.year() !== +yearFilter) return false;
      return true;
    });
  }, [items, monthFilter, yearFilter]);

  // ── Thống kê nhanh dựa trên tập đã lọc ──
  const stats = useMemo(() => {
    const paidCount = filteredItems.filter(i => i.display_status === 'paid').length;
    const unpaidCount = filteredItems.filter(i => i.display_status === 'pending' || i.display_status === 'awaiting_confirmation').length;
    const revenue = filteredItems
      .filter(i => i.display_status === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
    return { totalCount: filteredItems.length, paidCount, unpaidCount, revenue };
  }, [filteredItems]);

  // ── Phân trang client-side ──
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setMonthFilter('');
    setYearFilter('');
  };

  return (
    <div>
      <PageHeader
        title="Quản lý hóa đơn"
        subtitle={`Tổng ${total} hóa đơn`}
        action={<button onClick={() => setGenModal(true)} className="btn-primary">+ Xuất hóa đơn nhanh</button>}
      />

      {/* Thanh thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatMini label="Sau khi lọc" value={stats.totalCount} colorClass="text-gray-800" />
        <StatMini label="Chưa thanh toán" value={stats.unpaidCount} colorClass="text-yellow-600" />
        <StatMini label="Đã thanh toán" value={stats.paidCount} colorClass="text-green-600" />
        <StatMini label="Doanh thu (đang lọc)" value={money(stats.revenue)} colorClass="text-primary-600" />
      </div>

      {/* Bộ lọc */}
      <div className="card mb-4 space-y-3">
        {/* Hàng 1: tìm kiếm + tháng + năm + làm mới */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            placeholder="Tìm theo tên học sinh / phụ huynh / mã HS / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input sm:w-40" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="">Mọi tháng</option>
            {MONTHS.map(m => <option key={m} value={m}>Tháng {m}</option>)}
          </select>
          <select className="input sm:w-32" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="">Mọi năm</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={resetFilters} className="btn-secondary sm:w-32 whitespace-nowrap">↺ Làm mới</button>
        </div>

        {/* Hàng 2: filter chip trạng thái */}
        <div className="flex flex-wrap gap-2">
          {STATUS_CHIPS.map(chip => (
            <button
              key={chip.value}
              onClick={() => setStatus(chip.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                status === chip.value
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách dạng lưới Card */}
      {loading ? <LoadingScreen /> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pagedItems.map((inv) => (
              <div
                key={inv.id}
                className="card border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{inv.student?.full_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      PH: {inv.student?.parent_name || '—'}
                    </p>
                  </div>
                  <InvoiceStatusBadge status={inv.display_status} />
                </div>

                <div className="space-y-1.5 text-xs mb-3 flex-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mã hóa đơn</span>
                    <span className="font-mono text-gray-700">{inv.payment_code || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kỳ thanh toán</span>
                    <span className="text-gray-700">
                      {inv.due_date ? `Tháng ${dayjs(inv.due_date).format('M/YYYY')}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hạn nộp</span>
                    <span className="text-gray-700">{inv.due_date ? dayjs(inv.due_date).format('DD/MM/YYYY') : '—'}</span>
                  </div>
                  {inv.paid_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">TT lúc</span>
                      <span className="text-gray-700">{dayjs(inv.paid_at).format('DD/MM HH:mm')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-primary-600">{money(inv.amount)}</span>
                  <button
                    onClick={() => openDetail(inv.id)}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="card text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">💰</div>
              <p>Không có hóa đơn nào phù hợp</p>
            </div>
          )}

          {/* Phân trang */}
          {filteredItems.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="btn-secondary px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹ Trước
              </button>
              <span className="text-sm text-gray-500">Trang {page}/{totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="btn-secondary px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau ›
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal: Xuất hóa đơn hàng loạt (giữ nguyên) */}
      <Modal open={genModal} onClose={() => setGenModal(false)} title="Xuất hóa đơn hàng loạt" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Hệ thống sẽ tạo hóa đơn cho tất cả Parent có học sinh đang đăng ký tuyến (active) và chưa có hóa đơn trong tháng này.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
              <select className="input" value={genForm.month} onChange={(e) => setGenForm(f => ({ ...f, month: +e.target.value }))}>
                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
              <input type="number" className="input" value={genForm.year} onChange={(e) => setGenForm(f => ({ ...f, year: +e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền mỗi hóa đơn (VNĐ)</label>
            <input
              type="number" step="1000" className="input"
              value={genForm.amount}
              onChange={(e) => setGenForm(f => ({ ...f, amount: +e.target.value }))}
            />
            <p className="text-xs text-gray-400 mt-1">Mặc định 2.000.000đ, có thể chỉnh sửa trước khi xuất.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setGenModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={generate} disabled={generating} className="btn-primary flex-1">
              {generating ? 'Đang tạo...' : 'Xuất hóa đơn'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Chi tiết hóa đơn (giữ nguyên) */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Chi tiết hóa đơn" size="sm">
        {detailLoading ? <LoadingScreen /> : detail && detail.student ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{detail.student.full_name}</h3>
              <InvoiceStatusBadge status={detail.display_status} />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Mã học sinh:</span><strong>{detail.student.student_id}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Phụ huynh:</span><strong>{detail.student.parent_name}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span><strong className="text-primary-600">{money(detail.amount)}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Hạn nộp:</span><span>{dayjs(detail.due_date).format('DD/MM/YYYY')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Code:</span><span className="font-mono">{detail.payment_code}</span></div>
              {detail.paid_at && (
                <div className="flex justify-between"><span className="text-gray-500">Thanh toán lúc:</span><span>{dayjs(detail.paid_at).format('DD/MM/YYYY HH:mm')}</span></div>
              )}
            </div>

            {detail.status !== 'paid' && detail.checkout_url && (
              <a
                href={detail.checkout_url} target="_blank" rel="noopener noreferrer"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                🔗 Mở trang thanh toán payOS (xem QR / trạng thái)
              </a>
            )}

            {detail.status !== 'paid' && !detail.checkout_url && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center text-sm text-yellow-700 space-y-2">
                <p>Chưa có link thanh toán payOS cho hóa đơn này (có thể do lỗi lúc tạo hàng loạt).</p>
                <button onClick={retryPayos} disabled={retrying} className="btn-secondary w-full">
                  {retrying ? 'Đang tạo...' : '🔄 Tạo lại link thanh toán'}
                </button>
              </div>
            )}

            {detail.status !== 'paid' && (
              <p className="text-xs text-gray-400 text-center">
                Hóa đơn tự động chuyển "Đã thanh toán" khi payOS xác nhận giao dịch. Chỉ xác nhận tay bên dưới nếu chắc chắn đã nhận được tiền mà hệ thống chưa tự cập nhật (VD: webhook lỗi).
              </p>
            )}

            {detail.status !== 'paid' && (
              <button onClick={confirmPaid} disabled={confirming} className="btn-primary w-full">
                {confirming ? 'Đang xác nhận...' : '✅ Xác nhận thủ công (dự phòng)'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">Không tải được chi tiết hóa đơn</p>
        )}
      </Modal>
    </div>
  );
}
