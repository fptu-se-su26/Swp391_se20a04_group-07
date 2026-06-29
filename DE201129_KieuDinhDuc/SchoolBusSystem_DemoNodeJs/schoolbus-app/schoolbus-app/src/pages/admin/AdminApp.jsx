import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { MOCK_STUDENTS, MOCK_BUSES, MOCK_DRIVERS, MOCK_LEAVES, MOCK_NOTIFICATIONS } from '../../data/mockData';
import { Card, Btn, Badge, Avatar, StatCard, Table, Th, Td, Modal, Input, Select, Textarea, TwoCol, Toast, Empty, C } from '../../components/UI';

// ── Sidebar ────────────────────────────────────────────────────
const NAV = [
  { key:'dashboard',     icon:'📊', label:'Tổng quan',           section:'TỔNG QUAN' },
  { key:'students',      icon:'👨‍👩‍👧', label:'Học sinh & PH',       section:'QUẢN LÝ' },
  { key:'buses',         icon:'🚌', label:'Xe đưa đón'           },
  { key:'drivers',       icon:'🧑‍✈️', label:'Tài xế'               },
  { key:'schedule',      icon:'📅', label:'Phân ca'               },
  { key:'attendance',    icon:'✅', label:'Điểm danh',            section:'HOẠT ĐỘNG' },
  { key:'leaves',        icon:'📝', label:'Đơn xin nghỉ'         },
  { key:'notifications', icon:'🔔', label:'Thông báo'            },
];

function Sidebar({ page, setPage, badges, onLogout }) {
  return (
    <div style={{ width:220, background:'#fff', borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', flexShrink:0, height:'100vh', position:'sticky', top:0 }}>
      <div style={{ padding:'18px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, background:'#2563EB', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🚌</div>
        <div><div style={{ fontSize:15, fontWeight:700 }}>SchoolBus</div><div style={{ fontSize:11, color:C.textSub }}>Admin Dashboard</div></div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {NAV.map(item => (
          <React.Fragment key={item.key}>
            {item.section && <div style={{ fontSize:10, fontWeight:600, color:'#bbb', padding:'10px 16px 3px', letterSpacing:'0.06em' }}>{item.section}</div>}
            <div onClick={()=>setPage(item.key)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', cursor:'pointer', fontSize:13, fontWeight:page===item.key?600:400, color:page===item.key?C.blue:C.textSub, background:page===item.key?C.blueSoft:'transparent', borderRadius:'0 10px 10px 0', marginRight:8, transition:'background 0.15s' }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {badges[item.key]>0 && <span style={{ background:'#DC2626', color:'#fff', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10 }}>{badges[item.key]}</span>}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:C.blueSoft, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:C.blue }}>AD</div>
        <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>Admin</div><div style={{ fontSize:11, color:C.textSub }}>Quản trị viên</div></div>
        <button onClick={onLogout} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16 }} title="Đăng xuất">🚪</button>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard({ students, buses, leaves, notifications, setPage, onApprove }) {
  const present  = 4; const absent = 1; const leave = 1;
  const pending  = leaves.filter(l=>l.status==='pending').length;
  const unread   = notifications.filter(n=>!n.read).length;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <StatCard icon="👨‍👩‍👧" label="Tổng học sinh" value={students.length} sub="6 đang hoạt động" color={C.blue} />
        <StatCard icon="🚌" label="Xe đưa đón"   value={buses.length}    sub="2 đang chạy"       color="#7C3AED" />
        <StatCard icon="✅" label="Điểm danh sáng" value={`${present}/${students.length}`} sub={`${absent} vắng · ${leave} nghỉ`} color={C.green} />
        <StatCard icon="🔔" label="Thông báo mới" value={unread} sub={`${pending} đơn chờ duyệt`} color={C.amber} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
            <span>📍</span><span style={{ fontWeight:600, flex:1 }}>Tuyến xe hôm nay</span>
          </div>
          <div style={{ padding:'16px 18px' }}>
            {buses.map(b => {
              const cnt = students.filter(s=>s.bus===b.plate&&s.morning==='present').length;
              const tot = students.filter(s=>s.bus===b.plate).length;
              const pct = tot ? Math.round(cnt/tot*100) : 0;
              return (
                <div key={b.id} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                    <span><strong>{b.route}</strong> <span style={{ color:C.textSub }}>{b.plate}</span></span>
                    <span>{cnt}/{tot} HS</span>
                  </div>
                  <div style={{ height:6, background:C.border, borderRadius:3 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:pct===100?C.green:pct>50?C.blue:C.red, borderRadius:3 }}/>
                  </div>
                  <div style={{ fontSize:11, color:C.textSub, marginTop:2 }}>Tài xế: {b.driver}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
            <span>📝</span><span style={{ fontWeight:600, flex:1 }}>Đơn xin nghỉ mới</span>
            <Btn sm variant="soft" onClick={()=>setPage('leaves')}>Xem tất cả</Btn>
          </div>
          <div style={{ padding:'0 18px' }}>
            {leaves.filter(l=>l.status==='pending').map(l => (
              <div key={l.id} style={{ padding:'11px 0', borderBottom:`1px solid ${C.border}`, display:'flex', gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#DC2626', flexShrink:0, marginTop:5 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{l.student}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{l.session} · {l.date}</div>
                </div>
                <Btn sm variant="green" onClick={()=>onApprove(l.id)}>Duyệt</Btn>
              </div>
            ))}
            {leaves.filter(l=>l.status==='pending').length===0 && <div style={{ padding:'20px 0', textAlign:'center', color:C.textSub, fontSize:13 }}>Không có đơn mới</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Students ──────────────────────────────────────────────────
function Students({ students, setStudents, showToast }) {
  const [search, setSearch]   = useState('');
  const [modal,  setModal]    = useState(null);
  const [form,   setForm]     = useState({ name:'', parent:'', phone:'', address:'', zone:'Khu A', route:'Tuyến 1' });
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.parent.toLowerCase().includes(search.toLowerCase()));

  function handleImport(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const wb = XLSX.read(ev.target.result, { type:'binary' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const newS = rows.map((r,i) => ({ id:Date.now()+i, name:r['Tên học sinh']||'', parent:r['Tên phụ huynh']||'', phone:r['SĐT']||'', address:r['Địa chỉ đón']||'', zone:r['Khu vực']||'Khu A', route:r['Tuyến']||'Tuyến 1', bus:'51B-12345', status:'active', morning:'pending', afternoon:'pending' }));
      setStudents(prev=>[...prev,...newS]);
      showToast(`Đã nhập ${newS.length} học sinh từ Excel`);
    };
    reader.readAsBinaryString(file);
  }

  return (
    <div>
      <Card>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontWeight:600, fontSize:14, flex:1 }}>Danh sách học sinh ({filtered.length})</span>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px', border:`1px solid ${C.border}`, borderRadius:8, background:C.graySoft }}>
            <span>🔍</span><input placeholder="Tìm kiếm..." value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none', background:'transparent', fontSize:13, outline:'none', width:160 }}/>
          </div>
          <label style={{ cursor:'pointer' }}>
            <Btn sm variant="gray" style={{ pointerEvents:'none' }}>📤 Nhập Excel</Btn>
            <input type="file" accept=".xlsx,.xls,.csv" style={{ display:'none' }} onChange={handleImport}/>
          </label>
          <Btn sm onClick={()=>setModal('add')}>+ Thêm mới</Btn>
        </div>
        <Table>
          <thead><tr><Th>Học sinh</Th><Th>Phụ huynh</Th><Th>SĐT</Th><Th>Địa chỉ</Th><Th>Khu vực</Th><Th>Tuyến</Th><Th>Trạng thái</Th><Th></Th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={s.name}/>{s.name}</div></Td>
                <Td>{s.parent}</Td>
                <Td style={{ color:C.textSub, fontSize:12 }}>{s.phone}</Td>
                <Td style={{ color:C.textSub, fontSize:12, maxWidth:160 }}>{s.address}</Td>
                <Td><span style={{ background:C.blueSoft, color:C.blue, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:500 }}>{s.zone}</span></Td>
                <Td>{s.route}</Td>
                <Td><Badge status={s.status}/></Td>
                <Td><Btn sm variant="soft" onClick={()=>setModal(s)}>👁 Chi tiết</Btn></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {modal==='add' && (
        <Modal title="Thêm học sinh mới" onClose={()=>setModal(null)}
          footer={<><Btn variant="ghost" onClick={()=>setModal(null)}>Hủy</Btn><Btn onClick={()=>{ if(!form.name)return; setStudents(p=>[...p,{...form,id:Date.now(),status:'active',morning:'pending',afternoon:'pending',bus:'51B-12345'}]); showToast('Đã thêm học sinh'); setModal(null); setForm({name:'',parent:'',phone:'',address:'',zone:'Khu A',route:'Tuyến 1'}); }}>Lưu</Btn></>}>
          <TwoCol><Input label="Tên học sinh *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nguyễn Văn A"/><Input label="Tên phụ huynh *" value={form.parent} onChange={e=>setForm({...form,parent:e.target.value})} placeholder="Nguyễn Văn B"/></TwoCol>
          <TwoCol><Input label="SĐT phụ huynh" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="09xxxxxxxx"/><Select label="Khu vực" value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})}><option>Khu A</option><option>Khu B</option><option>Khu C</option></Select></TwoCol>
          <Input label="Địa chỉ đón xe" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Số nhà, đường, quận..."/>
          <Select label="Tuyến xe" value={form.route} onChange={e=>setForm({...form,route:e.target.value})}><option>Tuyến 1</option><option>Tuyến 2</option><option>Tuyến 3</option></Select>
        </Modal>
      )}
      {modal&&modal.name&&(
        <Modal title="Chi tiết học sinh" onClose={()=>setModal(null)} footer={<Btn variant="ghost" onClick={()=>setModal(null)}>Đóng</Btn>}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
            <Avatar name={modal.name} size={52} bg={C.blue}/>
            <div><div style={{ fontSize:16,fontWeight:700 }}>{modal.name}</div><div style={{ fontSize:13,color:C.textSub }}>{modal.route} · {modal.zone}</div></div>
            <Badge status={modal.status}/>
          </div>
          {[['👤 Phụ huynh',modal.parent],['📞 SĐT',modal.phone],['📍 Địa chỉ',modal.address],['🚌 Tuyến xe',modal.route],['🗺 Khu vực',modal.zone]].map(([k,v])=>(
            <div key={k} style={{ display:'flex', gap:12, padding:'8px 0', borderBottom:`1px solid #f4f4f4`, fontSize:13 }}>
              <span style={{ color:C.textSub, width:130 }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

// ── Buses ─────────────────────────────────────────────────────
function Buses({ buses, setBuses, showToast }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ plate:'', capacity:'', route:'Tuyến 1' });
  return (
    <div>
      <Card>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontWeight:600, fontSize:14, flex:1 }}>Danh sách xe đưa đón ({buses.length})</span>
          <Btn sm onClick={()=>setModal(true)}>+ Thêm xe</Btn>
        </div>
        <Table>
          <thead><tr><Th>Biển số</Th><Th>Sức chứa</Th><Th>Tuyến</Th><Th>Tài xế</Th><Th>Trạng thái</Th></tr></thead>
          <tbody>{buses.map(b=>(
            <tr key={b.id}>
              <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:20 }}>🚌</span><strong>{b.plate}</strong></div></Td>
              <Td>{b.capacity} chỗ</Td>
              <Td><span style={{ background:C.blueSoft, color:C.blue, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:500 }}>{b.route}</span></Td>
              <Td style={{ color:b.driver==='Chưa phân'?C.textSub:C.text }}>{b.driver}</Td>
              <Td><Badge status={b.status}/></Td>
            </tr>
          ))}</tbody>
        </Table>
      </Card>
      {modal&&(
        <Modal title="Thêm xe đưa đón" onClose={()=>setModal(false)}
          footer={<><Btn variant="ghost" onClick={()=>setModal(false)}>Hủy</Btn><Btn onClick={()=>{ if(!form.plate)return; setBuses(p=>[...p,{...form,id:Date.now(),capacity:Number(form.capacity)||30,driver:'Chưa phân',status:'idle'}]); showToast('Đã thêm xe thành công'); setModal(false); }}>Lưu</Btn></>}>
          <TwoCol><Input label="Biển số xe *" value={form.plate} onChange={e=>setForm({...form,plate:e.target.value})} placeholder="51B-XXXXX"/><Input label="Sức chứa" type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} placeholder="30"/></TwoCol>
          <Select label="Tuyến xe" value={form.route} onChange={e=>setForm({...form,route:e.target.value})}><option>Tuyến 1</option><option>Tuyến 2</option><option>Tuyến 3</option><option>Tuyến 4</option></Select>
        </Modal>
      )}
    </div>
  );
}

// ── Drivers ───────────────────────────────────────────────────
function Drivers({ drivers, setDrivers, showToast }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name:'', phone:'', license:'B2', shift:'morning' });
  const shiftLabel = { morning:'☀ Sáng 6:30–11:45', afternoon:'🌆 Chiều 13:25–17:15', both:'Cả 2 ca' };
  const shiftColor = { morning:'#FFFBEB', afternoon:C.blueSoft, both:'#F3F0FF' };
  return (
    <div>
      <Card>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontWeight:600, fontSize:14, flex:1 }}>Danh sách tài xế ({drivers.length})</span>
          <Btn sm onClick={()=>setModal(true)}>+ Thêm tài xế</Btn>
        </div>
        <Table>
          <thead><tr><Th>Tài xế</Th><Th>SĐT</Th><Th>Bằng lái</Th><Th>Ca đăng ký</Th><Th>Xe phân công</Th><Th>Trạng thái</Th></tr></thead>
          <tbody>{drivers.map(d=>(
            <tr key={d.id}>
              <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={d.name}/>{d.name}</div></Td>
              <Td style={{ color:C.textSub, fontSize:12 }}>{d.phone}</Td>
              <Td><span style={{ background:C.graySoft, padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:500 }}>{d.license}</span></Td>
              <Td><span style={{ background:shiftColor[d.shift], padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:500 }}>{shiftLabel[d.shift]}</span></Td>
              <Td style={{ color:d.bus==='Chưa phân'?C.textSub:C.text, fontWeight:d.bus!=='Chưa phân'?600:400 }}>{d.bus}</Td>
              <Td><Badge status={d.status}/></Td>
            </tr>
          ))}</tbody>
        </Table>
      </Card>
      {modal&&(
        <Modal title="Thêm tài xế mới" onClose={()=>setModal(false)}
          footer={<><Btn variant="ghost" onClick={()=>setModal(false)}>Hủy</Btn><Btn onClick={()=>{ if(!form.name)return; setDrivers(p=>[...p,{...form,id:Date.now(),bus:'Chưa phân',status:'available'}]); showToast('Đã thêm tài xế'); setModal(false); }}>Lưu</Btn></>}>
          <TwoCol><Input label="Họ và tên *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nguyễn Văn A"/><Input label="Số điện thoại" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="09xxxxxxxx"/></TwoCol>
          <Select label="Ca làm việc" value={form.shift} onChange={e=>setForm({...form,shift:e.target.value})}><option value="morning">☀ Sáng (6:30 – 11:45)</option><option value="afternoon">🌆 Chiều (13:25 – 17:15)</option><option value="both">Cả 2 ca</option></Select>
        </Modal>
      )}
    </div>
  );
}

// ── Schedule ──────────────────────────────────────────────────
function Schedule({ drivers, setDrivers, buses, showToast }) {
  const morning   = drivers.filter(d=>d.shift==='morning'||d.shift==='both');
  const afternoon = drivers.filter(d=>d.shift==='afternoon'||d.shift==='both');
  function autoAssign() {
    const upd = drivers.map((d,i) => d.bus==='Chưa phân'&&buses[i] ? {...d,bus:buses[i].plate,status:'active'} : d);
    setDrivers(upd); showToast('Đã phân ca tự động!');
  }
  const ShiftCol = ({ title, color, list }) => (
    <Card>
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ background:color+'22', color, padding:'4px 12px', borderRadius:8, fontSize:13, fontWeight:600 }}>{title}</span>
        <span style={{ marginLeft:'auto', fontSize:12, color:C.textSub }}>{list.length} tài xế</span>
      </div>
      <div style={{ padding:'10px 16px' }}>
        {list.map(d=>(
          <div key={d.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
            <Avatar name={d.name}/>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{d.name}</div><div style={{ fontSize:11, color:C.textSub }}>{d.phone}</div></div>
            <select value={buses.find(b=>b.plate===d.bus)?.id||''} onChange={e=>{ const b=buses.find(x=>x.id===Number(e.target.value)); setDrivers(p=>p.map(x=>x.id===d.id?{...x,bus:b?.plate||'Chưa phân'}:x)); showToast('Đã lưu phân công'); }} style={{ padding:'5px 8px', borderRadius:8, border:`1px solid ${C.border}`, fontSize:12, background:'#fff', cursor:'pointer' }}>
              <option value="">Chọn tuyến</option>
              {buses.map(b=><option key={b.id} value={b.id}>{b.route} · {b.plate}</option>)}
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
  return (
    <div>
      <Card style={{ marginBottom:16 }}>
        <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14, fontWeight:600, flex:1 }}>🪄 Phân ca tự động theo đăng ký của tài xế</span>
          <Btn sm onClick={autoAssign}>🔄 Phân tự động</Btn>
        </div>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <ShiftCol title="☀ Buổi Sáng 6:30–11:45"   color={C.amber} list={morning}/>
        <ShiftCol title="🌆 Buổi Chiều 13:25–17:15" color={C.blue}  list={afternoon}/>
      </div>
    </div>
  );
}

// ── Attendance ────────────────────────────────────────────────
function Attendance({ students }) {
  const [session, setSession] = useState('morning');
  const present = students.filter(s=>s[session]==='present').length;
  const absent  = students.filter(s=>s[session]==='absent').length;
  const leave   = students.filter(s=>s[session]==='leave').length;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
        <StatCard icon="✅" label="Có mặt"   value={present} color={C.green}/>
        <StatCard icon="❌" label="Vắng mặt" value={absent}  color={C.red}/>
        <StatCard icon="📝" label="Xin nghỉ" value={leave}   color={C.amber}/>
      </div>
      <Card>
        <div style={{ padding:'0 18px', borderBottom:`1px solid ${C.border}`, display:'flex' }}>
          {[{k:'morning',l:'☀ Buổi Sáng'},{k:'afternoon',l:'🌆 Buổi Chiều'}].map(t=>(
            <div key={t.k} onClick={()=>setSession(t.k)} style={{ padding:'10px 16px', cursor:'pointer', fontSize:13, fontWeight:session===t.k?600:400, color:session===t.k?C.blue:C.textSub, borderBottom:session===t.k?`2px solid ${C.blue}`:'2px solid transparent', marginBottom:-1 }}>{t.l}</div>
          ))}
        </div>
        <Table>
          <thead><tr><Th>Học sinh</Th><Th>Tuyến xe</Th><Th>Xe</Th><Th>Trạng thái</Th><Th>Cập nhật</Th></tr></thead>
          <tbody>{students.map(s=>(
            <tr key={s.id}>
              <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={s.name}/>{s.name}</div></Td>
              <Td>{s.route}</Td>
              <Td style={{ fontSize:12, color:C.textSub }}>{s.bus}</Td>
              <Td><Badge status={s[session]}/></Td>
              <Td style={{ fontSize:12, color:C.textSub }}>{s[session]==='present'?'Tài xế điểm danh':s[session]==='leave'?'PH xin nghỉ':'—'}</Td>
            </tr>
          ))}</tbody>
        </Table>
        <div style={{ padding:'10px 18px', fontSize:12, color:C.textSub }}>ℹ️ Điểm danh do tài xế cập nhật qua app</div>
      </Card>
    </div>
  );
}

// ── Leaves ────────────────────────────────────────────────────
function Leaves({ leaves, setLeaves, showToast }) {
  const sessionColor = { 'Cả ngày':'red', 'Sáng':'amber', 'Chiều':'blue' };
  function handle(id, status) {
    setLeaves(p=>p.map(l=>l.id===id?{...l,status}:l));
    showToast(status==='approved'?'Đã duyệt đơn':'Đã từ chối đơn', status==='approved'?'success':'error');
  }
  return (
    <Card>
      <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontWeight:600, fontSize:14, flex:1 }}>Đơn xin nghỉ</span>
        <Badge status="pending"/><span style={{ fontSize:13, color:C.textSub }}>{leaves.filter(l=>l.status==='pending').length} chờ duyệt</span>
      </div>
      <div style={{ padding:'10px 18px', background:'#FFFBEB', borderBottom:`1px solid ${C.border}`, fontSize:12, color:C.amber }}>
        ⏰ Đơn phải gửi trước <strong>17:00 ngày hôm trước</strong>
      </div>
      <Table>
        <thead><tr><Th>Học sinh</Th><Th>Phụ huynh</Th><Th>Ngày nghỉ</Th><Th>Buổi</Th><Th>Lý do</Th><Th>Gửi lúc</Th><Th>Trạng thái</Th><Th></Th></tr></thead>
        <tbody>{leaves.map(l=>(
          <tr key={l.id}>
            <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={l.student}/>{l.student}</div></Td>
            <Td style={{ color:C.textSub }}>{l.parent}</Td>
            <Td><strong>{l.date}</strong></Td>
            <Td><span style={{ background:sessionColor[l.session]==='red'?C.redSoft:sessionColor[l.session]==='amber'?C.amberSoft:C.blueSoft, color:sessionColor[l.session]==='red'?C.red:sessionColor[l.session]==='amber'?C.amber:C.blue, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:500 }}>{l.session}</span></Td>
            <Td style={{ maxWidth:180, fontSize:12, color:C.textSub }}>{l.reason}</Td>
            <Td style={{ fontSize:11, color:'#aaa' }}>{l.submitted}</Td>
            <Td><Badge status={l.status}/></Td>
            <Td>{l.status==='pending'&&<div style={{ display:'flex', gap:4 }}><Btn sm variant="green" onClick={()=>handle(l.id,'approved')}>Duyệt</Btn><Btn sm variant="danger" onClick={()=>handle(l.id,'rejected')}>Từ chối</Btn></div>}</Td>
          </tr>
        ))}</tbody>
      </Table>
    </Card>
  );
}

// ── Notifications ─────────────────────────────────────────────
function AdminNotifications({ notifications, setNotifications, students, drivers, showToast }) {
  const [form, setForm] = useState({ to:'all-parents', type:'general', message:'' });
  return (
    <div>
      <Card style={{ marginBottom:16 }}>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}` }}><span style={{ fontWeight:600, fontSize:14 }}>📨 Gửi thông báo mới</span></div>
        <div style={{ padding:18 }}>
          <TwoCol>
            <Select label="Gửi đến" value={form.to} onChange={e=>setForm({...form,to:e.target.value})}>
              <option value="all-parents">Tất cả phụ huynh</option>
              <option value="all-drivers">Tất cả tài xế</option>
              <option value="zone-a">Phụ huynh – Khu A</option>
              <option value="zone-b">Phụ huynh – Khu B</option>
              <option value="zone-c">Phụ huynh – Khu C</option>
              {students.map(s=><option key={s.id} value={`parent-${s.id}`}>{s.parent} (PH của {s.name})</option>)}
              {drivers.map(d=><option key={d.id} value={`driver-${d.id}`}>{d.name} (Tài xế)</option>)}
            </Select>
            <Select label="Loại thông báo" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="general">Thông báo chung</option>
              <option value="schedule">Thay đổi lịch</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="reminder">Nhắc nhở</option>
            </Select>
          </TwoCol>
          <Textarea label="Nội dung" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Nhập nội dung thông báo..."/>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Btn onClick={()=>{ showToast('Đã gửi thông báo thành công'); setForm({...form,message:''}); }}>📤 Gửi thông báo</Btn>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontWeight:600, fontSize:14, flex:1 }}>🔔 Thông báo nhận được</span>
          <Btn sm variant="soft" onClick={()=>{ setNotifications(p=>p.map(n=>({...n,read:true}))); showToast('Đã đánh dấu đã đọc'); }}>Đọc tất cả</Btn>
        </div>
        <div style={{ padding:'0 18px' }}>
          {notifications.map(n=>(
            <div key={n.id} style={{ padding:'12px 0', borderBottom:`1px solid ${C.border}`, display:'flex', gap:10, background:!n.read?'#FAFBFF':'transparent', margin:!n.read?'0 -18px':'0', padding:!n.read?'12px 18px':'12px 0' }}>
              {!n.read?<div style={{ width:8, height:8, borderRadius:'50%', background:'#DC2626', flexShrink:0, marginTop:5 }}/>:<div style={{ width:8, flexShrink:0 }}/>}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  {n.from}
                  <span style={{ background:n.type==='leave'?C.amberSoft:C.blueSoft, color:n.type==='leave'?C.amber:C.blue, fontSize:10, padding:'1px 6px', borderRadius:10 }}>{n.type==='leave'?'Xin nghỉ':'Tài xế'}</span>
                </div>
                <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{n.message}</div>
              </div>
              <div style={{ fontSize:11, color:'#bbb', whiteSpace:'nowrap' }}>{n.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Admin App ─────────────────────────────────────────────────
export default function AdminApp({ onLogout }) {
  const [page,          setPage]   = useState('dashboard');
  const [students,  setStudents]   = useState(MOCK_STUDENTS);
  const [buses,     setBuses]      = useState(MOCK_BUSES);
  const [drivers,   setDrivers]    = useState(MOCK_DRIVERS);
  const [leaves,    setLeaves]     = useState(MOCK_LEAVES);
  const [notifications, setNotif] = useState(MOCK_NOTIFICATIONS);
  const [toast,     setToast]      = useState(null);

  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000); }
  function approveLeave(id) { setLeaves(p=>p.map(l=>l.id===id?{...l,status:'approved'}:l)); showToast('Đã duyệt đơn xin nghỉ'); }

  const pageTitles = { dashboard:'Bảng điều khiển', students:'Học sinh & Phụ huynh', buses:'Quản lý xe đưa đón', drivers:'Quản lý tài xế', schedule:'Phân ca tài xế', attendance:'Điểm danh hôm nay', leaves:'Đơn xin nghỉ', notifications:'Thông báo' };
  const badges = { leaves: leaves.filter(l=>l.status==='pending').length, notifications: notifications.filter(n=>!n.read).length };

  const content = {
    dashboard:     <Dashboard students={students} buses={buses} leaves={leaves} notifications={notifications} setPage={setPage} onApprove={approveLeave}/>,
    students:      <Students students={students} setStudents={setStudents} showToast={showToast}/>,
    buses:         <Buses buses={buses} setBuses={setBuses} showToast={showToast}/>,
    drivers:       <Drivers drivers={drivers} setDrivers={setDrivers} showToast={showToast}/>,
    schedule:      <Schedule drivers={drivers} setDrivers={setDrivers} buses={buses} showToast={showToast}/>,
    attendance:    <Attendance students={students}/>,
    leaves:        <Leaves leaves={leaves} setLeaves={setLeaves} showToast={showToast}/>,
    notifications: <AdminNotifications notifications={notifications} setNotifications={setNotif} students={students} drivers={drivers} showToast={showToast}/>,
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'Inter,sans-serif' }}>
      {toast && <Toast message={toast.msg} type={toast.type}/>}
      <Sidebar page={page} setPage={setPage} badges={badges} onLogout={onLogout}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'#fff', borderBottom:`1px solid ${C.border}`, padding:'13px 24px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <div style={{ flex:1, fontSize:16, fontWeight:700 }}>{pageTitles[page]}</div>
          <div style={{ fontSize:12, color:C.textSub }}>{new Date().toLocaleDateString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'})}</div>
          <div style={{ width:32, height:32, borderRadius:'50%', background:C.blueSoft, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:C.blue }}>AD</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', background:'#F5F7FF' }}>
          {content[page]}
        </div>
      </div>
    </div>
  );
}
