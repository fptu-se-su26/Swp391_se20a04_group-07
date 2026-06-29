import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_LEAVES, MOCK_NOTIFICATIONS, MOCK_BUSES, SCHOOL } from '../../data/mockData';
import { optimizeRoute, haversine } from '../../hooks/api';
import { Card, Btn, Badge, C, Toast, Input, Select, Textarea, Empty } from '../../components/UI';

// ── Bottom Nav ────────────────────────────────────────────────
function BottomNav({ page, setPage, unread }) {
  const items = [
    { key:'home',          icon:'🏠', label:'Tổng quan' },
    { key:'tracking',      icon:'📍', label:'Theo dõi'  },
    { key:'leaves',        icon:'📝', label:'Xin nghỉ'  },
    { key:'notifications', icon:'🔔', label:'Thông báo', badge: unread },
    { key:'profile',       icon:'👤', label:'Hồ sơ'     },
  ];
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:`1px solid ${C.border}`, display:'flex', zIndex:100, boxShadow:'0 -4px 20px rgba(0,0,0,0.07)', maxWidth:480, margin:'0 auto' }}>
      {items.map(item => (
        <div key={item.key} onClick={()=>setPage(item.key)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'9px 0 6px', cursor:'pointer', color:page===item.key?C.blue:C.gray, position:'relative' }}>
          {page===item.key && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:3, background:C.blue, borderRadius:2 }}/>}
          <div style={{ position:'relative' }}>
            <span style={{ fontSize:22 }}>{item.icon}</span>
            {item.badge>0 && <span style={{ position:'absolute', top:-4, right:-6, background:'#DC2626', color:'#fff', fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:10, minWidth:16, textAlign:'center' }}>{item.badge}</span>}
          </div>
          <span style={{ fontSize:10, fontWeight:page===item.key?700:400, marginTop:1 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────
function Home({ user, setPage }) {
  const students    = MOCK_STUDENTS.filter(s=>s.parent===user.name);
  const today       = new Date().toLocaleDateString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit'});
  const pendingLeaves = MOCK_LEAVES.filter(l=>l.parent===user.name&&l.status==='pending');
  const unreadNotifs  = MOCK_NOTIFICATIONS.filter(n=>!n.read).length;
  const hour = new Date().getHours();
  const greet = hour<12?'Chào buổi sáng':hour<18?'Chào buổi chiều':'Chào buổi tối';

  return (
    <div style={{ padding:'0 0 100px' }}>
      <div style={{ background:'linear-gradient(135deg,#2563EB,#38bdf8)', padding:'24px 20px 56px', borderRadius:'0 0 28px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" style={{ width:44, height:44, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.4)' }}/>
            : <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'#fff' }}>{user.name?.[0]}</div>
          }
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)' }}>{greet},</div>
            <div style={{ fontSize:17, fontWeight:700, color:'#fff' }}>{user.name}</div>
          </div>
          {unreadNotifs>0 && <div onClick={()=>setPage('notifications')} style={{ background:'#DC2626', color:'#fff', borderRadius:20, padding:'4px 10px', fontSize:12, fontWeight:600, cursor:'pointer' }}>🔔 {unreadNotifs}</div>}
        </div>
      </div>

      <div style={{ padding:'0 16px', marginTop:-40 }}>
        {students.length===0 ? (
          <Card style={{ marginBottom:16, padding:24, textAlign:'center', color:C.textSub, fontSize:13 }}>
            Chưa có thông tin học sinh. Liên hệ nhà trường để cập nhật.
          </Card>
        ) : students.map(child => {
          const bus = MOCK_BUSES.find(b=>b.plate===child.bus);
          return (
            <Card key={child.id} style={{ marginBottom:14, padding:'18px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#2563EB,#38bdf8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#fff' }}>{child.name?.[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:700 }}>{child.name}</div>
                  <div style={{ fontSize:13, color:C.textSub }}>{child.route} · {child.zone}</div>
                </div>
                <Badge status={child.status}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                <div style={{ background:C.bg, borderRadius:10, padding:'10px 12px' }}>
                  <div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>☀ Buổi sáng</div>
                  <Badge status={child.morning}/>
                </div>
                <div style={{ background:C.bg, borderRadius:10, padding:'10px 12px' }}>
                  <div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>🌆 Buổi chiều</div>
                  <Badge status={child.afternoon}/>
                </div>
              </div>
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, display:'flex', gap:16, fontSize:13 }}>
                <div><span style={{ color:C.textSub }}>🚌 </span><span style={{ fontWeight:500 }}>{child.bus}</span></div>
                <div><span style={{ color:C.textSub }}>👤 </span><span style={{ fontWeight:500 }}>{bus?.driver||'—'}</span></div>
                <Btn sm variant="soft" onClick={()=>setPage('tracking')} style={{ marginLeft:'auto' }}>📍 Theo dõi</Btn>
              </div>
            </Card>
          );
        })}

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[
            { icon:'📍', label:'Theo dõi xe',  page:'tracking',      color:'#2563EB', bg:'#EFF6FF' },
            { icon:'📝', label:'Xin nghỉ',     page:'leaves',        color:'#D97706', bg:'#FFFBEB' },
            { icon:'🔔', label:'Thông báo',    page:'notifications', color:'#16A34A', bg:'#F0FDF4' },
            { icon:'👤', label:'Hồ sơ',        page:'profile',       color:'#7C3AED', bg:'#F3F0FF' },
          ].map(item => (
            <Card key={item.page} onClick={()=>setPage(item.page)} style={{ padding:16, cursor:'pointer' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontSize:13, fontWeight:600, color:item.color }}>{item.label}</div>
            </Card>
          ))}
        </div>

        {/* Pending leaves */}
        {pendingLeaves.length>0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>Đơn xin nghỉ đang chờ duyệt</div>
            {pendingLeaves.map(l=>(
              <Card key={l.id} style={{ padding:'14px 16px', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:22 }}>📄</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{l.student}</div>
                    <div style={{ fontSize:12, color:C.textSub }}>{l.date} · {l.session}</div>
                  </div>
                  <Badge status={l.status}/>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tracking ──────────────────────────────────────────────────
function Tracking({ user }) {
  const children = MOCK_STUDENTS.filter(s=>s.parent===user.name);
  const [sel, setSel] = useState(children[0] || null);
  const bus = MOCK_BUSES.find(b=>b.plate===sel?.bus);
  const W=340, H=240, PAD=28;
  const pts = sel ? [{lat:sel.lat,lng:sel.lng,name:sel.name},{lat:SCHOOL.lat,lng:SCHOOL.lng,name:'Trường'},{lat:bus?.gps_lat||10.77,lng:bus?.gps_lng||106.70}] : [];
  const lats=pts.map(p=>p.lat), lngs=pts.map(p=>p.lng);
  const minLat=Math.min(...lats), maxLat=Math.max(...lats);
  const minLng=Math.min(...lngs), maxLng=Math.max(...lngs);
  const toX=lng=>maxLng===minLng?W/2:PAD+((lng-minLng)/(maxLng-minLng))*(W-PAD*2);
  const toY=lat=>maxLat===minLat?H/2:H-PAD-((lat-minLat)/(maxLat-minLat))*(H-PAD*2);

  return (
    <div style={{ padding:'0 16px 100px', animation:'slideUp 0.3s ease' }}>
      <div style={{ padding:'20px 0 14px' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>📍 Theo dõi lộ trình</div>
      </div>
      {children.length>1 && (
        <div style={{ display:'flex', gap:8, marginBottom:14, overflowX:'auto' }}>
          {children.map(c=>(
            <button key={c.id} onClick={()=>setSel(c)} style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:sel?.id===c.id?C.blue:C.blueSoft, color:sel?.id===c.id?'#fff':C.blue, whiteSpace:'nowrap' }}>{c.name}</button>
          ))}
        </div>
      )}
      <Card style={{ padding:14, marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:13 }}>
          <div><strong>{bus?.plate||'—'}</strong> · {sel?.route}</div>
          <Badge status={bus?.status||'idle'}/>
        </div>
        <div style={{ borderRadius:14, overflow:'hidden', background:'#EEF4FB' }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
            <rect width={W} height={H} fill="#EEF4FB"/>
            {[0,1,2,3].map(i=><line key={i} x1={0} y1={H/4*(i+0.5)} x2={W} y2={H/4*(i+0.5)} stroke="#fff" strokeWidth="8" strokeOpacity="0.5"/>)}
            {[0,1,2,3].map(i=><line key={i} x1={W/4*(i+0.5)} y1={0} x2={W/4*(i+0.5)} y2={H} stroke="#fff" strokeWidth="8" strokeOpacity="0.5"/>)}
            {pts.length>1&&<polyline points={pts.map(p=>`${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`).join(' ')} fill="none" stroke={C.blue} strokeWidth="2.5" strokeDasharray="6,3"/>}
            {sel&&<><circle cx={toX(sel.lng)} cy={toY(sel.lat)} r="8" fill={C.green} stroke="#fff" strokeWidth="2"/><text x={toX(sel.lng)+11} y={toY(sel.lat)+4} fontSize="9" fill={C.green} fontWeight="600">{sel.name.split(' ')[0]}</text></>}
            <circle cx={toX(SCHOOL.lng)} cy={toY(SCHOOL.lat)} r="11" fill={C.green} stroke="#fff" strokeWidth="2"/>
            <text x={toX(SCHOOL.lng)} y={toY(SCHOOL.lat)+4} textAnchor="middle" fontSize="11">🏫</text>
            {bus?.gps_lat&&<>
              <circle cx={toX(bus.gps_lng)} cy={toY(bus.gps_lat)} r="16" fill={C.blue} opacity="0.12"/>
              <circle cx={toX(bus.gps_lng)} cy={toY(bus.gps_lat)} r="11" fill={C.blue} stroke="#fff" strokeWidth="2"/>
              <text x={toX(bus.gps_lng)} y={toY(bus.gps_lat)+4} textAnchor="middle" fontSize="12">🚌</text>
              <circle cx={toX(bus.gps_lng)} cy={toY(bus.gps_lat)} r="11" fill="none" stroke={C.blue} strokeWidth="1.5"><animate attributeName="r" from="13" to="26" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite"/></circle>
            </>}
          </svg>
        </div>
        <div style={{ display:'flex', gap:14, marginTop:10, fontSize:11, color:C.textSub, justifyContent:'center' }}>
          <span>🚌 Xe hiện tại</span><span style={{ color:C.green }}>● Điểm đón</span><span>🏫 Trường</span>
        </div>
      </Card>
      {sel && (
        <Card style={{ padding:'16px' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Thông tin chuyến xe</div>
          {[
            ['🧑‍✈️ Tài xế', bus?.driver||'—'],
            ['🚌 Biển số', bus?.plate||'—'],
            ['🛣 Tuyến',    sel.route],
            ['📍 Điểm đón', sel.address],
          ].map(([k,v])=>(
            <div key={k} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
              <span style={{ color:C.textSub, width:110 }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ── Leaves ────────────────────────────────────────────────────
function Leaves({ user }) {
  const children = MOCK_STUDENTS.filter(s=>s.parent===user.name);
  const [leaves, setLeaves] = useState(MOCK_LEAVES.filter(l=>l.parent===user.name));
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]       = useState(null);
  const [form, setForm]         = useState({ student_id: children[0]?.id||'', leave_date:'', session:'all_day', reason:'' });
  const [errors, setErrors]     = useState({});

  function showToast(msg,type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000); }

  function validate() {
    const e={};
    if (!form.leave_date) { e.leave_date='Chọn ngày nghỉ'; }
    else {
      const leaveDay=new Date(form.leave_date);
      const today=new Date(); today.setHours(0,0,0,0);
      if (leaveDay<=today) e.leave_date='Ngày nghỉ phải là ngày mai trở đi';
      else {
        const deadline=new Date(leaveDay); deadline.setDate(deadline.getDate()-1); deadline.setHours(17,0,0,0);
        if (new Date()>deadline) e.leave_date='⏰ Đã quá 17:00 hôm qua – không thể gửi đơn cho ngày này';
      }
    }
    if (!form.reason.trim()) e.reason='Nhập lý do';
    return e;
  }

  function submit() {
    const e=validate(); if (Object.keys(e).length) { setErrors(e); return; }
    const child=children.find(c=>c.id===Number(form.student_id))||children[0];
    const sessionLabel={morning:'Sáng',afternoon:'Chiều',all_day:'Cả ngày'};
    setLeaves(prev=>[{ id:Date.now(), student:child?.name, parent:user.name, date:new Date(form.leave_date).toLocaleDateString('vi-VN'), session:sessionLabel[form.session], reason:form.reason, submitted:new Date().toLocaleString('vi-VN'), status:'pending' }, ...prev]);
    showToast('Đã gửi đơn xin nghỉ thành công!');
    setShowForm(false); setForm({...form,leave_date:'',reason:''}); setErrors({});
  }

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate  = tomorrow.toISOString().slice(0,10);

  return (
    <div style={{ padding:'0 16px 100px', animation:'slideUp 0.3s ease' }}>
      {toast && <Toast message={toast.msg} type={toast.type}/>}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0 14px' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>📝 Đơn xin nghỉ</div>
        {!showForm && <Btn sm onClick={()=>setShowForm(true)}>+ Tạo đơn</Btn>}
      </div>
      <Card style={{ padding:'12px 16px', marginBottom:14, background:'#FFFBEB', border:`1px solid #FCD34D` }}>
        <div style={{ fontSize:13, color:'#92400E', lineHeight:1.6 }}>⏰ <strong>Lưu ý:</strong> Đơn phải gửi trước <strong>17:00 ngày hôm trước</strong></div>
      </Card>
      {showForm && (
        <Card style={{ padding:'18px 16px', marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>📝 Tạo đơn xin nghỉ</div>
          {children.length>1 && <Select label="Học sinh" value={form.student_id} onChange={e=>setForm({...form,student_id:Number(e.target.value)})}>{children.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select>}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textSub, marginBottom:5 }}>Ngày nghỉ *</label>
            <input type="date" min={minDate} value={form.leave_date} onChange={e=>{ setForm({...form,leave_date:e.target.value}); setErrors({...errors,leave_date:null}); }} style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:`1.5px solid ${errors.leave_date?C.red:C.border}`, fontSize:13, outline:'none' }}/>
            {errors.leave_date && <div style={{ fontSize:11,color:C.red,marginTop:3 }}>{errors.leave_date}</div>}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textSub, marginBottom:8 }}>Buổi nghỉ *</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[{v:'morning',l:'☀ Sáng'},{v:'afternoon',l:'🌆 Chiều'},{v:'all_day',l:'📅 Cả ngày'}].map(opt=>(
                <button key={opt.v} onClick={()=>setForm({...form,session:opt.v})} style={{ padding:'9px 4px', borderRadius:10, fontSize:12, fontWeight:600, border:`1.5px solid ${form.session===opt.v?C.blue:C.border}`, background:form.session===opt.v?C.blueSoft:'#fff', color:form.session===opt.v?C.blue:C.textSub, cursor:'pointer' }}>{opt.l}</button>
              ))}
            </div>
          </div>
          <Textarea label="Lý do *" placeholder="Bé bị ốm, sốt cao..." value={form.reason} onChange={e=>{ setForm({...form,reason:e.target.value}); setErrors({...errors,reason:null}); }} error={errors.reason}/>
          <div style={{ display:'flex', gap:8 }}>
            <Btn variant="ghost" onClick={()=>{ setShowForm(false); setErrors({}); }} style={{ flex:1 }}>Hủy</Btn>
            <Btn onClick={submit} style={{ flex:2 }}>📤 Gửi đơn</Btn>
          </div>
        </Card>
      )}
      {leaves.length===0 && !showForm && <Empty icon="📋" message="Chưa có đơn xin nghỉ nào"/>}
      {leaves.map(l=>(
        <Card key={l.id} style={{ padding:'16px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <div><div style={{ fontSize:14, fontWeight:700 }}>{l.student}</div><div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{l.date} · {l.session}</div></div>
            <Badge status={l.status}/>
          </div>
          <div style={{ fontSize:13, color:C.textSub, borderTop:`1px solid ${C.border}`, paddingTop:8, lineHeight:1.6 }}><strong>Lý do:</strong> {l.reason}</div>
          <div style={{ fontSize:11, color:'#bbb', marginTop:6 }}>Gửi: {l.submitted}</div>
        </Card>
      ))}
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────
function ParentNotifications() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const unread = notifs.filter(n=>!n.read).length;
  const displayed = filter==='unread' ? notifs.filter(n=>!n.read) : notifs;
  const typeIcon = { leave:'📄', driver:'🚌', general:'📢', urgent:'🚨' };
  return (
    <div style={{ padding:'0 16px 100px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0 14px' }}>
        <div><div style={{ fontSize:18, fontWeight:700 }}>🔔 Thông báo</div>{unread>0&&<div style={{ fontSize:13,color:C.textSub,marginTop:2 }}>{unread} chưa đọc</div>}</div>
        {unread>0 && <Btn sm variant="soft" onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}>Đọc tất cả</Btn>}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[{k:'all',l:`Tất cả (${notifs.length})`},{k:'unread',l:`Chưa đọc (${unread})`}].map(t=>(
          <button key={t.k} onClick={()=>setFilter(t.k)} style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:filter===t.k?C.blue:C.blueSoft, color:filter===t.k?'#fff':C.blue }}>{t.l}</button>
        ))}
      </div>
      {displayed.length===0 && <Empty icon={filter==='unread'?'✅':'📭'} message={filter==='unread'?'Đã đọc hết thông báo!':'Chưa có thông báo nào.'}/>}
      {displayed.map(n=>(
        <div key={n.id} onClick={()=>!n.read&&setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))} style={{ marginBottom:10, cursor:!n.read?'pointer':'default' }}>
          <Card style={{ padding:14, borderLeft:!n.read?`3px solid ${C.blue}`:'3px solid transparent', background:!n.read?'#FAFBFF':C.white }}>
            <div style={{ display:'flex', gap:12 }}>
              <div style={{ width:38,height:38,borderRadius:12,background:n.type==='urgent'?C.redSoft:C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{typeIcon[n.type]||'📢'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:n.read?500:700,marginBottom:3 }}>{n.from}</div>
                <div style={{ fontSize:13,color:C.textSub,lineHeight:1.5 }}>{n.message}</div>
                <div style={{ fontSize:11,color:'#bbb',marginTop:6,display:'flex',alignItems:'center',gap:8 }}>
                  {n.time}
                  {!n.read && <div style={{ width:7,height:7,borderRadius:'50%',background:C.blue }}/>}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

// ── Profile ────────────────────────────────────────────────────
function Profile({ user, onLogout }) {
  const children = MOCK_STUDENTS.filter(s=>s.parent===user.name);
  const [phone, setPhone]   = useState(user.phone||'');
  const [editing, setEdit]  = useState(false);
  const [toast, setToast]   = useState(null);
  return (
    <div style={{ padding:'0 16px 100px' }}>
      {toast && <Toast message={toast.msg} type={toast.type}/>}
      <div style={{ fontSize:18,fontWeight:700,padding:'20px 0 14px' }}>👤 Hồ sơ cá nhân</div>
      <Card style={{ padding:'24px 20px', marginBottom:14, textAlign:'center' }}>
        {user.avatar_url
          ? <img src={user.avatar_url} alt="" style={{ width:80,height:80,borderRadius:'50%',border:`3px solid ${C.blue}`,marginBottom:12 }}/>
          : <div style={{ width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#2563EB,#38bdf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:700,color:'#fff',margin:'0 auto 12px' }}>{user.name?.[0]}</div>
        }
        <div style={{ fontSize:18,fontWeight:700 }}>{user.name}</div>
        <div style={{ fontSize:13,color:C.textSub,marginTop:4 }}>{user.email}</div>
        <div style={{ marginTop:10,display:'inline-flex',alignItems:'center',gap:6,background:C.greenSoft,color:C.green,padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:500 }}>● Tài khoản đã xác thực</div>
      </Card>
      <Card style={{ padding:'16px', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:14,fontWeight:700 }}>Thông tin liên hệ</span>
          {!editing && <Btn sm variant="soft" onClick={()=>setEdit(true)}>✏ Sửa</Btn>}
        </div>
        {[['📧 Email', user.email]].map(([k,v])=>(
          <div key={k} style={{ display:'flex',gap:10,padding:'7px 0',borderBottom:`1px solid ${C.border}`,fontSize:13 }}><span style={{ color:C.textSub,width:120 }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span></div>
        ))}
        <div style={{ display:'flex',gap:10,padding:'7px 0',fontSize:13 }}>
          <span style={{ color:C.textSub,width:120 }}>📞 SĐT</span>
          {editing
            ? <div style={{ flex:1 }}>
                <input value={phone} onChange={e=>setPhone(e.target.value)} style={{ width:'100%',padding:'7px 10px',borderRadius:8,border:`1px solid ${C.border}`,fontSize:13,outline:'none',marginBottom:8 }}/>
                <div style={{ display:'flex',gap:6 }}><Btn sm variant="ghost" onClick={()=>setEdit(false)} style={{ flex:1 }}>Hủy</Btn><Btn sm onClick={()=>{ setEdit(false); setToast({msg:'Đã cập nhật SĐT',type:'success'}); setTimeout(()=>setToast(null),2500); }} style={{ flex:2 }}>Lưu</Btn></div>
              </div>
            : <span style={{ fontWeight:500 }}>{phone||'Chưa cập nhật'}</span>
          }
        </div>
      </Card>
      <Card style={{ padding:'16px', marginBottom:14 }}>
        <div style={{ fontSize:14,fontWeight:700,marginBottom:12 }}>👨‍👩‍👧 Học sinh ({children.length})</div>
        {children.map((c,i)=>(
          <div key={c.id} style={{ display:'flex',alignItems:'center',gap:12,padding:i>0?'12px 0 0':0,borderTop:i>0?`1px solid ${C.border}`:'none',paddingTop:i>0?12:0 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#2563EB,#38bdf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:'#fff' }}>{c.name?.[0]}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:14,fontWeight:600 }}>{c.name}</div><div style={{ fontSize:12,color:C.textSub }}>{c.route} · {c.zone}</div></div>
            <div style={{ fontSize:12,color:C.textSub,textAlign:'right' }}><div>{c.bus}</div><div style={{ color:'#bbb',marginTop:2 }}>{c.address.slice(0,18)}...</div></div>
          </div>
        ))}
      </Card>
      <Btn full variant="danger" onClick={onLogout}>🚪 Đăng xuất</Btn>
    </div>
  );
}

// ── Parent App ────────────────────────────────────────────────
export default function ParentApp({ user, onLogout }) {
  const [page, setPage] = useState('home');
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const unread = notifs.filter(n=>!n.read).length;

  const pages = {
    home:          <Home          user={user} setPage={setPage}/>,
    tracking:      <Tracking      user={user}/>,
    leaves:        <Leaves        user={user}/>,
    notifications: <ParentNotifications/>,
    profile:       <Profile       user={user} onLogout={onLogout}/>,
  };

  return (
    <div style={{ maxWidth:480, margin:'0 auto', minHeight:'100vh', background:'#F0F4FF', position:'relative' }}>
      {pages[page]||pages.home}
      <BottomNav page={page} setPage={setPage} unread={unread}/>
    </div>
  );
}
