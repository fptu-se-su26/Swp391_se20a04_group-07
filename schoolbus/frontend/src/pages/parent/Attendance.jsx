import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import dayjs from 'dayjs';

export default function ParentAttendance() {
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState(null);
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear]   = useState(dayjs().year());

  useEffect(() => {
    parentApi.getChildren()
      .then(r => { setChildren(r.data.data); if (r.data.data[0]) setSelected(r.data.data[0].id); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    parentApi.getAttendanceHistory(selected, { month, year })
      .then(r => setRecords(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected, month, year]);


  const stats = {
    total:    records.length,
    boarded:  records.filter(r => r.status === 'boarded').length,
    absent:   records.filter(r => r.status === 'absent').length,
    dropped:  records.filter(r => r.status === 'dropped_off').length,
  };

  
  return (
    <div>
      <PageHeader title="Lịch sử điểm danh" />

      {/* Filters */}
      <div className="card mb-4 flex flex-wrap gap-3 items-end">
        {children.length > 1 && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Học sinh</label>
            <select className="input w-48" value={selected} onChange={e => setSelected(e.target.value)}>
              {children.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Tháng</label>
          <select className="input w-28" value={month} onChange={e => setMonth(+e.target.value)}>
            {[...Array(12)].map((_,i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Năm</label>
          <input type="number" className="input w-24" value={year} onChange={e => setYear(+e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label:'Tổng chuyến', value: stats.total,   color:'blue',   icon:'📋' },
          { label:'Đã lên xe',   value: stats.boarded, color:'green',  icon:'✅' },
          { label:'Vắng mặt',    value: stats.absent,  color:'red',    icon:'❌' },
          { label:'Đã xuống xe', value: stats.dropped, color:'yellow', icon:'🏠' },
        ].map(s => (
          <div key={s.label} className={`card text-center border-${s.color}-100 bg-${s.color}-50`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Records table */}
      {loading ? <LoadingScreen /> : (
        <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {['Ngày', 'Loại chuyến', 'Tuyến đường', 'Tài xế', 'Trạng thái', 'Giờ lên xe', 'Giờ xuống xe'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{dayjs(r.scheduled_date).format('DD/MM/YYYY')}</td>
                  <td className="table-cell text-xs">{r.trip_type === 'morning_pickup' ? '🌅 Sáng' : '🌇 Chiều'}</td>
                  <td className="table-cell text-gray-600">{r.route_name}</td>
                  <td className="table-cell text-gray-600">{r.driver_name}</td>
                  <td className="table-cell"><StatusBadge status={r.status} /></td>
                  <td className="table-cell text-xs text-gray-400">{r.boarded_at ? dayjs(r.boarded_at).format('HH:mm') : '—'}</td>
                  <td className="table-cell text-xs text-gray-400">{r.dropped_at ? dayjs(r.dropped_at).format('HH:mm') : '—'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}
