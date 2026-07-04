// ============================================================
// DRIVER SERVICE — Fixed: bỏ User, dùng UserDriver + Student
// ============================================================
const {
  Trip, TripAttendance, Route, Vehicle,
  UserDriver, Student,         // ← dùng đúng model mới
  RouteStop, Incident, LocationLog, sequelize
} = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

class DriverService {

  async getTodayTrips(driverId) {
    return Trip.findAll({
      where: {
        driver_id: driverId,
        scheduled_date: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      include: [
        {
          model: Route,
          include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }]
        },
        { model: Vehicle }
      ],
      order: [['scheduled_start', 'ASC']]
    });
  }

  async getTripDetail(tripId, driverId) {
    const trip = await Trip.findOne({
      where: { id: tripId, driver_id: driverId },
      include: [
        {
          model: Route,
          include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }]
        },
        { model: Vehicle },
        {
          model: TripAttendance,
          include: [{
            model: Student,
            as: 'student',
            attributes: ['id', 'full_name', 'student_phone', 'student_email']
          }]
        }
      ]
    });
    if (!trip) throw Object.assign(new Error('Chuyến không tồn tại'), { status: 404 });
    return trip;
  }

  async startTrip(tripId, driverId) {
    const trip = await Trip.findOne({
      where: { id: tripId, driver_id: driverId, status: 'pending' }
    });
    if (!trip) throw Object.assign(new Error('Không thể bắt đầu chuyến này'), { status: 400 });
    return trip.update({ status: 'in_progress', actual_start: new Date() });
  }

  async completeTrip(tripId, driverId) {
    const trip = await Trip.findOne({
      where: { id: tripId, driver_id: driverId, status: 'in_progress' }
    });
    if (!trip) throw Object.assign(new Error('Chuyến không đang chạy'), { status: 400 });
    await TripAttendance.update(
      { status: 'absent' },
      { where: { trip_id: tripId, status: 'waiting' } }
    );
    return trip.update({ status: 'completed', actual_end: new Date() });
  }

  async cancelTrip(tripId, driverId, reason) {
    const trip = await Trip.findOne({
      where: { id: tripId, driver_id: driverId, status: 'pending' }
    });
    if (!trip) throw Object.assign(new Error('Không thể hủy chuyến này'), { status: 400 });
    return trip.update({ status: 'cancelled', cancellation_reason: reason });
  }

  async updateAttendance(tripId, studentId, status, noteData, driverId) {
    const trip = await Trip.findOne({ where: { id: tripId, driver_id: driverId } });
    if (!trip) throw Object.assign(new Error('Không có quyền'), { status: 403 });

    const attendance = await TripAttendance.findOne({
      where: { trip_id: tripId, student_id: studentId }
    });
    if (!attendance) throw Object.assign(new Error('Học sinh không trong chuyến này'), { status: 404 });

    const updateData = { status, noted_by: driverId, note: noteData };
    if (status === 'boarded')     updateData.boarded_at = new Date();
    if (status === 'dropped_off') updateData.dropped_at = new Date();

    await attendance.update(updateData);

    if (status === 'boarded') {
      await Trip.increment('boarded_count', { where: { id: tripId } });
    }
    return attendance;
  }

  async reportIncident(data, driverId) {
    return Incident.create({
      id: uuidv4(),
      reported_by:   driverId,
      reporter_type: 'driver',
      ...data
    });
  }

  async getTripHistory(driverId, page = 1, limit = 20) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Trip.findAndCountAll({
      where: {
        driver_id: driverId,
        status: { [Op.in]: ['completed', 'cancelled'] }
      },
      include: [{ model: Route, attributes: ['route_name', 'route_code'] }],
      limit: parseInt(limit), offset,
      order: [['scheduled_date', 'DESC']]
    });
    return { total: count, data: rows };
  }

  async getPerformance(driverId) {
    const [stats] = await sequelize.query(`
      SELECT
        COUNT(*)  AS total_trips,
        SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled,
        AVG(CAST(boarded_count AS FLOAT) / NULLIF(total_students,0) * 100) AS avg_attendance_rate
      FROM Trips WHERE driver_id = :driverId
    `, { replacements: { driverId }, type: sequelize.QueryTypes.SELECT });
    return stats[0];
  }
}

module.exports = new DriverService();
