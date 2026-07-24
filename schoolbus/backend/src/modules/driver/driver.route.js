const express = require('express');
const router = express.Router();
const driverService = require('./driver.service');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');

const auth = [verifyToken, authorizeRoles('driver')];

router.get('/trips/today', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.getTodayTrips(req.user.id) }); } catch (e) { next(e); }
});

router.get('/trips/history', ...auth, async (req, res, next) => {
  try {
    const { page, limit, search, status, fromDate, toDate } = req.query;
    res.json({
      success: true,
      data: await driverService.getTripHistory(req.user.id, { page, limit, search, status, fromDate, toDate })
    });
  } catch (e) { next(e); }
});

// ← THÊM MỚI: số liệu tổng quan cho trang Lịch sử chuyến (4 thẻ thống kê)
router.get('/trips/history/stats', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.getTripHistoryStats(req.user.id) }); } catch (e) { next(e); }
});

router.get('/trips/:id', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.getTripDetail(req.params.id, req.user.id) }); } catch (e) { next(e); }
});

router.patch('/trips/:id/start', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.startTrip(req.params.id, req.user.id) }); } catch (e) { next(e); }
});

router.patch('/trips/:id/complete', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.completeTrip(req.params.id, req.user.id) }); } catch (e) { next(e); }
});

router.patch('/trips/:id/cancel', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.cancelTrip(req.params.id, req.user.id, req.body.reason) }); } catch (e) { next(e); }
});

router.patch('/trips/:id/attendance/:studentId', ...auth, async (req, res, next) => {
  try {
    const result = await driverService.updateAttendance(
      req.params.id, req.params.studentId, req.body.status, req.body.note, req.user.id
    );
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
});

router.post('/incidents', ...auth, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await driverService.reportIncident(req.body, req.user.id) }); } catch (e) { next(e); }
});

router.get('/performance', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.getPerformance(req.user.id) }); } catch (e) { next(e); }
});

// ============================================================
// NOTIFICATIONS — hộp thư thông báo của tài xế
// ============================================================
router.get('/notifications', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await driverService.getNotifications(req.user.id, req.query) }); }
  catch (e) { next(e); }
});

router.patch('/notifications/:id/read', ...auth, async (req, res, next) => {
  try {
    await driverService.markNotificationRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (e) { next(e); }
});

router.patch('/notifications/read-all', ...auth, async (req, res, next) => {
  try {
    await driverService.markAllNotificationsRead(req.user.id);
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;