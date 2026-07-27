import React, { useEffect, useState, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { studentApi } from '../../api';
import { useSocket } from '../../context';
import { PageHeader, LoadingScreen, StatusBadge } from '../../components/common';
import { useIsMobile } from '../../hooks/useIsMobile';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// ✅ Kiểm tra tọa độ hợp lệ (giống Tracking.jsx bên Parent)
const isValidLatLng = (pos) =>
  pos &&
  Array.isArray(pos) &&
  pos.length === 2 &&
  typeof pos[0] === 'number' && !isNaN(pos[0]) && pos[0] !== 0 &&
  typeof pos[1] === 'number' && !isNaN(pos[1]) && pos[1] !== 0;

// ✅ Default center: TP.Đà Nẵng
const DEFAULT_CENTER = { longitude: 108.2022, latitude: 16.0544 };

// ✅ Tính khoảng cách Haversine (km)
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

export default function StudentBusTracker() {
  const socket = useSocket();
  const mapRef = useRef(null);
  const [trip, setTrip]       = useState(null);
  const [busPos, setBusPos]   = useState(null); // [lat, lng]
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [viewState, setViewState] = useState({ ...DEFAULT_CENTER, zoom: 14 });

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

      // ✅ Validate trước khi update
      const lat = +latitude;
      const lng = +longitude;
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        setBusPos([lat, lng]);
      }
    });
    return () => socket.off('bus:location');
  }, [socket, trip]);

  // Hook check mobile
  const isMobile = useIsMobile();

  // Lấy dữ liệu điểm danh của học sinh
  const myAtt = trip?.TripAttendances?.[0];

  const [routeGeoJSON, setRouteGeoJSON] = useState(null);

  // Tính toán tuyến đường xe chạy (sẽ cập nhật qua API Directions Mapbox)
  const fetchRoute = React.useCallback(async (from, to) => {
    if (!isValidLatLng(from) || !isValidLatLng(to)) return;
    try {
      const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${from[1]},${from[0]};${to[1]},${to[0]}?${new URLSearchParams({ geometries: 'geojson', overview: 'full', access_token: MAPBOX_TOKEN })}`);
      const data = await res.json();
      const route = data.routes?.[0];
      if (route) {
        setRouteGeoJSON({ type: 'Feature', geometry: route.geometry });
      }
    } catch (err) {
      console.error('Lỗi khi tải đường đi:', err);
    }
  }, []);

  // Vị trí nhà học sinh
  const homePos = React.useMemo(() => {
    const lat = myAtt?.student?.home_lat;
    const lng = myAtt?.student?.home_lng;
    return isValidLatLng([lat, lng]) ? [lat, lng] : null;
  }, [myAtt]);

  const schoolPos = React.useMemo(() => {
    const stops = trip?.Route?.RouteStops;
    if (!stops?.length) return null;
    const last = stops[stops.length - 1];
    return (last?.latitude && last?.longitude) ? [+last.latitude, +last.longitude] : null;
  }, [trip]);

  useEffect(() => {
    if (!isValidLatLng(busPos)) return;
    if (myAtt?.status === 'boarded') {
      if (isValidLatLng(schoolPos)) {
        fetchRoute(busPos, schoolPos);
      }
    } else if (myAtt?.status === 'waiting' || !myAtt?.status) {
      if (isValidLatLng(homePos)) {
        fetchRoute(busPos, homePos);
      }
    } else {
      setRouteGeoJSON(null);
    }
  }, [busPos, myAtt?.status, homePos, schoolPos, fetchRoute]);

  if (loading) return <LoadingScreen />;

  const mapContent = (
    <>
      <style>{`
        @keyframes bus-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(59,130,246,.5), 0 3px 10px rgba(0,0,0,.15); }
          70%  { box-shadow: 0 0 0 12px rgba(59,130,246,0), 0 3px 10px rgba(0,0,0,.15); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0), 0 3px 10px rgba(0,0,0,.15); }
        }
      `}</style>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Đường đi của tuyến */}
        {routeGeoJSON && (
          <Source id="bus-route" type="geojson" data={routeGeoJSON}>
            <Layer id="bus-route-casing" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#1d4ed8', 'line-width': 10, 'line-opacity': 0.15 }} />
            <Layer id="bus-route-line" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.88 }} />
          </Source>
        )}

        {/* Biểu tượng nhà học sinh */}
        {homePos && (
          <Marker longitude={homePos[1]} latitude={homePos[0]} anchor="center">
            <div style={{ fontSize: 26, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,.3))', cursor: 'default' }}>🏠</div>
          </Marker>
        )}

        {/* Biểu tượng xe bus */}
        {isValidLatLng(busPos) && (
          <>
            <Marker
              longitude={busPos[1]}
              latitude={busPos[0]}
              anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); setShowPopup(true); }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute', width: 54, height: 54, borderRadius: '50%',
                  background: '#3b82f6', opacity: 0.25,
                  animation: 'bus-pulse 2.2s ease-out infinite',
                }} />
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: '#fff', border: `3px solid #3b82f6`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 14px rgba(59,130,246,0.35)`, fontSize: 20, position: 'relative',
                }}>🚌</div>
              </div>
            </Marker>

            {showPopup && (
              <Popup
                longitude={busPos[1]}
                latitude={busPos[0]}
                anchor="bottom"
                offset={32}
                onClose={() => setShowPopup(false)}
                closeOnClick={false}
              >
                <strong>{trip?.Route?.route_name}</strong>
              </Popup>
            )}
          </>
        )}
      </Map>
    </>
  );

  const infoContent = (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
      {trip ? (
        <>
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 p-4 rounded-2xl">
            <span className="text-3xl flex-shrink-0">🚌</span>
            <div className="min-w-0">
              <p className="font-bold text-teal-800 text-lg truncate">{trip.Route?.route_name}</p>
              <p className="text-xs text-teal-600 mt-0.5">Tuyến xe hiện tại của bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">👨‍✈️</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{trip.driver?.full_name}</p>
              <p className="text-xs text-gray-400 truncate">Tài xế chuyến đi</p>
            </div>
            {trip.driver?.phone && (
              <a href={`tel:${trip.driver.phone}`}
                className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition flex-shrink-0 shadow-sm"
                title={trip.driver.phone}>
                📞
              </a>
            )}
          </div>
          
          {myAtt && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Trạng thái điểm danh</span>
              <StatusBadge status={myAtt.status} />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-3">🚌</span>
          <p className="font-medium text-sm text-center">Không có chuyến nào đang chạy</p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col bg-gray-100 -m-4 -mb-6" style={{ zIndex: 0, height: 'calc(100vh - 120px)' }}>
        <div className="relative flex-shrink-0" style={{ height: '55%' }}>
          {mapContent}
          
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-1.5">
            <div className={`w-2 h-2 rounded-full ${isValidLatLng(busPos) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-[11px] font-semibold text-gray-600">{isValidLatLng(busPos) ? 'Live GPS' : 'Chờ tín hiệu'}</span>
          </div>

          {isValidLatLng(busPos) && (
            <button
              onClick={() => mapRef.current?.flyTo({ center: [busPos[1], busPos[0]], zoom: 16, duration: 800 })}
              className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur rounded-xl shadow px-3 py-2 text-xs font-semibold text-gray-700 flex items-center gap-1.5 hover:bg-white transition">
              🎯 Theo dõi xe
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col bg-white"
          style={{ borderRadius: '20px 20px 0 0', marginTop: '-16px', boxShadow: '0 -4px 24px rgba(0,0,0,.1)' }}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 bg-gray-300 rounded-full" />
          </div>
          {infoContent}
        </div>
      </div>
    );
  }

  // DESKTOP LAYOUT
  return (
    <div className="flex bg-white overflow-hidden shadow-sm border border-gray-200 -m-6" style={{ height: 'calc(100vh - 48px)' }}>
      {/* Map */}
      <div className="relative flex-1 min-w-0">
        {mapContent}

        {/* Top overlay: GPS */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-1.5">
            <div className={`w-2 h-2 rounded-full ${isValidLatLng(busPos) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-[11px] font-semibold text-gray-600">{isValidLatLng(busPos) ? 'Live GPS' : 'Chờ tín hiệu'}</span>
          </div>
        </div>

        {/* Focus button */}
        {isValidLatLng(busPos) && (
          <button
            onClick={() => mapRef.current?.flyTo({ center: [busPos[1], busPos[0]], zoom: 16, duration: 800 })}
            className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur rounded-xl shadow px-3 py-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5 hover:bg-white transition">
            🎯 Theo dõi xe
          </button>
        )}
      </div>

      {/* Right info sidebar */}
      <div className="w-80 xl:w-96 flex-shrink-0 border-l border-gray-100 bg-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚌</span>
            <h1 className="font-bold text-gray-900">Theo dõi xe buýt</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isValidLatLng(busPos) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-500">{isValidLatLng(busPos) ? 'Đang cập nhật trực tiếp' : 'Chờ tín hiệu GPS...'}</span>
          </div>
        </div>
        
        {infoContent}
      </div>
    </div>
  );
}
