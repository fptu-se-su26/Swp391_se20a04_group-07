import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STUDENTS, MOCK_TRIPS, MOCK_BUSES, SCHOOL } from '../../data/mockData';
import { optimizeRoute, haversine } from '../../hooks/api';
import { Card, Btn, Badge, Avatar, C, Toast, Textarea, Empty } from '../../components/UI';

// ── Bottom Nav ────────────────────────────────────────────────
function DriverNav({ page, setPage }) {
  const items = [
    { key:'home',       icon:'🏠', label:'Tổng quan' },
    { key:'route',      icon:'🗺️', label:'Lộ trình'  },
    { key:'attendance', icon:'📋', label:'Điểm danh' },
    { key:'gps',        icon:'📡', label:'GPS'        },
    { key:'trips',      icon:'🗂',  label:'Chuyến đi' },
  ];
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:`1px solid ${C.border}`, display:'flex', zIndex:100, boxShadow:'0 -4px 20px rgba(0,0,0,0.07)', maxWidth:480, margin:'0 auto' }}>
      {items.map(item => (
        <div key={item.key} onClick={()=>setPage(item.key)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'9px 0 6px', cursor:'pointer', color:page===item.key?'#1B6CA8':C.gray, position:'relative' }}>
          {page===item.key && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:3, background:'#1B6CA8', borderRadius:2 }}/>}
          <span style={{ fontSize:22 }}>{item.icon}</span>
          <span style={{ fontSize:10, fontWeight:page===item.key?700:400, marginTop:1 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────
function DriverHome({ driver, session, setSession, setPage }) {
  const [time, setTime]   = useState(new Date());
  const [gps,  setGps]    = useState(null);
  useEffect(() => {
    const t = setInterval(()=>setTime(new Date()), 1000);
    navigator.geolocation?.getCurrentPosition(
      p => setGps({ lat:p.coords.latitude, lng:p.coords.longitude }),
      () => setGps({ lat:10.7769, lng:106.7009 })
    );
    return () => clearInterval(t);
  }, []);

  const students  = MOCK_STUDENTS;
  const present   = students.filter(s=>s[session]==='present').length;
  const leave     = students.filter(s=>s[session]==='leave').length;
  const pending   = students.filter(s=>s[session]==='pending').length;
  const pickable  = students.filter(s=>s[session]==='pending' && s.lat);
  const start     = gps||{ lat:10.7769, lng:106.7009 };
  const route     = optimizeRoute(start, pickable);
  const totalDist = route.reduce((s,p)=>s+(p.dist_km||0),0).toFixed(1);
  const todayTrips= MOCK_TRIPS.filter(t=>t.date==='2026-06-20');
  const isActive  = session==='morning'
    ? (time.getHours()>6||(time.getHours()===6&&time.getMinutes()>=30))&&time.getHours()<12
    : (time.getHours()>13||(time.getHours()===13&&time.getMinutes()>=25))&&time.getHours()<18;

  return (
    <div style={{ padding:'0 0 90px', animation:'slideUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1B6CA8,#1A3A5C)', padding:'20px 20px 32px', borderRadius:'0 0 28px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🧑‍✈️</div>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>Xin chào,</div>
            <div style={{ color:'#fff', fontSize:17, fontWeight:700 }}>{driver.name}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:'#fff', fontSize:20, fontWeight:700 }}>{time.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>{time.toLocaleDateString('vi-VN',{weekday:'short',day:'2-digit',month:'2-digit'})}</div>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:14, padding:'12px 14px', display:'flex', gap:16 }}>
          <div><div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>Xe</div><div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{driver.bus_plate}</div></div>
          <div><div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>Tuyến</div><div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{driver.bus_route}</div></div>
          <div style={{ marginLeft:'auto' }}>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>Trạng thái</div>
            <div style={{ color:isActive?'#4ADE80':'#FCD34D', fontWeight:700, fontSize:13 }}>{isActive?'● Đang chạy':'○ Chờ ca'}</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'0 16px', marginTop:-16 }}>
        {/* Session selector */}
        {driver.shift==='both' && (
          <div style={{ display:'flex', gap:0, background:'#fff', borderRadius:14, padding:4, boxShadow:'0 2px 10px rgba(0,0,0,0.06)', marginBottom:14 }}>
            {[{k:'morning',l:'☀ Ca sáng 6:30'},{k:'afternoon',l:'🌆 Ca chiều 13:25'}].map(s=>(
              <button key={s.k} onClick={()=>setSession(s.k)} style={{ flex:1, padding:'9px 6px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', background:session===s.k?'#1B6CA8':'transparent', color:session===s.k?'#fff':C.gray, transition:'all 0.2s' }}>{s.l}</button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
          {[
            { icon:'👥', label:'Tổng HS',  value:students.length, color:'#1B6CA8' },
            { icon:'✅', label:'Có mặt',   value:present,          color:C.green   },
            { icon:'📝', label:'Xin nghỉ', value:leave,            color:C.amber   },
            { icon:'⏳', label:'Chưa đón', value:pending,          color:C.gray    },
          ].map(s=>(
            <div key={s.label} style={{ background:s.color+'11', border:`1px solid ${s.color}22`, borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
              <div style={{ fontSize:16 }}>{s.icon}</div>
              <div style={{ fontSize:18, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:C.textSub }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[
            { icon:'🗺️', title:'Lộ trình đón', sub:`${route.length} điểm · ${totalDist} km`, page:'route',      color:'#1B6CA8', bg:'#EFF6FF' },
            { icon:'📋', title:'Điểm danh',     sub:`${present}/${students.length} có mặt`,   page:'attendance', color:C.green,   bg:C.greenSoft },
            { icon:'📡', title:'GPS',            sub:gps?`${gps.lat.toFixed(3)},${gps.lng.toFixed(3)}`:'Đang định vị...', page:'gps', color:'#7C3AED', bg:'#F3F0FF' },
            { icon:'🗂', title:'Chuyến đi',     sub:`${todayTrips.length} chuyến hôm nay`,    page:'trips',      color:C.amber,   bg:C.amberSoft },
          ].map(item=>(
            <Card key={item.page} onClick={()=>setPage(item.page)} style={{ padding:16, cursor:'pointer' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:item.color }}>{item.title}</div>
              <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{item.sub}</div>
            </Card>
          ))}
        </div>

        {/* Next stop */}
        {route.length>0 && (
          <Card style={{ padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ fontSize:18 }}>📍</span>
              <span style={{ fontWeight:700, fontSize:14, flex:1 }}>Điểm đón tiếp theo</span>
              <span style={{ fontSize:12, color:'#1B6CA8', background:'#EFF6FF', padding:'2px 8px', borderRadius:10 }}>{route[0].dist_km?.toFixed(1)} km</span>
            </div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{route[0].name}</div>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:12 }}>{route[0].address}</div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn sm variant="soft" onClick={()=>setPage('route')} style={{ flex:1, color:'#1B6CA8', background:'#EFF6FF' }}>🗺️ Xem lộ trình</Btn>
              <Btn sm onClick={()=>setPage('attendance')} style={{ flex:1, background:'#1B6CA8' }}>📋 Điểm danh</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Route ─────────────────────────────────────────────────────
function DriverRoute({ session }) {
  const [gps, setGps]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeStop, setActive] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => { setGps({ lat:p.coords.latitude, lng:p.coords.longitude }); setLoading(false); },
      () => { setGps({ lat:10.7769, lng:106.7009 }); setLoading(false); }
    );
  }, []);

  const pickable = MOCK_STUDENTS.filter(s=>s[session]==='pending'&&s.lat);
  const start    = gps||{ lat:10.7769, lng:106.7009 };
  const ordered  = optimizeRoute(start, pickable);
  const totalKm  = ordered.reduce((s,p)=>s+(p.dist_km||0),0);
  const schDist  = ordered.length ? haversine(ordered[ordered.length-1].lat,ordered[ordered.length-1].lng,SCHOOL.lat,SCHOOL.lng) : 0;

  // SVG map
  const W=340, H=240, PAD=24;
  const allPts = [...(gps?[gps]:[]), ...ordered, SCHOOL].filter(p=>p.lat);
  const lats=allPts.map(p=>p.lat), lngs=allPts.map(p=>p.lng);
  const minLat=Math.min(...lats), maxLat=Math.max(...lats);
  const minLng=Math.min(...lngs), maxLng=Math.max(...lngs);
  const toX=lng=>maxLng===minLng?W/2:PAD+((lng-minLng)/(maxLng-minLng))*(W-PAD*2);
  const toY=lat=>maxLat===minLat?H/2:H-PAD-((lat-minLat)/(maxLat-minLat))*(H-PAD*2);
  const linePts=[...(gps?[gps]:[]),...ordered,SCHOOL].filter(p=>p.lat).map(p=>`${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`).join(' ');

  return (
    <div style={{ padding:'0 16px 90px', animation:'slideUp 0.3s ease' }}>
      <div style={{ padding:'20px 0 12px' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>🗺️ Lộ trình đón xe</div>
        <div style={{ fontSize:13, color:C.textSub, marginTop:2 }}>{session==='morning'?'☀ Ca sáng · 06:30':'🌆 Ca chiều · 13:25'} · Tối ưu quãng đường ngắn nhất</div>
      </div>

      {/* Summary */}
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[
          { icon:'📍', label:'Điểm đón',   value:ordered.length },
          { icon:'📏', label:'Quãng đường', value:`${(totalKm+schDist).toFixed(1)} km` },
          { icon:'⏱',  label:'Ước tính',   value:`${Math.round((totalKm+schDist)/25*60)} phút` },
        ].map(s=>(
          <div key={s.label} style={{ flex:1, background:'#fff', borderRadius:12, padding:'10px 6px', textAlign:'center', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:18 }}>{s.icon}</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#1B6CA8', marginTop:2 }}>{s.value}</div>
            <div style={{ fontSize:10, color:C.textSub }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map */}
      <Card style={{ padding:12, marginBottom:14 }}>
        <div style={{ borderRadius:14, overflow:'hidden', background:'#EEF4FB' }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
            <rect width={W} height={H} fill="#EEF4FB"/>
            {[0,1,2,3].map(i=><React.Fragment key={i}><line x1={0} y1={H/4*(i+.5)} x2={W} y2={H/4*(i+.5)} stroke="#fff" strokeWidth="8" strokeOpacity=".5"/><line x1={W/4*(i+.5)} y1={0} x2={W/4*(i+.5)} y2={H} stroke="#fff" strokeWidth="8" strokeOpacity=".5"/></React.Fragment>)}
            {linePts&&<polyline points={linePts} fill="none" stroke="#1B6CA8" strokeWidth="2.5" strokeDasharray="6,3" strokeLinecap="round" strokeLinejoin="round"/>}
            {ordered.map((p,i)=>(
              <g key={p.id}>
                <circle cx={toX(p.lng)} cy={toY(p.lat)} r="11" fill="#1B6CA8" stroke="#fff" strokeWidth="2"/>
                <text x={toX(p.lng)} y={toY(p.lat)+4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{i+1}</text>
              </g>
            ))}
            <circle cx={toX(SCHOOL.lng)} cy={toY(SCHOOL.lat)} r="13" fill={C.green} stroke="#fff" strokeWidth="2"/>
            <text x={toX(SCHOOL.lng)} y={toY(SCHOOL.lat)+4} textAnchor="middle" fontSize="11">🏫</text>
            {gps?.lat&&(
              <g>
                <circle cx={toX(gps.lng)} cy={toY(gps.lat)} r="16" fill="#1B6CA8" opacity=".12"/>
                <circle cx={toX(gps.lng)} cy={toY(gps.lat)} r="10" fill="#1B6CA8" stroke="#fff" strokeWidth="2"/>
                <text x={toX(gps.lng)} y={toY(gps.lat)+4} textAnchor="middle" fontSize="11">🚌</text>
                <circle cx={toX(gps.lng)} cy={toY(gps.lat)} r="10" fill="none" stroke="#1B6CA8" strokeWidth="1.5"><animate attributeName="r" from="12" to="24" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" from=".6" to="0" dur="1.8s" repeatCount="indefinite"/></circle>
              </g>
            )}
          </svg>
        </div>
        <div style={{ display:'flex', gap:14, marginTop:10, fontSize:11, color:C.textSub, justifyContent:'center' }}>
          <span>🚌 Xe hiện tại</span><span style={{ color:'#1B6CA8' }}>● Điểm đón</span><span style={{ color:C.green }}>🏫 Trường</span>
        </div>
      </Card>

      {/* Stop list */}
      <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>Danh sách điểm đón ({ordered.length})</div>
      {ordered.length===0 && <Card style={{ padding:24, textAlign:'center', color:C.textSub, fontSize:14 }}>✅ Tất cả đã điểm danh hoặc xin nghỉ</Card>}
      {ordered.map((stop,idx)=>(
        <Card key={stop.id} style={{ marginBottom:10 }} onClick={()=>setActive(activeStop===stop.id?null:stop.id)}>
          <div style={{ padding:'14px 16px', display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'#1B6CA8', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>{idx+1}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700 }}>{stop.name}</div>
              <div style={{ fontSize:12, color:C.textSub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{stop.address}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#1B6CA8' }}>{stop.dist_km?.toFixed(1)} km</div>
              <div style={{ fontSize:10, color:C.textSub }}>từ điểm trước</div>
            </div>
          </div>
          {activeStop===stop.id && (
            <div style={{ borderTop:`1px solid ${C.border}`, padding:'12px 16px', background:C.bg }}>
              <div style={{ fontSize:13, color:C.textSub, marginBottom:8 }}>👤 PH: {stop.parent} · 📞 {stop.phone}</div>
              <Btn sm variant="soft" onClick={e=>{ e.stopPropagation(); window.open(`tel:${stop.phone}`); }} style={{ color:'#1B6CA8' }}>📞 Gọi phụ huynh</Btn>
            </div>
          )}
        </Card>
      ))}

      {/* School */}
      <Card style={{ padding:'14px 16px', background:'#F0FDF4', border:`1.5px solid ${C.green}33` }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:C.green, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.green }}>Điểm đến – {SCHOOL.name}</div>
            <div style={{ fontSize:12, color:C.textSub }}>{SCHOOL.address}</div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:C.green }}>{schDist.toFixed(1)} km</div>
        </div>
      </Card>
    </div>
  );
}

// ── Attendance ─────────────────────────────────────────────────
function DriverAttendance({ driver, session }) {
  const [students, setStudents] = useState(MOCK_STUDENTS.map(s=>({...s, currentStatus:s[session]})));
  const [submitting, setSubmit] = useState(false);
  const [submitted,  setDone]   = useState(false);
  const [toast,      setToast]  = useState(null);
  const [search,     setSearch] = useState('');

  function showToast(msg,type='success'){ setToast({msg,type}); setTimeout(()=>setToast(null),2500); }

  async function submitAll(){
    setSubmit(true);
    await new Promise(r=>setTimeout(r,800));
    setDone(true); showToast('Đã gửi điểm danh lên hệ thống!');
    setSubmit(false);
  }

  const STATUS = [
    { v:'present', l:'✓ Có mặt',   c:C.green, bg:C.greenSoft },
    { v:'absent',  l:'✗ Vắng',     c:C.red,   bg:C.redSoft   },
    { v:'leave',   l:'~ Xin nghỉ', c:C.amber, bg:C.amberSoft },
  ];

  const present = students.filter(s=>s.currentStatus==='present').length;
  const absent  = students.filter(s=>s.currentStatus==='absent').length;
  const leave   = students.filter(s=>s.currentStatus==='leave').length;
  const pending = students.filter(s=>s.currentStatus==='pending').length;
  const filtered= students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:'0 16px 120px', animation:'slideUp 0.3s ease' }}>
      {toast && <Toast message={toast.msg} type={toast.type}/>}
      <div style={{ padding:'20px 0 12px' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>📋 Điểm danh</div>
        <div style={{ fontSize:13, color:C.textSub, marginTop:2 }}>{session==='morning'?'☀ Ca sáng':'🌆 Ca chiều'} · {new Date().toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'})}</div>
      </div>

      {/* Summary */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[{l:'Có mặt',c:C.green,v:present},{l:'Vắng',c:C.red,v:absent},{l:'Xin nghỉ',c:C.amber,v:leave},{l:'Chưa',c:C.gray,v:pending}].map(s=>(
          <div key={s.l} style={{ flex:1, textAlign:'center', background:'#fff', borderRadius:12, padding:'8px 4px', border:`1.5px solid ${s.c}22` }}>
            <div style={{ fontSize:18, fontWeight:700, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:10, color:C.textSub }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, padding:'9px 14px', marginBottom:14 }}>
        <span>🔍</span>
        <input placeholder="Tìm học sinh..." value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none', outline:'none', fontSize:14, flex:1, background:'transparent' }}/>
      </div>

      {submitted && (
        <div style={{ background:C.greenSoft, border:`1px solid ${C.green}33`, borderRadius:12, padding:'11px 16px', marginBottom:14, fontSize:13, color:C.green, fontWeight:600 }}>
          ✅ Đã gửi điểm danh! Có thể cập nhật lại nếu cần.
        </div>
      )}

      {filtered.map(s=>(
        <Card key={s.id} style={{ marginBottom:10, padding:'14px 16px' }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
            <Avatar name={s.name} size={40} bg={s.currentStatus==='present'?C.green:s.currentStatus==='absent'?C.red:s.currentStatus==='leave'?C.amber:C.gray}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
              <div style={{ fontSize:12, color:C.textSub }}>{s.address}</div>
            </div>
            <Badge status={s.currentStatus}/>
          </div>
          <div style={{ display:'flex', gap:6, marginBottom:10 }}>
            {STATUS.map(opt=>(
              <button key={opt.v} onClick={()=>setStudents(p=>p.map(x=>x.id===s.id?{...x,currentStatus:opt.v}:x))} style={{ flex:1, padding:'8px 4px', borderRadius:10, fontSize:12, fontWeight:600, border:`1.5px solid ${s.currentStatus===opt.v?opt.c:C.border}`, background:s.currentStatus===opt.v?opt.bg:'#fff', color:s.currentStatus===opt.v?opt.c:C.textSub, cursor:'pointer', transition:'all 0.15s' }}>{opt.l}</button>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:C.textSub }}>
            <span>PH: {s.parent}</span>
            <button onClick={()=>window.open(`tel:${s.phone}`)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#1B6CA8', fontWeight:600 }}>📞 {s.phone}</button>
          </div>
        </Card>
      ))}

      {/* Sticky submit */}
      <div style={{ position:'fixed', bottom:68, left:0, right:0, padding:'10px 16px', background:'rgba(240,244,255,0.95)', backdropFilter:'blur(8px)', borderTop:`1px solid ${C.border}`, maxWidth:480, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ flex:1, fontSize:13, color:pending>0?C.amber:C.green, fontWeight:500 }}>{pending>0?`⚠ Còn ${pending} HS chưa điểm danh`:'✅ Đã điểm danh hết'}</div>
          <Btn onClick={submitAll} loading={submitting} style={{ background:'#1B6CA8' }}>📤 Gửi điểm danh</Btn>
        </div>
      </div>
    </div>
  );
}

// ── GPS ────────────────────────────────────────────────────────
function DriverGPS({ driver }) {
  const [tracking, setTracking] = useState(false);
  const [pos,      setPos]      = useState(null);
  const [history,  setHistory]  = useState([]);
  const [speed,    setSpeed]    = useState(0);
  const [elapsed,  setElapsed]  = useState(0);
  const [distTotal,setDist]     = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const simRef   = useRef(null);

  function hav(a,b,c,d){ const R=6371,dL=(c-a)*Math.PI/180,dN=(d-b)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dN/2)**2; return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)); }

  function startTracking(){
    setTracking(true); setHistory([]); setDist(0); setElapsed(0);
    startRef.current = Date.now();
    timerRef.current = setInterval(()=>setElapsed(Math.floor((Date.now()-startRef.current)/1000)),1000);
    // Simulate GPS movement (demo mode)
    let step=0;
    simRef.current = setInterval(()=>{
      const lat=10.7769+Math.sin(step*0.25)*0.006, lng=106.7009+Math.cos(step*0.25)*0.009, spd=18+Math.random()*22;
      setPos({lat,lng}); setSpeed(spd);
      setHistory(prev=>{ const next=[...prev.slice(-49),{lat,lng,t:Date.now()}]; if(prev.length>0){ const last=prev[prev.length-1]; setDist(d=>d+hav(last.lat,last.lng,lat,lng)); } return next; });
      step++;
    },2500);
  }

  function stopTracking(){
    setTracking(false);
    clearInterval(timerRef.current); clearInterval(simRef.current);
  }
  useEffect(()=>()=>{ clearInterval(timerRef.current); clearInterval(simRef.current); },[]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // Trail map
  const W=320, H=160, PAD=14;
  const buildTrail=()=>{
    if(history.length<2) return null;
    const lats=history.map(p=>p.lat),lngs=history.map(p=>p.lng);
    const minLat=Math.min(...lats),maxLat=Math.max(...lats),minLng=Math.min(...lngs),maxLng=Math.max(...lngs);
    const toX=lng=>maxLng===minLng?W/2:PAD+((lng-minLng)/(maxLng-minLng))*(W-PAD*2);
    const toY=lat=>maxLat===minLat?H/2:H-PAD-((lat-minLat)/(maxLat-minLat))*(H-PAD*2);
    return { pts:history.map(p=>`${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`).join(' '), cur:pos?{x:toX(pos.lng),y:toY(pos.lat)}:null };
  };
  const trail=buildTrail();

  return (
    <div style={{ padding:'0 16px 90px', animation:'slideUp 0.3s ease' }}>
      <div style={{ padding:'20px 0 12px' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>📡 GPS Thời gian thực</div>
        <div style={{ fontSize:13, color:C.textSub, marginTop:2 }}>Xe {driver.bus_plate} · {driver.bus_route}</div>
      </div>

      <div style={{ background:tracking?'linear-gradient(135deg,#16A34A,#15803D)':'linear-gradient(135deg,#1B6CA8,#1e40af)', borderRadius:18, padding:'20px 18px', marginBottom:16, color:'#fff' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:tracking?16:0 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, position:'relative' }}>
            📡
            {tracking && <div style={{ position:'absolute', top:2, right:2, width:12, height:12, borderRadius:'50%', background:'#4ADE80', animation:'pulse 1.5s infinite' }}/>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{tracking?'● Đang phát GPS':'○ GPS chưa bật'}</div>
            {tracking && <div style={{ fontSize:12, opacity:.8 }}>Phụ huynh đang theo dõi xe theo thời gian thực</div>}
          </div>
        </div>
        {tracking && (
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[{icon:'⚡',label:'Tốc độ',value:`${speed.toFixed(0)} km/h`},{icon:'📏',label:'Quãng đường',value:`${(distTotal*1000).toFixed(0)} m`},{icon:'⏱',label:'Thời gian',value:fmt(elapsed)}].map(s=>(
              <div key={s.label} style={{ flex:1, background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
                <div style={{ fontSize:16 }}>{s.icon}</div>
                <div style={{ fontWeight:700, fontSize:14, marginTop:2 }}>{s.value}</div>
                <div style={{ fontSize:10, opacity:.75 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={tracking?stopTracking:startTracking} style={{ width:'100%', padding:'13px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.3)', background:tracking?'rgba(220,38,38,0.8)':'rgba(255,255,255,0.18)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>
          {tracking?'⏹ Dừng GPS':'▶ Bắt đầu phát GPS'}
        </button>
      </div>

      {pos && (
        <Card style={{ padding:16, marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>📍 Vị trí hiện tại</div>
          {[['🌐 Vĩ độ',pos.lat.toFixed(6)],['🌐 Kinh độ',pos.lng.toFixed(6)],['🚀 Tốc độ',`${speed.toFixed(1)} km/h`]].map(([k,v])=>(
            <div key={k} style={{ display:'flex', padding:'7px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
              <span style={{ color:C.textSub, flex:1 }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </Card>
      )}

      {trail && (
        <Card style={{ padding:14, marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>🛣 Lộ trình đã đi ({history.length} điểm)</div>
          <div style={{ borderRadius:12, overflow:'hidden', background:'#EEF4FB' }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
              <rect width={W} height={H} fill="#EEF4FB"/>
              {[1,2,3].map(i=><React.Fragment key={i}><line x1={0} y1={H/4*i} x2={W} y2={H/4*i} stroke="#fff" strokeWidth="6" strokeOpacity=".6"/><line x1={W/4*i} y1={0} x2={W/4*i} y2={H} stroke="#fff" strokeWidth="6" strokeOpacity=".6"/></React.Fragment>)}
              <polyline points={trail.pts} fill="none" stroke="#1B6CA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              {trail.cur && <>
                <circle cx={trail.cur.x} cy={trail.cur.y} r="8" fill="#1B6CA8" stroke="#fff" strokeWidth="2"/>
                <circle cx={trail.cur.x} cy={trail.cur.y} r="8" fill="none" stroke="#1B6CA8" strokeWidth="1.5"><animate attributeName="r" from="10" to="22" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" from=".7" to="0" dur="1.6s" repeatCount="indefinite"/></circle>
              </>}
            </svg>
          </div>
          <div style={{ fontSize:11, color:C.textSub, textAlign:'center', marginTop:6 }}>Cập nhật mỗi 2.5 giây</div>
        </Card>
      )}

      <Card style={{ padding:16 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>ℹ️ Thông tin</div>
        {[['🚌 Xe',driver.bus_plate],['🛣 Tuyến',driver.bus_route],['👤 Tài xế',driver.name]].map(([k,v])=>(
          <div key={k} style={{ display:'flex', padding:'7px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
            <span style={{ color:C.textSub, flex:1 }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop:10, fontSize:12, color:C.textSub, lineHeight:1.7 }}>• GPS phát mỗi 2.5 giây khi đang chạy<br/>• Phụ huynh theo dõi qua app Parent<br/>• Tắt GPS khi kết thúc chuyến</div>
      </Card>
    </div>
  );
}

// ── Trips ──────────────────────────────────────────────────────
function DriverTrips({ driver, session }) {
  const [filter, setFilter] = useState('all');
  const trips   = filter==='all' ? MOCK_TRIPS : MOCK_TRIPS.filter(t=>t.shift===filter);
  const totKm   = MOCK_TRIPS.reduce((s,t)=>s+t.km,0);
  const totPresent = MOCK_TRIPS.reduce((s,t)=>s+t.present,0);
  const shiftBg = { morning:'#FFFBEB', afternoon:'#EFF6FF' };
  const shiftC  = { morning:C.amber,   afternoon:'#1B6CA8'  };
  const shiftL  = { morning:'☀ Sáng',  afternoon:'🌆 Chiều' };
  return (
    <div style={{ padding:'0 16px 90px', animation:'slideUp 0.3s ease' }}>
      <div style={{ padding:'20px 0 12px' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>🗂 Danh sách chuyến đi</div>
        <div style={{ fontSize:13, color:C.textSub, marginTop:2 }}>Xe {driver.bus_plate} · {driver.bus_route}</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
        {[{icon:'🛣',label:'Chuyến',value:MOCK_TRIPS.length,color:'#1B6CA8'},{icon:'✅',label:'HS đón',value:totPresent,color:C.green},{icon:'📝',label:'Xin nghỉ',value:MOCK_TRIPS.reduce((s,t)=>s+t.leave,0),color:C.amber},{icon:'📏',label:'Tổng km',value:totKm.toFixed(1),color:'#7C3AED'}].map(s=>(
          <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'10px 6px', textAlign:'center', border:`1.5px solid ${s.color}20` }}>
            <div style={{ fontSize:16 }}>{s.icon}</div>
            <div style={{ fontSize:16, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:C.textSub }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14, background:'#fff', borderRadius:14, padding:4, boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
        {[{k:'all',l:'📅 Tất cả'},{k:'morning',l:'☀ Sáng'},{k:'afternoon',l:'🌆 Chiều'}].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)} style={{ flex:1, padding:'8px 6px', borderRadius:10, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:filter===f.k?'#1B6CA8':'transparent', color:filter===f.k?'#fff':C.gray, transition:'all 0.2s' }}>{f.l}</button>
        ))}
      </div>
      {trips.length===0 && <Empty icon="🗂" message="Không có chuyến đi nào"/>}
      {trips.map(trip=>{
        const rate=Math.round(trip.present/trip.total*100);
        const dateStr=new Date(trip.date).toLocaleDateString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit'});
        return (
          <Card key={trip.id} style={{ marginBottom:12, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div><div style={{ fontSize:14, fontWeight:700 }}>{dateStr}</div><div style={{ fontSize:12, color:C.textSub, marginTop:1 }}>{trip.start} – {trip.end}</div></div>
              <div style={{ display:'flex', gap:6, flexDirection:'column', alignItems:'flex-end' }}>
                <span style={{ background:shiftBg[trip.shift], color:shiftC[trip.shift], padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>{shiftL[trip.shift]}</span>
                <Badge status={trip.status}/>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:10 }}>
              {[{l:'Có mặt',v:`${trip.present}/${trip.total}`,c:C.green},{l:'Xin nghỉ',v:trip.leave,c:C.amber},{l:'Vắng',v:trip.absent,c:C.red},{l:'Km',v:trip.km,c:'#1B6CA8'}].map(s=>(
                <div key={s.l} style={{ flex:1, background:C.bg, borderRadius:8, padding:'7px 4px', textAlign:'center' }}>
                  <div style={{ fontSize:14, fontWeight:700, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:10, color:C.textSub }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.textSub, marginBottom:4 }}><span>Tỷ lệ có mặt</span><span style={{ fontWeight:700, color:rate>=80?C.green:C.amber }}>{rate}%</span></div>
              <div style={{ height:6, background:C.border, borderRadius:3 }}><div style={{ height:'100%', width:`${rate}%`, background:rate>=80?C.green:'#F59E0B', borderRadius:3, transition:'width 0.5s ease' }}/></div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── Report ─────────────────────────────────────────────────────
function DriverReport({ driver, session, onClose }) {
  const [note, setNote]         = useState('');
  const [submitting, setSubmit] = useState(false);
  const [done, setDone]         = useState(false);
  const [toast, setToast]       = useState(null);
  const students = MOCK_STUDENTS;
  const present  = students.filter(s=>s[session]==='present').length;
  const absent   = students.filter(s=>s[session]==='absent').length;
  const leave    = students.filter(s=>s[session]==='leave').length;
  async function submit(){
    setSubmit(true); await new Promise(r=>setTimeout(r,800));
    setDone(true); setToast({msg:'Đã gửi báo cáo cho admin!',type:'success'});
    setTimeout(()=>setToast(null),2500); setSubmit(false);
  }
  return (
    <div style={{ padding:'0 16px 90px', animation:'slideUp 0.3s ease' }}>
      {toast && <Toast message={toast.msg} type={toast.type}/>}
      <div style={{ padding:'20px 0 12px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20 }}>←</button>
        <div style={{ fontSize:18, fontWeight:700 }}>📊 Báo cáo ngày</div>
      </div>
      <Card style={{ padding:16, marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>
          {session==='morning'?'☀ Ca sáng':'🌆 Ca chiều'} · {new Date().toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'})}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
          {[{icon:'✅',label:'Có mặt',value:present,c:C.green},{icon:'📝',label:'Xin nghỉ',value:leave,c:C.amber},{icon:'❌',label:'Vắng',value:absent,c:C.red}].map(s=>(
            <div key={s.label} style={{ background:C.bg, borderRadius:12, padding:'12px 8px', textAlign:'center' }}>
              <div style={{ fontSize:22 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:700, color:s.c, marginTop:2 }}>{s.value}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{s.label}</div>
            </div>
          ))}
        </div>
        {absent>0 && (
          <div style={{ background:C.redSoft, borderRadius:10, padding:'10px 12px', marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:4 }}>Học sinh vắng không phép:</div>
            {students.filter(s=>s[session]==='absent').map(s=><div key={s.id} style={{ fontSize:12, color:C.red }}>• {s.name} — {s.address}</div>)}
          </div>
        )}
        <Textarea label="Ghi chú cho admin (tuỳ chọn)" value={note} onChange={e=>setNote(e.target.value)} placeholder="Ví dụ: Xe bị kẹt đường Nguyễn Trãi, trễ 10 phút..."/>
        {done
          ? <div style={{ background:C.greenSoft, borderRadius:10, padding:'12px', textAlign:'center', fontSize:13, color:C.green, fontWeight:600 }}>✅ Đã gửi báo cáo lên admin</div>
          : <Btn full onClick={submit} loading={submitting} style={{ background:'#1B6CA8' }}>📤 Gửi báo cáo cho admin</Btn>
        }
      </Card>
      <Card style={{ padding:16 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>📈 Tổng kết tuần</div>
        {[{icon:'🛣',label:'Tổng chuyến',value:MOCK_TRIPS.length,c:'#1B6CA8'},{icon:'👥',label:'Lượt đón',value:MOCK_TRIPS.reduce((s,t)=>s+t.present,0),c:C.green},{icon:'📏',label:'Tổng km',value:`${MOCK_TRIPS.reduce((s,t)=>s+t.km,0).toFixed(1)} km`,c:'#7C3AED'}].map(s=>(
          <div key={s.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
            <span style={{ fontSize:18 }}>{s.icon}</span><span style={{ flex:1, color:C.textSub }}>{s.label}</span><span style={{ fontWeight:700, color:s.c }}>{s.value}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Driver App ─────────────────────────────────────────────────
export default function DriverApp({ driver, onLogout }) {
  const [page,    setPage]    = useState('home');
  const defaultSession = new Date().getHours()<12?'morning':'afternoon';
  const [session, setSession] = useState(driver.shift==='both'?defaultSession:driver.shift);

  if (page==='report') return <DriverReport driver={driver} session={session} onClose={()=>setPage('home')}/>;

  const pages = {
    home:       <DriverHome       driver={driver} session={session} setSession={setSession} setPage={setPage}/>,
    route:      <DriverRoute      session={session}/>,
    attendance: <DriverAttendance driver={driver} session={session}/>,
    gps:        <DriverGPS        driver={driver}/>,
    trips:      <DriverTrips      driver={driver} session={session}/>,
  };

  return (
    <div style={{ maxWidth:480, margin:'0 auto', minHeight:'100vh', background:'#F0F5FF', position:'relative' }}>
      {/* Topbar */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(240,245,255,0.93)', backdropFilter:'blur(10px)', borderBottom:`1px solid ${C.border}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
        {driver.shift==='both' && (
          <div style={{ display:'flex', gap:4, background:'#E5E7EB', borderRadius:10, padding:3 }}>
            {[{k:'morning',l:'☀'},{k:'afternoon',l:'🌆'}].map(s=>(
              <button key={s.k} onClick={()=>setSession(s.k)} style={{ padding:'4px 10px', borderRadius:8, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', background:session===s.k?'#1B6CA8':'transparent', color:session===s.k?'#fff':C.gray, transition:'all 0.2s' }}>{s.l}</button>
            ))}
          </div>
        )}
        <div style={{ flex:1, fontSize:13, fontWeight:600, color:'#1B6CA8' }}>{session==='morning'?'☀ Ca sáng 6:30–11:45':'🌆 Ca chiều 13:25–17:15'}</div>
        <button onClick={()=>setPage('report')} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer' }}>📊</button>
        <button onClick={onLogout} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer' }}>🚪</button>
      </div>
      <div style={{ paddingBottom:72 }}>{pages[page]||pages.home}</div>
      <DriverNav page={page} setPage={setPage}/>
    </div>
  );
}
