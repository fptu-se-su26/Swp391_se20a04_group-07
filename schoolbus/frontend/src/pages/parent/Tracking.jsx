import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { parentApi } from '../../api';
import { useSocket } from '../../context';
import { LoadingScreen } from '../../components/common';
import { useIsMobile } from '../../hooks/useIsMobile';
import toast from 'react-hot-toast';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const DEFAULT_CENTER = { longitude: 108.2022, latitude: 16.0544 };

/* ── helpers ─────────────────────────────────────────────────────────────── */
const isValid = (pos) =>
  pos && Array.isArray(pos) && pos.length === 2 &&
  typeof pos[0] === 'number' && !isNaN(pos[0]) && pos[0] !== 0 &&
  typeof pos[1] === 'number' && !isNaN(pos[1]) && pos[1] !== 0;

function makeCircle([lat, lng], r = 40, pts = 32) {

  const dx = r / (111320 * Math.cos((lat * Math.PI) / 180)), dy = r / 110540;
  const coords = Array.from({ length: pts }, (_, i) => {
    const theta = (i / pts) * 2 * Math.PI;
    return [lng + dx * Math.cos(theta), lat + dy * Math.sin(theta)];
  });

  coords.push(coords[0]);
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] } };
}


/* ── Phase config ─────────────────────────────────────────────────────────── */
const PHASES = {
  waiting_pickup: { label: 'Đang đón học sinh', icon: '⏳', color: '#f59e0b', bgClass: 'bg-amber-500', textClass: 'text-amber-700', lightClass: 'bg-amber-50 border-amber-200' },
  to_school:      { label: 'Đang đến trường',   icon: '🚗', color: '#3b82f6', bgClass: 'bg-blue-500',  textClass: 'text-blue-700',  lightClass: 'bg-blue-50 border-blue-200'   },
  arrived:        { label: 'Đã đến trường',      icon: '🏫', color: '#22c55e', bgClass: 'bg-green-500', textClass: 'text-green-700', lightClass: 'bg-green-50 border-green-200' },
  absent:         { label: 'Vắng mặt hôm nay',  icon: '❌', color: '#ef4444', bgClass: 'bg-red-500',   textClass: 'text-red-700',   lightClass: 'bg-red-50 border-red-200'     },
};


function getPhase(tripData, childAtt) {
  if (!tripData) return null;
  if (tripData.status === 'completed') return 'arrived';
  if (!childAtt) return 'waiting_pickup';
  if (childAtt.status === 'boarded' || childAtt.status === 'dropped_off') return 'to_school';
  if (childAtt.status === 'absent') return 'absent';
  return 'waiting_pickup';
}

/* ── BusMarker with animated ring ────────────────────────────────────────── */
function BusMarker({ phase }) {
  const cfg = PHASES[phase] || PHASES.waiting_pickup;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute', width: 54, height: 54, borderRadius: '50%',
        background: cfg.color, opacity: 0.18,
        animation: 'bus-pulse 2.2s ease-out infinite',
      }} />
      <div style={{
        width: 42, height: 42, borderRadius: '50%',
        background: '#fff', border: `3px solid ${cfg.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 14px ${cfg.color}55`, fontSize: 20, position: 'relative',
      }}>🚌</div>
    </div>
  );
}

/* ── Child status card ────────────────────────────────────────────────────── */
function ChildStatusCard({ childAtt, selected }) {

  if (!childAtt) return null;
  const { status } = childAtt;
  const config = {
    boarded:     { icon: '✅', label: `${selected?.full_name} đã lên xe an toàn 🎉`, cls: 'bg-green-50 border-green-200 text-green-800' },
    dropped_off: { icon: '🏠', label: `${selected?.full_name} đã về đến nhà`,         cls: 'bg-blue-50 border-blue-200 text-blue-800'   },
    absent:      { icon: '❌', label: `${selected?.full_name} vắng mặt hôm nay`,      cls: 'bg-red-50 border-red-200 text-red-800'       },
    waiting:     { icon: '⏳', label: `Đang chờ xe đến đón ${selected?.full_name}`,   cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  };

  const c = config[status] || config.waiting;
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${c.cls}`}>
      <span className="text-2xl flex-shrink-0">{c.icon}</span>
      <p className="font-semibold text-sm leading-snug">{c.label}</p>
    </div>
  );
  
}

/* ── Stats row ────────────────────────────────────────────────────────────── */
function TripStats({ tripData, routeInfo, phase, childAtt }) {
  const cfg = PHASES[phase] || PHASES.waiting_pickup;
  
  let statusText = 'Đang chờ';
  let statusColor = 'text-amber-600';
  if (childAtt) {
    if (childAtt.status === 'boarded') { statusText = 'Đã lên xe'; statusColor = 'text-green-600'; }
    else if (childAtt.status === 'dropped_off') { statusText = 'Đã về nhà'; statusColor = 'text-blue-600'; }
    else if (childAtt.status === 'absent') { statusText = 'Vắng mặt'; statusColor = 'text-red-600'; }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gray-50 rounded-2xl p-3 text-center flex flex-col justify-center">
        <p className={`text-sm md:text-base font-bold truncate ${statusColor}`}>
          {statusText}
        </p>
        <p className="text-[10px] text-gray-400 font-medium mt-1">Trạng thái con</p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-3 text-center">
        <p className="text-lg font-bold text-blue-700">
          {routeInfo ? `${routeInfo.distanceKm} km` : '—'}
        </p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Còn lại</p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-3 text-center">
        <p className={`text-lg font-bold ${cfg.textClass}`}>
          {routeInfo ? `~${routeInfo.durationMin}p` : '—'}
        </p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">ETA</p>
      </div>
    </div>
  );
}

/* ── Driver info row ─────────────────────────────────────────────────────── */
function DriverRow({ tripData }) {
  if (!tripData?.driver?.full_name) return null;
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">👨‍✈️</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{tripData.driver.full_name}</p>
        <p className="text-xs text-gray-400 truncate">{tripData.Route?.route_name}</p>
      </div>
      {tripData.driver.phone && (
        <a href={`tel:${tripData.driver.phone}`}
          className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition flex-shrink-0"
          title={tripData.driver.phone}>
          📞
        </a>
      )}
    </div>
  );
}

/* ── Child chip selector ─────────────────────────────────────────────────── */
function ChildChip({ child, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
        active ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
      }`}>
      <span>👨‍🎓</span><span>{child.full_name}</span>
    </button>
  );
}

/* ── Shared Map content (used in both mobile & desktop) ───────────────────── */
function MapContent({ mapRef, viewState, setViewState, busPos, showBusPopup, setShowBusPopup,
  tripData, homePos, schoolPos, routeGeoJSON, accuracyCircle, phase }) {
  const cfg = PHASES[phase] || PHASES.waiting_pickup;
  return (
    <Map ref={mapRef} {...viewState} onMove={evt => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN} mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}>

      {/* Route polyline */}
      {routeGeoJSON && (
        <Source id="bus-route" type="geojson" data={routeGeoJSON}>
          <Layer id="bus-route-casing" type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{ 'line-color': '#1d4ed8', 'line-width': 10, 'line-opacity': 0.15 }} />
          <Layer id="bus-route-line" type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{ 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.88 }} />
        </Source>
      )}

      {/* Accuracy circle */}
      {accuracyCircle && (
        <Source id="acc-circle" type="geojson" data={accuracyCircle}>
          <Layer id="acc-fill" type="fill"
            paint={{ 'fill-color': cfg.color, 'fill-opacity': 0.1 }} />
        </Source>
      )}

      {/* Bus */}
      {isValid(busPos) && (
        <>
          <Marker longitude={busPos[1]} latitude={busPos[0]} anchor="center"
            onClick={e => { e.originalEvent.stopPropagation(); setShowBusPopup(v => !v); }}>
            <BusMarker phase={phase} />
          </Marker>
          {showBusPopup && (
            <Popup longitude={busPos[1]} latitude={busPos[0]} anchor="bottom" offset={32}
              onClose={() => setShowBusPopup(false)} closeOnClick={false}>
              <div className="text-sm min-w-[150px] py-0.5">
                <p className="font-bold text-gray-800">{tripData?.Route?.route_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">👨‍✈️ {tripData?.driver?.full_name}</p>
                <p className={`text-xs font-semibold mt-1 ${cfg.textClass}`}>{cfg.icon} {cfg.label}</p>
              </div>
            </Popup>
          )}
        </>
      )}

      {/* Home marker */}
      {isValid(homePos) && (
        <Marker longitude={homePos[1]} latitude={homePos[0]} anchor="center">
          <div style={{ fontSize: 26, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,.3))', cursor: 'default' }}>🏠</div>
        </Marker>
      )}

      {/* School marker */}
      {isValid(schoolPos) && (
        <Marker longitude={schoolPos[1]} latitude={schoolPos[0]} anchor="bottom">
          <div style={{ fontSize: 26, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,.3))' }}>🏫</div>
        </Marker>
      )}
    </Map>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE LAYOUT
   ─ Top ~44dvh: bản đồ
   ─ Bottom flex-1: info panel luôn hiển thị
   ═══════════════════════════════════════════════════════════════════════════ */
function MobileTrackingLayout({ children: ch, selected, onSelectChild,
  tripData, childAtt, busPos, routeInfo, phase, isLive, mapProps }) {
  const cfg = PHASES[phase] || PHASES.waiting_pickup;
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="flex flex-col bg-gray-100 -m-4 -mb-6" style={{ zIndex: 0, height: 'calc(100vh - 120px)' }}>
      {/* ── MAP ─────────────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ height: '55%' }}>
        <MapContent {...mapProps} />

        {/* Top left: phase badge overlay */}
        {tripData && phase && (
          <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-lg ${cfg.bgClass}`}>
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
          </div>
        )}

        {/* Top right: GPS live indicator */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-1.5">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-[11px] font-semibold text-gray-600">{isLive ? 'Live' : 'Chờ GPS'}</span>
        </div>

        {/* Focus bus button */}
        {isValid(busPos) && (
          <button
            onClick={() => mapProps.mapRef.current?.flyTo({ center: [busPos[1], busPos[0]], zoom: 16, duration: 800 })}
            className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur rounded-xl shadow px-3 py-2 text-xs font-semibold text-gray-700 flex items-center gap-1 hover:bg-white transition">
            🎯 Theo xe
          </button>
        )}
      </div>

      {/* ── INFO PANEL ─────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white"
        style={{ borderRadius: '22px 22px 0 0', marginTop: '-18px', boxShadow: '0 -6px 24px rgba(0,0,0,.1)' }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Child selector */}
        {ch.length > 1 && (
          <div className="flex-shrink-0 px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {ch.map(c => (
                <ChildChip key={c.id} child={c} active={selected?.id === c.id} onClick={() => onSelectChild(c)} />
              ))}
            </div>
          </div>
        )}

        {tripData ? (
          <>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 space-y-3 pb-2">
              {/* Child status card */}
              <ChildStatusCard childAtt={childAtt} selected={selected} />

              {/* Stats */}
              <TripStats tripData={tripData} routeInfo={routeInfo} phase={phase} childAtt={childAtt} />

              {/* Driver info (collapsible section) */}
              <button onClick={() => setDetailOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-2xl hover:bg-gray-100 transition">
                <span className="text-sm font-semibold text-gray-700">Chi tiết chuyến đi</span>
                <span className="text-gray-400 text-xs">{detailOpen ? '▲' : '▼'}</span>
              </button>

              {detailOpen && (
                <div className="space-y-2">
                  <DriverRow tripData={tripData} />
                  {selected?.home_address && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">🏠</span>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Điểm đón của {selected.full_name}</p>
                        <p className="text-sm text-gray-700">{selected.home_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pb-6">
            <span className="text-5xl mb-3">🚌</span>
            <p className="font-medium text-sm">
              {selected ? 'Không có chuyến nào đang chạy' : 'Chọn học sinh để theo dõi'}
            </p>
            <p className="text-xs mt-1 text-gray-300">Chuyến xe sẽ hiện khi bắt đầu</p>
          </div>
        )}

        {/* Bottom safe area */}
        <div className="flex-shrink-0" style={{ height: 'env(safe-area-inset-bottom, 12px)' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DESKTOP LAYOUT — map fullscreen + right info panel
   ═══════════════════════════════════════════════════════════════════════════ */
function DesktopTrackingLayout({ children: ch, selected, onSelectChild,
  tripData, childAtt, busPos, routeInfo, phase, isLive, mapProps }) {
  const cfg = PHASES[phase] || PHASES.waiting_pickup;

  return (
    <div className="flex bg-white overflow-hidden shadow-sm border border-gray-200 -m-6" style={{ height: 'calc(100vh - 48px)' }}>
      {/* Map */}
      <div className="relative flex-1 min-w-0">
        <MapContent {...mapProps} />

        {/* Top overlay: phase + GPS */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {tripData && phase && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow ${cfg.bgClass}`}>
              {cfg.icon} {cfg.label}
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-1.5">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-[11px] font-semibold text-gray-600">{isLive ? 'Live GPS' : 'Chờ tín hiệu'}</span>
          </div>
        </div>

        {/* Focus button */}
        {isValid(busPos) && (
          <button
            onClick={() => mapProps.mapRef.current?.flyTo({ center: [busPos[1], busPos[0]], zoom: 16, duration: 800 })}
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
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-500">{isLive ? 'Đang cập nhật trực tiếp' : 'Chờ tín hiệu GPS...'}</span>
          </div>
        </div>

        {/* Child selector */}
        {ch.length > 1 && (
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 flex-wrap">
              {ch.map(c => (
                <ChildChip key={c.id} child={c} active={selected?.id === c.id} onClick={() => onSelectChild(c)} />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
          {tripData ? (
            <>
              {/* Phase pill */}
              {phase && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border ${cfg.lightClass} ${cfg.textClass}`}>
                  {cfg.icon} {cfg.label}
                </div>
              )}

              <ChildStatusCard childAtt={childAtt} selected={selected} />
              <TripStats tripData={tripData} routeInfo={routeInfo} phase={phase} childAtt={childAtt} />
              <DriverRow tripData={tripData} />

              {selected?.home_address && (
                <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                  <span className="text-xl mt-0.5">🏠</span>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Điểm đón</p>
                    <p className="text-sm text-gray-700">{selected.home_address}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-3">🚌</span>
              <p className="font-medium text-sm text-center">
                {selected ? 'Không có chuyến nào đang chạy' : 'Chọn học sinh để theo dõi'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ParentTracking() {
  const socket   = useSocket();
  const mapRef   = useRef(null);
  const watchRef = useRef(null);
  const isMobile = useIsMobile();

  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [childAtt, setChildAtt] = useState(null);
  const [busPos, setBusPos]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showBusPopup, setShowBusPopup] = useState(false);

  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo]       = useState(null);
  const [viewState, setViewState] = useState({ ...DEFAULT_CENTER, zoom: 13 });

  /* ── load children ───────────────────────────────────────────────────── */
  useEffect(() => {
    parentApi.getChildren()
      .then(r => { setChildren(r.data.data); if (r.data.data[0]) setSelected(r.data.data[0]); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── load trip for selected child ────────────────────────────────────── */
  useEffect(() => {
    if (!selected) return;
    setBusPos(null); setTripData(null); setChildAtt(null);
    setRouteGeoJSON(null); setRouteInfo(null);

    parentApi.getCurrentTrip(selected.id).then(r => {
      if (!r.data.data) return;
      const { trip, lastLocation } = r.data.data;
      setTripData(trip);

      // Find attendance for this child
      const att = (trip.TripAttendances || []).find(
        a => a.student_id === selected.id || String(a.student_id) === String(selected.id)
      );
      setChildAtt(att || null);

      if (lastLocation?.latitude && !isNaN(+lastLocation.latitude)) {
        setBusPos([+lastLocation.latitude, +lastLocation.longitude]);
      }

      if (socket && trip) {
        if (watchRef.current) socket.emit('client:unwatch_trip', { tripId: watchRef.current });
        socket.emit('client:watch_trip', { tripId: trip.id });
        watchRef.current = trip.id;
      }
    }).catch(console.error);
  }, [selected]);

  /* ── socket ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!socket) return;
    socket.on('bus:location', ({ tripId, latitude, longitude }) => {
      if (tripData?.id === tripId) {
        const lat = +latitude, lng = +longitude;
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) setBusPos([lat, lng]);
      }
    });
    socket.on('attendance:updated', ({ tripId, studentId, status }) => {
      if (tripData?.id === tripId && childAtt && String(childAtt.student_id) === String(studentId)) {
        setChildAtt(prev => prev ? { ...prev, status } : prev);
        if (status === 'boarded') toast.success('🎉 Con đã lên xe an toàn!', { duration: 6000 });
      }
    });
    socket.on('trip:completed', ({ tripId }) => {
      if (tripData?.id === tripId) {
        setTripData(prev => prev ? { ...prev, status: 'completed' } : prev);
        toast.success('🏫 Con đã đến trường an toàn!', { duration: 6000 });
      }
    });
    socket.on('notification:new', n => toast(n.title, { icon: '🔔', duration: 5000 }));
    return () => { socket.off('bus:location'); socket.off('attendance:updated'); socket.off('trip:completed'); socket.off('notification:new'); };
  }, [socket, tripData, childAtt]);

  /* ── fly to bus ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (isValid(busPos) && mapRef.current) {
      mapRef.current.flyTo({ center: [busPos[1], busPos[0]], zoom: 15, duration: 1200 });
    }
  }, [busPos]);

  /* ── fetch route ─────────────────────────────────────────────────────── */
  const fetchRoute = useCallback(async (from, to) => {
    if (!isValid(from) || !isValid(to)) return;
    try {
      const res  = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${from[1]},${from[0]};${to[1]},${to[0]}?${new URLSearchParams({ geometries: 'geojson', overview: 'full', access_token: MAPBOX_TOKEN })}`);
      const data = await res.json();
      const route = data.routes?.[0];
      if (route) {
        setRouteGeoJSON({ type: 'Feature', geometry: route.geometry });
        setRouteInfo({ distanceKm: (route.distance / 1000).toFixed(1), durationMin: Math.round(route.duration / 60) });
      }
    } catch {}
  }, []);

  const schoolPos = useMemo(() => {
    const stops = tripData?.Route?.RouteStops;
    if (!stops?.length) return null;
    const last = stops[stops.length - 1];
    return (last?.latitude && last?.longitude) ? [+last.latitude, +last.longitude] : null;
  }, [tripData]);

  const phase = getPhase(tripData, childAtt);

  useEffect(() => {
    if (!isValid(busPos)) return;
    if (phase === 'to_school' && isValid(schoolPos)) fetchRoute(busPos, schoolPos);
    else if (phase === 'waiting_pickup') {
      const home = selected?.home_lat != null ? [+selected.home_lat, +selected.home_lng] : null;
      if (isValid(home)) fetchRoute(busPos, home);
    }
  }, [busPos, phase, schoolPos]);

  /* ── derived ─────────────────────────────────────────────────────────── */
  const accuracyCircle = useMemo(() => isValid(busPos) ? makeCircle(busPos, 40) : null, [busPos]);
  const homePos   = selected?.home_lat != null ? [+selected.home_lat, +selected.home_lng] : null;
  const isLive    = isValid(busPos);

  if (loading) return <LoadingScreen />;

  const mapProps = {
    mapRef, viewState, setViewState, busPos, showBusPopup, setShowBusPopup,
    tripData, homePos, schoolPos, routeGeoJSON, accuracyCircle, phase,
  };

  const layoutProps = {
    children: children, selected, onSelectChild: setSelected,
    tripData, childAtt, busPos, routeInfo, phase, isLive, mapProps,
  };

  return (
    <>
      <style>{`
        @keyframes bus-pulse {
          0%   { transform: scale(1);   opacity: .18; }
          60%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1);   opacity: 0;   }
        }
      `}</style>

      {isMobile
        ? <MobileTrackingLayout {...layoutProps} />
        : <DesktopTrackingLayout {...layoutProps} />
      }
    </>
  );
}
