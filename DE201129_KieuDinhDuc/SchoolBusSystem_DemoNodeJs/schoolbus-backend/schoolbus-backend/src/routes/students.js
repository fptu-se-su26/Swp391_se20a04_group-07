const express = require('express');
const multer  = require('multer');
const XLSX    = require('xlsx');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly, parentOnly } = require('../middleware/auth');

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage() });

// ── ADMIN: Lấy tất cả học sinh ────────────────────────────────
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT s.*, p.name AS parent_name, p.email AS parent_email, p.phone AS parent_phone,
             z.name AS zone_name, b.plate AS bus_plate
      FROM Students s
      JOIN Parents   p ON s.parent_id = p.id
      LEFT JOIN Zones  z ON s.zone_id  = z.id
      LEFT JOIN Buses  b ON s.bus_id   = b.id
      ORDER BY s.created_at DESC
    `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── PARENT: Lấy con của mình ─────────────────────────────────
router.get('/my-children', authMiddleware, parentOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query(`
        SELECT s.*, z.name AS zone_name, b.plate AS bus_plate,
               b.route AS bus_route, b.gps_lat, b.gps_lng, b.gps_updated,
               d.name AS driver_name, d.phone AS driver_phone
        FROM   Students s
        LEFT JOIN Zones   z ON s.zone_id = z.id
        LEFT JOIN Buses   b ON s.bus_id  = b.id
        LEFT JOIN Drivers d ON d.bus_id  = b.id AND d.status = 'active'
        WHERE  s.parent_id = @parent_id AND s.status = 'active'
      `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Thêm 1 học sinh ────────────────────────────────────
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { name, parent_id, zone_id, bus_id, pickup_address, pickup_lat, pickup_lng, route } = req.body;
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('name',           sql.NVarChar, name)
      .input('parent_id',      sql.Int,      parent_id)
      .input('zone_id',        sql.Int,      zone_id   || null)
      .input('bus_id',         sql.Int,      bus_id    || null)
      .input('pickup_address', sql.NVarChar, pickup_address)
      .input('pickup_lat',     sql.Float,    pickup_lat || null)
      .input('pickup_lng',     sql.Float,    pickup_lng || null)
      .input('route',          sql.NVarChar, route || null)
      .query(`
        INSERT INTO Students (name, parent_id, zone_id, bus_id, pickup_address, pickup_lat, pickup_lng, route)
        OUTPUT INSERTED.*
        VALUES (@name, @parent_id, @zone_id, @bus_id, @pickup_address, @pickup_lat, @pickup_lng, @route)
      `);
    res.status(201).json(r.recordset[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Import từ Excel ────────────────────────────────────
router.post('/import-excel', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Chưa upload file' });

    const wb   = XLSX.read(req.file.buffer, { type: 'buffer' });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);

    const pool = await getPool();
    let imported = 0, errors = [];

    for (const row of rows) {
      try {
        const email  = (row['Email phụ huynh'] || row['email'] || '').trim().toLowerCase();
        const sName  = (row['Tên học sinh']    || row['ten_hoc_sinh'] || '').trim();
        const addr   = (row['Địa chỉ đón']     || row['dia_chi'] || '').trim();
        const zone   = (row['Khu vực']          || row['khu_vuc'] || '').trim();
        const route  = (row['Tuyến']            || row['tuyen'] || '').trim();

        if (!email || !sName) { errors.push(`Dòng thiếu email hoặc tên: ${JSON.stringify(row)}`); continue; }

        // Tìm hoặc tạo parent
        let pRes = await pool.request().input('email', sql.NVarChar, email)
          .query('SELECT id FROM Parents WHERE email = @email');
        let parentId = pRes.recordset[0]?.id;

        if (!parentId) {
          const pName  = (row['Tên phụ huynh'] || row['ten_phu_huynh'] || '').trim();
          const pPhone = (row['SĐT']            || row['sdt'] || '').trim();
          const ins = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('name',  sql.NVarChar, pName || email)
            .input('phone', sql.NVarChar, pPhone || null)
            .query('INSERT INTO Parents (email, name, phone) OUTPUT INSERTED.id VALUES (@email, @name, @phone)');
          parentId = ins.recordset[0].id;
        }

        // Tìm zone id
        let zoneId = null;
        if (zone) {
          const zRes = await pool.request().input('name', sql.NVarChar, zone)
            .query('SELECT id FROM Zones WHERE name = @name');
          zoneId = zRes.recordset[0]?.id || null;
        }

        await pool.request()
          .input('name',           sql.NVarChar, sName)
          .input('parent_id',      sql.Int,      parentId)
          .input('zone_id',        sql.Int,      zoneId)
          .input('pickup_address', sql.NVarChar, addr)
          .input('route',          sql.NVarChar, route || null)
          .query(`
            INSERT INTO Students (name, parent_id, zone_id, pickup_address, route)
            VALUES (@name, @parent_id, @zone_id, @pickup_address, @route)
          `);
        imported++;
      } catch (rowErr) {
        errors.push(`Lỗi dòng: ${rowErr.message}`);
      }
    }

    res.json({ imported, errors, total: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN: Cập nhật học sinh ──────────────────────────────────
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { name, zone_id, bus_id, pickup_address, route, status } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id',             sql.Int,      req.params.id)
      .input('name',           sql.NVarChar, name)
      .input('zone_id',        sql.Int,      zone_id || null)
      .input('bus_id',         sql.Int,      bus_id  || null)
      .input('pickup_address', sql.NVarChar, pickup_address)
      .input('route',          sql.NVarChar, route   || null)
      .input('status',         sql.NVarChar, status  || 'active')
      .query(`
        UPDATE Students
        SET name=@name, zone_id=@zone_id, bus_id=@bus_id,
            pickup_address=@pickup_address, route=@route, status=@status
        WHERE id=@id
      `);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
