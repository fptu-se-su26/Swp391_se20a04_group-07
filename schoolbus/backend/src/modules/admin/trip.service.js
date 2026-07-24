// ============================================================
// TRIP SERVICE — Admin/Manager tạo và quản lý chuyến đi
// ============================================================
const {
  Trip, TripAttendance, Route, Vehicle, UserDriver,
  Student, sequelize
} = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

class TripService {

  // ── Lấy danh sách trips ──────────────────────────────────
  async getTrips({ date, status, routeId, page = 1, limit = 20 }) {
    const where = {};
    if (status)  where.status   = status;
    if (routeId) where.route_id = routeId;

    // Mặc định lấy hôm nay nếu không truyền date
    const targetDate = date || this._todayVN();
    where.scheduled_date = targetDate;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Trip.findAndCountAll({
      where,
      include: [
        { model: Route,      attributes: ['id','route_name','route_code'] },
        { model: Vehicle,    attributes: ['id','plate_number','vehicle_name'] },
        { model: UserDriver, as: 'driver', attributes: ['id','full_name','phone'] },
      ],
      limit: parseInt(limit), offset,
      order: [['scheduled_start','ASC']],
    });
    return { total: count, page: parseInt(page), data: rows };
  }

  // ── Tạo chuyến đi ────────────────────────────────────────
  async createTrip(data) {
    const { route_id, vehicle_id, driver_id, trip_type, scheduled_date, scheduled_start } = data;

    // Validate route tồn tại
    const route = await Route.findByPk(route_id);
    if (!route) throw Object.assign(new Error('Tuyến đường không tồn tại'), { status: 404 });

    // Validate driver
    const driver = await UserDriver.findByPk(driver_id);
    if (!driver) throw Object.assign(new Error('Tài xế không tồn tại'), { status: 404 });

    // Validate vehicle
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) throw Object.assign(new Error('Xe không tồn tại'), { status: 404 });

    // Không còn chặn cứng "1 tuyến chỉ 1 chuyến/loại/ngày" nữa —
    // 1 tuyến có thể cần nhiều chuyến (chở nhiều đợt, chia ca...).
    // Thay vào đó chỉ chặn khi TRÙNG THỰC SỰ:
    //  (1) Tài xế đã được gán 1 chuyến khác cùng ngày, cùng giờ xuất phát
    //  (2) Xe đã được gán 1 chuyến khác cùng ngày, cùng giờ xuất phát
    //  (3) Y hệt: cùng tuyến + cùng ngày + cùng loại + cùng giờ (chặn double-submit)
    const startTime = scheduled_start || (trip_type === 'morning_pickup' ? '06:30:00' : '16:30:00');

    const driverConflict = await Trip.findOne({
      where: {
        driver_id, scheduled_date, scheduled_start: startTime,
        status: { [Op.notIn]: ['cancelled'] },
      },
    });
    if (driverConflict) throw Object.assign(
      new Error(`Tài xế này đã được xếp 1 chuyến khác vào lúc ${startTime.slice(0, 5)} ngày ${scheduled_date}`),
      { status: 409 }
    );

    const vehicleConflict = await Trip.findOne({
      where: {
        vehicle_id, scheduled_date, scheduled_start: startTime,
        status: { [Op.notIn]: ['cancelled'] },
      },
    });
    if (vehicleConflict) throw Object.assign(
      new Error(`Xe này đã được xếp 1 chuyến khác vào lúc ${startTime.slice(0, 5)} ngày ${scheduled_date}`),
      { status: 409 }
    );

    const exactDuplicate = await Trip.findOne({
      where: { route_id, scheduled_date, trip_type, scheduled_start: startTime },
    });
    if (exactDuplicate) throw Object.assign(
      new Error(`Chuyến này đã tồn tại (cùng tuyến, cùng giờ, cùng loại) ngày ${scheduled_date}`),
      { status: 409 }
    );

    // Lấy học sinh được gán tuyến này (nguồn: Student.bus_route_id) —
    // dùng 1 query cho cả đếm số lượng và tạo TripAttendance
    const students = await Student.findAll({
      where: { bus_route_id: route_id, status: 'active' },
      attributes: ['id', 'bus_stop_id'],
    });

    // Tạo trip
    const trip = await Trip.create({
      id: uuidv4(),
      route_id,
      vehicle_id,
      driver_id,
      trip_type,
      scheduled_date,
      scheduled_start: startTime,
      status: 'pending',
      total_students: students.length,
    });

    // Tạo TripAttendance cho từng học sinh trong danh sách trên
    if (students.length > 0) {
      const attendances = students.map(stu => ({
        id:         uuidv4(),
        trip_id:    trip.id,
        student_id: stu.id,
        stop_id:    stu.bus_stop_id || null,
        status:     'waiting',
      }));
      await TripAttendance.bulkCreate(attendances);
    }

    return this.getTripById(trip.id);
  }

  // ── Tạo trip hàng loạt cho 1 ngày ───────────────────────
  async createDailyTrips(date) {
    const targetDate = date || this._todayVN();
    const routes = await Route.findAll({
      where: { is_active: true },
      include: [
        { model: Vehicle,    required: true },
        { model: UserDriver, as: 'driver', required: true },
      ],
    });

    const results = { created: 0, skipped: 0, errors: [] };

    for (const route of routes) {
      for (const tripType of ['morning_pickup', 'afternoon_dropoff']) {
        try {
          await this.createTrip({
            route_id:       route.id,
            vehicle_id:     route.vehicle_id,
            driver_id:      route.driver_id,
            trip_type:      tripType,
            scheduled_date: targetDate,
          });
          results.created++;
        } catch (err) {
          if (err.status === 409) results.skipped++;
          else results.errors.push(`${route.route_name} - ${tripType}: ${err.message}`);
        }
      }
    }
    return results;
  }

  // ── Lấy chi tiết trip ────────────────────────────────────
  async getTripById(id) {
    const trip = await Trip.findByPk(id, {
      include: [
        { model: Route,      attributes: ['id','route_name','route_code'] },
        { model: Vehicle,    attributes: ['id','plate_number','vehicle_name'] },
        { model: UserDriver, as: 'driver', attributes: ['id','full_name','phone'] },
        {
          model: TripAttendance,
          include: [{
            model: Student,
            as: 'student',
            attributes: ['id','student_id','full_name','student_email','student_phone'],
          }],
        },
      ],
    });
    if (!trip) throw Object.assign(new Error('Chuyến không tồn tại'), { status: 404 });
    return trip;
  }

  // ── Hủy chuyến ───────────────────────────────────────────
  async cancelTrip(id, reason) {
    const trip = await Trip.findByPk(id);
    if (!trip) throw Object.assign(new Error('Chuyến không tồn tại'), { status: 404 });
    if (trip.status === 'completed') throw Object.assign(new Error('Không thể hủy chuyến đã hoàn thành'), { status: 400 });
    return trip.update({ status: 'cancelled', cancellation_reason: reason });
  }

  // ── Xóa chuyến (chỉ pending) ─────────────────────────────
  async deleteTrip(id) {
    const trip = await Trip.findByPk(id);
    if (!trip) throw Object.assign(new Error('Chuyến không tồn tại'), { status: 404 });
    if (trip.status !== 'pending') throw Object.assign(new Error('Chỉ có thể xóa chuyến đang chờ'), { status: 400 });
    await TripAttendance.destroy({ where: { trip_id: id } });
    await trip.destroy();
  }

  // ── Helper: ngày hôm nay theo UTC+7 ──────────────────────
  _todayVN() {
    const now = new Date();
    // UTC+7
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vnTime.toISOString().split('T')[0];
  }
}

module.exports = new TripService();
