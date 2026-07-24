const express = require('express');
const router  = express.Router();
const adminService = require('./admin.service');
const absentRequestService = require('./absentRequest.service');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');

const auth        = [verifyToken, authorizeRoles('admin')];
const managerAuth = [verifyToken, authorizeRoles('admin', 'manager')];

// ── DASHBOARD ──────────────────────────────────────────────
router.get('/dashboard/stats', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.getDashboardStats() }); }
  catch (e) { next(e); }
});

// ── USERS ──────────────────────────────────────────────────
router.get('/users', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.getUsers(req.query) }); }
  catch (e) { next(e); }
});
router.post('/users', ...auth, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await adminService.createUser(req.body) }); }
  catch (e) { next(e); }
});
router.get('/users/:id', ...auth, async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id, req.query.role);
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});
router.put('/users/:id', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.updateUser(req.params.id, req.body) }); }
  catch (e) { next(e); }
});
router.patch('/users/:id/toggle-active', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.toggleActive(req.params.id, req.body.role) }); }
  catch (e) { next(e); }
});
router.delete('/users/:id', ...auth, async (req, res, next) => {
  try {
    const role = req.body.role || req.query.role;
    await adminService.deleteUser(req.params.id, role);
    res.json({ success: true, message: 'Đã xóa user' });
  } catch (e) { next(e); }
});

// ── VEHICLES ───────────────────────────────────────────────
router.get('/vehicles', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.getVehicles() }); }
  catch (e) { next(e); }
});
router.post('/vehicles', ...auth, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await adminService.createVehicle(req.body) }); }
  catch (e) { next(e); }
});
router.put('/vehicles/:id', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.updateVehicle(req.params.id, req.body) }); }
  catch (e) { next(e); }
});
router.delete('/vehicles/:id', ...auth, async (req, res, next) => {
  try { await adminService.deleteVehicle(req.params.id); res.json({ success: true }); }
  catch (e) { next(e); }
});

// ── ROUTES ─────────────────────────────────────────────────
router.get('/routes', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.getRoutes() }); }
  catch (e) { next(e); }
});
router.post('/routes', ...auth, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await adminService.createRoute(req.body) }); }
  catch (e) { next(e); }
});
router.put('/routes/:id', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.updateRoute(req.params.id, req.body) }); }
  catch (e) { next(e); }
});
// ← THÊM MỚI: DELETE route
router.delete('/routes/:id', ...auth, async (req, res, next) => {
  try {
    const { Route } = require('../../models');
    const r = await Route.findByPk(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Tuyến không tồn tại' });
    await r.destroy();
    res.json({ success: true, message: 'Đã xóa tuyến đường' });
  } catch (e) { next(e); }
});
router.post('/routes/:id/stops', ...auth, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await adminService.addStop(req.params.id, req.body) }); }
  catch (e) { next(e); }
});
router.post('/assign-driver', ...auth, async (req, res, next) => {
  try {
    const { vehicleId, driverId, routeId } = req.body;
    res.json({ success: true, data: await adminService.assignDriver(vehicleId, driverId, routeId) });
  } catch (e) { next(e); }
});

// ── INCIDENTS ──────────────────────────────────────────────
router.get('/incidents', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.getIncidents(req.query) }); }
  catch (e) { next(e); }
});
router.patch('/incidents/:id/resolve', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.resolveIncident(req.params.id, req.user.id) }); }
  catch (e) { next(e); }
});

// ── REPORTS ────────────────────────────────────────────────
router.get('/reports/attendance', ...auth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    res.json({ success: true, data: await adminService.getAttendanceReport(startDate, endDate) });
  } catch (e) { next(e); }
});

// ── NOTIFICATIONS ──────────────────────────────────────────
router.post('/notifications/broadcast', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.broadcastNotification(req.body) }); }
  catch (e) { next(e); }
});

// Thông báo của chính Admin/Manager đang đăng nhập (chuông thông báo)
router.get('/notifications', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.getMyNotifications(req.user.id, req.user.role, req.query) }); }
  catch (e) { next(e); }
});
router.patch('/notifications/:id/read', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.markNotificationRead(req.params.id, req.user.id, req.user.role) }); }
  catch (e) { next(e); }
});
router.patch('/notifications/read-all', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.markAllNotificationsRead(req.user.id, req.user.role) }); }
  catch (e) { next(e); }
});

// ── ĐƠN XIN VẮNG HỌC (tab riêng, không gộp chung thông báo khác) ──
router.get('/absent-requests', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await absentRequestService.getAbsentRequests(req.query) }); }
  catch (e) { next(e); }
});
router.get('/absent-requests/:id', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await absentRequestService.getAbsentRequestById(req.params.id) }); }
  catch (e) { next(e); }
});
// ============================================================
// THÊM CÁC ROUTE SAU VÀO admin.route.js
// (chèn ngay dưới route cũ `router.post('/notifications/broadcast', ...)`,
//  hoặc thay thế hẳn route đó nếu bạn không cần giữ kiểu gửi "broadcast tất cả" cũ nữa)
// ============================================================

// Cho phép cả Admin lẫn Manager gửi thông báo (giống pattern managerAuth ở /vehicles)
router.post('/notifications/send', ...managerAuth, async (req, res, next) => {
  try {
    const { title, body, priority, targetRole } = req.body;
    const result = await adminService.sendNotification(req.user.id, req.user.role, { title, body, priority, targetRole });
    res.status(201).json({ success: true, message: `Đã gửi thông báo tới ${result.sent} người nhận`, data: result });
  } catch (e) { next(e); }
});

router.get('/notifications/history', ...managerAuth, async (req, res, next) => {
  try {
    const { page, limit, search, targetRole, fromDate, toDate } = req.query;
    res.json({ success: true, data: await adminService.getNotificationHistory({ page, limit, search, targetRole, fromDate, toDate }) });
  } catch (e) { next(e); }
});

router.patch('/notifications/history/:batchId/recall', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.recallNotification(req.params.batchId) }); }
  catch (e) { next(e); }
});

router.put('/notifications/history/:batchId', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.editNotification(req.params.batchId, req.body) }); }
  catch (e) { next(e); }
});

router.patch('/notifications/history/:batchId/pin', ...managerAuth, async (req, res, next) => {
  try { res.json({ success: true, data: await adminService.togglePinNotification(req.params.batchId) }); }
  catch (e) { next(e); }
});

module.exports = router;
