import React from 'react';

export const C = {
  blue:'#2563EB', blueSoft:'#EFF6FF', blueDark:'#1D4ED8',
  green:'#16A34A', greenSoft:'#F0FDF4',
  amber:'#D97706', amberSoft:'#FFFBEB',
  red:'#DC2626',   redSoft:'#FEF2F2',
  gray:'#6B7280',  graySoft:'#F9FAFB',
  text:'#111827',  textSub:'#6B7280',
  border:'#E5E7EB', white:'#FFFFFF', bg:'#F0F4FF',
};

export function Card({ children, style, onClick }) {
  return <div onClick={onClick} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 1px 6px rgba(0,0,0,0.06)', overflow:'hidden', cursor:onClick?'pointer':'default', ...style }}>{children}</div>;
}

export function Btn({ children, onClick, variant='primary', sm, full, disabled, loading, style }) {
  const v = {
    primary:{ background:C.blue,    color:'#fff', border:'none' },
    ghost:  { background:'transparent', color:C.blue, border:`1.5px solid ${C.blue}` },
    danger: { background:C.red,     color:'#fff', border:'none' },
    green:  { background:C.green,   color:'#fff', border:'none' },
    soft:   { background:C.blueSoft,color:C.blue, border:'none' },
    gray:   { background:C.graySoft,color:C.gray, border:'none' },
    amber:  { background:'#F59E0B', color:'#fff', border:'none' },
  }[variant]||{background:C.blue,color:'#fff',border:'none'};
  return (
    <button onClick={onClick} disabled={disabled||loading} style={{ ...v, padding:sm?'6px 14px':'10px 20px', borderRadius:10, fontSize:sm?12:13, fontWeight:600, cursor:(disabled||loading)?'not-allowed':'pointer', width:full?'100%':'auto', opacity:(disabled||loading)?0.6:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, transition:'opacity 0.15s', ...style }}>
      {loading ? <span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block' }}/> : children}
    </button>
  );
}

export function Badge({ status }) {
  const m = { present:{l:'✓ Có mặt',bg:C.greenSoft,c:C.green}, absent:{l:'✗ Vắng',bg:C.redSoft,c:C.red}, leave:{l:'~ Xin nghỉ',bg:C.amberSoft,c:C.amber}, pending:{l:'⋯ Chờ',bg:C.graySoft,c:C.gray}, approved:{l:'✓ Duyệt',bg:C.greenSoft,c:C.green}, rejected:{l:'✕ Từ chối',bg:C.redSoft,c:C.red}, active:{l:'● Hoạt động',bg:C.greenSoft,c:C.green}, idle:{l:'○ Chờ',bg:C.graySoft,c:C.gray}, completed:{l:'✓ Xong',bg:C.greenSoft,c:C.green} };
  const s = m[status]||{l:status,bg:C.graySoft,c:C.gray};
  return <span style={{ background:s.bg,color:s.c,padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600 }}>{s.l}</span>;
}

export function Spinner({ size=36 }) {
  return <div style={{ display:'flex',justifyContent:'center',padding:32 }}><div style={{ width:size,height:size,border:`3px solid ${C.blueSoft}`,borderTopColor:C.blue,borderRadius:'50%',animation:'spin 0.75s linear infinite' }}/></div>;
}

export function Avatar({ name, size=32, bg=C.blue }) {
  return <div style={{ width:size,height:size,borderRadius:'50%',background:bg+'22',color:bg,border:`1.5px solid ${bg}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.38,fontWeight:700,flexShrink:0 }}>{name?.[0]||'?'}</div>;
}

export function Toast({ message, type='success', onClose }) {
  const c = type==='error'?C.red:type==='warning'?C.amber:C.green;
  return <div style={{ position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',background:c,color:'#fff',padding:'11px 20px',borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:'0 8px 24px rgba(0,0,0,0.15)',display:'flex',alignItems:'center',gap:8,animation:'slideUp 0.25s ease',whiteSpace:'nowrap' }}>{type==='error'?'❌':type==='warning'?'⚠️':'✅'} {message}</div>;
}

export function Table({ children }) {
  return <div style={{ overflowX:'auto' }}><table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>{children}</table></div>;
}
export function Th({ children }) {
  return <th style={{ textAlign:'left',padding:'8px 14px',fontSize:11,fontWeight:600,color:C.gray,textTransform:'uppercase',letterSpacing:'0.04em',borderBottom:`1px solid ${C.border}`,background:C.graySoft }}>{children}</th>;
}
export function Td({ children, style }) {
  return <td style={{ padding:'10px 14px',borderBottom:`1px solid ${C.border}`,verticalAlign:'middle',...style }}>{children}</td>;
}

export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label&&<label style={{ display:'block',fontSize:12,fontWeight:600,color:C.textSub,marginBottom:5 }}>{label}</label>}
      <input style={{ width:'100%',padding:'9px 12px',borderRadius:10,border:`1.5px solid ${error?C.red:C.border}`,fontSize:13,outline:'none',background:'#fff',color:C.text }} {...props}/>
      {error&&<div style={{ fontSize:11,color:C.red,marginTop:3 }}>{error}</div>}
    </div>
  );
}
export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label&&<label style={{ display:'block',fontSize:12,fontWeight:600,color:C.textSub,marginBottom:5 }}>{label}</label>}
      <select style={{ width:'100%',padding:'9px 12px',borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,background:'#fff',color:C.text,outline:'none' }} {...props}>{children}</select>
    </div>
  );
}
export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label&&<label style={{ display:'block',fontSize:12,fontWeight:600,color:C.textSub,marginBottom:5 }}>{label}</label>}
      <textarea style={{ width:'100%',padding:'9px 12px',borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,background:'#fff',color:C.text,outline:'none',resize:'vertical',minHeight:80,fontFamily:'Inter,sans-serif' }} {...props}/>
    </div>
  );
}
export function Modal({ title, onClose, children, footer }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:'#fff',borderRadius:16,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding:'16px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontSize:15,fontWeight:700 }}>{title}</span>
          <Btn sm variant="gray" onClick={onClose}>✕</Btn>
        </div>
        <div style={{ padding:20 }}>{children}</div>
        {footer&&<div style={{ padding:'14px 20px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'flex-end',gap:8 }}>{footer}</div>}
      </div>
    </div>
  );
}
export function StatCard({ icon, label, value, sub, color=C.blue }) {
  return (
    <div style={{ background:color+'11',border:`1px solid ${color}22`,borderRadius:12,padding:'14px 16px',flex:1 }}>
      <div style={{ fontSize:11,color:C.textSub,marginBottom:6,display:'flex',alignItems:'center',gap:4 }}>{icon} {label}</div>
      <div style={{ fontSize:24,fontWeight:700,color }}>{value}</div>
      {sub&&<div style={{ fontSize:11,color:C.textSub,marginTop:2 }}>{sub}</div>}
    </div>
  );
}
export function Empty({ icon='📭', message }) {
  return <div style={{ textAlign:'center',padding:'40px 20px',color:C.gray }}><div style={{ fontSize:40,marginBottom:10 }}>{icon}</div><div style={{ fontSize:13 }}>{message}</div></div>;
}
export function TwoCol({ children }) {
  return <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>{children}</div>;
}
