import React, { useEffect, useState } from 'react';
import { driverApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';

export default function DriverHistory() {
  const [data, setData]     = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(1);

  const fetch = async (p = 1) => {
    setLoading(true);
    try { const r = await driverApi.getTripHistory({ page: p, limit: 15 }); setData(r.data.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(page); }, [page]);

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Lịch sử chuyến" subtitle={`${data.total} chuyến`} />
      <div className="space-y-3">
        {data.data.map(t => (
          <div key={t.id} className="card flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">{t.Route?.route_name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                📅 {new Date(t.scheduled_date).toLocaleDateString('vi-VN')} ·
                {t.trip_type === 'morning_pickup' ? ' 🌅 Sáng' : ' 🌇 Chiều'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                👨‍🎓 {t.boarded_count}/{t.total_students} học sinh lên xe
              </p>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
        {data.data.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📂</p>
            <p>Chưa có lịch sử</p>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-3 mt-5">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn-secondary">← Trước</button>
        <span className="flex items-center text-sm text-gray-600 px-3">Trang {page}</span>
        <button onClick={() => setPage(p => p+1)} disabled={data.data.length < 15} className="btn-secondary">Sau →</button>
      </div>
    </div>
  );
}
