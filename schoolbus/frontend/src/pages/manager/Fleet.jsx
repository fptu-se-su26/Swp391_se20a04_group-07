// src/pages/manager/Fleet.jsx - Live GPS tracking map (Mapbox)
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSocket } from '../../context';
import { managerApi } from '../../api';
import { PageHeader, StatusBadge } from '../../components/common';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Vị trí mặc định khi chưa có xe nào (Đà Nẵng) — chỉ dùng khi thật sự không có dữ liệu
const DEFAULT_CENTER = { longitude: 108.2022, latitude: 16.0544 };

export default function Fleet() {
  const socket = useSocket();
  const mapRef = useRef(null);
  const hasAutoCentered = useRef(false);
  const [trips, setTrips] = useState([]);
  const [positions, setPositions] = useState({});
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [popupTripId, setPopupTripId] = useState(null);

  const [viewState, setViewState] = useState({ ...DEFAULT_CENTER, zoom: 13 });

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

  // Tự động bay tới xe đầu tiên có vị trí, chỉ 1 lần khi vừa có dữ liệu
  // (tương đương useEffect + hasAutoCentered.current trong bản Leaflet cũ)
  useEffect(() => {
    const posList = Object.values(positions);
    if (!hasAutoCentered.current && posList.length > 0 && mapRef.current) {
      mapRef.current.flyTo({ center: [posList[0].lng, posList[0].lat], zoom: 15, duration: 800 });
      hasAutoCentered.current = true;
    }
  }, [positions]);

  // Bay tới vị trí xe được chọn khi click vào danh sách + mở popup sau khi bay xong
  const flyToTrip = useCallback((tripId) => {
    setSelectedTripId(tripId);
    const pos = positions[tripId];
    if (pos && mapRef.current) {
      mapRef.current.flyTo({ center: [pos.lng, pos.lat], zoom: 16, duration: 1000 });
      setTimeout(() => setPopupTripId(tripId), 350);
    }
  }, [positions]);

  const popupTrip = popupTripId ? trips.find(t => t.id === popupTripId) : null;
  const popupPos  = popupTripId ? positions[popupTripId] : null;

  return (
    <div>
      <PageHeader title="Theo dõi xe đưa đón" subtitle="GPS trực tuyến" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-96 rounded-xl overflow-hidden shadow-sm border">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            style={{ width: '100%', height: '100%' }}
          >
            {Object.entries(positions).map(([tripId, pos]) => (
              <Marker
                key={tripId}
                longitude={pos.lng}
                latitude={pos.lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedTripId(tripId);
                  setPopupTripId(tripId);
                }}
              >
                <div style={{ fontSize: 28, filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.4))', cursor: 'pointer' }}>
                  🚌
                </div>
              </Marker>
            ))}

            {popupTrip && popupPos && (
              <Popup
                longitude={popupPos.lng}
                latitude={popupPos.lat}
                anchor="bottom"
                onClose={() => setPopupTripId(null)}
                closeOnClick={false}
              >
                <div className="text-sm">
                  <p className="font-bold">{popupTrip.Route?.route_name || 'Xe đang chạy'}</p>
                  <p>🏎️ {popupPos.speed?.toFixed(1) || 0} km/h</p>
                  <p>👨‍✈️ {popupTrip.driver?.full_name}</p>
                </div>
              </Popup>
            )}
          </Map>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 text-sm">Chuyến xe đang hoạt động</h3>
          {trips.filter(t => t.status === 'in_progress').map(t => (
            <div
              key={t.id}
              onClick={() => flyToTrip(t.id)}
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
          {trips.filter(t => t.status === 'in_progress').length === 0 && (
            <p className="text-sm text-gray-400">Không có xe nào đang chạy</p>
          )}
        </div>
      </div>
    </div>
  );
}
