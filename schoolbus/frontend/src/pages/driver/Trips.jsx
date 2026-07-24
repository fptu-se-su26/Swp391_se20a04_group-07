import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../../api';
import { PageHeader, LoadingScreen, StatusBadge, ConfirmDialog } from '../../components/common';
import { useSocket } from '../../context';
import toast from 'react-hot-toast';

// ── Format giờ an toàn ────────────────────────────────────────
// Backend có thể trả scheduled_start dạng "08:00:00" (TIME thuần)
// hoặc dạng ISO datetime "1970-01-01T08:00:00.000Z" (khi Sequelize
// serialize cột TIME thành Date object ở mốc epoch 1970-01-01).
// Hàm này lấy đúng HH:MM trong cả 2 trường hợp, không dùng new Date()
// để tránh bị lệch giờ do đổi múi giờ.
const formatTime = (val) => {
  if (!val) return '—';
  const str = String(val);
  const timePart = str.includes('T') ? str.split('T')[1] : str;
  return timePart ? timePart.slice(0, 5) : '—';
};

export default function DriverTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    try { const {data} = await driverApi.getTodayTrips(); setTrips(data.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleStart = async (trip) => {
    try {
      await driverApi.startTrip(trip.id);
      socket?.emit('driver:trip_started', { tripId: trip.id });
      toast.success('Bắt đầu chuyến!');
      navigate('/driver/active', { state: { tripId: trip.id } });
    } catch {}
  };

  const handleCancel = async (id) => {
    try { await driverApi.cancelTrip(id, 'Hủy bởi tài xế'); toast.success('Đã hủy chuyến'); fetch(); } catch {}
  };

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Chuyến hôm nay" subtitle={new Date().toLocaleDateString('vi-VN')}
        action={<button onClick={fetch} className="btn-secondary text-sm">🔄 Làm mới</button>} />
      {trips.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p>Không có chuyến nào hôm nay</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map(t => (
            <div key={t.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t.Route?.route_name}</h3>
                  <p className="text-sm text-gray-500">🚌 {t.Vehicle?.plate_number} · {t.trip_type === 'morning_pickup' ? '🌅 Sáng' : '🌇 Chiều'}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <p>⏰ Giờ xuất phát: <strong>{formatTime(t.scheduled_start)}</strong></p>
                <p>👨‍🎓 Học sinh: <strong>{t.total_students} em</strong></p>
              </div>
              {/* Stops */}
              {t.Route?.RouteStops?.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mb-4 text-xs">
                  {t.Route.RouteStops.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">📍 {s.stop_name}</span>
                      {i < t.Route.RouteStops.length - 1 && <span className="text-gray-300">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {t.status === 'pending' && (
                  <>
                    <button onClick={() => handleStart(t)} className="btn-success flex-1">🚀 Bắt đầu chuyến</button>
                    <button onClick={() => setConfirm(t)} className="btn-danger">Hủy</button>
                  </>
                )}
                {t.status === 'in_progress' && (
                  <button onClick={() => navigate('/driver/active', { state: { tripId: t.id } })} className="btn-primary flex-1">
                    📍 Tiếp tục điểm danh
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => handleCancel(confirm?.id)}
        title="Hủy chuyến" message="Bạn có chắc muốn hủy chuyến này?" danger />
    </div>
  );
}
