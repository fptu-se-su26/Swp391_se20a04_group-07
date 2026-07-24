// ============================================================
// ADMIN — GỬI THÔNG BÁO (src/pages/admin/Notifications.jsx)
// ============================================================
import React from 'react';
import { adminApi } from '../../api';
import { SendNotificationCenter } from '../../components/common';

export default function AdminNotifications() {
  return <SendNotificationCenter api={adminApi} />;
}
