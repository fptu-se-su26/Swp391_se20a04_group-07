const {
  Student, ClassRoom, Trip, TripAttendance, Route, RouteStop, RouteSubscription,
  UserDriver, UserManager, UserAdmin, AbsentRequest, Invoice, Notification, Feedback, LocationLog, sequelize
} = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { getIO } = require('../../utils/socketRegistry');
const { buildVietQrUrl } = require('../../utils/qrcode.util');
const { geocodeAddress, clearGeocodeCache } = require('../../utils/geocode.util');

const PARENT_PREFIX = 'parent_';

// Ngày hôm nay theo UTC+7 (Vietnam), dạng YYYY-MM-DD — dùng để so sánh với due_date (DATEONLY)
const todayVN = () => {
  const vnTime = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().split('T')[0];
};

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
        { model: Route },
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
    const request = await AbsentRequest.create({
      id: uuidv4(), student_id: studentId, parent_id: ownStudentId,
      absent_date: absentDate, trip_type: tripType, reason, status: 'approved'
    });

    // Thông báo cho Admin + Manager. Không throw nếu bước này lỗi (mạng, DB tạm thời...)
    // để không chặn việc phụ huynh gửi đơn — chỉ log lại để điều tra sau.
    try {
      await this._notifyAbsentRequest(request, studentId, absentDate, reason);
    } catch (err) {
      console.error('createAbsentRequest: gửi thông báo cho Admin/Manager thất bại:', err.message);
    }

    return request;
  }

  // ── Tạo Notification cho toàn bộ Admin + Manager đang active ─
  async _notifyAbsentRequest(request, studentId, absentDate, reason) {
    const student = await Student.findByPk(studentId, {
      attributes: ['student_id', 'full_name'],
      include: [{ model: ClassRoom, as: 'classInfo', attributes: ['class_name'], required: false }],
    });

    const studentLabel = student
      ? `${student.full_name} (${student.student_id}${student.classInfo ? ' - Lớp ' + student.classInfo.class_name : ''})`
      : 'Một học sinh';

    const title = '📋 Đơn xin vắng học mới';
    const body = `${studentLabel} xin nghỉ ngày ${absentDate}${reason ? ': ' + reason : ''}`;
    const data = JSON.stringify({ absentRequestId: request.id, studentId, absentDate });

    const [managers, admins] = await Promise.all([
      UserManager.findAll({ where: { is_active: true }, attributes: ['id'] }),
      UserAdmin.findAll({ where: { is_active: true }, attributes: ['id'] }),
    ]);

    const notifs = [
      ...managers.map(m => ({
        id: uuidv4(), user_id: m.id, user_type: 'manager',
        type: 'absent_request', title, body, data,
      })),
      ...admins.map(a => ({
        id: uuidv4(), user_id: a.id, user_type: 'admin',
        type: 'absent_request', title, body, data,
      })),
    ];

    if (notifs.length > 0) await Notification.bulkCreate(notifs);

    // Đẩy real-time cho chuông thông báo trên thanh điều hướng Admin/Manager.
    // Không throw nếu socket chưa sẵn sàng (vd server vừa khởi động) —
    // Notification đã lưu DB rồi nên phía FE vẫn thấy khi tải lại trang.
    const io = getIO();
    if (io) {
      const payload = { title, body, type: 'absent_request', data: JSON.parse(data), sentAt: new Date() };
      io.to('role:admin').emit('notification:new', payload);
      io.to('role:manager').emit('notification:new', payload);
    }
  }

  async getAbsentRequests(parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    return AbsentRequest.findAll({
      where: { student_id: studentId },
      order: [['absent_date', 'DESC']]
    });
  }

  // ── Hóa đơn ────────────────────────────────────────────────
  // Trả về kèm: display_status ('overdue' tính ảo cho hóa đơn pending quá hạn)
  // và qr_url (ảnh QR VietQR sinh trực tiếp từ payment_code, không lưu DB).
  async getInvoices(parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    const invoices = await Invoice.findAll({
      // Invoice.parent_id is populated with the student's own id, not "parent_<uuid>"
      // (see managerRouter.post('/payments/generate-invoices') in other.routes.js).
      where: { parent_id: studentId },
      include: [{ model: Student, as: 'student', attributes: ['full_name'] }],
      order: [['created_at', 'DESC']]
    });

    const today = todayVN();
    return invoices.map(inv => {
      const json = inv.toJSON();
      const displayStatus = (json.status === 'pending' && String(json.due_date) < today)
        ? 'overdue' : json.status;
      return {
        ...json,
        display_status: displayStatus,
        // checkout_url payOS là nguồn chính (thanh toán tự động xác nhận qua webhook).
        // qr_url tĩnh chỉ dùng dự phòng nếu vì lý do gì đó chưa tạo được link payOS.
        qr_url: json.checkout_url ? null : (json.payment_code ? buildVietQrUrl(json.amount, json.payment_code) : null),
      };
    });
  }

  // GIỮ LẠI để tương thích ngược — không còn dùng trong luồng chính (payOS tự xác nhận qua
  // webhook), nhưng có thể hữu ích làm phương án dự phòng thủ công nếu webhook gặp sự cố.
  async payInvoice(invoiceId, parentId) {
    const studentId = this._studentIdFromParentId(parentId);
    const inv = await Invoice.findOne({ where: { id: invoiceId, parent_id: studentId, status: 'pending' } });
    if (!inv) throw Object.assign(new Error('Hóa đơn không tồn tại hoặc đã được xử lý'), { status: 404 });
    return inv.update({ status: 'awaiting_confirmation' });
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
    return Feedback.create({ id: uuidv4(), trip_id: tripId, from_user: studentId, from_type: 'parent', target_type: targetType, rating, comment });
  }

  // ══════════════════════════════════════════════════════════════
  // Vị TRÍ NHÀ HỌC SINH — Parent tự cập nhật
  // ══════════════════════════════════════════════════════════════

  /**
   * Lấy thông tin vị trí hiện tại của học sinh.
   * Parent chỉ được xem con của mình.
   */
  async getChildLocation(parentId, childId) {
    const ownStudentId = this._checkParent(parentId, childId);
    const student = await Student.findByPk(ownStudentId, {
      attributes: ['id', 'full_name', 'home_address', 'home_lat', 'home_lng'],
    });
    if (!student) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });
    return {
      id:           student.id,
      full_name:    student.full_name,
      home_address: student.home_address,
      home_lat:     student.home_lat     ? parseFloat(student.home_lat)  : null,
      home_lng:     student.home_lng     ? parseFloat(student.home_lng)  : null,
      hasConfirmed: !!(student.home_lat && student.home_lng),
    };
  }

  /**
   * Cập nhật vị trí nhà học sinh.
   * Ưu tiên: lat/lng được cung cấp trực tiếp (Parent kéo marker)
   *           nếu không có thì geocode từ home_address mới.
   *
   * @param {string} parentId
   * @param {string} childId
   * @param {{ home_address?: string, home_lat?: number, home_lng?: number }} body
   */
  async updateChildLocation(parentId, childId, body) {
    const ownStudentId = this._checkParent(parentId, childId);
    const student = await Student.findByPk(ownStudentId);
    if (!student) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });

    const { home_address, home_lat, home_lng } = body;
    const updates = {};

    // ── Trường hợp 1: Parent cung cấp toạ độ trực tiếp (kéo marker) ──
    if (home_lat != null && home_lng != null) {
      const lat = parseFloat(home_lat);
      const lng = parseFloat(home_lng);
      if (isNaN(lat) || isNaN(lng)) throw Object.assign(new Error('Toạ độ không hợp lệ'), { status: 400 });
      updates.home_lat = lat;
      updates.home_lng = lng;
      if (home_address) {
        updates.home_address = home_address;
        clearGeocodeCache(home_address);
      }
    }
    // ── Trường hợp 2: Chỉ có địa chỉ mới (chưa có toạ độ) — geocode lại ──
    else if (home_address && home_address !== student.home_address) {
      clearGeocodeCache(student.home_address);
      updates.home_address = home_address;

      const geo = await geocodeAddress(home_address);
      if (geo) {
        updates.home_lat = geo.lat;
        updates.home_lng = geo.lng;
      } else {
        // Geocoding thất bại — xóa toạ độ cũ (để Driver biết cần xác nhận)
        updates.home_lat = null;
        updates.home_lng = null;
      }
    } else {
      throw Object.assign(new Error('Không có dữ liệu nào để cập nhật'), { status: 400 });
    }

    await student.update(updates);

    return {
      id:           student.id,
      home_address: student.home_address,
      home_lat:     updates.home_lat  ?? parseFloat(student.home_lat)  ?? null,
      home_lng:     updates.home_lng  ?? parseFloat(student.home_lng)  ?? null,
      hasConfirmed: !!(updates.home_lat && updates.home_lng),
    };
  }
}

module.exports = new ParentService();
