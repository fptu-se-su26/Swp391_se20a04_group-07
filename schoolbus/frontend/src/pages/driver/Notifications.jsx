// ============================================================
// DRIVER NOTIFICATIONS PAGE (src/pages/driver/Notifications.jsx)
// ============================================================
import React from 'react';
import { driverApi } from '../../api';
import { NotificationsInbox } from '../../components/common';

export default function DriverNotifications() {
  return <NotificationsInbox api={driverApi} title="Thông báo" />;
}
