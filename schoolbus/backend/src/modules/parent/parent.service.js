const {
  Student, ClassRoom, Trip, TripAttendance, Route, RouteStop, RouteSubscription,
  UserDriver, AbsentRequest, Invoice, Notification, Feedback, LocationLog, sequelize
} = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const PARENT_PREFIX = 'parent_';

class ParentService {

  // ── ID helpers ──────────────────────────────────────────────
  // req.user.id for a parent is always "parent_<studentUuid>" (see auth.service.js loginGoogle).
  // There is no separate parent account/table: a Google parent login is resolved to exactly
  // one Student row via Student.parent_gmail (unique), so "the parent" IS that student record.
  _studentIdFromParentId(parentId) {
    if (typeof parentId !== 'string' || !parentId.startsWith(PARENT_PREFIX)) {
      throw Object.assign(new Error('parentId không hợp lệ'), { status: 400 });
    }
    return parentId.slice(PARENT_PREFIX.length);
  }

  // Any UUID column that logically means "this parent" (Invoice.parent_id, AbsentRequest.parent_id,
  // Notification.user_id, Feedback.from_user, ...) actually stores the student's own UUID, not the
  // "parent_<uuid>" string — that prefix only exists in the JWT/session, never in the DB.
  _checkParent(parentId, studentId) {
    const ownStudentId = this._studentIdFromParentId(parentId);
    if (ownStudentId !== studentId) {
      throw Object.assign(new Error('Bạn không phải phụ huynh của học sinh này'), { status: 403 });
    }
    return ownStudentId;
  }

  async getChildren(parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    const student = await Student.findByPk(studentId, {
      include: [{ model: ClassRoom, as: 'classInfo', attributes: ['class_name', 'grade'] }]
    });
    if (!student) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });
    // A parent account is 1:1 with a student in this architecture, but keep the API shape (array)
    // that callers already expect from the old multi-child design.
    return [student];
  }

  async linkChild() {
    // "Linking" no longer applies: a parent account is created implicitly the moment an admin
    // sets Student.parent_gmail, and Google login resolves straight to that single student.
    // There is nowhere to attach a second child, so this endpoint can only ever fail cleanly now.
    throw Object.assign(
      new Error('Không hỗ trợ liên kết thêm học sinh. Vui lòng liên hệ quản trị viên nếu cần thêm học sinh vào tài khoản.'),
      { status: 400 }
    );
  }

  async getChildBusStatus(parentId, studentId) {
    this._checkParent(parentId, studentId);
    const today = new Date().toISOString().split('T')[0];

    return Trip.findAll({
      where: { scheduled_date: today, status: { [Op.in]: ['pending', 'in_progress'] } },
      include: [
        { model: TripAttendance, where: { student_id: studentId }, required: true },
        { model: Route, attributes: ['route_name'] },
        { model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] }
      ]
    });
  }

  async getCurrentTrip(parentId, studentId) {
    this._checkParent(parentId, studentId);
    const today = new Date().toISOString().split('T')[0];
    const trip = await Trip.findOne({
      where: { scheduled_date: today, status: 'in_progress' },
      include: [
        { model: TripAttendance, where: { student_id: studentId }, required: true },
        { model: Route, include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }] },
        { model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] }
      ]
    });

    if (trip) {
      const lastLoc = await LocationLog.findOne({
        where: { trip_id: trip.id },
        order: [['logged_at', 'DESC']]
      });
      return { trip, lastLocation: lastLoc };
    }
    return null;
  }

  async getAttendanceHistory(parentId, studentId, month, year) {
    this._checkParent(parentId, studentId);
    const rows = await sequelize.query(`
      SELECT
        t.scheduled_date, t.trip_type, ta.status,
        ta.boarded_at, ta.dropped_at,
        r.route_name, ud.full_name AS driver_name
      FROM TripAttendance ta
      INNER JOIN Trips t ON ta.trip_id = t.id
      INNER JOIN Routes r ON t.route_id = r.id
      INNER JOIN UserDrivers ud ON t.driver_id = ud.id
      WHERE ta.student_id = :studentId
        AND MONTH(t.scheduled_date) = :month
        AND YEAR(t.scheduled_date) = :year
      ORDER BY t.scheduled_date DESC
    `, { replacements: { studentId, month, year }, type: sequelize.QueryTypes.SELECT });
    return rows;
  }

  async getSubscriptions(parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    return RouteSubscription.findAll({
      where: { student_id: studentId },
      include: [
        { model: Route, include: [{ model: RouteStop, order: [['stop_order', 'ASC']] }] },
        { model: Student, as: 'student', attributes: ['full_name'] }
      ]
    });
  }

  async createSubscription(parentId, studentId, routeId, pickupStopId) {
    this._checkParent(parentId, studentId);
    const exist = await RouteSubscription.findOne({ where: { student_id: studentId, route_id: routeId, status: 'active' } });
    if (exist) throw Object.assign(new Error('Học sinh đã đăng ký tuyến này'), { status: 409 });
    return RouteSubscription.create({ id: uuidv4(), student_id: studentId, route_id: routeId, pickup_stop_id: pickupStopId, start_date: new Date() });
  }

  async createAbsentRequest(parentId, studentId, absentDate, tripType, reason) {
    const ownStudentId = this._checkParent(parentId, studentId);
    // AbsentRequest.parent_id is a UUID column — store the student's own id (see Invoice pattern
    // in other.routes.js generate-invoices), never the "parent_<uuid>" token string.
    return AbsentRequest.create({
      id: uuidv4(), student_id: studentId, parent_id: ownStudentId,
      absent_date: absentDate, trip_type: tripType, reason, status: 'approved'
    });
  }

  async getAbsentRequests(parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    return AbsentRequest.findAll({
      where: { student_id: studentId },
      order: [['absent_date', 'DESC']]
    });
  }

  async getInvoices(parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    return Invoice.findAll({
      // Invoice.parent_id is populated with the student's own id, not "parent_<uuid>"
      // (see managerRouter.post('/payments/generate-invoices') in other.routes.js).
      where: { parent_id: studentId },
      include: [{ model: Student, as: 'student', attributes: ['full_name'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async payInvoice(invoiceId, parentId, paymentMethod) {
    const studentId = this._studentIdFromParentId(parentId);
    const inv = await Invoice.findOne({ where: { id: invoiceId, parent_id: studentId, status: 'pending' } });
    if (!inv) throw Object.assign(new Error('Hóa đơn không tồn tại hoặc đã thanh toán'), { status: 404 });
    return inv.update({ status: 'paid', paid_at: new Date(), payment_method: paymentMethod, transaction_id: 'TXN-' + Date.now() });
  }

  async getNotifications(userId, page = 1, limit = 20) {
    const studentId = this._studentIdFromParentId(userId);
    const offset = (page - 1) * limit;
    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: studentId, user_type: 'parent' },
      limit: parseInt(limit), offset,
      order: [['sent_at', 'DESC']]
    });
    return { total: count, data: rows };
  }

  async markNotificationRead(notifId, userId) {
    const studentId = this._studentIdFromParentId(userId);
    await Notification.update({ is_read: true }, { where: { id: notifId, user_id: studentId, user_type: 'parent' } });
  }

  async markAllRead(userId) {
    const studentId = this._studentIdFromParentId(userId);
    await Notification.update({ is_read: true }, { where: { user_id: studentId, user_type: 'parent', is_read: false } });
  }

  async createFeedback(parentId, tripId, targetType, rating, comment) {
    const studentId = this._studentIdFromParentId(parentId);
    // Feedback.from_user is a UUID column — same rule as parent_id elsewhere.
    return Feedback.create({ id: uuidv4(), trip_id: tripId, from_user: studentId, from_type: 'parent', target_type: targetType, rating, comment });
  }
}

module.exports = new ParentService();