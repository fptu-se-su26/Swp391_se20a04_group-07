import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge, Modal, ConfirmDialog } from '../../components/common';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function ParentInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [method, setMethod]     = useState('bank_transfer');

  const fetch = async () => {
    setLoading(true);
    try { const r = await parentApi.getInvoices(); setInvoices(r.data.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handlePay = async () => {
    try {
      await parentApi.payInvoice(payModal.id, { payment_method: method });
      toast.success('Thanh toán thành công!');
      setPayModal(null);
      fetch();
    } catch {}
  };

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + parseFloat(i.amount), 0);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Hóa đơn học phí xe" subtitle="Quản lý thanh toán" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card bg-yellow-50 border-yellow-200 text-center">
          <p className="text-2xl font-bold text-yellow-700">{invoices.filter(i => i.status === 'pending').length}</p>
          <p className="text-xs text-yellow-600 mt-1">Chưa thanh toán</p>
        </div>
        <div className="card bg-green-50 border-green-200 text-center">
          <p className="text-2xl font-bold text-green-700">{invoices.filter(i => i.status === 'paid').length}</p>
          <p className="text-xs text-green-600 mt-1">Đã thanh toán</p>
        </div>
        <div className="card bg-red-50 border-red-200 text-center">
          <p className="text-lg font-bold text-red-700">{totalPending.toLocaleString('vi-VN')}đ</p>
          <p className="text-xs text-red-600 mt-1">Tổng cần thanh toán</p>
        </div>
      </div>

      {/* Invoice list */}
      <div className="space-y-3">
        {invoices.map(inv => (
          <div key={inv.id} className={`card border-l-4 ${
            inv.status === 'pending' ? 'border-l-yellow-400' :
            inv.status === 'paid'    ? 'border-l-green-400' :
                                       'border-l-red-400'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">
                    {inv.student?.full_name}
                  </h3>
                  <StatusBadge status={inv.status} />
                </div>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p>💰 Số tiền: <strong className="text-gray-900">{parseFloat(inv.amount).toLocaleString('vi-VN')}đ</strong></p>
                  <p>📅 Hạn nộp: <span className={dayjs(inv.due_date).isBefore(dayjs()) && inv.status !== 'paid' ? 'text-red-600 font-medium' : ''}>
                    {dayjs(inv.due_date).format('DD/MM/YYYY')}
                  </span></p>
                  {inv.paid_at && <p>✅ Đã thanh toán: {dayjs(inv.paid_at).format('DD/MM/YYYY HH:mm')}</p>}
                  {inv.transaction_id && <p className="text-xs text-gray-400">Mã GD: {inv.transaction_id}</p>}
                </div>
              </div>
              {inv.status === 'pending' && (
                <button onClick={() => setPayModal(inv)} className="btn-primary ml-4">Thanh toán</button>
              )}
            </div>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">💰</p>
            <p>Chưa có hóa đơn nào</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Xác nhận thanh toán" size="sm">
        {payModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Học sinh:</span> <strong>{payModal.student?.full_name}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span> <strong className="text-primary-600">{parseFloat(payModal.amount).toLocaleString('vi-VN')}đ</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Hạn nộp:</span> <span>{dayjs(payModal.due_date).format('DD/MM/YYYY')}</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'bank_transfer', label: '🏦 Chuyển khoản' },
                  { value: 'cash',          label: '💵 Tiền mặt' },
                  { value: 'momo',          label: '💜 MoMo' },
                  { value: 'vnpay',         label: '💳 VNPay' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setMethod(opt.value)}
                    className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all
                      ${method === opt.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPayModal(null)} className="btn-secondary flex-1">Hủy</button>
              <button onClick={handlePay} className="btn-primary flex-1">✅ Xác nhận thanh toán</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
