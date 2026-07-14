// ============================================================
// MANAGER ROUTES + STUDENT ROUTES
// Fixed: bỏ User, dùng UserDriver + Student + ClassRoom
// ============================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const {
  Trip, Route, Vehicle, RouteStop,
  UserDriver,          // ← thay User
  Student,             // ← thay User as student
  ClassRoom,
  TripAttendance, RouteSubscription,
  Invoice, PaymentPlan, Notification,
  Feedback, sequelize
} = require('../models');

const tripService = require('./admin/trip.service');

// ── Helpers ───────────────────────────────────────────────────
// Ngày hôm nay theo UTC+7 (Vietnam)
const todayVN = () => {
  const vnTime = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().split('T')[0];
};

// ============================================================
// MANAGER ROUTER
// ============================================================
const managerRouter = express.Router();
const auth = [verifyToken, authorizeRoles('manager', 'admin')];

// ── Manager lấy danh sách tài xế ─────────────────────────────
managerRouter.get('/drivers', ...auth, async (req, res, next) => {
  try {
    const drivers = await UserDriver.findAll({
      where: { is_active: true },
      attributes: ['id', 'full_name', 'phone', 'email', 'license_number'],
      order: [['full_name', 'ASC']],
    });
    res.json({ success: true, data: drivers });
  } catch (e) { next(e); }
});

// ── Manager lấy danh sách xe ──────────────────────────────────
managerRouter.get('/vehicles', ...auth, async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { status: 'active' },
      include: [{ model: UserDriver, as: 'driver', attributes: ['full_name'] }],
      order: [['plate_number', 'ASC']],
    });
    res.json({ success: true, data: vehicles });
  } catch (e) { next(e); }
});

// ── Dashboard overview ────────────────────────────────────────
managerRouter.get('/dashboard/overview', ...auth, async (req, res, next) => {
  try {
    const today = todayVN();
    const [trips, vehicles] = await Promise.all([
      Trip.findAll({
        where: { scheduled_date: today },
        include: [
          { model: Route,      attributes: ['route_name', 'route_code'] },
          { model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] },
          { model: Vehicle,    attributes: ['plate_number'] },
        ],
        order: [['scheduled_start', 'ASC']],
      }),
      Vehicle.findAll({
        include: [{ model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] }]
      }),
    ]);
    res.json({ success: true, data: { trips, vehicles } });
  } catch (e) { next(e); }
});

// ── Trips hôm nay ─────────────────────────────────────────────
managerRouter.get('/trips/today', ...auth, async (req, res, next) => {
  try {
    const today = todayVN();
    const trips = await Trip.findAll({
      where: { scheduled_date: today },
      include: [
        { model: Route,      attributes: ['route_name', 'route_code'] },
        { model: Vehicle,    attributes: ['plate_number', 'vehicle_name'] },
        { model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] },
      ],
      order: [['scheduled_start', 'ASC']],
    });
    res.json({ success: true, data: trips });
  } catch (e) { next(e); }
});

// ── Tạo chuyến đi (Admin/Manager) ────────────────────────────
managerRouter.post('/trips', ...auth, async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json({ success: true, message: 'Đã tạo chuyến đi', data: trip });
  } catch (e) { next(e); }
});

// ── Tạo chuyến hàng loạt cho 1 ngày ─────────────────────────
managerRouter.post('/trips/daily', ...auth, async (req, res, next) => {
  try {
    const result = await tripService.createDailyTrips(req.body.date);
    res.json({ success: true, message: `Tạo ${result.created} chuyến, bỏ qua ${result.skipped}`, data: result });
  } catch (e) { next(e); }
});

// ── Lấy danh sách trips theo ngày ────────────────────────────
managerRouter.get('/trips', ...auth, async (req, res, next) => {
  try {
    const result = await tripService.getTrips(req.query);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
});

// ── Chi tiết trip ─────────────────────────────────────────────
managerRouter.get('/trips/:id', ...auth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await tripService.getTripById(req.params.id) });
  } catch (e) { next(e); }
});

// ── Hủy chuyến ───────────────────────────────────────────────
managerRouter.patch('/trips/:id/cancel', ...auth, async (req, res, next) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id, req.body.reason);
    res.json({ success: true, data: trip });
  } catch (e) { next(e); }
});

// ── Xóa chuyến ───────────────────────────────────────────────
managerRouter.delete('/trips/:id', ...auth, async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id);
    res.json({ success: true, message: 'Đã xóa chuyến' });
  } catch (e) { next(e); }
});

// ── Subscriptions ─────────────────────────────────────────────
managerRouter.get('/subscriptions/pending', ...auth, async (req, res, next) => {
  try {
    const subs = await RouteSubscription.findAll({
      where: { status: 'active' },
      include: [
        { model: Student, as: 'student', attributes: ['full_name', 'student_email'] },
        { model: Route,   attributes: ['route_name', 'route_code'] },
      ],
    });
    res.json({ success: true, data: subs });
  } catch (e) { next(e); }
});

// ── Generate invoices ─────────────────────────────────────────
managerRouter.post('/payments/generate-invoices', ...auth, async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const [plans, subs] = await Promise.all([
      PaymentPlan.findAll({ where: { is_active: true } }),
      RouteSubscription.findAll({ where: { status: 'active' } }),
    ]);
    const dueDate = new Date(year, month - 1, 5);
    const invoices = [];

    for (const sub of subs) {
      const plan = plans.find(p => p.route_id === sub.route_id);
      if (!plan) continue;
      // Lấy parent từ bảng Students (parent_gmail là parent)
      const student = await Student.findByPk(sub.student_id, { attributes: ['id','parent_gmail'] });
      if (!student) continue;
      invoices.push({
        id: uuidv4(),
        student_id: sub.student_id,
        parent_id:  sub.student_id, // dùng student.id làm ref cho parent
        plan_id:    plan.id,
        amount:     plan.amount,
        status:     'pending',
        due_date:   dueDate,
      });
    }
    if (invoices.length) await Invoice.bulkCreate(invoices);
    res.json({ success: true, message: `Đã tạo ${invoices.length} hóa đơn`, data: { count: invoices.length } });
  } catch (e) { next(e); }
});

// ── Feedbacks ─────────────────────────────────────────────────
managerRouter.get('/feedbacks', ...auth, async (req, res, next) => {
  try {
    const feedbacks = await Feedback.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: feedbacks });
  } catch (e) { next(e); }
});

// ============================================================
// STUDENT ROUTER
// ============================================================
const studentRouter = express.Router();
const studentAuth = [verifyToken, authorizeRoles('student')];

// ── Profile ───────────────────────────────────────────────────
studentRouter.get('/profile', ...studentAuth, async (req, res, next) => {
  try {
    const s = await Student.findByPk(req.user.id, {
      include: [{ model: ClassRoom, as: 'classInfo', attributes: ['id', 'class_name', 'grade'], required: false }],
    });
    if (!s) return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh' });
    res.json({ success: true, data: { ...s.toJSON(), role: 'student' } });
  } catch (e) { next(e); }
});

// ── My route ─────────────────────────────────────────────────
studentRouter.get('/my-route', ...studentAuth, async (req, res, next) => {
  try {
    const sub = await RouteSubscription.findOne({
      where: { student_id: req.user.id, status: 'active' },
      include: [{
        model: Route,
        include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }]
      }],
    });
    res.json({ success: true, data: sub });
  } catch (e) { next(e); }
});

// ── Current trip ──────────────────────────────────────────────
studentRouter.get('/trips/current', ...studentAuth, async (req, res, next) => {
  try {
    const today = todayVN();
    const trip = await Trip.findOne({
      where: { scheduled_date: today, status: 'in_progress' },
      include: [
        {
          model: TripAttendance,
          where: { student_id: req.user.id },
          required: true
        },
        { model: Route },
        { model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] },
      ],
    });
    res.json({ success: true, data: trip });
  } catch (e) { next(e); }
});

// ── Week schedule ─────────────────────────────────────────────
// Hỗ trợ điều hướng tuần: FE truyền ?date=YYYY-MM-DD (1 ngày bất kỳ
// trong tuần muốn xem) → BE tính Thứ 2 -> Chủ Nhật của tuần chứa
// ngày đó. Không truyền date → mặc định tuần hiện tại (VN timezone).
studentRouter.get('/schedule/week', ...studentAuth, async (req, res, next) => {
  try {
    const anchor = req.query.date
      ? new Date(`${req.query.date}T00:00:00.000Z`)
      : new Date(Date.now() + 7 * 60 * 60 * 1000);

    if (isNaN(anchor.getTime())) {
      throw Object.assign(new Error('Tham số date không hợp lệ (định dạng YYYY-MM-DD)'), { status: 400 });
    }

    const day     = anchor.getUTCDay(); // 0=CN
    const monday  = new Date(anchor);
    monday.setUTCDate(anchor.getUTCDate() - (day === 0 ? 6 : day - 1));
    const sunday  = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    const mondayStr = monday.toISOString().split('T')[0];
    const sundayStr = sunday.toISOString().split('T')[0];

    const trips = await Trip.findAll({
      where: {
        scheduled_date: { [Op.between]: [mondayStr, sundayStr] },
      },
      include: [
        { model: TripAttendance, where: { student_id: req.user.id }, required: true },
        { model: Route, attributes: ['route_name', 'route_code'] },
      ],
      order: [['scheduled_date','ASC'], ['scheduled_start','ASC']],
    });
    res.json({
      success: true,
      data: trips,
      meta: { monday: mondayStr, sunday: sundayStr },
    });
  } catch (e) { next(e); }
});

// ============================================================
// THAY THẾ route studentRouter.get('/notifications', ...) hiện tại
// trong other.routes.js bằng khối sau (thêm mark-read + phân trang):
// ============================================================

studentRouter.get('/notifications', ...studentAuth, async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: req.user.id, user_type: 'student', recalled_at: null },
      order: [['pinned', 'DESC'], ['sent_at', 'DESC']],
      limit, offset,
    });
    const unread = await Notification.count({
      where: { user_id: req.user.id, user_type: 'student', is_read: false, recalled_at: null }
    });
    res.json({ success: true, data: { total: count, unread, data: rows } });
  } catch (e) { next(e); }
});

studentRouter.patch('/notifications/:id/read', ...studentAuth, async (req, res, next) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { id: req.params.id, user_id: req.user.id, user_type: 'student' } }
    );
    res.json({ success: true });
  } catch (e) { next(e); }
});

studentRouter.patch('/notifications/read-all', ...studentAuth, async (req, res, next) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, user_type: 'student', is_read: false } }
    );
    res.json({ success: true });
  } catch (e) { next(e); }
});


module.exports = { managerRouter, studentRouter };