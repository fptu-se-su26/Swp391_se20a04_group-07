// src/pages/driver/DriverLayout.jsx
import React from 'react';
import { DashboardLayout } from '../../components/common';
const links = [
  { to:'/driver',              label:'Chuyến hôm nay', icon:'📋', end:true },
  { to:'/driver/active',       label:'Đang chạy',      icon:'🚌' },
  { to:'/driver/history',      label:'Lịch sử',        icon:'📂' },
  { to:'/driver/notifications',label:'Thông báo',      icon:'🔔' },
  { to:'/driver/download',     label:'Tải ứng dụng',  icon:'📲' },
];
export default function DriverLayout() {
  return <DashboardLayout title="Driver App" links={links} roleColor="bg-green-900" />;
}
