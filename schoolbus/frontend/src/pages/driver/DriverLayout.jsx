// DRIVER LAYOUT
export function DriverLayout_() {} // placeholder, actual below

// src/pages/driver/DriverLayout.jsx
import React from 'react';
import { Sidebar, DashboardLayout } from '../../components/common';
const links = [
  { to:'/driver',         label:'Chuyến hôm nay', icon:'📋', end:true },
  { to:'/driver/active',  label:'Đang chạy',      icon:'🚌' },
  { to:'/driver/history', label:'Lịch sử',        icon:'📂' },
];
export default function DriverLayout() {
  return <DashboardLayout sidebar={<Sidebar title="Driver App" links={links} roleColor="bg-green-900" />} />;
}
