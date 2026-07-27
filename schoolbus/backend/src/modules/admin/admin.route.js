const express = require('express');
const router = express.Router();
const adminService = require('./admin.service');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');
const absentRequestRoutes = require('../absentRequest/absentRequest.route');
router.use('/absent-requests', absentRequestRoutes);

const auth = [verifyToken, authorizeRoles('admin')];
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

// ============================================================
// THÊM VÀO admin.route.js (dưới các route ── USERS ── là hợp lý nhất)
// Chỉ chạy 1 lần để geocode ngược cho các học sinh ĐÃ CÓ SẴN trong DB
// trước khi tính năng này ra đời (học sinh thêm mới sau này sẽ tự
// geocode ngay lúc tạo, không cần dùng route này nữa).
// ============================================================
router.post('/students/geocode-missing', ...auth, async (req, res, next) => {
  try {
    const { Student } = require('../../models');
    const { Op } = require('sequelize');
    const { geocodeAddress } = require('../../utils/geocode.util');

    const students = await Student.findAll({
      where: {
        home_address: { [Op.ne]: null },
        home_lat: null,
      },
      attributes: ['id', 'home_address'],
    });

    let success = 0;
    const failed = [];

    // Chạy tuần tự (không Promise.all) để tránh vượt rate-limit của Mapbox Geocoding API
    for (const s of students) {
      const result = await geocodeAddress(s.home_address);
      if (result) {
        await Student.update(
          { home_lat: result.lat, home_lng: result.lng },
          { where: { id: s.id } }
        );
        success++;
      } else {
        failed.push({ id: s.id, address: s.home_address });
      }
      // Nghỉ nhẹ giữa các lần gọi, tránh bị Mapbox chặn do gọi quá nhanh
      await new Promise((r) => setTimeout(r, 150));
    }

    res.json({
      success: true,
      message: `Đã geocode ${success}/${students.length} học sinh`,
      data: { total: students.length, success, failed },
    });
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

// Báo cáo lợi nhuận: chỉ tính hóa đơn status='paid', theo kỳ due_date hàng tháng,
// lọc thêm theo tuyến xe (PaymentPlan.route_id) nếu có truyền routeId.
router.get('/reports/revenue', ...auth, async (req, res, next) => {
  try {
    const { startDate, endDate, routeId } = req.query;
    res.json({ success: true, data: await adminService.getRevenueReport({ startDate, endDate, routeId }) });
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
