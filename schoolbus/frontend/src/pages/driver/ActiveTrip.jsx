import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { driverApi } from '../../api';
import { StatusBadge, LoadingScreen } from '../../components/common';
import { useSocket } from '../../context';
import toast from 'react-hot-toast';

export default function ActiveTrip() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const socket    = useSocket();
  const tripId    = state?.tripId;
  const gpsRef    = useRef(null);

  const [trip, setTrip]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [location, setLocation] = useState(null);
  const [incident, setIncident] = useState(false);
  const [incForm, setIncForm]   = useState({ type:'other', severity:'low', description:'' });

  const fetchTrip = useCallback(async () => {
    if (!tripId) return navigate('/driver');
    try { const {data} = await driverApi.getTripDetail(tripId); setTrip(data.data); }
    catch { navigate('/driver'); } finally { setLoading(false); }
  }, [tripId]);

  useEffect(() => { fetchTrip(); }, [fetchTrip]);

  // Start GPS broadcasting
  useEffect(() => {
    if (!socket || !tripId) return;
    gpsRef.current = setInterval(() => {
      navigator.geolocation?.getCurrentPosition((pos) => {
        const { latitude, longitude, speed, heading, accuracy } = pos.coords;
        setLocation({ latitude, longitude, speed: speed ? speed * 3.6 : null }); // m/s -> km/h
        socket.emit('driver:location', { tripId, latitude, longitude, speed: speed ? speed * 3.6 : null, heading, accuracy });
      }, (err) => {
        console.error('Geolocation error:', err.message);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 });
    }, 5000);
    return () => { if (gpsRef.current) clearInterval(gpsRef.current); };
  }, [socket, tripId]);

  const updateStatus = async (studentId, status) => {
    try {
      await driverApi.updateAttendance(tripId, studentId, { status });
      socket?.emit('driver:attendance_updated', { tripId, studentId, status });
      toast.success(`Cập nhật: ${status}`);
      fetchTrip();
    } catch {}
  };

  const completeTrip = async () => {
    try {
      await driverApi.completeTrip(tripId);
      socket?.emit('driver:trip_completed', { tripId });
      if (gpsRef.current) clearInterval(gpsRef.current);
      toast.success('Đã kết thúc chuyến!');
      navigate('/driver');
    } catch {}
  };

  const submitIncident = async () => {
    try { await driverApi.reportIncident({ trip_id: tripId, ...incForm }); toast.success('Đã báo cáo sự cố'); setIncident(false); } catch {}
  };

  const statusBtns = [
    { status:'boarded',    label:'✅ Lên xe', cls:'btn-success' },
    { status:'absent',     label:'❌ Vắng',   cls:'btn-danger' },
    { status:'dropped_off',label:'🏠 Xuống',  cls:'btn-secondary' },
  ];

  if (loading) return <LoadingScreen />;
  if (!trip)   return null;

  const students = trip.TripAttendances || [];
  const boardedCount = students.filter(s => s.status === 'boarded').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{trip.Route?.route_name}</h1>
          <p className="text-sm text-gray-500">🚌 {trip.Vehicle?.plate_number} · {trip.trip_type === 'morning_pickup' ? '🌅 Sáng' : '🌇 Chiều'}</p>
        </div>
        <span className="badge-green text-sm px-3 py-1">Đang chạy</span>
      </div>

      {/* GPS status */}
      <div className="card mb-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">GPS đang hoạt động</span>
          </div>
          {location && <span className="text-xs text-green-600">{location.speed?.toFixed(1) || 0} km/h</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center py-3 bg-blue-50 border-blue-100">
          <p className="text-2xl font-bold text-blue-700">{students.length}</p>
          <p className="text-xs text-blue-600">Tổng HS</p>
        </div>
        <div className="card text-center py-3 bg-green-50 border-green-100">
          <p className="text-2xl font-bold text-green-700">{boardedCount}</p>
          <p className="text-xs text-green-600">Đã lên xe</p>
        </div>
        <div className="card text-center py-3 bg-red-50 border-red-100">
          <p className="text-2xl font-bold text-red-700">{students.filter(s=>s.status==='absent').length}</p>
          <p className="text-xs text-red-600">Vắng mặt</p>
        </div>
      </div>

      {/* Student list */}
      <div className="card mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Danh sách học sinh</h3>
        <div className="space-y-2">
          {students.map(att => (
            <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                  {att.student?.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{att.student?.full_name}</p>
                  <StatusBadge status={att.status} />
                </div>
              </div>
              {att.status === 'waiting' && (
                <div className="flex gap-1">
                  {statusBtns.slice(0,2).map(btn => (
                    <button key={btn.status} onClick={() => updateStatus(att.student_id, btn.status)}
                      className={`${btn.cls} text-xs py-1 px-2`}>{btn.label}</button>
                  ))}
                </div>
              )}
              {att.status === 'boarded' && (
                <button onClick={() => updateStatus(att.student_id, 'dropped_off')} className="btn-secondary text-xs py-1 px-2">🏠 Đã xuống</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => setIncident(true)} className="btn-secondary flex-1">🚨 Báo sự cố</button>
        <button onClick={completeTrip} className="btn-primary flex-1 bg-green-600 hover:bg-green-700">✅ Kết thúc chuyến</button>
      </div>

      {/* Incident modal */}
      {incident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="font-semibold text-lg mb-4">🚨 Báo cáo sự cố</h3>
            <div className="space-y-3">
              <select className="input" value={incForm.type} onChange={e=>setIncForm(f=>({...f,type:e.target.value}))}>
                <option value="vehicle_breakdown">Hỏng xe</option>
                <option value="accident">Tai nạn</option>
                <option value="traffic">Kẹt xe</option>
                <option value="student_issue">Vấn đề học sinh</option>
                <option value="other">Khác</option>
              </select>
              <select className="input" value={incForm.severity} onChange={e=>setIncForm(f=>({...f,severity:e.target.value}))}>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
                <option value="critical">Nghiêm trọng</option>
              </select>
              <textarea className="input" rows={3} placeholder="Mô tả chi tiết..." value={incForm.description}
                onChange={e=>setIncForm(f=>({...f,description:e.target.value}))} />
              <div className="flex gap-3">
                <button onClick={() => setIncident(false)} className="btn-secondary flex-1">Hủy</button>
                <button onClick={submitIncident} className="btn-danger flex-1">Gửi báo cáo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
