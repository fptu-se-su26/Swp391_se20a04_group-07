// src/pages/admin/Incidents.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';

const SEVERITY = { low:'badge-gray', medium:'badge-yellow', high:'badge-red', critical:'bg-red-200 text-red-900 px-2 py-0.5 rounded-full text-xs font-medium' };
const SEVERITY_LABELS = { low:'Thấp', medium:'Trung bình', high:'Cao', critical:'Nghiêm trọng' };
const TYPE_LABELS = { vehicle_breakdown:'Hỏng xe', accident:'Tai nạn', traffic:'Kẹt xe', student_issue:'Vấn đề học sinh', other:'Khác' };

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [resolving, setResolving] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const {data} = await adminApi.getIncidents({ status }); setIncidents(data.data.data); }
    catch {} finally { setLoading(false); }
  }, [status]);
  useEffect(() => { fetch(); }, [fetch]);

  const resolve = async (id) => {
    try { await adminApi.resolveIncident(id, 'Đã xử lý'); toast.success('Đã đánh dấu giải quyết'); fetch(); } catch {}
  };

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Quản lý sự cố" subtitle={`${incidents.length} sự cố`} />
      <div className="flex gap-3 mb-4">
        {['','open','in_review','resolved'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${status===s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
            {s===''?'Tất cả':s==='open'?'Chưa xử lý':s==='in_review'?'Đang xem xét':'Đã giải quyết'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {incidents.map(inc => (
          <div key={inc.id} className="card border-l-4 border-l-red-400">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={SEVERITY[inc.severity]}>{SEVERITY_LABELS[inc.severity]}</span>
                  <span className="badge-blue">{TYPE_LABELS[inc.type] || inc.type}</span>
                  <StatusBadge status={inc.status} />
                </div>
                <p className="text-gray-700 text-sm">{inc.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Báo cáo bởi: {inc.reporter?.full_name} · {new Date(inc.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
              {inc.status === 'open' && (
                <button onClick={() => setResolving(inc)} className="btn-success text-xs py-1 ml-4">✓ Giải quyết</button>
              )}
            </div>
          </div>
        ))}
        {incidents.length === 0 && <div className="text-center py-10 text-gray-400">Không có sự cố nào</div>}
      </div>
      <ConfirmDialog open={!!resolving} onClose={() => setResolving(null)} onConfirm={() => resolve(resolving?.id)}
        title="Xác nhận giải quyết" message={`Đánh dấu sự cố này là đã giải quyết?`} />
    </div>
  );
}
