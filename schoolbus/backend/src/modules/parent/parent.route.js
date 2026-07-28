const express = require('express');
const router = express.Router();
const parentService = require('./parent.service');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');

const auth = [verifyToken, authorizeRoles('parent')];

router.get('/children', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getChildren(req.user.id) }); } catch (e) { next(e); }
});
router.post('/children/link', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.linkChild(req.user.id, req.body.studentCode, req.body.dob) }); } catch (e) { next(e); }
});

router.get('/children/:id/bus-status', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getChildBusStatus(req.user.id, req.params.id) }); } catch (e) { next(e); }
});
router.get('/children/:id/trip/current', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getCurrentTrip(req.user.id, req.params.id) }); } catch (e) { next(e); }
});
router.get('/children/:id/attendance', ...auth, async (req, res, next) => {
  try {
    const { month, year } = req.query;
    res.json({ success: true, data: await parentService.getAttendanceHistory(req.user.id, req.params.id, month || new Date().getMonth() + 1, year || new Date().getFullYear()) });
  } catch (e) { next(e); }
});

router.get('/subscriptions', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getSubscriptions(req.user.id) }); } catch (e) { next(e); }
});
router.post('/subscriptions', ...auth, async (req, res, next) => {
  try {
    const { studentId, routeId, pickupStopId } = req.body;
    res.status(201).json({ success: true, data: await parentService.createSubscription(req.user.id, studentId, routeId, pickupStopId) });
  } catch (e) { next(e); }
});

router.get('/absent-requests', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getAbsentRequests(req.user.id) }); } catch (e) { next(e); }
});
router.post('/absent-requests', ...auth, async (req, res, next) => {
  try {
    const { studentId, absentDate, tripType, reason } = req.body;
    res.status(201).json({ success: true, data: await parentService.createAbsentRequest(req.user.id, studentId, absentDate, tripType, reason) });
  } catch (e) { next(e); }
});

router.get('/invoices', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getInvoices(req.user.id) }); } catch (e) { next(e); }
});
router.post('/invoices/:id/pay', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.payInvoice(req.params.id, req.user.id, req.body.payment_method) }); } catch (e) { next(e); }
});

router.get('/notifications', ...auth, async (req, res, next) => {
  try { res.json({ success: true, data: await parentService.getNotifications(req.user.id, req.query.page, req.query.limit) }); } catch (e) { next(e); }
});
router.patch('/notifications/:id/read', ...auth, async (req, res, next) => {
  try { await parentService.markNotificationRead(req.params.id, req.user.id); res.json({ success: true }); } catch (e) { next(e); }
});
router.patch('/notifications/read-all', ...auth, async (req, res, next) => {
  try { await parentService.markAllRead(req.user.id); res.json({ success: true }); } catch (e) { next(e); }
});

router.post('/feedback', ...auth, async (req, res, next) => {
  try {
    const { tripId, targetType, rating, comment } = req.body;
    res.status(201).json({ success: true, data: await parentService.createFeedback(req.user.id, tripId, targetType, rating, comment) });
  } catch (e) { next(e); }
});

// ── Vị trí nhà học sinh ──────────────────────────────────────────────────────

/**
 * GET /api/v1/parent/children/:childId/location
 * Lấy thông tin vị trí hiện tại (home_address, home_lat, home_lng) của con.
 */
router.get('/children/:childId/location', ...auth, async (req, res, next) => {
  try {
    const data = await parentService.getChildLocation(req.user.id, req.params.childId);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

/**
 * PATCH /api/v1/parent/children/:childId/location
 * Cập nhật vị trí nhà học sinh.
 * Body: { home_address?, home_lat?, home_lng? }
 *   - Nếu có home_lat + home_lng: lưu trực tiếp (ưu tiên tuyệt đối - Parent kéo marker)
 *   - Nếu chỉ có home_address: geocode lại
 */
router.patch('/children/:childId/location', ...auth, async (req, res, next) => {
  try {
    const data = await parentService.updateChildLocation(req.user.id, req.params.childId, req.body);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

module.exports = router;

