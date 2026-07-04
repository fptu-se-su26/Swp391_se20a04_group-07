// src/pages/manager/Fleet.jsx - Live GPS tracking map
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSocket } from '../../context';
import { managerApi } from '../../api';
import { PageHeader, StatusBadge } from '../../components/common';
import L from 'leaflet';

const busIcon = L.divIcon({ className:'', html:'<div style="font-size:28px;filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.4))">🚌</div>', iconSize:[32,32], iconAnchor:[16,16] });

// Vị trí mặc định khi chưa có xe nào (trung tâm VN) — chỉ dùng khi thật sự không có dữ liệu
const DEFAULT_CENTER = [16.0544, 108.2022]; // Đà Nẵng, có thể đổi theo khu vực hoạt động chính

// ── Component điều khiển map từ bên ngoài ──────────────────────
// MapContainer chỉ nhận `center` lúc khởi tạo, không tự phản ứng khi
// state thay đổi -> cần dùng useMap() để gọi setView/flyTo thủ công.
function MapController({ positions, selectedTripId }) {
  const map = useMap();
  const hasAutoCentered = useRef(false);

  // Tự động center vào xe đầu tiên có vị trí, chỉ 1 lần khi vừa có dữ liệu
  // (tránh việc map tự nhảy về vị trí xe mỗi lần re-render/F5)
  useEffect(() => {
    const posList = Object.values(positions);
    if (!hasAutoCentered.current && posList.length > 0) {
      map.setView([posList[0].lat, posList[0].lng], 15);
      hasAutoCentered.current = true;
    }
  }, [positions, map]);

  // Bay tới vị trí xe được chọn khi click vào danh sách tài xế
  useEffect(() => {
    if (selectedTripId && positions[selectedTripId]) {
      const { lat, lng } = positions[selectedTripId];
      map.flyTo([lat, lng], 16, { duration: 1 });
    }
  }, [selectedTripId, positions, map]);

  return null;
}

export default function Fleet() {
  const socket = useSocket();
  const [trips, setTrips] = useState([]);
  const [positions, setPositions] = useState({});
  const [selectedTripId, setSelectedTripId] = useState(null);
  const markerRefs = useRef({});

  useEffect(() => {
    managerApi.getTripsToday().then(r => setTrips(r.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('manager:watch_all');
    socket.on('fleet:current_positions', (data) => setPositions(data));
    socket.on('bus:location', ({ tripId, latitude, longitude, speed }) => {
      setPositions(p => ({ ...p, [tripId]: { lat: latitude, lng: longitude, speed } }));
    });
    return () => { socket.off('fleet:current_positions'); socket.off('bus:location'); };
  }, [socket]);

  return (
    <div>
      <PageHeader title="Theo dõi đội xe" subtitle="Live GPS tracking" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-96 rounded-xl overflow-hidden shadow-sm border">
          <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height:'100%', width:'100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            <MapController positions={positions} selectedTripId={selectedTripId} />
            {Object.entries(positions).map(([tripId, pos]) => {
              const trip = trips.find(t => t.id === tripId);
              return (
                <Marker
                  key={tripId}
                  position={[pos.lat, pos.lng]}
                  icon={busIcon}
                  ref={(el) => { if (el) markerRefs.current[tripId] = el; }}
                  eventHandlers={{ click: () => setSelectedTripId(tripId) }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{trip?.Route?.route_name || 'Xe đang chạy'}</p>
                      <p>🏎️ {pos.speed?.toFixed(1) || 0} km/h</p>
                      <p>👨‍✈️ {trip?.driver?.full_name}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 text-sm">Chuyến đang chạy</h3>
          {trips.filter(t => t.status === 'in_progress').map(t => (
            <div
              key={t.id}
              onClick={() => {
                setSelectedTripId(t.id);
                // Mở popup của marker tương ứng sau khi map bay tới
                setTimeout(() => markerRefs.current[t.id]?.openPopup(), 350);
              }}
              className={`card p-3 border-l-4 cursor-pointer transition hover:shadow-md ${
                selectedTripId === t.id ? 'border-l-blue-500 bg-blue-50' : 'border-l-green-400'
              }`}
            >
              <p className="font-medium text-sm">{t.Route?.route_name}</p>
              <p className="text-xs text-gray-500">🚌 {t.Vehicle?.plate_number}</p>
              <p className="text-xs text-gray-500">👨‍✈️ {t.driver?.full_name}</p>
              {positions[t.id] && (
                <p className="text-xs text-green-600 mt-1">🟢 {positions[t.id].speed?.toFixed(1)} km/h</p>
              )}
            </div>
          ))}
          {trips.filter(t=>t.status==='in_progress').length === 0 && (
            <p className="text-sm text-gray-400">Không có xe nào đang chạy</p>
          )}
        </div>
      </div>
    </div>
  );
}
