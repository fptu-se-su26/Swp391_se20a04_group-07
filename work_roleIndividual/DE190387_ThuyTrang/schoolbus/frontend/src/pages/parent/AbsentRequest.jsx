// ============================================================
// ABSENT REQUEST PAGE  (src/pages/parent/AbsentRequest.jsx)
// ============================================================
import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api';
import { PageHeader, LoadingScreen, Modal } from '../../components/common';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function AbsentRequest() {
  const [children, setChildren]   = useState([]);
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm] = useState({
    studentId: '', absentDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    tripType: 'both', reason: ''
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [childRes, reqRes] = await Promise.all([
        parentApi.getChildren(),
        parentApi.getAbsentRequests()
      ]);
      setChildren(childRes.data.data);
      setRequests(reqRes.data.data);
      if (childRes.data.data[0] && !form.studentId) {
        setForm(f => ({ ...f, studentId: childRes.data.data[0].id }));
      }
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    if (!form.studentId || !form.absentDate) return toast.error('Vui lòng điền đầy đủ thông tin');
    if (dayjs(form.absentDate).isBefore(dayjs(), 'day')) return toast.error('Không thể báo vắng cho ngày đã qua');
    try {
      await parentApi.createAbsentRequest(form);
      toast.success('Đã gửi báo vắng!');
      setModal(false);
      fetchAll();
    } catch {}
  };

  const TRIP_TYPES = { morning: '🌅 Buổi sáng', afternoon: '🌇 Buổi chiều', both: '📋 Cả hai buổi' };

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Báo vắng" subtitle="Thông báo con không đi xe"
        action={<button onClick={() => setModal(true)} className="btn-primary">+ Tạo báo vắng</button>} />

      <div className="space-y-3">
        {requests.map(r => {
          const child = children.find(c => c.id === r.student_id);
          return (
            <div key={r.id} className="card border-l-4 border-l-orange-400">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {child?.full_name || 'Học sinh'}
                    </h3>
                    <span className="badge-yellow">Đã duyệt</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    📅 {dayjs(r.absent_date).format('dddd, DD/MM/YYYY')} · {TRIP_TYPES[r.trip_type]}
                  </p>
                  {r.reason && <p className="text-sm text-gray-500 mt-1">📝 {r.reason}</p>}
                  <p className="text-xs text-gray-400 mt-1">Tạo lúc: {dayjs(r.created_at).format('DD/MM HH:mm')}</p>
                </div>
              </div>
            </div>
          );
        })}
        {requests.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📝</p>
            <p>Chưa có báo vắng nào</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Tạo báo vắng" size="sm">
        <div className="space-y-4">
          {children.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Học sinh</label>
              <select className="input" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
                {children.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày vắng</label>
            <input type="date" className="input" value={form.absentDate}
              min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
              onChange={e => setForm(f => ({ ...f, absentDate: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buổi vắng</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TRIP_TYPES).map(([val, label]) => (
                <button key={val} onClick={() => setForm(f => ({ ...f, tripType: val }))}
                  className={`p-2 rounded-lg border-2 text-xs font-medium transition-all
                    ${form.tripType === val ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lý do (tùy chọn)</label>
            <textarea className="input" rows={3} placeholder="VD: Bé bị bệnh, nghỉ lễ..."
              value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Hủy</button>
            <button onClick={handleSubmit} className="btn-primary flex-1">📤 Gửi báo vắng</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
