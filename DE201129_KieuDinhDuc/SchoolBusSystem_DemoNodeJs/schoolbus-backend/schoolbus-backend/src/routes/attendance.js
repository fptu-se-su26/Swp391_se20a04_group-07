const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly, parentOnly } = require('../middleware/auth');

const router = express.Router();

// ADMIN: Điểm danh theo ngày
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('date', sql.Date, date)
      .query(`
        SELECT a.*, s.name AS student_name, s.route,
               b.plate AS bus_plate, p.name AS parent_name,
               d.name AS driver_name
        FROM   Attendance a
        JOIN   Students   s ON a.student_id  = s.id
        JOIN   Parents    p ON s.parent_id   = p.id
        LEFT JOIN Buses   b ON s.bus_id      = b.id
        LEFT JOIN Drivers d ON a.updated_by  = d.id
        WHERE  a.attend_date = @date
        ORDER BY s.route, s.name
      `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Xem điểm danh của con (7 ngày gần nhất)
router.get('/my-children', authMiddleware, parentOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query(`
        SELECT a.attend_date, a.session, a.status, a.note,
               s.name AS student_name, d.name AS driver_name
        FROM   Attendance a
        JOIN   Students   s ON a.student_id = s.id
        LEFT JOIN Drivers d ON a.updated_by = d.id
        WHERE  s.parent_id = @parent_id
          AND  a.attend_date >= DATEADD(DAY,-7,CAST(GETDATE() AS DATE))
        ORDER BY a.attend_date DESC, a.session
      `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DRIVER: Điểm danh học sinh
router.post('/:student_id', authMiddleware, async (req, res) => {
  const { date, session, status, note, driver_id } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input('student_id',  sql.Int,      req.params.student_id)
      .input('attend_date', sql.Date,     date)
      .input('session',     sql.NVarChar, session)
      .input('status',      sql.NVarChar, status)
      .input('note',        sql.NVarChar, note || null)
      .input('driver_id',   sql.Int,      driver_id || null)
      .query(`
        MERGE Attendance AS t
        USING (VALUES (@student_id,@attend_date,@session)) AS s(student_id,attend_date,session)
        ON t.student_id=s.student_id AND t.attend_date=s.attend_date AND t.session=s.session
        WHEN MATCHED    THEN UPDATE SET status=@status, updated_by=@driver_id, updated_at=GETDATE(), note=@note
        WHEN NOT MATCHED THEN INSERT (student_id,attend_date,session,status,updated_by,updated_at,note)
                              VALUES (@student_id,@attend_date,@session,@status,@driver_id,GETDATE(),@note);
      `);
    res.json({ message: 'Đã cập nhật điểm danh' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
