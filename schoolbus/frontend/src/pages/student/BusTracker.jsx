import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { studentApi } from '../../api';
import { useSocket } from '../../context';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import L from 'leaflet';

const busIcon = L.divIcon({ className:'', html:'<div style="font-size:32px">🚌</div>', iconSize:[36,36], iconAnchor:[18,18] });

// ✅ Guard: chỉ FlyTo khi tọa độ hợp lệ
function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (
      position &&
      Array.isArray(position) &&
      position.length === 2 &&
      typeof position[0] === 'number' && !isNaN(position[0]) &&
      typeof position[1] === 'number' && !isNaN(position[1])
    ) {
      map.flyTo(position, 16, { duration: 1 });
    }
  }, [position]);
  return null;
}

// ✅ Kiểm tra tọa độ hợp lệ (giống Tracking.jsx bên Parent)
const isValidLatLng = (pos) =>
  pos &&
  Array.isArray(pos) &&
  pos.length === 2 &&
  typeof pos[0] === 'number' && !isNaN(pos[0]) && pos[0] !== 0 &&
  typeof pos[1] === 'number' && !isNaN(pos[1]) && pos[1] !== 0;

// ✅ Default center: TP.Đà Nẵng
const DEFAULT_CENTER = [16.0544, 108.2022];

export default function StudentBusTracker() {
  const socket = useSocket();
  const [trip, setTrip]     = useState(null);
  const [busPos, setBusPos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getCurrentTrip()
      .then(r => {
        setTrip(r.data.data);
        if (r.data.data && socket) {
          socket.emit('client:watch_trip', { tripId: r.data.data.id });
        }
      }).catch(console.error).finally(() => setLoading(false));
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('bus:location', ({ tripId, latitude, longitude }) => {
      // ✅ Chỉ nhận nếu đúng tripId đang theo dõi (nếu server có gửi tripId)
      if (trip && tripId && trip.id !== tripId) return;

      // ✅ Validate trước khi update, tránh Invalid LatLng crash
      const lat = +latitude;
      const lng = +longitude;
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        setBusPos([lat, lng]);
      }
    });
    return () => socket.off('bus:location');
  }, [socket, trip]);

  const myAtt = trip?.TripAttendances?.[0];
  // ✅ Center an toàn: dùng busPos nếu hợp lệ, fallback về DEFAULT_CENTER
  const center = isValidLatLng(busPos) ? busPos : DEFAULT_CENTER;

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Theo dõi xe buýt" subtitle="Xem vị trí xe (chỉ đọc)" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border shadow-sm" style={{ height: 420 }}>
          <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* ✅ Chỉ render Marker khi busPos hợp lệ */}
            {isValidLatLng(busPos) && (
              <>
                <Marker position={busPos} icon={busIcon}>
                  <Popup><strong>{trip?.Route?.route_name}</strong></Popup>
                </Marker>
                <FlyToMarker position={busPos} />
              </>
            )}
          </MapContainer>
        </div>
        <div className="space-y-3">
          {trip ? (
            <>
              <div className="card bg-teal-50 border-teal-200">
                <p className="font-semibold text-teal-700">{trip.Route?.route_name}</p>
                <p className="text-xs text-gray-500 mt-1">👨‍✈️ {trip.driver?.full_name}</p>
                <p className="text-xs text-gray-500">📞 {trip.driver?.phone}</p>
                {myAtt && <div className="mt-2"><StatusBadge status={myAtt.status} /></div>}
              </div>
              {isValidLatLng(busPos) ? (
                <div className="card bg-green-50 border-green-200 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm text-green-700 font-medium">GPS đang cập nhật</p>
                </div>
              ) : (
                <div className="card bg-gray-50 text-center py-4 text-gray-400 text-sm">Chờ GPS từ xe...</div>
              )}
              <div className="card">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase">Điểm dừng</p>
                {trip.Route?.RouteStops?.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2 py-1.5 text-sm border-b last:border-0">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">{i+1}</span>
                    <span className="text-gray-700">{s.stop_name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🚌</p>
              <p>Không có chuyến nào đang chạy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
