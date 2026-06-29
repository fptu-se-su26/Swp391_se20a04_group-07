const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly, parentOnly } = require('../middleware/auth');

const router = express.Router();

// ADMIN: Gửi thông báo
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { target_type, target_id, zone_id, title, message, notif_type } = req.body;
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('target_type', sql.NVarChar, target_type)
      .input('target_id',   sql.Int,      target_id  || null)
      .input('zone_id',     sql.Int,      zone_id    || null)
      .input('title',       sql.NVarChar, title)
      .input('message',     sql.NVarChar, message)
      .input('notif_type',  sql.NVarChar, notif_type || 'general')
      .query(`
        INSERT INTO Notifications (target_type,target_id,zone_id,title,message,notif_type)
        OUTPUT INSERTED.*
        VALUES (@target_type,@target_id,@zone_id,@title,@message,@notif_type)
      `);
    res.status(201).json(r.recordset[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Lấy tất cả thông báo đã gửi
router.get('/admin', authMiddleware, adminOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT n.*, z.name AS zone_name,
             p.name AS target_parent_name
      FROM   Notifications n
      LEFT JOIN Zones   z ON n.zone_id   = z.id
      LEFT JOIN Parents p ON n.target_id = p.id AND n.target_type = 'parent'
      ORDER  BY n.created_at DESC
    `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Lấy thông báo dành cho mình
router.get('/mine', authMiddleware, parentOnly, async (req, res) => {
  try {
    const pool = await getPool();
    // Lấy zone của parent (qua student)
    const zoneRes = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query('SELECT DISTINCT zone_id FROM Students WHERE parent_id=@parent_id AND zone_id IS NOT NULL');
    const zoneIds = zoneRes.recordset.map(r => r.zone_id);
    const zoneIn  = zoneIds.length ? zoneIds.join(',') : '0';

    const r = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query(`
        SELECT n.*,
               CASE WHEN nr.read_at IS NOT NULL THEN 1 ELSE 0 END AS is_read,
               nr.read_at
        FROM   Notifications n
        LEFT JOIN NotificationReads nr ON nr.notification_id = n.id AND nr.parent_id = @parent_id
        WHERE  n.target_type = 'all_parents'
            OR (n.target_type = 'parent'  AND n.target_id = @parent_id)
            OR (n.target_type = 'zone'    AND n.zone_id IN (${zoneIn}))
            OR  n.target_type = 'system'
        ORDER  BY n.created_at DESC
      `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Đánh dấu đã đọc
router.post('/:id/read', authMiddleware, parentOnly, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('notification_id', sql.Int, req.params.id)
      .input('parent_id',       sql.Int, req.user.id)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM NotificationReads WHERE notification_id=@notification_id AND parent_id=@parent_id)
          INSERT INTO NotificationReads (notification_id, parent_id) VALUES (@notification_id, @parent_id)
      `);
    res.json({ message: 'Đã đọc' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PARENT: Đánh dấu tất cả đã đọc
router.post('/read-all', authMiddleware, parentOnly, async (req, res) => {
  try {
    const pool = await getPool();
    const zoneRes = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query('SELECT DISTINCT zone_id FROM Students WHERE parent_id=@parent_id AND zone_id IS NOT NULL');
    const zoneIds = zoneRes.recordset.map(r => r.zone_id);
    const zoneIn  = zoneIds.length ? zoneIds.join(',') : '0';

    const notifs = await pool.request()
      .input('parent_id', sql.Int, req.user.id)
      .query(`
        SELECT id FROM Notifications
        WHERE  target_type='all_parents'
            OR (target_type='parent' AND target_id=@parent_id)
            OR (target_type='zone'   AND zone_id IN (${zoneIn}))
            OR  target_type='system'
      `);

    for (const n of notifs.recordset) {
      await pool.request()
        .input('notification_id', sql.Int, n.id)
        .input('parent_id',       sql.Int, req.user.id)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM NotificationReads WHERE notification_id=@notification_id AND parent_id=@parent_id)
            INSERT INTO NotificationReads (notification_id, parent_id) VALUES (@notification_id, @parent_id)
        `);
    }
    res.json({ message: 'Đã đánh dấu tất cả đã đọc' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
