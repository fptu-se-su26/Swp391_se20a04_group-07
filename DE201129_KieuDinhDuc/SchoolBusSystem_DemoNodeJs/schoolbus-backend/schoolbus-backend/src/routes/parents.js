const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ADMIN: Lấy tất cả phụ huynh
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT p.*,
             COUNT(s.id) AS student_count,
             MAX(p.last_login) AS last_login
      FROM   Parents p
      LEFT JOIN Students s ON s.parent_id = p.id
      GROUP  BY p.id, p.google_id, p.email, p.name, p.phone,
                p.avatar_url, p.is_active, p.created_at, p.last_login
      ORDER  BY p.name
    `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Thêm phụ huynh thủ công (khi không import Excel)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { email, name, phone } = req.body;
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('email', sql.NVarChar, email.toLowerCase().trim())
      .input('name',  sql.NVarChar, name)
      .input('phone', sql.NVarChar, phone || null)
      .query(`INSERT INTO Parents (email,name,phone) OUTPUT INSERTED.* VALUES (@email,@name,@phone)`);
    res.status(201).json(r.recordset[0]);
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email đã tồn tại trong hệ thống' });
    res.status(500).json({ error: e.message });
  }
});

// ADMIN: Cập nhật phụ huynh
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { name, phone, is_active } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id',        sql.Int,      req.params.id)
      .input('name',      sql.NVarChar, name)
      .input('phone',     sql.NVarChar, phone || null)
      .input('is_active', sql.Bit,      is_active !== undefined ? is_active : 1)
      .query(`UPDATE Parents SET name=@name,phone=@phone,is_active=@is_active WHERE id=@id`);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Cập nhật thông tin cá nhân
router.put('/me/profile', authMiddleware, async (req, res) => {
  const { phone } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('id',    sql.Int,      req.user.id)
      .input('phone', sql.NVarChar, phone || null)
      .query(`UPDATE Parents SET phone=@phone WHERE id=@id`);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
