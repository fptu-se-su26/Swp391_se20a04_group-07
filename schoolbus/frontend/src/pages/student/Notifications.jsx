// ============================================================
// STUDENT NOTIFICATIONS PAGE (src/pages/student/Notifications.jsx)
// ============================================================
import React from 'react';
import { studentApi } from '../../api';
import { NotificationsInbox } from '../../components/common';

export default function StudentNotifications() {
  return <NotificationsInbox api={studentApi} title="Thông báo" />;
}
