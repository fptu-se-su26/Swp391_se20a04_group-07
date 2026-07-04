import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { studentApi } from '../../api';
import { useSocket } from '../../context';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import L from 'leaflet';

const busIcon = L.divIcon({ className:'', html:'<div style="font-size:32px">🚌</div>', iconSize:[36,36], iconAnchor:[18,18] });

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
    socket.on('bus:location', ({ latitude, longitude }) => setBusPos([latitude, longitude]));
    return () => socket.off('bus:location');
  }, [socket]);

  const myAtt = trip?.TripAttendances?.[0];
  const center = busPos || [10.7769, 106.7009];

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <PageHeader title="Theo dõi xe buýt" subtitle="Xem vị trí xe (chỉ đọc)" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border shadow-sm" style={{ height: 420 }}>
          <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {busPos && (
              <Marker position={busPos} icon={busIcon}>
                <Popup><strong>{trip?.Route?.route_name}</strong></Popup>
              </Marker>
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
              {busPos ? (
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
