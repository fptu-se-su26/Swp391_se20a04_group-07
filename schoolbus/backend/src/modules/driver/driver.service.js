// ============================================================
// DRIVER SERVICE — Fixed: bỏ User, dùng UserDriver + Student
// ============================================================
const {
  Trip, TripAttendance, Route, Vehicle,
  UserDriver, Student,         // ← dùng đúng model mới
  RouteStop, Incident, LocationLog, AbsentRequest, sequelize
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
            attributes: ['id', 'full_name', 'student_phone', 'student_email', 'home_address', 'home_lat', 'home_lng']
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

    const now = new Date();

    // Học sinh chưa được điểm danh (vẫn đang 'waiting') -> coi như vắng mặt
    const stillWaiting = await TripAttendance.findAll({
      where: { trip_id: tripId, status: 'waiting' },
      attributes: ['student_id'],
    });
    await TripAttendance.update(
      { status: 'absent' },
      { where: { trip_id: tripId, status: 'waiting' } }
    );
    // Gửi email cho từng học sinh vừa bị đánh dấu vắng (không chặn hoàn tất chuyến nếu lỗi)
    stillWaiting.forEach(a => {
      this._notifyUnexcusedAbsence(trip, a.student_id).catch(err => {
        console.error('completeTrip: gửi email vắng không phép thất bại:', err.message);
      });
    });

    // ✅ Học sinh đã lên xe ('boarded') -> tự động đánh dấu đã xuống xe
    // kèm giờ xuống xe, vì tài xế kết thúc chuyến nghĩa là đã tới điểm cuối.
    await TripAttendance.update(
      { status: 'dropped_off', dropped_at: now },
      { where: { trip_id: tripId, status: 'boarded' } }
    );

    return trip.update({ status: 'completed', actual_end: now });
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
    if (status === 'boarded') updateData.boarded_at = new Date();
    if (status === 'dropped_off') updateData.dropped_at = new Date();

    await attendance.update(updateData);

    if (status === 'boarded') {
      await Trip.increment('boarded_count', { where: { id: tripId } });
    }

    // Vắng mặt không rõ lý do → kiểm tra đơn xin nghỉ, nếu không có thì báo email phụ huynh.
    // Không throw nếu bước này lỗi (mạng, SMTP tạm thời...) để không chặn việc điểm danh.
    if (status === 'absent') {
      this._notifyUnexcusedAbsence(trip, studentId).catch(err => {
        console.error('updateAttendance: gửi email vắng không phép thất bại:', err.message);
      });
    }

    return attendance;
  }

  // ── Gửi email cho phụ huynh khi HS vắng mà không có đơn xin nghỉ hợp lệ ──
  async _notifyUnexcusedAbsence(trip, studentId) {
    // Đơn hợp lệ: đúng học sinh, đúng ngày, đã duyệt, và loại chuyến khớp
    // (trip_type = 'both' áp dụng cho cả 2 buổi, hoặc khớp đúng buổi của chuyến này).
    const validRequest = await AbsentRequest.findOne({
      where: {
        student_id: studentId,
        absent_date: trip.scheduled_date,
        status: 'approved',
        trip_type: { [Op.in]: ['both', trip.trip_type] },
      },
    });
    if (validRequest) return; // đã có đơn xin nghỉ hợp lệ → không gửi email

    const student = await Student.findByPk(studentId, {
      attributes: ['student_id', 'full_name', 'parent_gmail', 'parent_name'],
    });
    if (!student || !student.parent_gmail) return;

    const route = await Route.findByPk(trip.route_id, { attributes: ['route_name', 'route_code'] });

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: `"SchoolBus" <${process.env.MAIL_USER}>`,
      to: student.parent_gmail,
      subject: `⚠️ Thông báo vắng mặt: ${student.full_name} - ${trip.scheduled_date}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:28px;border-radius:12px;border:1px solid #e5e7eb">
          <h2 style="color:#dc2626">🚌 School Bus - Thông báo vắng mặt</h2>
          <p>Kính gửi Quý phụ huynh <strong>${student.parent_name || ''}</strong>,</p>
          <p>Hệ thống ghi nhận học sinh sau <strong>vắng mặt</strong> trên xe buýt và <strong>chưa nhận được đơn xin nghỉ</strong> hợp lệ cho ngày này:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:6px 0;color:#666">Học sinh</td><td style="padding:6px 0;font-weight:600">${student.full_name}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Mã học sinh</td><td style="padding:6px 0;font-weight:600">${student.student_id}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Ngày vắng</td><td style="padding:6px 0;font-weight:600">${trip.scheduled_date}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Tuyến xe</td><td style="padding:6px 0;font-weight:600">${route?.route_name || '—'}</td></tr>
          </table>
          <p>Nếu học sinh vắng mặt có lý do, vui lòng liên hệ nhà trường hoặc gửi đơn xin nghỉ để nhà trường ghi nhận.</p>
          <p style="color:#888;font-size:13px">Đây là email tự động, vui lòng không phản hồi trực tiếp email này.</p>
        </div>
      `,
    });
  }

  async reportIncident(data, driverId) {
    return Incident.create({
      id: uuidv4(),
      reported_by: driverId,
      reporter_type: 'driver',
      ...data
    });
  }

  // ============================================================
  // TRIP HISTORY — bổ sung: quãng đường, điểm đầu/cuối, tìm kiếm, lọc
  // ============================================================
  async getTripHistory(driverId, { page = 1, limit = 15, search, status, fromDate, toDate } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { driver_id: driverId };

    // Mặc định "lịch sử" chỉ gồm chuyến đã kết thúc (hoàn thành/hủy),
    // nhưng cho phép lọc theo 1 trạng thái cụ thể nếu FE truyền lên.
    where.status = status ? status : { [Op.in]: ['completed', 'cancelled', 'in_progress', 'pending'] };

    if (fromDate && toDate) {
      where.scheduled_date = { [Op.between]: [fromDate, toDate] };
    }

    const routeWhere = search
      ? { route_name: { [Op.like]: `%${search}%` } }
      : undefined;

    const { count, rows } = await Trip.findAndCountAll({
      where,
      include: [{
        model: Route,
        attributes: ['id', 'route_name', 'route_code', 'total_distance'],
        where: routeWhere,
        required: !!routeWhere,
        include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }]
      }],
      limit: parseInt(limit), offset,
      order: [['scheduled_date', 'DESC'], ['scheduled_start', 'DESC']]
    });

    const data = rows.map(t => {
      const stops = t.Route?.RouteStops || [];
      const firstStop = stops[0];
      const lastStop = stops[stops.length - 1];

      let durationMin = null;
      if (t.actual_start && t.actual_end) {
        durationMin = Math.round((new Date(t.actual_end) - new Date(t.actual_start)) / 60000);
      }

      let onTime = null;
      if (t.actual_start && t.scheduled_start) {
        let h, m;
        if (t.scheduled_start instanceof Date) {
          // MSSQL trả cột TIME dưới dạng Date object (ví dụ 1970-01-01T06:30:00.000Z)
          h = t.scheduled_start.getUTCHours();
          m = t.scheduled_start.getUTCMinutes();
        } else if (typeof t.scheduled_start === 'string') {
          [h, m] = t.scheduled_start.split(':').map(Number);
        }
        if (h != null && m != null) {
          const scheduled = new Date(t.scheduled_date);
          scheduled.setHours(h, m, 0, 0);
          onTime = new Date(t.actual_start) <= scheduled;
        }
      }

      return {
        ...t.toJSON(),
        start_point: firstStop?.stop_name || firstStop?.address || null,
        end_point: lastStop?.stop_name || lastStop?.address || null,
        distance_km: t.Route?.total_distance ?? null,
        duration_min: durationMin,
        on_time: onTime,
      };
    });

    return { total: count, page: parseInt(page), limit: parseInt(limit), data };
  }

  // ============================================================
  // TRIP HISTORY STATS — 4 số liệu tổng quan cho trang lịch sử
  // ============================================================
  async getTripHistoryStats(driverId) {
    const [stats] = await sequelize.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='completed'   THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status IN ('pending','in_progress') THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status='cancelled'   THEN 1 ELSE 0 END) AS cancelled
      FROM Trips WHERE driver_id = :driverId
    `, { replacements: { driverId }, type: sequelize.QueryTypes.SELECT });
    return stats[0];
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

  // ============================================================
  // NOTIFICATIONS — hộp thư thông báo của tài xế
  // ============================================================
  async getNotifications(driverId, { page = 1, limit = 20 } = {}) {
    const { Notification } = require('../../models');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: driverId, user_type: 'driver', recalled_at: null },
      order: [['pinned', 'DESC'], ['sent_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });
    const unread = await Notification.count({
      where: { user_id: driverId, user_type: 'driver', is_read: false, recalled_at: null },
    });

    return { total: count, page: parseInt(page), limit: parseInt(limit), unread, data: rows };
  }

  async markNotificationRead(notificationId, driverId) {
    const { Notification } = require('../../models');
    await Notification.update(
      { is_read: true },
      { where: { id: notificationId, user_id: driverId, user_type: 'driver' } }
    );
  }

  async markAllNotificationsRead(driverId) {
    const { Notification } = require('../../models');
    await Notification.update(
      { is_read: true },
      { where: { user_id: driverId, user_type: 'driver', is_read: false } }
    );
  }
}

module.exports = new DriverService();
