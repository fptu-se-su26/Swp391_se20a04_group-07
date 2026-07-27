// src/pages/manager/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { managerApi } from '../../api';
import { StatCard, LoadingScreen, PageHeader, StatusBadge } from '../../components/common';
import dayjs from 'dayjs';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    managerApi.getOverview().then(r => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingScreen />;
  const running = data?.trips?.filter(t => t.status === 'in_progress') || [];
  return (
    <div>
      <PageHeader title="Bảng điều khiển quản lý" subtitle={dayjs().format('dddd, DD/MM/YYYY')} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Chuyến hôm nay" value={data?.trips?.length} icon="📋" color="blue" />
        <StatCard label="Đang vận hành"  value={running.length}       icon="🟢" color="green" />
        <StatCard label="Xe hoạt động"  value={data?.vehicles?.filter(v=>v.status==='active').length} icon="🚌" color="yellow" />
        <StatCard label="Xe bảo trì"    value={data?.vehicles?.filter(v=>v.status==='maintenance').length} icon="🔧" color="red" />
      </div>
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">Chuyến xe đang chạy</h3>
        {running.length === 0 ? <p className="text-gray-400 text-sm">Không có chuyến nào đang chạy</p> : (
          <div className="space-y-2">
            {running.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-green-50 rounded-lg px-4 py-2">
                <div>
                  <p className="font-medium text-sm">{t.Route?.route_name}</p>
                  <p className="text-xs text-gray-500">Tài xế: {t.driver?.full_name} · {t.driver?.phone}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
