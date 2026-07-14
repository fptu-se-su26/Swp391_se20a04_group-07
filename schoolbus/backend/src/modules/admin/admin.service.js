// ============================================================
// ADMIN SERVICE - Fixed: dùng bảng Students/Classes mới
// ============================================================
const {
  UserAdmin, UserManager, UserDriver,
  Student, ClassRoom,
  Vehicle, Route, RouteStop, Trip, Incident, Notification, sequelize
} = require('../../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { getIO } = require('../../utils/socketRegistry');

// Map role -> model (CHỈ cho admin/manager/driver)
const MODEL_MAP = {
  admin:   UserAdmin,
  manager: UserManager,
  driver:  UserDriver,
};

// Map role gửi -> model để lấy tên người gửi
const SENDER_MODEL_MAP = {
  admin:   UserAdmin,
  manager: UserManager,
};

class AdminService {

  // ============================================================
  // DASHBOARD STATS
  // ============================================================
  async getDashboardStats() {
    const [stats] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM Students    WHERE status='active') AS total_students,
        (SELECT COUNT(*) FROM UserDrivers WHERE is_active=1)     AS total_drivers,
        (SELECT COUNT(*) FROM UserAdmins  WHERE is_active=1) +
        (SELECT COUNT(*) FROM UserManagers WHERE is_active=1)    AS total_managers,
        (SELECT COUNT(*) FROM Vehicles    WHERE status='active')  AS active_vehicles,
        (SELECT COUNT(*) FROM Trips       WHERE scheduled_date=CAST(GETDATE() AS DATE)) AS trips_today,
        (SELECT COUNT(*) FROM Trips       WHERE status='in_progress')  AS trips_running,
        (SELECT COUNT(*) FROM Incidents   WHERE status='open')         AS open_incidents,
        (SELECT COUNT(*) FROM Trips       WHERE status='completed'
          AND scheduled_date=CAST(GETDATE() AS DATE))                  AS completed_today
    `);
    return stats[0];
  }

  // ============================================================
  // USERS (admin/manager/driver) — KHÔNG còn parent/student
  // ============================================================
  async getUsers({ role, search, page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (role && MODEL_MAP[role]) {
      const Model = MODEL_MAP[role];
      const where = { is_active: true };
      if (search) {
        where[Op.or] = [
          { full_name: { [Op.like]: `%${search}%` } },
          { email:     { [Op.like]: `%${search}%` } },
          { phone:     { [Op.like]: `%${search}%` } },
        ];
      }
      const { count, rows } = await Model.findAndCountAll({
        where,
        attributes: { exclude: ['password_hash'] },
        limit: parseInt(limit), offset,
        order: [['created_at', 'DESC']]
      });
      return {
        total: count, page: parseInt(page), limit: parseInt(limit),
        data: rows.map(r => ({ ...r.toJSON(), role }))
      };
    }

    const searchWhere = search ? {
      [Op.or]: [
        { full_name: { [Op.like]: `%${search}%` } },
        { email:     { [Op.like]: `%${search}%` } },
      ]
    } : {};

    const [admins, managers, drivers] = await Promise.all([
      UserAdmin.findAll({   where: { is_active: true, ...searchWhere }, attributes: { exclude: ['password_hash'] } }),
      UserManager.findAll({ where: { is_active: true, ...searchWhere }, attributes: { exclude: ['password_hash'] } }),
      UserDriver.findAll({  where: { is_active: true, ...searchWhere }, attributes: { exclude: ['password_hash'] } }),
    ]);

    const all = [
      ...admins.map(u   => ({ ...u.toJSON(), role: 'admin' })),
      ...managers.map(u => ({ ...u.toJSON(), role: 'manager' })),
      ...drivers.map(u  => ({ ...u.toJSON(), role: 'driver' })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = all.length;
    const data  = all.slice(offset, offset + parseInt(limit));
    return { total, page: parseInt(page), limit: parseInt(limit), data };
  }

  async createUser({ full_name, email, phone, password, role }) {
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Role không hợp lệ. Học sinh dùng trang Quản lý Học sinh.'), { status: 400 });

    const exist = await Model.findOne({ where: { email } });
    if (exist) throw Object.assign(new Error('Email đã tồn tại'), { status: 409 });

    const password_hash = await bcrypt.hash(password || 'Admin@123', 12);
    const user = await Model.create({ id: uuidv4(), full_name, email, phone, password_hash });
    const { password_hash: _, ...out } = user.toJSON();
    return { ...out, role };
  }

  async getUserById(id, role) {
    if (role && MODEL_MAP[role]) {
      const user = await MODEL_MAP[role].findByPk(id, { attributes: { exclude: ['password_hash'] } });
      if (!user) throw Object.assign(new Error('Không tìm thấy user'), { status: 404 });
      return { ...user.toJSON(), role };
    }
    for (const [r, Model] of Object.entries(MODEL_MAP)) {
      const user = await Model.findByPk(id, { attributes: { exclude: ['password_hash'] } });
      if (user) return { ...user.toJSON(), role: r };
    }
    throw Object.assign(new Error('Không tìm thấy user'), { status: 404 });
  }

  async updateUser(id, data) {
    const role  = data.role;
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Thiếu role hợp lệ'), { status: 400 });

    const user = await Model.findByPk(id);
    if (!user) throw Object.assign(new Error('User không tồn tại'), { status: 404 });

    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 12);
      delete data.password;
    }
    delete data.role;
    await user.update(data);
    const { password_hash, ...out } = user.toJSON();
    return { ...out, role };
  }

  async toggleActive(id, role) {
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Thiếu role'), { status: 400 });
    const user = await Model.findByPk(id);
    if (!user) throw Object.assign(new Error('User không tồn tại'), { status: 404 });
    await user.update({ is_active: !user.is_active });
    return { id, is_active: !user.is_active };
  }

  async deleteUser(id, role) {
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Thiếu role'), { status: 400 });
    const user = await Model.findByPk(id);
    if (!user) throw Object.assign(new Error('User không tồn tại'), { status: 404 });
    await user.destroy();
  }

  // ============================================================
  // VEHICLES
  // ============================================================
  async getVehicles() {
    return Vehicle.findAll({
      include: [{ model: UserDriver, as: 'driver', attributes: ['id', 'full_name', 'phone'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async createVehicle(data) {
    const exist = await Vehicle.findOne({ where: { plate_number: data.plate_number } });
    if (exist) throw Object.assign(new Error('Biển số xe đã tồn tại'), { status: 409 });
    return Vehicle.create({ id: uuidv4(), ...data });
  }

  async updateVehicle(id, data) {
    const v = await Vehicle.findByPk(id);
    if (!v) throw Object.assign(new Error('Xe không tồn tại'), { status: 404 });
    return v.update(data);
  }

  async deleteVehicle(id) {
    const v = await Vehicle.findByPk(id);
    if (!v) throw Object.assign(new Error('Xe không tồn tại'), { status: 404 });
    await v.destroy();
  }

  // ============================================================
  // ROUTES
  // ============================================================
  async getRoutes() {
    return Route.findAll({
      include: [
        { model: Vehicle },
        { model: UserDriver, as: 'driver', attributes: ['id', 'full_name', 'phone'] },
        { model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async createRoute(data) {
    return Route.create({ id: uuidv4(), ...data });
  }

  async updateRoute(id, data) {
    const r = await Route.findByPk(id);
    if (!r) throw Object.assign(new Error('Tuyến không tồn tại'), { status: 404 });
    return r.update(data);
  }

  async addStop(routeId, stopData) {
    return RouteStop.create({ id: uuidv4(), route_id: routeId, ...stopData });
  }

  async assignDriver(vehicleId, driverId, routeId) {
    await Vehicle.update({ current_driver_id: driverId }, { where: { id: vehicleId } });
    await Route.update({ driver_id: driverId, vehicle_id: vehicleId }, { where: { id: routeId } });
    return { vehicleId, driverId, routeId };
  }

  // ============================================================
  // INCIDENTS
  // ============================================================
  async getIncidents({ status, page = 1, limit = 20 }) {
    const where = {};
    if (status) where.status = status;
    const offset = (page - 1) * limit;
    const { count, rows } = await Incident.findAndCountAll({
      where, limit: parseInt(limit), offset,
      order: [['created_at', 'DESC']]
    });
    return { total: count, data: rows };
  }

  async resolveIncident(id, resolvedBy) {
    const inc = await Incident.findByPk(id);
    if (!inc) throw Object.assign(new Error('Sự cố không tồn tại'), { status: 404 });
    return inc.update({ status: 'resolved', resolved_by: resolvedBy, resolved_at: new Date() });
  }

  // ============================================================
  // REPORTS
  // ============================================================
  async getAttendanceReport(startDate, endDate) {
    const rows = await sequelize.query(`
      SELECT
        t.scheduled_date, t.trip_type,
        COUNT(ta.id) AS total,
        SUM(CASE WHEN ta.status='boarded' THEN 1 ELSE 0 END) AS boarded,
        SUM(CASE WHEN ta.status='absent'  THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN ta.status='waiting' THEN 1 ELSE 0 END) AS waiting
      FROM Trips t
      LEFT JOIN TripAttendance ta ON ta.trip_id = t.id
      WHERE t.scheduled_date BETWEEN :startDate AND :endDate
      GROUP BY t.scheduled_date, t.trip_type
      ORDER BY t.scheduled_date DESC
    `, { replacements: { startDate, endDate }, type: sequelize.QueryTypes.SELECT });
    return rows;
  }

  // ============================================================
  // GỬI THÔNG BÁO THEO ĐỐI TƯỢNG (Admin/Manager)
  // targetRole: 'driver' | 'student' | 'parent' | 'all'
  // Chỉ được chọn 1 nhóm cho mỗi lần gửi (hoặc 'all' = cả 3 nhóm),
  // không bao giờ gộp tùy chọn nhiều nhóm riêng lẻ trong 1 request.
  // ============================================================
  async sendNotification(senderId, senderRole, { title, body, priority = 'normal', targetRole }) {
    const VALID_TARGETS = ['driver', 'student', 'parent', 'all'];
    if (!VALID_TARGETS.includes(targetRole)) {
      throw Object.assign(new Error('Đối tượng nhận không hợp lệ'), { status: 400 });
    }
    if (!title?.trim() || !body?.trim()) {
      throw Object.assign(new Error('Vui lòng nhập đầy đủ tiêu đề và nội dung'), { status: 400 });
    }
    const VALID_PRIORITIES = ['normal', 'important', 'urgent'];
    if (!VALID_PRIORITIES.includes(priority)) priority = 'normal';

    const SenderModel = SENDER_MODEL_MAP[senderRole];
    const sender = SenderModel ? await SenderModel.findByPk(senderId, { attributes: ['full_name'] }) : null;
    const senderName = sender?.full_name || (senderRole === 'admin' ? 'Quản trị viên' : 'Quản lý');

    const batchId = uuidv4();
    const notifications = [];

    const pushFor = (userId, userType) => {
      notifications.push({
        id: uuidv4(), user_id: userId, user_type: userType,
        type: 'broadcast', title: title.trim(), body: body.trim(),
        priority, sender_id: senderId, sender_name: senderName, sender_role: senderRole,
        target_role: targetRole, batch_id: batchId,
      });
    };

    if (targetRole === 'driver' || targetRole === 'all') {
      const drivers = await UserDriver.findAll({ where: { is_active: true }, attributes: ['id'] });
      drivers.forEach(d => pushFor(d.id, 'driver'));
    }
    if (targetRole === 'student' || targetRole === 'all') {
      const students = await Student.findAll({ where: { status: 'active' }, attributes: ['id'] });
      students.forEach(s => pushFor(s.id, 'student'));
    }
    if (targetRole === 'parent' || targetRole === 'all') {
      // Kiến trúc hiện tại: 1 phụ huynh = 1 học sinh, user_id của "parent" chính là student.id
      // (xem parent.service.js — _studentIdFromParentId). Notification.user_id lưu student.id,
      // user_type='parent' để phân biệt hộp thư của phụ huynh và của chính học sinh.
      const students = await Student.findAll({ where: { status: 'active' }, attributes: ['id'] });
      students.forEach(s => pushFor(s.id, 'parent'));
    }

    if (notifications.length > 0) await Notification.bulkCreate(notifications);

    // Đẩy real-time. Giả định room theo quy ước 'role:<user_type>' giống 'role:admin'/'role:manager'
    // đã dùng trong parent.service.js — chỉnh lại tên room nếu socket.handler.js đặt khác.
    const io = getIO();
    if (io) {
      const payload = { title: title.trim(), body: body.trim(), type: 'broadcast', priority, sentAt: new Date() };
      const rooms = targetRole === 'all' ? ['role:driver', 'role:student', 'role:parent'] : [`role:${targetRole}`];
      rooms.forEach(r => io.to(r).emit('notification:new', payload));
    }

    return { batchId, sent: notifications.length, targetRole };
  }

  // ============================================================
  // LỊCH SỬ GỬI THÔNG BÁO (Admin/Manager) — nhóm theo batch_id
  // ============================================================
  async getNotificationHistory({ page = 1, limit = 15, search, targetRole, fromDate, toDate }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const conditions = ['batch_id IS NOT NULL'];
    const replacements = { limit: parseInt(limit), offset };

    if (search) {
      conditions.push('(title LIKE :search OR body LIKE :search)');
      replacements.search = `%${search}%`;
    }
    if (targetRole) {
      conditions.push('target_role = :targetRole');
      replacements.targetRole = targetRole;
    }
    if (fromDate && toDate) {
      conditions.push('sent_at BETWEEN :fromDate AND :toDate');
      replacements.fromDate = fromDate;
      replacements.toDate = toDate;
    }
    const whereSql = conditions.join(' AND ');

    const rows = await sequelize.query(`
      SELECT
        batch_id,
        MIN(title)        AS title,
        MIN(body)         AS body,
        MIN(priority)     AS priority,
        MIN(target_role)  AS target_role,
        MIN(sender_name)  AS sender_name,
        MIN(sender_role)  AS sender_role,
        MIN(sent_at)      AS sent_at,
        MAX(CAST(pinned AS INT))       AS pinned,
        MAX(recalled_at)               AS recalled_at,
        COUNT(*)                       AS total_recipients,
        SUM(CASE WHEN is_read=1 THEN 1 ELSE 0 END) AS read_count
      FROM Notifications
      WHERE ${whereSql}
      GROUP BY batch_id
      ORDER BY MAX(CAST(pinned AS INT)) DESC, MIN(sent_at) DESC
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    const [{ total }] = await sequelize.query(`
      SELECT COUNT(DISTINCT batch_id) AS total FROM Notifications WHERE ${whereSql}
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    return { total, page: parseInt(page), limit: parseInt(limit), data: rows };
  }

  // ── Thu hồi thông báo — chỉ khi chưa ai đọc ──
  async recallNotification(batchId) {
    const readCount = await Notification.count({ where: { batch_id: batchId, is_read: true } });
    if (readCount > 0) {
      throw Object.assign(new Error('Đã có người đọc thông báo này, không thể thu hồi'), { status: 400 });
    }
    await Notification.update({ recalled_at: new Date() }, { where: { batch_id: batchId } });
    return { batchId };
  }

  // ── Sửa thông báo — chỉ khi chưa ai đọc ──
  async editNotification(batchId, { title, body, priority }) {
    const readCount = await Notification.count({ where: { batch_id: batchId, is_read: true } });
    if (readCount > 0) {
      throw Object.assign(new Error('Đã có người đọc thông báo này, không thể chỉnh sửa'), { status: 400 });
    }
    const data = {};
    if (title?.trim()) data.title = title.trim();
    if (body?.trim())  data.body  = body.trim();
    if (priority && ['normal', 'important', 'urgent'].includes(priority)) data.priority = priority;
    await Notification.update(data, { where: { batch_id: batchId } });
    return { batchId };
  }

  // ── Ghim / bỏ ghim ──
  async togglePinNotification(batchId) {
    const one = await Notification.findOne({ where: { batch_id: batchId } });
    if (!one) throw Object.assign(new Error('Không tìm thấy thông báo'), { status: 404 });
    const newPinned = !one.pinned;
    await Notification.update({ pinned: newPinned }, { where: { batch_id: batchId } });
    return { batchId, pinned: newPinned };
  }

  // ============================================================
  // NOTIFICATIONS — của chính Admin/Manager đang đăng nhập (chuông thông báo)
  // ============================================================
  async getMyNotifications(userId, role, { page = 1, limit = 20 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: userId, user_type: role },
      limit: parseInt(limit), offset,
      order: [['sent_at', 'DESC']],
    });
    const unread = await Notification.count({ where: { user_id: userId, user_type: role, is_read: false } });
    return { total: count, unread, page: parseInt(page), limit: parseInt(limit), data: rows };
  }

  async markNotificationRead(id, userId, role) {
    await Notification.update({ is_read: true }, { where: { id, user_id: userId, user_type: role } });
    return { id };
  }

  async markAllNotificationsRead(userId, role) {
    await Notification.update({ is_read: true }, { where: { user_id: userId, user_type: role, is_read: false } });
    return { user_id: userId };
  }
}

module.exports = new AdminService();
