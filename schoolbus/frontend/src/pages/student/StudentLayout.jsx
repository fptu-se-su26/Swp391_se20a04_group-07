// ============================================================
// STUDENT LAYOUT  (src/pages/student/StudentLayout.jsx)
// ============================================================
import React from 'react';
import { Sidebar, DashboardLayout } from '../../components/common';
const links = [
  { to: '/student',     label: 'Trang chủ',   icon: '🏠', end: true },
  { to: '/student/bus', label: 'Theo dõi xe',  icon: '🚌' },
];
export default function StudentLayout() {
  return <DashboardLayout sidebar={<Sidebar title="Học Sinh" links={links} roleColor="bg-teal-800" />} />;
}
