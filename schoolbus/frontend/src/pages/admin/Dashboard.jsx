import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminApi } from '../../api';
import { StatCard, LoadingScreen, PageHeader } from '../../components/common';

const COLORS = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const pieData = [
    { name: 'Học sinh',   value: stats?.total_students || 0 },
    { name: 'Tài xế',     value: stats?.total_drivers || 0 },
    { name: 'Phụ huynh',  value: stats?.total_parents || 0 },
  ];

  const tripData = [
    { name: 'Chờ',         value: (stats?.trips_today || 0) - (stats?.trips_running || 0) - (stats?.completed_today || 0) },
    { name: 'Đang chạy',   value: stats?.trips_running || 0 },
    { name: 'Hoàn thành',  value: stats?.completed_today || 0 },
  ];

  return (
    <div>
      <PageHeader title="Tổng quan hệ thống" subtitle={`Hôm nay, ${new Date().toLocaleDateString('vi-VN')}`} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Học sinh"        value={stats?.total_students} icon="👨‍🎓" color="blue"   />
        <StatCard label="Xe hoạt động"    value={stats?.active_vehicles} icon="🚌" color="green"  />
        <StatCard label="Chuyến hôm nay"  value={stats?.trips_today}    icon="📋" color="yellow" />
        <StatCard label="Sự cố chưa xử lý" value={stats?.open_incidents} icon="🚨" color="red"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatCard label="Tài xế"         value={stats?.total_drivers}  icon="👨‍✈️" color="purple" />
        <StatCard label="Đang vận hành"  value={stats?.trips_running}  icon="🟢" color="green" sub="Chuyến đang chạy" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Phân bố người dùng</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Trạng thái chuyến hôm nay</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tripData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
