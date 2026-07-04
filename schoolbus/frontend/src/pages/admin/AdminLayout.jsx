import React from 'react';
import { Sidebar, DashboardLayout } from '../../components/common';

const links = [
  { to: '/admin',           label: 'Tổng quan',    icon: '📊', end: true },
  { to: '/admin/users',     label: 'Người dùng',   icon: '👥' },
  { to: '/admin/students',  label: 'Học sinh',      icon: '🎒' },
  { to: '/admin/vehicles',  label: 'Xe buýt',       icon: '🚌' },
  { to: '/admin/routes',    label: 'Tuyến đường',   icon: '🗺️' },
  { to: '/admin/incidents', label: 'Sự cố',         icon: '🚨' },
  { to: '/admin/reports',   label: 'Báo cáo',       icon: '📈' },
];

export default function AdminLayout() {
  return <DashboardLayout sidebar={<Sidebar title="Admin Panel" links={links} roleColor="bg-purple-900" />} />;
}
