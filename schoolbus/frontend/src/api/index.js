import api from './axios';

// ============================================================
// AUTH
// ============================================================
export const authApi = {
  login:          (data) => api.post('/auth/login', data),
  register:       (data) => api.post('/auth/register', data),
  logout:         (refreshToken) => api.post('/auth/logout', { refreshToken }),
  getMe:          () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOtp:      (data) => api.post('/auth/verify-otp', data),
  resetPassword:  (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  refreshToken:   (token) => api.post('/auth/refresh-token', { refreshToken: token }),
};

// ============================================================
// ADMIN
// ============================================================
export const adminApi = {
  getDashboard:    () => api.get('/admin/dashboard/stats'),
  getUsers:        (params) => api.get('/admin/users', { params }),
  getUser:         (id) => api.get(`/admin/users/${id}`),
  createUser:      (data) => api.post('/admin/users', data),
  updateUser:      (id, data) => api.put(`/admin/users/${id}`, data),
  toggleActive:    (id) => api.patch(`/admin/users/${id}/toggle-active`),
  deleteUser:      (id) => api.delete(`/admin/users/${id}`),

  getVehicles:     () => api.get('/admin/vehicles'),
  createVehicle:   (data) => api.post('/admin/vehicles', data),
  updateVehicle:   (id, data) => api.put(`/admin/vehicles/${id}`, data),
  deleteVehicle:   (id) => api.delete(`/admin/vehicles/${id}`),

  getRoutes:       () => api.get('/admin/routes'),
  createRoute:     (data) => api.post('/admin/routes', data),
  updateRoute:     (id, data) => api.put(`/admin/routes/${id}`, data),
  addStop:         (id, data) => api.post(`/admin/routes/${id}/stops`, data),
  assignDriver:    (data) => api.post('/admin/assign-driver', data),

  getIncidents:    (params) => api.get('/admin/incidents', { params }),
  resolveIncident: (id, note) => api.patch(`/admin/incidents/${id}/resolve`, { note }),

  getReport:       (params) => api.get('/admin/reports/attendance', { params }),

  // Đơn xin vắng học
  getAbsentRequests:   (params) => api.get('/admin/absent-requests', { params }),
  getAbsentRequestById:(id) => api.get(`/admin/absent-requests/${id}`),

  // Chuông thông báo của chính Admin/Manager đang đăng nhập
  getMyNotifications:      (params) => api.get('/admin/notifications', { params }),
  markNotificationRead:    (id) => api.patch(`/admin/notifications/${id}/read`),
  markAllNotificationsRead:() => api.patch('/admin/notifications/read-all'),

  // ── Gửi thông báo theo đối tượng (mới) ──
  sendNotification:      ({ title, body, priority, targetRole }) =>
    api.post('/admin/notifications/send', { title, body, priority, targetRole }),
  getNotificationHistory:(params) => api.get('/admin/notifications/history', { params }),
  recallNotification:    (batchId) => api.patch(`/admin/notifications/history/${batchId}/recall`),
  editNotification:      (batchId, data) => api.put(`/admin/notifications/history/${batchId}`, data),
  togglePinNotification: (batchId) => api.patch(`/admin/notifications/history/${batchId}/pin`),
};

// ============================================================
// MANAGER
// ============================================================
export const managerApi = {
  getOverview:        () => api.get('/manager/dashboard/overview'),
  getTripsToday:      () => api.get('/manager/trips/today'),
  cancelTrip:         (id, reason) => api.patch(`/manager/trips/${id}/cancel`, { reason }),
  getSubscriptions:   () => api.get('/manager/subscriptions/pending'),
  generateInvoices:   (data) => api.post('/manager/payments/generate-invoices', data),
  getFeedbacks:       () => api.get('/manager/feedbacks'),
};

// ============================================================
// DRIVER
// ============================================================
export const driverApi = {
  getTodayTrips:       () => api.get('/driver/trips/today'),
  getTripDetail:       (id) => api.get(`/driver/trips/${id}`),
  startTrip:           (id) => api.patch(`/driver/trips/${id}/start`),
  completeTrip:        (id) => api.patch(`/driver/trips/${id}/complete`),
  cancelTrip:          (id, reason) => api.patch(`/driver/trips/${id}/cancel`, { reason }),
  updateAttendance:    (tripId, studentId, data) => api.patch(`/driver/trips/${tripId}/attendance/${studentId}`, data),
  reportIncident:      (data) => api.post('/driver/incidents', data),
  getTripHistory:      (params) => api.get('/driver/trips/history', { params }),
  getTripHistoryStats: () => api.get('/driver/trips/history/stats'),
  getPerformance:      () => api.get('/driver/performance'),

  // ── Thông báo ──
  getNotifications: (params) => api.get('/driver/notifications', { params }),
  markRead:         (id) => api.patch(`/driver/notifications/${id}/read`),
  markAllRead:      () => api.patch('/driver/notifications/read-all'),
};

// ============================================================
// PARENT
// ============================================================
export const parentApi = {
  getChildren:          () => api.get('/parent/children'),
  linkChild:            (data) => api.post('/parent/children/link', data),
  getBusStatus:         (id) => api.get(`/parent/children/${id}/bus-status`),
  getCurrentTrip:       (id) => api.get(`/parent/children/${id}/trip/current`),
  getAttendanceHistory: (id, params) => api.get(`/parent/children/${id}/attendance`, { params }),
  getSubscriptions:     () => api.get('/parent/subscriptions'),
  createSubscription:   (data) => api.post('/parent/subscriptions', data),
  getAbsentRequests:    () => api.get('/parent/absent-requests'),
  createAbsentRequest:  (data) => api.post('/parent/absent-requests', data),
  getInvoices:          () => api.get('/parent/invoices'),
  payInvoice:           (id, data) => api.post(`/parent/invoices/${id}/pay`, data),
  getNotifications:     (params) => api.get('/parent/notifications', { params }),
  markRead:             (id) => api.patch(`/parent/notifications/${id}/read`),
  markAllRead:          () => api.patch('/parent/notifications/read-all'),
  createFeedback:       (data) => api.post('/parent/feedback', data),
};

// ============================================================
// STUDENT
// ============================================================
export const studentApi = {
  getProfile:      () => api.get('/student/profile'),
  getMyRoute:      () => api.get('/student/my-route'),
  getCurrentTrip:  () => api.get('/student/trips/current'),
  getWeekSchedule: (date) => api.get('/student/schedule/week', { params: date ? { date } : {} }),

  // ── Thông báo ──
  getNotifications: (params) => api.get('/student/notifications', { params }),
  markRead:         (id) => api.patch(`/student/notifications/${id}/read`),
  markAllRead:      () => api.patch('/student/notifications/read-all'),
};
