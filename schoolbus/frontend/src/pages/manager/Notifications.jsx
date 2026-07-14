// ============================================================
// MANAGER — GỬI THÔNG BÁO (src/pages/manager/Notifications.jsx)
// Dùng chung adminApi vì backend gộp route /admin/notifications/*
// cho cả 2 role (xem managerAuth trong admin.route.js)
// ============================================================
import React from 'react';
import { adminApi } from '../../api';
import { SendNotificationCenter } from '../../components/common';

export default function ManagerNotifications() {
  return <SendNotificationCenter api={adminApi} />;
}
