const { LocationLog, Trip, Notification, User } = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

// Map lưu socket theo userId
const connectedUsers = new Map(); // userId -> socketId
const activeTrips = new Map();    // tripId -> { driverSocketId, lat, lng }

module.exports = (io) => {

  // Middleware xác thực token khi connect
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Token không hợp lệ'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    connectedUsers.set(user.id, socket.id);
    logger.info(`Socket connected: ${user.role} - ${user.id}`);

    // Join room theo role
    socket.join(`role:${user.role}`);
    socket.join(`user:${user.id}`);

    // ============================================================
    // DRIVER: Gửi vị trí GPS (mỗi 5 giây)
    // ============================================================
    socket.on('driver:location', async (data) => {
      // data = { tripId, latitude, longitude, speed, heading, accuracy }
      try {
        const { tripId, latitude, longitude, speed, heading, accuracy } = data;

        // Verify driver owns this trip
        const trip = await Trip.findOne({ where: { id: tripId, driver_id: user.id, status: 'in_progress' } });
        if (!trip) return;

        // Save to DB
        await LocationLog.create({ trip_id: tripId, vehicle_id: trip.vehicle_id, latitude, longitude, speed, heading, accuracy });

        // Update cache
        activeTrips.set(tripId, { lat: latitude, lng: longitude, speed, heading, updatedAt: new Date() });

        // Broadcast đến room của trip (parents + managers đang xem trip cụ thể)
        io.to(`trip:${tripId}`).emit('bus:location', {
          tripId, latitude, longitude, speed: speed || 0, heading, updatedAt: new Date()
        });

        // ✅ FIX: Broadcast thêm tới toàn bộ manager (role:manager) vì manager
        // KHÔNG join room `trip:${tripId}` — chỉ join room `role:manager` lúc connect.
        // Thiếu dòng này thì Fleet.jsx chỉ nhận được snapshot 1 lần (fleet:current_positions)
        // chứ không nhận được cập nhật vị trí realtime tiếp theo.
        io.to('role:manager').emit('bus:location', {
          tripId, latitude, longitude, speed: speed || 0, heading, updatedAt: new Date()
        });

        // Cảnh báo tốc độ cao
        if (speed && speed > 60) {
          io.to('role:manager').emit('alert:speed', {
            tripId, driverId: user.id, speed,
            message: `Tài xế đang chạy quá tốc độ: ${speed.toFixed(1)} km/h`
          });
        }
      } catch (err) {
        logger.error('driver:location error', err);
      }
    });

    // ============================================================
    // DRIVER: Bắt đầu chuyến → broadcast
    // ============================================================
    socket.on('driver:trip_started', async ({ tripId }) => {
      try {
        socket.join(`trip:${tripId}`);
        io.to('role:manager').emit('trip:started', { tripId, driverId: user.id, startedAt: new Date() });

        // Notify parents có con trong chuyến
        const attendances = await require('../models').TripAttendance.findAll({ where: { trip_id: tripId } });
        for (const att of attendances) {
          const parents = await require('../models').ParentStudent.findAll({ where: { student_id: att.student_id } });
          for (const p of parents) {
            io.to(`user:${p.parent_id}`).emit('notification:new', {
              title: '🚌 Xe đã xuất phát',
              body: 'Xe buýt đã bắt đầu chuyến. Bạn có thể theo dõi vị trí xe.',
              type: 'trip_started'
            });
          }
        }
      } catch (err) {
        logger.error('driver:trip_started error', err);
      }
    });

    // ============================================================
    // DRIVER: Kết thúc chuyến
    // ============================================================
    socket.on('driver:trip_completed', async ({ tripId }) => {
      try {
        activeTrips.delete(tripId);
        io.to(`trip:${tripId}`).emit('trip:completed', { tripId, completedAt: new Date() });
        io.to('role:manager').emit('trip:completed', { tripId, driverId: user.id });
      } catch (err) {
        logger.error('driver:trip_completed error', err);
      }
    });

    // ============================================================
    // DRIVER: Điểm danh → notify parent
    // ============================================================
    socket.on('driver:attendance_updated', async ({ tripId, studentId, status }) => {
      try {
        const parents = await require('../models').ParentStudent.findAll({ where: { student_id: studentId } });
        const msgs = {
          boarded:    { title: '✅ Con đã lên xe', body: 'Con bạn đã lên xe buýt an toàn.' },
          dropped_off:{ title: '🏠 Con đã xuống xe', body: 'Con bạn đã xuống xe buýt và về đến điểm trả.' },
          absent:     { title: '⚠️ Con vắng mặt', body: 'Con bạn không có mặt khi xe đến điểm đón.' },
        };
        const msg = msgs[status];
        if (!msg) return;
        for (const p of parents) {
          // Save notification to DB
          await Notification.create({
            id: uuidv4(), user_id: p.parent_id,
            type: `attendance_${status}`, title: msg.title, body: msg.body
          });
          io.to(`user:${p.parent_id}`).emit('notification:new', { ...msg, type: `attendance_${status}` });
        }
      } catch (err) {
        logger.error('driver:attendance_updated error', err);
      }
    });

    // ============================================================
    // PARENT/STUDENT: Subscribe theo dõi trip cụ thể
    // ============================================================
    socket.on('client:watch_trip', ({ tripId }) => {
      socket.join(`trip:${tripId}`);
      // Gửi vị trí hiện tại nếu có
      const current = activeTrips.get(tripId);
      if (current) {
        socket.emit('bus:location', { tripId, ...current });
      }
    });

    socket.on('client:unwatch_trip', ({ tripId }) => {
      socket.leave(`trip:${tripId}`);
    });

    // ============================================================
    // MANAGER: Subscribe theo dõi tất cả trips đang chạy
    // ============================================================
    socket.on('manager:watch_all', () => {
      socket.join('role:manager');
      // Gửi tất cả xe đang chạy
      const allActive = {};
      for (const [tripId, loc] of activeTrips.entries()) {
        allActive[tripId] = loc;
      }
      socket.emit('fleet:current_positions', allActive);
    });

    // ============================================================
    // INCIDENT: Driver báo sự cố realtime
    // ============================================================
    socket.on('driver:incident', async (data) => {
      try {
        io.to('role:manager').emit('alert:incident', {
          ...data,
          driverId: user.id,
          reportedAt: new Date()
        });
        // Notify tất cả managers
        const managers = await User.findAll({ where: { role: 'manager', is_active: true }, attributes: ['id'] });
        const notifs = managers.map(m => ({
          id: uuidv4(), user_id: m.id,
          type: 'incident', title: '🚨 Sự cố mới', body: `Tài xế báo cáo: ${data.type}`
        }));
        await Notification.bulkCreate(notifs);
      } catch (err) {
        logger.error('driver:incident error', err);
      }
    });

    // ============================================================
    // DISCONNECT
    // ============================================================
    socket.on('disconnect', () => {
      connectedUsers.delete(user.id);
      logger.info(`Socket disconnected: ${user.role} - ${user.id}`);
    });
  });

  return io;
};