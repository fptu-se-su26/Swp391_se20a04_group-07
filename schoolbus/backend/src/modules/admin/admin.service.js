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

// Map role -> model (CHỈ cho admin/manager/driver)
const MODEL_MAP = {
  admin:   UserAdmin,
  manager: UserManager,
  driver:  UserDriver,
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

    // Filter theo role cụ thể
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

    // Không filter → gộp admin + manager + driver
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

  // ============================================================
  // CREATE USER (admin/manager/driver)
  // ============================================================
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

  // ============================================================
  // GET USER BY ID
  // ============================================================
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

  // ============================================================
  // UPDATE USER
  // ============================================================
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

  // ============================================================
  // TOGGLE ACTIVE
  // ============================================================
  async toggleActive(id, role) {
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Thiếu role'), { status: 400 });
    const user = await Model.findByPk(id);
    if (!user) throw Object.assign(new Error('User không tồn tại'), { status: 404 });
    await user.update({ is_active: !user.is_active });
    return { id, is_active: !user.is_active };
  }

  // ============================================================
  // DELETE USER
  // ============================================================
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

    const payload = this._mapVehiclePayload(data);
    if (payload.current_driver_id) {
      await this._checkDriverNotAssigned(payload.current_driver_id);
    }
    return Vehicle.create({ id: uuidv4(), ...payload });
  }

  async updateVehicle(id, data) {
    const v = await Vehicle.findByPk(id);
    if (!v) throw Object.assign(new Error('Xe không tồn tại'), { status: 404 });

    const payload = this._mapVehiclePayload(data);
    if (payload.current_driver_id && payload.current_driver_id !== v.current_driver_id) {
      await this._checkDriverNotAssigned(payload.current_driver_id, id);
    }
    return v.update(payload);
  }

  // Chuẩn hóa payload từ form: driver_id (frontend) -> current_driver_id (DB column)
  // Cho phép truyền driver_id = '' hoặc null để bỏ phân công tài xế.
  _mapVehiclePayload(data) {
    const { driver_id, ...rest } = data;
    if (driver_id !== undefined) {
      rest.current_driver_id = driver_id || null;
    }
    return rest;
  }

  // Đảm bảo 1 tài xế không bị gán cho 2 xe cùng lúc
  async _checkDriverNotAssigned(driverId, excludeVehicleId = null) {
    const where = { current_driver_id: driverId };
    if (excludeVehicleId) where.id = { [Op.ne]: excludeVehicleId };
    const conflict = await Vehicle.findOne({ where });
    if (conflict) {
      throw Object.assign(
        new Error(`Tài xế này đã được phân công cho xe ${conflict.plate_number}`),
        { status: 409 }
      );
    }
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
  // NOTIFICATIONS BROADCAST
  // ============================================================
  async broadcastNotification({ title, body, type, role }) {
    const notifications = [];

    const addFromModel = async (Model, userRole) => {
      const users = await Model.findAll({ where: { is_active: true }, attributes: ['id'] });
      users.forEach(u => notifications.push({
        id: uuidv4(), user_id: u.id, user_type: userRole, type, title, body, is_read: false
      }));
    };

    const addFromStudents = async (col, userRole) => {
      const rows = await Student.findAll({ where: { status: 'active' }, attributes: ['id'] });
      rows.forEach(s => notifications.push({
        id: uuidv4(), user_id: s.id, user_type: userRole, type, title, body, is_read: false
      }));
    };

    if (!role || role === 'admin')   await addFromModel(UserAdmin,   'admin');
    if (!role || role === 'manager') await addFromModel(UserManager, 'manager');
    if (!role || role === 'driver')  await addFromModel(UserDriver,  'driver');
    if (!role || role === 'student') await addFromStudents(Student,  'student');
    if (!role || role === 'parent')  await addFromStudents(Student,  'parent');

    if (notifications.length) await Notification.bulkCreate(notifications);
    return { sent: notifications.length };
  }
}

module.exports = new AdminService();
