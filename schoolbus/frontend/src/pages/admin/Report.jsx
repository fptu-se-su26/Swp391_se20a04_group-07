// src/pages/admin/Report.jsx
import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { PageHeader, LoadingScreen } from '../../components/common';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Report() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(() => { const d=new Date(); d.setDate(1); return d.toISOString().split('T')[0]; });
  const [end, setEnd] = useState(() => new Date().toISOString().split('T')[0]);

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi.getReport({ startDate:start, endDate:end }); setData(r.data.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <PageHeader title="Báo cáo điểm danh" />
      <div className="card mb-5 flex gap-3 items-end">
        <div><label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
          <input type="date" className="input" value={start} onChange={e=>setStart(e.target.value)} /></div>
        <div><label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
          <input type="date" className="input" value={end} onChange={e=>setEnd(e.target.value)} /></div>
        <button onClick={fetch} className="btn-primary">Xem báo cáo</button>
      </div>
      {loading ? <LoadingScreen /> : (
        <div className="card">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="scheduled_date" tickFormatter={d => new Date(d).toLocaleDateString('vi-VN')} tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} />
              <Tooltip labelFormatter={d => new Date(d).toLocaleDateString('vi-VN')} />
              <Bar dataKey="boarded" name="Đã lên xe" fill="#22c55e" radius={[3,3,0,0]} stackId="a"/>
              <Bar dataKey="absent"  name="Vắng"      fill="#ef4444" radius={[3,3,0,0]} stackId="a"/>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50">
                {['Ngày','Loại','Tổng','Đã lên','Vắng','Chờ'].map(h=><th key={h} className="table-header">{h}</th>)}
              </tr></thead>
              <tbody>
                {data.map((row,i) => (
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
