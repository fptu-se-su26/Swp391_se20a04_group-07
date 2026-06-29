const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly, parentOnly } = require('../middleware/auth');

const router = express.Router();

// ADMIN: Tất cả đơn xin nghỉ
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT lr.*, s.name AS student_name, s.route,
             p.name AS parent_name, p.phone AS parent_phone
      FROM   LeaveRequests lr
      JOIN   Students      s  ON lr.student_id = s.id
      JOIN   Parents       p  ON lr.parent_id  = p.id
      ORDER  BY lr.submitted_at DESC
    `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Xem đơn của mình
router.get('/mine', authMiddleware, parentOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query(`
        SELECT lr.*, s.name AS student_name
        FROM   LeaveRequests lr
        JOIN   Students      s ON lr.student_id = s.id
        WHERE  lr.parent_id = @parent_id
        ORDER  BY lr.submitted_at DESC
      `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Gửi đơn xin nghỉ
router.post('/', authMiddleware, parentOnly, async (req, res) => {
  const { student_id, leave_date, session, reason } = req.body;
  try {
    const pool = await getPool();

    // Kiểm tra deadline: phải gửi trước 17:00 ngày hôm trước
    const now       = new Date();
    const leaveDay  = new Date(leave_date);
    const yesterday = new Date(leaveDay); yesterday.setDate(leaveDay.getDate() - 1);
    const isOnTime  = now < new Date(yesterday.toDateString() + ' 17:00:00');

    if (!isOnTime) {
      return res.status(400).json({
        error: 'Đã quá thời hạn gửi đơn. Đơn xin nghỉ phải được gửi trước 17:00 ngày hôm trước.',
        deadline_passed: true,
      });
    }

    // Kiểm tra student thuộc parent này
    const check = await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('parent_id',  sql.Int, req.user.id)
      .query('SELECT id FROM Students WHERE id=@student_id AND parent_id=@parent_id');
    if (!check.recordset.length) return res.status(403).json({ error: 'Học sinh không thuộc tài khoản này' });

    const r = await pool.request()
      .input('student_id', sql.Int,      student_id)
      .input('parent_id',  sql.Int,      req.user.id)
      .input('leave_date', sql.Date,     leave_date)
      .input('session',    sql.NVarChar, session)
      .input('reason',     sql.NVarChar, reason)
      .query(`
        INSERT INTO LeaveRequests (student_id, parent_id, leave_date, session, reason)
        OUTPUT INSERTED.*
        VALUES (@student_id, @parent_id, @leave_date, @session, @reason)
      `);
    res.status(201).json(r.recordset[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Duyệt / Từ chối đơn
router.patch('/:id/review', authMiddleware, adminOnly, async (req, res) => {
  const { status, reviewer } = req.body; // status: 'approved' | 'rejected'
  try {
    const pool = await getPool();
    await pool.request()
      .input('id',          sql.Int,      req.params.id)
      .input('status',      sql.NVarChar, status)
      .input('reviewer',    sql.NVarChar, reviewer || 'Admin')
      .query(`
        UPDATE LeaveRequests
        SET    status=@status, reviewed_by=@reviewer, reviewed_at=GETDATE()
        WHERE  id=@id
      `);

    // Gửi thông báo cho parent
    const lr = await pool.request().input('id', sql.Int, req.params.id)
      .query('SELECT lr.*, s.name AS student_name FROM LeaveRequests lr JOIN Students s ON lr.student_id=s.id WHERE lr.id=@id');
    const leave = lr.recordset[0];
    const msg   = status === 'approved'
      ? `Đơn xin nghỉ cho ${leave.student_name} ngày ${leave.leave_date} đã được DUYỆT.`
      : `Đơn xin nghỉ cho ${leave.student_name} ngày ${leave.leave_date} đã bị TỪ CHỐI.`;

    await pool.request()
      .input('target_id',  sql.Int,      leave.parent_id)
      .input('title',      sql.NVarChar, status === 'approved' ? 'Đơn xin nghỉ được duyệt ✅' : 'Đơn xin nghỉ bị từ chối ❌')
      .input('message',    sql.NVarChar, msg)
      .input('notif_type', sql.NVarChar, status === 'approved' ? 'leave_approved' : 'leave_rejected')
      .query(`INSERT INTO Notifications (target_type,target_id,title,message,notif_type) VALUES ('parent',@target_id,@title,@message,@notif_type)`);

    res.json({ message: `Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} đơn` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
