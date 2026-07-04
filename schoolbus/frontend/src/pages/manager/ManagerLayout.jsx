// ============================================================
// MANAGER LAYOUT  (src/pages/manager/ManagerLayout.jsx)
// ============================================================
import React from 'react';
import { Sidebar, DashboardLayout } from '../../components/common';
const links = [
  { to:'/manager',         label:'Tổng quan',   icon:'📊', end:true },
  { to:'/manager/trips',   label:'Chuyến hôm nay', icon:'🚌' },
  { to:'/manager/fleet',   label:'Theo dõi xe', icon:'🗺️' },
  { to:'/manager/payments',label:'Thanh toán',  icon:'💰' },
];
export default function ManagerLayout() {
  return <DashboardLayout sidebar={<Sidebar title="Manager Panel" links={links} roleColor="bg-blue-900" />} />;
}
