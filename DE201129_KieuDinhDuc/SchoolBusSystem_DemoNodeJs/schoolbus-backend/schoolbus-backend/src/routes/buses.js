const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Lấy tất cả xe (admin + parent đều xem được)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT b.*, d.name AS driver_name, d.phone AS driver_phone
      FROM   Buses b
      LEFT JOIN Drivers d ON d.bus_id = b.id AND d.status = 'active'
      ORDER BY b.route
    `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Lấy vị trí GPS hiện tại của 1 xe (parent theo dõi lộ trình)
router.get('/:id/location', authMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    // Vị trí hiện tại
    const cur = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT gps_lat AS lat, gps_lng AS lng, gps_updated AS updated_at FROM Buses WHERE id=@id');

    // Lịch sử 30 phút gần nhất
    const hist = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT TOP 50 lat, lng, speed, recorded_at
        FROM   BusLocations
        WHERE  bus_id = @id AND recorded_at >= DATEADD(MINUTE,-30,GETDATE())
        ORDER BY recorded_at ASC
      `);

    res.json({ current: cur.recordset[0], history: hist.recordset });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DRIVER/SYSTEM: Cập nhật GPS xe
router.post('/:id/location', authMiddleware, async (req, res) => {
  const { lat, lng, speed } = req.body;
  try {
    const pool = await getPool();
    // Cập nhật current GPS
    await pool.request()
      .input('id',  sql.Int,      req.params.id)
      .input('lat', sql.Float,    lat)
      .input('lng', sql.Float,    lng)
      .query(`UPDATE Buses SET gps_lat=@lat, gps_lng=@lng, gps_updated=GETDATE() WHERE id=@id`);

    // Lưu lịch sử
    await pool.request()
      .input('bus_id', sql.Int,   req.params.id)
      .input('lat',    sql.Float, lat)
      .input('lng',    sql.Float, lng)
      .input('speed',  sql.Float, speed || null)
      .query(`INSERT INTO BusLocations (bus_id, lat, lng, speed) VALUES (@bus_id, @lat, @lng, @speed)`);

    res.json({ message: 'GPS updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Thêm xe
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { plate, capacity, route } = req.body;
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('plate',    sql.NVarChar, plate)
      .input('capacity', sql.Int,      capacity || 30)
      .input('route',    sql.NVarChar, route)
      .query('INSERT INTO Buses (plate, capacity, route) OUTPUT INSERTED.* VALUES (@plate,@capacity,@route)');
    res.status(201).json(r.recordset[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Cập nhật xe
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { plate, capacity, route, status } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id',       sql.Int,      req.params.id)
      .input('plate',    sql.NVarChar, plate)
      .input('capacity', sql.Int,      capacity)
      .input('route',    sql.NVarChar, route)
      .input('status',   sql.NVarChar, status)
      .query('UPDATE Buses SET plate=@plate,capacity=@capacity,route=@route,status=@status WHERE id=@id');
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
