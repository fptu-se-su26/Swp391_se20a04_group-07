import React from 'react';
import { DashboardLayout } from '../../components/common';

const links = [
  { to: '/parent',               label: 'Tổng quan',    icon: '🏠', end: true },
  { to: '/parent/tracking',      label: 'Theo dõi xe',  icon: '🗺️' },
  { to: '/parent/attendance',    label: 'Điểm danh',    icon: '📋' },
  { to: '/parent/location',      label: 'Vị trí nhà',   icon: '📍' },
  { to: '/parent/absent',        label: 'Báo vắng',     icon: '📝' },
  { to: '/parent/invoices',      label: 'Hóa đơn',      icon: '💰' },
  { to: '/parent/notifications', label: 'Thông báo',    icon: '🔔' },
  { to: '/parent/download',      label: 'Tải ứng dụng', icon: '📲' },
];

export default function ParentLayout() {
  return <DashboardLayout title="Phụ Huynh" links={links} roleColor="bg-yellow-800" />;
}
