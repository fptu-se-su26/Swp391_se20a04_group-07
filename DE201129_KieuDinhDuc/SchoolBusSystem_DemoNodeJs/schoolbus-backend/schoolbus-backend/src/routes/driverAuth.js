const express = require('express');
const jwt     = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

const router = express.Router();

// POST /api/auth/driver-login  { phone, pin }
router.post('/driver-login', async (req, res) => {
  const { phone, pin } = req.body;
  if (!phone || !pin) return res.status(400).json({ error: 'Thiếu số điện thoại hoặc PIN' });

  try {
    const pool = await getPool();

    // Tìm driver theo phone + pin
    // PIN được lưu dạng plain text hoặc hash (demo dùng plain, production nên dùng bcrypt)
    const r = await pool.request()
      .input('phone', sql.NVarChar, phone)
      .input('pin',   sql.NVarChar, pin)
      .query(`
        SELECT d.*, b.plate AS bus_plate, b.route AS bus_route, b.capacity AS bus_capacity
        FROM   Drivers d
        LEFT JOIN Buses b ON d.bus_id = b.id
        WHERE  d.phone = @phone AND d.pin = @pin AND d.status != 'off'
      `);

    const driver = r.recordset[0];
    if (!driver) return res.status(401).json({ error: 'Số điện thoại hoặc PIN không đúng' });

    // Cập nhật last_login
    await pool.request()
      .input('id', sql.Int, driver.id)
      .query(`UPDATE Drivers SET last_login = GETDATE() WHERE id = @id`);

    const token = jwt.sign(
      {
        id:    driver.id,
        name:  driver.name,
        phone: driver.phone,
        role:  'driver',
        bus_id:    driver.bus_id,
        bus_plate: driver.bus_plate,
        bus_route: driver.bus_route,
        shift:     driver.shift,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      driver: {
        id:           driver.id,
        name:         driver.name,
        phone:        driver.phone,
        license:      driver.license,
        shift:        driver.shift,
        bus_id:       driver.bus_id,
        bus_plate:    driver.bus_plate,
        bus_route:    driver.bus_route,
        bus_capacity: driver.bus_capacity,
        status:       driver.status,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/auth/driver-me  – lấy thông tin driver hiện tại
router.get('/driver-me', require('../middleware/auth').authMiddleware, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Không phải tài xế' });
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query(`
        SELECT d.*, b.plate AS bus_plate, b.route AS bus_route, b.capacity AS bus_capacity,
               b.gps_lat, b.gps_lng
        FROM   Drivers d
        LEFT JOIN Buses b ON d.bus_id = b.id
        WHERE  d.id = @id
      `);
    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
