import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { parentApi } from '../../api';
import { useSocket } from '../../context';
import { PageHeader, LoadingScreen } from '../../components/common';
import L from 'leaflet';
import toast from 'react-hot-toast';

const busIcon  = L.divIcon({ className:'', html:'<div style="font-size:32px;filter:drop-shadow(2px 2px 4px rgba(0,0,0,0.3))">🚌</div>', iconSize:[36,36], iconAnchor:[18,18] });
const stopIcon = L.divIcon({ className:'', html:'<div style="font-size:20px">📍</div>', iconSize:[24,24], iconAnchor:[12,12] });

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => { if (position) map.flyTo(position, 16, { duration: 1 }); }, [position]);
  return null;
}

export default function ParentTracking() {
  const socket = useSocket();
  const [children, setChildren]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [tripData, setTripData]   = useState(null);
  const [busPos, setBusPos]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const watchingTrip = useRef(null);

  useEffect(() => {
    parentApi.getChildren()
      .then(r => { setChildren(r.data.data); if (r.data.data[0]) setSelected(r.data.data[0]); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setBusPos(null);
    setTripData(null);
    parentApi.getCurrentTrip(selected.id)
      .then(r => {
        if (!r.data.data) return;
        const { trip, lastLocation } = r.data.data;
        setTripData(trip);
        if (lastLocation) setBusPos([lastLocation.latitude, lastLocation.longitude]);
        // Subscribe socket room
        if (socket && trip) {
          if (watchingTrip.current) socket.emit('client:unwatch_trip', { tripId: watchingTrip.current });
          socket.emit('client:watch_trip', { tripId: trip.id });
          watchingTrip.current = trip.id;
        }
      }).catch(console.error);
  }, [selected]);

  useEffect(() => {
    if (!socket) return;
    socket.on('bus:location', ({ tripId, latitude, longitude }) => {
      if (tripData?.id === tripId) setBusPos([latitude, longitude]);
    });
    socket.on('notification:new', (notif) => toast(notif.title, { icon: '🔔', duration: 5000 }));
    return () => { socket.off('bus:location'); socket.off('notification:new'); };
  }, [socket, tripData]);

  if (loading) return <LoadingScreen />;

  const stops = tripData?.Route?.RouteStops || [];
  const defaultCenter = busPos || [10.7769, 106.7009];

  return (
    <div>
      <PageHeader title="Theo dõi xe buýt" subtitle="Real-time GPS" />

      {/* Child selector */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                ${selected?.id === c.id ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
              👨‍🎓 {c.full_name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-md border" style={{ height: '450px' }}>
          <MapContainer center={defaultCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            {busPos && (
              <>
                <Marker position={busPos} icon={busIcon}>
                  <Popup>
                    <div className="text-sm font-medium">🚌 {tripData?.Route?.route_name}</div>
                    <div className="text-xs text-gray-500">👨‍✈️ {tripData?.driver?.full_name}</div>
                  </Popup>
                </Marker>
                <Circle center={busPos} radius={50} pathOptions={{ color:'#3b82f6', fillOpacity:0.1 }} />
                <FlyToMarker position={busPos} />
              </>
            )}
            {stops.map(s => s.latitude && (
              <Marker key={s.id} position={[parseFloat(s.latitude), parseFloat(s.longitude)]} icon={stopIcon}>
                <Popup><div className="text-xs"><strong>{s.stop_name}</strong><br/>{s.address}</div></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Info panel */}
        <div className="space-y-3">
          {tripData ? (
            <>
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-green-700 text-sm">Đang cập nhật live</span>
                </div>
                <p className="text-sm font-semibold">{tripData.Route?.route_name}</p>
                <p className="text-xs text-gray-500 mt-1">👨‍✈️ {tripData.driver?.full_name}</p>
                <p className="text-xs text-gray-500">📞 {tripData.driver?.phone}</p>
                <p className="text-xs text-gray-500 mt-1">
                  👨‍🎓 {tripData.boarded_count}/{tripData.total_students} học sinh đã lên xe
                </p>
              </div>

              {/* Route stops */}
              <div className="card">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Các điểm dừng</h4>
                <div className="space-y-2">
                  {stops.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-700">{s.stop_name}</p>
                        <p className="text-gray-400">{s.estimated_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Child attendance */}
              {tripData.TripAttendances?.length > 0 && (
                <div className="card bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-sm text-blue-700 mb-1">Trạng thái con</h4>
                  {tripData.TripAttendances.map(att => (
                    <div key={att.id} className="text-sm">
                      <span className={`font-medium ${
                        att.status === 'boarded' ? 'text-green-600' :
                        att.status === 'absent'  ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {att.status === 'boarded' ? '✅ Đã lên xe' :
                         att.status === 'absent'  ? '❌ Vắng mặt' :
                         att.status === 'dropped_off' ? '🏠 Đã xuống xe' : '⏳ Đang chờ'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-10">
              <div className="text-4xl mb-3">🚌</div>
              <p className="text-gray-500 text-sm">
                {selected ? 'Không có chuyến nào đang chạy' : 'Chọn học sinh để theo dõi'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
