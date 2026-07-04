const express = require('express');
const router  = express.Router();
const adminService = require('./admin.service');
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

module.exports = router;
