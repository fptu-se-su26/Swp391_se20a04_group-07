// ============================================================
// MANAGER LAYOUT  (src/pages/manager/ManagerLayout.jsx)
// ============================================================
import React from 'react';
import { DashboardLayout, NotificationBell } from '../../components/common';
const links = [
  { to:'/manager',         label:'Tổng quan',   icon:'📊', end:true },
  { to:'/manager/trips',   label:'Chuyến hôm nay', icon:'🚌' },
  { to:'/manager/fleet',   label:'Theo dõi xe', icon:'🗺️' },
  { to:'/manager/absent-requests', label:'Đơn xin vắng học', icon:'📋' },
  { to:'/manager/notifications', label:'Gửi thông báo', icon:'📢' },
  { to:'/manager/payments',label:'Thanh toán',  icon:'💰' },
  { to:'/manager/download',label:'Tải ứng dụng', icon:'📲' },
];
export default function ManagerLayout() {
  return (
    <DashboardLayout
      title="Manager Panel"
      links={links}
      roleColor="bg-blue-900"
      notifBell={<NotificationBell role="manager" absentRequestsPath="/manager/absent-requests" />}
    />
  );
}
