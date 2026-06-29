import React, { useState } from 'react';
import { setToken, setRole, loginWithGoogle } from '../hooks/api';
import { MOCK_DRIVER_USER } from '../data/mockData';
import { C, Btn, Input } from '../components/UI';

export default function Login({ onLogin }) {
  const [screen, setScreen] = useState('select'); // select | driver
  const [phone, setPhone]   = useState('');
  const [pin,   setPin]     = useState('');
  const [err,   setErr]     = useState('');
  const [loading, setLoad]  = useState(false);

  async function driverLogin() {
    if (!phone || !pin) { setErr('Nhập đầy đủ thông tin'); return; }
    setLoad(true); setErr('');
    await new Promise(r => setTimeout(r, 700));
    if (phone === '0901111222' && pin === '1234') {
      setToken('driver_mock_' + Date.now());
      setRole('driver');
      onLogin('driver', MOCK_DRIVER_USER);
    } else { setErr('Số điện thoại hoặc PIN không đúng'); }
    setLoad(false);
  }

  // Admin mock login
  function adminLogin() {
    setToken('admin_mock_' + Date.now());
    setRole('admin');
    onLogin('admin', { name: 'Admin', role: 'admin' });
  }

  // Parent mock login (thật dùng Google OAuth)
  function parentMockLogin() {
    setToken('parent_mock_' + Date.now());
    setRole('parent');
    onLogin('parent', { id:1, name:'Nguyễn Văn An', email:'nguyen.an@gmail.com', phone:'0901234567', avatar_url:null });
  }

  if (screen === 'driver') return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#1B6CA8,#1A3A5C)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <button onClick={()=>setScreen('select')} style={{ color:'rgba(255,255,255,0.7)', background:'none', border:'none', cursor:'pointer', fontSize:13, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>
          ← Quay lại
        </button>
        <div style={{ background:'#fff', borderRadius:24, padding:'32px 28px', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:44, marginBottom:8 }}>🧑‍✈️</div>
            <div style={{ fontSize:20, fontWeight:700 }}>Đăng nhập Tài xế</div>
          </div>
          {err && <div style={{ background:'#FEE2E2', color:C.red, padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 }}>❌ {err}</div>}
          <Input label="Số điện thoại" type="tel" placeholder="09xxxxxxxx" value={phone} onChange={e=>setPhone(e.target.value)} />
          <Input label="Mã PIN" type="password" placeholder="4–6 chữ số" value={pin} onChange={e=>setPin(e.target.value)} maxLength={6} />
          <div style={{ fontSize:12, color:C.textSub, marginBottom:16, padding:'8px 12px', background:C.graySoft, borderRadius:8 }}>
            Demo: SĐT <strong>0901111222</strong> / PIN <strong>1234</strong>
          </div>
          <Btn full onClick={driverLogin} loading={loading}>Đăng nhập</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1e3a8a 0%,#2563EB 50%,#38bdf8 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:80, height:80, background:'rgba(255,255,255,0.15)', borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, margin:'0 auto 16px', border:'1.5px solid rgba(255,255,255,0.25)' }}>🚌</div>
          <div style={{ fontSize:28, fontWeight:700, color:'#fff' }}>SchoolBus</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', marginTop:4 }}>Hệ thống quản lý xe đưa đón học sinh</div>
        </div>

        <div style={{ background:'#fff', borderRadius:24, padding:'28px 24px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:20, textAlign:'center' }}>Chọn vai trò của bạn</div>

          {[
            { role:'admin',  icon:'🛡️', title:'Quản trị viên', sub:'Quản lý toàn bộ hệ thống', color:'#7C3AED', bg:'#F3F0FF', action: adminLogin },
            { role:'parent', icon:'👨‍👩‍👧', title:'Phụ huynh',      sub:'Theo dõi con & xin nghỉ',  color:C.blue,   bg:C.blueSoft, action: parentMockLogin },
            { role:'driver', icon:'🧑‍✈️', title:'Tài xế',          sub:'Lộ trình, điểm danh, GPS', color:'#0891B2', bg:'#ECFEFF', action: ()=>setScreen('driver') },
          ].map(item => (
            <div key={item.role} onClick={item.action} style={{
              display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
              borderRadius:14, border:`1.5px solid ${item.color}22`,
              background:item.bg, marginBottom:10, cursor:'pointer',
              transition:'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow=`0 4px 16px ${item.color}22`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
            >
              <div style={{ width:48, height:48, borderRadius:14, background:item.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:item.color }}>{item.title}</div>
                <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{item.sub}</div>
              </div>
              <div style={{ color:item.color, fontSize:18 }}>→</div>
            </div>
          ))}

          <div style={{ marginTop:16, padding:'12px', background:C.graySoft, borderRadius:10, fontSize:11, color:C.textSub, lineHeight:1.6 }}>
            ℹ️ Phụ huynh đăng nhập bằng Google. Admin & Tài xế dùng tài khoản do hệ thống cấp.
          </div>
        </div>
      </div>
    </div>
  );
}
