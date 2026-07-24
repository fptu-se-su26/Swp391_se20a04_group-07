import React from 'react';
import { Sidebar, DashboardLayout, NotificationBell } from '../../components/common';

const links = [
  { to: '/admin',           label: 'Tổng quan',    icon: '📊', end: true },
  { to: '/admin/users',     label: 'Người dùng',   icon: '👥' },
  { to: '/admin/students',  label: 'Học sinh',      icon: '🎒' },
  { to: '/admin/vehicles',  label: 'Xe buýt',       icon: '🚌' },
  { to: '/admin/routes',    label: 'Tuyến đường',   icon: '🗺️' },
  { to: '/admin/absent-requests', label: 'Đơn xin vắng học', icon: '📋' },
  { to: '/admin/incidents', label: 'Sự cố',         icon: '🚨' },
  { to: '/admin/notifications', label: 'Gửi thông báo', icon: '📢' },
  { to: '/admin/reports',   label: 'Báo cáo',       icon: '📈' },
];

export default function AdminLayout() {
  return (
    <DashboardLayout sidebar={
      <Sidebar
        title="Admin Panel"
        links={links}
        roleColor="bg-purple-900"
        notifBell={<NotificationBell role="admin" absentRequestsPath="/admin/absent-requests" />}
      />
    } />
  );
}
