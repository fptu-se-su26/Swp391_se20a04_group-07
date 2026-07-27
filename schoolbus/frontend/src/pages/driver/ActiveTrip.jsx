import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { driverApi } from '../../api';
import { LoadingScreen } from '../../components/common';
import { useSocket } from '../../context';
import { useIsMobile } from '../../hooks/useIsMobile';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const DEFAULT_CENTER = { longitude: 108.2022, latitude: 16.0544 };

/* ── helpers ───────────────────────────────────────────────────────────── */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const STATUS = {
  waiting: { bg: '#f59e0b', border: '#d97706', ring: 'rgba(245,158,11,.5)', label: 'Chờ đón',  pill: 'bg-amber-100 text-amber-700 border-amber-200' },
  boarded: { bg: '#22c55e', border: '#16a34a', ring: 'rgba(34,197,94,.5)',  label: 'Đã đón',   pill: 'bg-green-100 text-green-700 border-green-200'  },
  absent:  { bg: '#ef4444', border: '#dc2626', ring: 'rgba(239,68,68,.5)',  label: 'Vắng mặt', pill: 'bg-red-100 text-red-700 border-red-200'         },
};
const s = (status) => STATUS[status] || STATUS.waiting;

/* ── Map Marker ──────────────────────────────────────────────────────────── */
function StudentMarker({ att, order, isNext }) {
  const { bg, border } = s(att.status);
  const icon = att.status === 'boarded' ? '✓' : att.status === 'absent' ? '✕' : order;
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: bg, border: `3px solid ${border}`,
      boxShadow: isNext ? `0 0 0 7px ${s(att.status).ring}, 0 3px 10px rgba(0,0,0,.28)` : '0 2px 8px rgba(0,0,0,.22)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
      animation: isNext ? 'pulse-ring 2s ease-out infinite' : 'none',
      transition: 'transform .2s',
    }}>{icon}</div>
  );
}

/* ── Progress bar ────────────────────────────────────────────────────────── */
function ProgressBar({ boarded, total }) {
  const pct = total > 0 ? Math.round((boarded / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold text-green-600">{pct}%</span>
    </div>
  );
}

/* ── Student Card (inline-expand accordion) ─────────────────────────────── */
function StudentCard({ att, order, dist, isSelected, routeInfo, routeLoading, navigatingTo,
  onSelect, onNavigate, onGoogleMaps, onBoard, onAbsent, isMobile }) {
  const cfg     = s(att.status);
  const icon    = att.status === 'boarded' ? '✓' : att.status === 'absent' ? '✕' : order;
  const isWait  = att.status === 'waiting';
  const isNav   = navigatingTo?.id === att.id;

  return (
    <div
      className={`transition-all duration-300 border-b border-gray-100 ${isSelected ? 'bg-white shadow-sm' : 'bg-white hover:bg-gray-50/70'}`}
      style={{ borderLeft: isSelected ? `3px solid ${cfg.bg}` : '3px solid transparent' }}
    >
      {/* ── Collapsed row ─────────────────────────── */}
      <button
        onClick={() => onSelect(isSelected ? null : att.id)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
          style={{ background: cfg.bg }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{att.student?.full_name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">
            {att.student?.home_address || 'Chưa có địa chỉ'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {dist != null && <span className="text-xs font-semibold text-gray-500">{dist.toFixed(1)} km</span>}
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${cfg.pill}`}>{cfg.label}</span>
        </div>
        <div className="text-gray-300 text-xs ml-1">
          {isSelected ? '▲' : '▼'}
        </div>
      </button>

      {/* ── Expanded detail ───────────────────────── */}
      {isSelected && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          {/* Info chips row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Phụ huynh</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{att.student?.parent_name || '—'}</p>
              <p className="text-xs text-gray-400 truncate">{att.student?.student_phone || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Khoảng cách & ETA</p>
              <p className="text-sm font-semibold text-gray-800">{dist != null ? `${dist.toFixed(1)} km` : '—'}</p>
              <p className="text-xs text-gray-400">
                {isNav && routeInfo ? `⏱ ~${routeInfo.durationMin} phút` : routeLoading ? '⏳ Đang tính...' : '—'}
              </p>
            </div>
          </div>

          {/* Address */}
          {att.student?.home_address && (
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
              <span className="text-sm mt-0.5 flex-shrink-0">📍</span>
              <p className="text-xs text-blue-800 leading-snug">{att.student.home_address}</p>
            </div>
          )}

          {/* Action buttons */}
          {isWait && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate(att)}
                  disabled={routeLoading || !att.student?.home_lat}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm disabled:opacity-50 transition"
                >
                  {routeLoading && isNav
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <span>🧭</span>}
                  Dẫn đường
                </button>
                <button
                  onClick={() => onGoogleMaps(att)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold text-sm transition"
                >
                  🗺️ Google Maps
                </button>
              </div>
              <button
                onClick={() => onBoard(att)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-base transition shadow shadow-green-200"
              >
                ✅ Điểm danh lên xe
              </button>
              <button
                onClick={() => onAbsent(att)}
                className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 font-semibold text-sm transition"
              >
                ❌ Đánh dấu vắng mặt
              </button>
            </div>
          )}

          {att.status === 'boarded' && (
            <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl py-2.5">
              <span className="text-base">✅</span>
              <span className="text-sm font-semibold text-green-700">Đã lên xe an toàn</span>
            </div>
          )}
          {att.status === 'absent' && (
            <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-xl py-2.5">
              <span className="text-base">❌</span>
              <span className="text-sm font-semibold text-red-700">Học sinh vắng mặt</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Incident Modal ──────────────────────────────────────────────────────── */
function IncidentModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ type: 'other', severity: 'low', description: '' });
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl px-5 pb-8 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">🚨 Báo cáo sự cố</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="space-y-3">
          <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="vehicle_breakdown">🔧 Hỏng xe</option>
            <option value="accident">🚗 Tai nạn</option>
            <option value="traffic">🚦 Kẹt xe</option>
            <option value="student_issue">👦 Vấn đề học sinh</option>
            <option value="other">📝 Khác</option>
          </select>
          <select className="input" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
            <option value="low">🟢 Thấp</option>
            <option value="medium">🟡 Trung bình</option>
            <option value="high">🔴 Cao</option>
            <option value="critical">🚨 Nghiêm trọng</option>
          </select>
          <textarea className="input" rows={3} placeholder="Mô tả chi tiết..."
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-secondary flex-1">Hủy</button>
            <button onClick={() => onSubmit(form)} className="btn-danger flex-1">🚨 Gửi báo cáo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RIGHT PANEL — Desktop sidebar
   ═══════════════════════════════════════════════════════════════════════════ */
function DesktopPanel({
  trip, students, sortedStudents, orderMap, distanceMap, selectedId, onSelectStudent,
  routeInfo, routeLoading, navigatingTo, onNavigate, onGoogleMaps, onBoard, onAbsent,
  onCancelNav, onCompleteTrip, onIncident,
}) {
  // sortedStudents: học sinh đã sắp xếp theo khoảng cách tăng dần
  const sorted  = sortedStudents || students;
  const boarded = students.filter(s => s.status === 'boarded').length;
  const waiting = students.filter(s => s.status === 'waiting').length;
  const absent  = students.filter(s => s.status === 'absent').length;

  const groups = [
    { key: 'waiting', items: sorted.filter(s => s.status === 'waiting') },
    { key: 'boarded', items: sorted.filter(s => s.status === 'boarded') },
    { key: 'absent',  items: sorted.filter(s => s.status === 'absent')  },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center text-white text-base flex-shrink-0">🚌</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{trip.Route?.route_name}</p>
            <p className="text-[11px] text-gray-400">🚍 {trip.Vehicle?.plate_number} · {trip.trip_type === 'morning_pickup' ? '🌅 Đón sáng' : '🌇 Trả chiều'}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-600">LIVE</span>
          </div>
        </div>
        <ProgressBar boarded={boarded} total={students.length} />
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {[
            { val: students.length, lbl: 'Tổng',   col: 'text-blue-700 bg-blue-50'   },
            { val: boarded,         lbl: 'Đã đón', col: 'text-green-700 bg-green-50' },
            { val: waiting,         lbl: 'Chờ',    col: 'text-amber-700 bg-amber-50' },
            { val: absent,          lbl: 'Vắng',   col: 'text-red-700 bg-red-50'     },
          ].map(x => (
            <div key={x.lbl} className={`${x.col} rounded-xl py-1.5 text-center`}>
              <p className="text-base font-bold leading-none">{x.val}</p>
              <p className="text-[9px] font-medium mt-0.5 opacity-80">{x.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation banner */}
      {navigatingTo && routeInfo && (
        <div className="bg-blue-600 px-4 py-2 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span>🧭</span>
            <div className="min-w-0">
              <p className="text-white font-semibold text-xs truncate">{navigatingTo.student.full_name}</p>
              <p className="text-blue-200 text-[10px]">{routeInfo.distanceKm} km · ~{routeInfo.durationMin} phút</p>
            </div>
          </div>
          <button onClick={onCancelNav} className="text-blue-200 hover:text-white text-[11px] bg-blue-700 px-2 py-1 rounded-lg flex-shrink-0">Hủy</button>
        </div>
      )}

      {/* Student list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {groups.map(g => g.items.length > 0 && (
          <div key={g.key}>
            <div className="sticky top-0 z-10 px-4 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: s(g.key).bg }}>
                {STATUS[g.key].label}
              </span>
              <span className="text-[10px] text-gray-400">({g.items.length})</span>
            </div>
            {g.items.map(att => (
              <StudentCard key={att.id}
                att={att} order={orderMap[att.id]} dist={distanceMap[att.id]}
                isSelected={selectedId === att.id}
                routeInfo={routeInfo} routeLoading={routeLoading} navigatingTo={navigatingTo}
                onSelect={id => onSelectStudent(id)}
                onNavigate={onNavigate} onGoogleMaps={onGoogleMaps} onBoard={onBoard} onAbsent={onAbsent}
              />
            ))}
          </div>
        ))}
        <div className="h-3" />
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 grid grid-cols-2 gap-2">
        <button onClick={onIncident} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm transition">
          🚨 Báo sự cố
        </button>
        <button onClick={onCompleteTrip} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition shadow shadow-green-200">
          ✅ Kết thúc
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE LAYOUT
   ─ Top 42dvh: bản đồ + overlays
   ─ Bottom flex-1: header compact + list cuộn + action bar cố định
   ═══════════════════════════════════════════════════════════════════════════ */
function MobileLayout({
  trip, students, sortedStudents, location, viewState, setViewState, mapRef,
  navigableStudents, orderMap, distanceMap, nextStop,
  selectedId, onSelectStudent,
  routeGeoJSON, routeInfo, routeLoading, navigatingTo, onNavigate, onGoogleMaps,
  onBoard, onAbsent, onCancelNav, onCompleteTrip, onIncident,
}) {
  // sortedStudents: học sinh đã sắp xếp theo khoảng cách tăng dần
  const sorted  = sortedStudents || students;
  const boarded = students.filter(s => s.status === 'boarded').length;
  const waiting = students.filter(s => s.status === 'waiting').length;
  const absent  = students.filter(s => s.status === 'absent').length;

  const groups = [
    { key: 'waiting', items: sorted.filter(s => s.status === 'waiting') },
    { key: 'boarded', items: sorted.filter(s => s.status === 'boarded') },
    { key: 'absent',  items: sorted.filter(s => s.status === 'absent')  },
  ];

  return (
    <div className="flex flex-col bg-gray-100 -m-4 -mb-6" style={{ zIndex: 0, height: 'calc(100vh - 120px)' }}>

      {/* ── MAP SECTION ─────────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ height: '55%' }}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: '100%', height: '100%' }}
        >
          {routeGeoJSON && (
            <Source id="nav-route" type="geojson" data={routeGeoJSON}>
              <Layer id="route-casing" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#1d4ed8', 'line-width': 9, 'line-opacity': .18 }} />
              <Layer id="route-line"   type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': .9  }} />
            </Source>
          )}
          {location && (
            <Marker longitude={location.longitude} latitude={location.latitude} anchor="center">
              <div style={{ fontSize: 26, filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,.5))' }}>🚍</div>
            </Marker>
          )}
          {navigableStudents.map(att => (
            <Marker key={att.id} longitude={att.student.home_lng} latitude={att.student.home_lat} anchor="bottom"
              onClick={e => { e.originalEvent.stopPropagation(); onSelectStudent(att.id === selectedId ? null : att.id); }}>
              <StudentMarker att={att} order={orderMap[att.id]} isNext={nextStop?.att?.id === att.id} />
            </Marker>
          ))}
        </Map>

        {/* Map overlays */}
        {/* GPS chip — top right */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-1.5">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${location ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-[11px] font-semibold text-gray-600">{location ? `${location.speed?.toFixed(0) || 0} km/h` : 'GPS...'}</span>
        </div>

        {/* Legend — bottom left */}
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-2 flex flex-col gap-1 text-[10px] font-medium text-gray-600">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 inline-block" />Chờ đón</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-600 inline-block" />Đã đón</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600 inline-block" />Vắng</span>
        </div>

        {/* Nav banner on map */}
        {navigatingTo && routeInfo && (
          <div className="absolute bottom-2.5 left-14 right-2.5 z-10 bg-blue-600/95 backdrop-blur rounded-xl shadow px-3 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base">🧭</span>
              <div className="min-w-0">
                <p className="text-white font-semibold text-xs truncate">{navigatingTo.student.full_name}</p>
                <p className="text-blue-200 text-[10px]">{routeInfo.distanceKm} km · ~{routeInfo.durationMin} phút</p>
              </div>
            </div>
            <button onClick={onCancelNav} className="text-blue-200 text-[10px] bg-blue-700 px-2 py-1 rounded-lg flex-shrink-0">Hủy</button>
          </div>
        )}
      </div>

      {/* ── LIST PANEL ──────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white"
        style={{ borderRadius: '20px 20px 0 0', marginTop: '-16px', boxShadow: '0 -4px 24px rgba(0,0,0,.1)' }}>

        {/* Panel header */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-gray-100">
          {/* drag hint */}
          <div className="flex justify-center mb-2">
            <div className="w-8 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Trip name row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-green-700 flex items-center justify-center text-white text-xs flex-shrink-0">🚌</div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate leading-tight">{trip.Route?.route_name}</p>
                <p className="text-[10px] text-gray-400 truncate">🚍 {trip.Vehicle?.plate_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-600">LIVE</span>
            </div>
          </div>

          {/* Progress + stats */}
          <ProgressBar boarded={boarded} total={students.length} />
          <div className="flex items-center gap-2 mt-2">
            {[
              { val: students.length, lbl: 'Tổng',   cls: 'text-blue-700 bg-blue-50'   },
              { val: boarded,         lbl: 'Đã đón', cls: 'text-green-700 bg-green-50' },
              { val: waiting,         lbl: 'Chờ',    cls: 'text-amber-700 bg-amber-50' },
              { val: absent,          lbl: 'Vắng',   cls: 'text-red-700 bg-red-50'     },
            ].map(x => (
              <div key={x.lbl} className={`flex-1 ${x.cls} rounded-xl py-1.5 text-center`}>
                <p className={`text-sm font-bold leading-none`}>{x.val}</p>
                <p className="text-[9px] font-medium mt-0.5 opacity-70">{x.lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next stop quick-tap (only if no selection) */}
        {nextStop && !selectedId && (
          <button
            onClick={() => onSelectStudent(nextStop.att.id)}
            className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-amber-50 border-b border-amber-100 hover:bg-amber-100 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm shadow-amber-200"
              style={{ animation: 'pulse-ring 2s ease-out infinite' }}>
              {orderMap[nextStop.att.id]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Điểm đón tiếp theo</p>
              <p className="font-bold text-gray-900 text-sm truncate leading-tight">{nextStop.att.student?.full_name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              {nextStop.dist != null && <p className="text-sm font-bold text-gray-700">{nextStop.dist.toFixed(1)} km</p>}
              <p className="text-[10px] text-amber-600">Nhấn để đón →</p>
            </div>
          </button>
        )}

        {/* Scrollable student list */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-4">
          {groups.map(g => g.items.length > 0 && (
            <div key={g.key}>
              <div className="sticky top-0 z-10 px-4 py-1.5 bg-gray-50 border-b border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: s(g.key).bg }}>
                  {STATUS[g.key].label} ({g.items.length})
                </span>
              </div>
              {g.items.map(att => (
                <StudentCard key={att.id}
                  att={att} order={orderMap[att.id]} dist={distanceMap[att.id]}
                  isSelected={selectedId === att.id}
                  routeInfo={routeInfo} routeLoading={routeLoading} navigatingTo={navigatingTo}
                  onSelect={id => onSelectStudent(id)}
                  onNavigate={onNavigate} onGoogleMaps={onGoogleMaps} onBoard={onBoard} onAbsent={onAbsent}
                  isMobile
                />
              ))}
            </div>
          ))}

          {/* Actions moved inside scrollable area */}
          <div className="p-4 mt-2 grid grid-cols-2 gap-3">
            <button onClick={onIncident} className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm transition">
              🚨 Báo sự cố
            </button>
            <button onClick={onCompleteTrip} className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition shadow shadow-green-200">
              ✅ Kết thúc
            </button>
          </div>
          <div style={{ height: 'env(safe-area-inset-bottom, 12px)' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ActiveTrip() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const socket     = useSocket();
  const isMobile   = useIsMobile();
  const tripId     = state?.tripId;
  const gpsRef     = useRef(null);
  const mapRef     = useRef(null);
  const hasCentered = useRef(false);

  const [trip, setTrip]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [location, setLocation]   = useState(null);
  const [viewState, setViewState] = useState({ ...DEFAULT_CENTER, zoom: 14 });
  const [selectedId, setSelectedId] = useState(null);
  const [showIncident, setShowIncident] = useState(false);

  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo]       = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState(null);

  /* ── fetch ──────────────────────────────────────────────────────────── */
  const fetchTrip = useCallback(async () => {
    if (!tripId) return navigate('/driver');
    try { const { data } = await driverApi.getTripDetail(tripId); setTrip(data.data); }
    catch { navigate('/driver'); }
    finally { setLoading(false); }
  }, [tripId]);
  useEffect(() => { fetchTrip(); }, [fetchTrip]);

  /* ── GPS ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!socket || !tripId) return;
    gpsRef.current = setInterval(() => {
      navigator.geolocation?.getCurrentPosition(pos => {
        const { latitude, longitude, speed, heading, accuracy } = pos.coords;
        setLocation({ latitude, longitude, speed: speed ? speed * 3.6 : null });
        socket.emit('driver:location', { tripId, latitude, longitude, speed: speed ? speed * 3.6 : null, heading, accuracy });
      }, err => console.error('GPS:', err.message), { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 });
    }, 5000);
    return () => { if (gpsRef.current) clearInterval(gpsRef.current); };
  }, [socket, tripId]);

  useEffect(() => {
    if (location && !hasCentered.current && mapRef.current) {
      mapRef.current.flyTo({ center: [location.longitude, location.latitude], zoom: 15, duration: 900 });
      hasCentered.current = true;
    }
  }, [location]);

  /* ── derived ────────────────────────────────────────────────────────── */
  const students = trip?.TripAttendances || [];
  const navigableStudents = useMemo(() =>
    students.filter(a => a.student?.home_lat != null && a.student?.home_lng != null), [students]);

  const orderedByDistance = useMemo(() =>
    [...navigableStudents]
      .map(att => ({ att, dist: location ? haversineKm(location.latitude, location.longitude, att.student.home_lat, att.student.home_lng) : null }))
      .sort((a, b) => a.dist == null || b.dist == null ? 0 : a.dist - b.dist),
    [navigableStudents, location]);

  const orderMap    = useMemo(() => { const m = {}; orderedByDistance.forEach(({ att }, i) => { m[att.id] = i + 1; }); return m; }, [orderedByDistance]);
  const distanceMap = useMemo(() => { const m = {}; orderedByDistance.forEach(({ att, dist }) => { m[att.id] = dist; }); return m; }, [orderedByDistance]);
  const nextStop    = orderedByDistance.find(({ att }) => att.status === 'waiting');

  /* ── navigation ─────────────────────────────────────────────────────── */
  const getCurrentPos = () => new Promise((res, rej) =>
    navigator.geolocation?.getCurrentPosition(p => res({ latitude: p.coords.latitude, longitude: p.coords.longitude }), rej, { enableHighAccuracy: true, timeout: 10000 })
    || rej(new Error('No GPS')));

  const startNavigateTo = async (att) => {
    setRouteLoading(true);
    try {
      const from = location || await getCurrentPos();
      const { home_lat: tLat, home_lng: tLng } = att.student;
      const res  = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${tLng},${tLat}?${new URLSearchParams({ geometries: 'geojson', overview: 'full', access_token: MAPBOX_TOKEN })}`);
      const data = await res.json();
      const route = data.routes?.[0];
      if (!route) { toast.error('Không tìm được đường'); return; }
      setRouteGeoJSON({ type: 'Feature', geometry: route.geometry });
      setRouteInfo({ distanceKm: (route.distance / 1000).toFixed(1), durationMin: Math.round(route.duration / 60) });
      setNavigatingTo(att);
      const pad = isMobile ? { top: 60, bottom: 20, left: 20, right: 20 } : { top: 80, bottom: 80, left: 60, right: 60 };
      mapRef.current?.fitBounds([[Math.min(from.longitude, tLng), Math.min(from.latitude, tLat)], [Math.max(from.longitude, tLng), Math.max(from.latitude, tLat)]], { padding: pad, duration: 900 });
    } catch { toast.error('Không lấy được vị trí'); }
    finally { setRouteLoading(false); }
  };

  const cancelNavigation = () => { setRouteGeoJSON(null); setRouteInfo(null); setNavigatingTo(null); };
  const openGoogleMaps = (att) => {
    const o = location ? `&origin=${location.latitude},${location.longitude}` : '';
    window.open(`https://www.google.com/maps/dir/?api=1${o}&destination=${att.student.home_lat},${att.student.home_lng}&travelmode=driving`, '_blank', 'noopener');
  };

  /* ── attendance ─────────────────────────────────────────────────────── */
  const updateStatus = async (att, status) => {
    try {
      await driverApi.updateAttendance(tripId, att.student_id, { status });
      socket?.emit('driver:attendance_updated', { tripId, studentId: att.student_id, status });
      if (status === 'boarded') {
        toast.success(`✅ Đã đón ${att.student?.full_name}`, { icon: '🟢' });
        const next = orderedByDistance.find(({ att: a }) => a.id !== att.id && a.status === 'waiting');
        if (next) { setSelectedId(next.att.id); startNavigateTo(next.att); }
        else { setSelectedId(null); cancelNavigation(); }
      } else {
        toast(`❌ Vắng: ${att.student?.full_name}`, { icon: '🔴' });
        setSelectedId(null);
      }
      fetchTrip();
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const completeTrip = async () => {
    if (!window.confirm('Kết thúc chuyến đi này?')) return;
    try {
      await driverApi.completeTrip(tripId);
      socket?.emit('driver:trip_completed', { tripId });
      if (gpsRef.current) clearInterval(gpsRef.current);
      toast.success('🎉 Hoàn thành chuyến đi!');
      navigate('/driver');
    } catch { toast.error('Có lỗi xảy ra'); }
  };

  const submitIncident = async (form) => {
    try { await driverApi.reportIncident({ trip_id: tripId, ...form }); toast.success('Đã gửi sự cố'); setShowIncident(false); }
    catch { toast.error('Gửi thất bại'); }
  };

  const handleSelectStudent = (id) => {
    setSelectedId(id);
    if (id) {
      const att = students.find(a => a.id === id);
      if (att?.student?.home_lat) {
        mapRef.current?.flyTo({ center: [att.student.home_lng, att.student.home_lat], zoom: 16, duration: 700 });
      }
    }
  };

  useEffect(() => {
    if (!selectedId || !trip) return;
    if (!(trip.TripAttendances || []).find(a => a.id === selectedId)) setSelectedId(null);
  }, [trip]);

  if (loading) return <LoadingScreen />;
  if (!trip)   return null;

  /* ── sortedStudents: sắp xếp theo khoảng cách tăng dần, không có tọa độ ở cuối ── */
  const _withCoords    = orderedByDistance.map(({ att }) => att);
  const _withoutCoords = students.filter(a => a.student?.home_lat == null || a.student?.home_lng == null);
  const sortedStudents = [..._withCoords, ..._withoutCoords];

  /* ── shared props ────────────────────────────────────────────────────── */
  const shared = {
    trip, students, sortedStudents, location, viewState, setViewState, mapRef,
    navigableStudents, orderMap, distanceMap, nextStop,
    selectedId, onSelectStudent: handleSelectStudent,
    routeGeoJSON, routeInfo, routeLoading, navigatingTo,
    onNavigate: startNavigateTo,
    onGoogleMaps: openGoogleMaps,
    onBoard: att => updateStatus(att, 'boarded'),
    onAbsent: att => updateStatus(att, 'absent'),
    onCancelNav: cancelNavigation,
    onCompleteTrip: completeTrip,
    onIncident: () => setShowIncident(true),
  };

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(245,158,11,.55), 0 3px 10px rgba(0,0,0,.28); }
          70%  { box-shadow: 0 0 0 10px rgba(245,158,11,0), 0 3px 10px rgba(0,0,0,.28); }
          100% { box-shadow: 0 0 0 0  rgba(245,158,11,0), 0 3px 10px rgba(0,0,0,.28); }
        }
      `}</style>

      {isMobile
        ? <MobileLayout {...shared} />
        : (
          /* ── DESKTOP split-view ─────────────────────────────────── */
          <div className="flex bg-white overflow-hidden shadow-sm border border-gray-200 -m-6" style={{ height: 'calc(100vh - 48px)' }}>
            {/* Map */}
            <div className="relative flex-1 min-w-0">
              <Map ref={mapRef} {...viewState} onMove={evt => setViewState(evt.viewState)}
                mapboxAccessToken={MAPBOX_TOKEN} mapStyle="mapbox://styles/mapbox/streets-v12"
                style={{ width: '100%', height: '100%' }}>
                {routeGeoJSON && (
                  <Source id="nav-route" type="geojson" data={routeGeoJSON}>
                    <Layer id="route-casing" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#1d4ed8', 'line-width': 9, 'line-opacity': .18 }} />
                    <Layer id="route-line"   type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': .9  }} />
                  </Source>
                )}
                {location && (
                  <Marker longitude={location.longitude} latitude={location.latitude} anchor="center">
                    <div style={{ fontSize: 28, filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,.5))' }}>🚍</div>
                  </Marker>
                )}
                {navigableStudents.map(att => (
                  <Marker key={att.id} longitude={att.student.home_lng} latitude={att.student.home_lat} anchor="bottom"
                    onClick={e => { e.originalEvent.stopPropagation(); handleSelectStudent(att.id === selectedId ? null : att.id); }}>
                    <StudentMarker att={att} order={orderMap[att.id]} isNext={nextStop?.att?.id === att.id} />
                  </Marker>
                ))}
              </Map>
              {/* GPS badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-xl shadow px-2.5 py-1.5">
                <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-[11px] font-semibold text-gray-600">{location ? `${location.speed?.toFixed(0) || 0} km/h` : 'Chờ GPS'}</span>
              </div>
              {/* Legend */}
              <div className="absolute bottom-4 left-3 z-10 bg-white/90 backdrop-blur rounded-xl shadow px-3 py-2 flex flex-col gap-1.5 text-[11px] font-medium text-gray-600">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 inline-block"/>Chờ đón</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 border border-green-600 inline-block"/>Đã đón</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 border border-red-600 inline-block"/>Vắng</span>
              </div>
            </div>
            {/* Right sidebar */}
            <div className="w-80 xl:w-96 flex-shrink-0 border-l border-gray-200 flex flex-col overflow-hidden">
              <DesktopPanel {...shared} />
            </div>
          </div>
        )
      }

      {showIncident && <IncidentModal onClose={() => setShowIncident(false)} onSubmit={submitIncident} />}
    </>
  );
}
