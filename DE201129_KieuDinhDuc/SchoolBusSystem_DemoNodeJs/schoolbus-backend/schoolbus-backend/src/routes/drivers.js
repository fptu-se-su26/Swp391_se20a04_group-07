const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Lấy tất cả tài xế
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT d.*, b.plate AS bus_plate, b.route AS bus_route
      FROM   Drivers d
      LEFT JOIN Buses b ON d.bus_id = b.id
      ORDER BY d.name
    `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Thêm tài xế
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { name, phone, license, shift } = req.body;
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('name',    sql.NVarChar, name)
      .input('phone',   sql.NVarChar, phone)
      .input('license', sql.NVarChar, license || 'B2')
      .input('shift',   sql.NVarChar, shift   || 'morning')
      .query(`INSERT INTO Drivers (name,phone,license,shift) OUTPUT INSERTED.* VALUES (@name,@phone,@license,@shift)`);
    res.status(201).json(r.recordset[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Cập nhật / phân xe cho tài xế
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { name, phone, license, shift, bus_id, status } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id',      sql.Int,      req.params.id)
      .input('name',    sql.NVarChar, name)
      .input('phone',   sql.NVarChar, phone)
      .input('license', sql.NVarChar, license)
      .input('shift',   sql.NVarChar, shift)
      .input('bus_id',  sql.Int,      bus_id || null)
      .input('status',  sql.NVarChar, status || 'active')
      .query(`UPDATE Drivers SET name=@name,phone=@phone,license=@license,shift=@shift,bus_id=@bus_id,status=@status WHERE id=@id`);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Phân ca tự động: gán tài xế chưa có xe vào xe chưa có tài xế
router.post('/auto-assign', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const freeDrivers = await pool.request().query(`SELECT id, shift FROM Drivers WHERE bus_id IS NULL AND status='available' ORDER BY id`);
    const freeBuses   = await pool.request().query(`SELECT id FROM Buses WHERE id NOT IN (SELECT bus_id FROM Drivers WHERE bus_id IS NOT NULL) ORDER BY id`);

    let assigned = 0;
    const buses = freeBuses.recordset;
    for (let i = 0; i < freeDrivers.recordset.length && i < buses.length; i++) {
      await pool.request()
        .input('bus_id',    sql.Int, buses[i].id)
        .input('driver_id', sql.Int, freeDrivers.recordset[i].id)
        .query(`UPDATE Drivers SET bus_id=@bus_id, status='active' WHERE id=@driver_id`);
      assigned++;
    }
    res.json({ message: `Đã phân công ${assigned} tài xế`, assigned });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
