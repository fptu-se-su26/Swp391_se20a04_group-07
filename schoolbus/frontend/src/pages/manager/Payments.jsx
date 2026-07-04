// src/pages/manager/Payments.jsx
import React, { useEffect, useState } from 'react';
import { managerApi } from '../../api';
import { PageHeader, Modal, LoadingScreen } from '../../components/common';
import toast from 'react-hot-toast';

export default function Payments() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear() });
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try { const r = await managerApi.generateInvoices(form); toast.success(`Đã tạo ${r.data.data.count} hóa đơn`); setModal(false); }
    catch {} finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Quản lý thanh toán" action={<button onClick={() => setModal(true)} className="btn-primary">+ Tạo hóa đơn tháng</button>} />
      <div className="card flex items-center justify-center py-16 text-gray-400">
        <div className="text-center">
          <div className="text-5xl mb-3">💰</div>
          <p>Nhấn "Tạo hóa đơn tháng" để tạo hóa đơn cho toàn bộ học sinh</p>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Tạo hóa đơn tháng" size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
              <select className="input" value={form.month} onChange={e => setForm(f => ({...f, month: +e.target.value}))}>
                {[...Array(12)].map((_,i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
              <input type="number" className="input" value={form.year} onChange={e => setForm(f => ({...f, year: +e.target.value}))} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={generate} disabled={loading} className="btn-primary flex-1">{loading ? 'Đang tạo...' : 'Tạo hóa đơn'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
