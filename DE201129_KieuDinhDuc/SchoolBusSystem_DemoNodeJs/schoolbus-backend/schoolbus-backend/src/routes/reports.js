const express = require('express');
const { getPool, sql } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// DRIVER: Gửi báo cáo ngày
router.post('/', authMiddleware, async (req, res) => {
  const { date, session, note, present, absent, leave, distance_km, start_time, end_time } = req.body;
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Chỉ tài xế mới gửi báo cáo' });
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('driver_id',   sql.Int,      req.user.id)
      .input('bus_id',      sql.Int,      req.user.bus_id || null)
      .input('report_date', sql.Date,     date)
      .input('session',     sql.NVarChar, session)
      .input('note',        sql.NVarChar, note || null)
      .input('present',     sql.Int,      present || 0)
      .input('absent',      sql.Int,      absent  || 0)
      .input('leave_count', sql.Int,      leave   || 0)
      .input('distance_km', sql.Float,    distance_km || 0)
      .input('start_time',  sql.NVarChar, start_time || null)
      .input('end_time',    sql.NVarChar, end_time   || null)
      .query(`
        MERGE DriverReports AS t
        USING (VALUES (@driver_id, @report_date, @session)) AS s(driver_id, report_date, session)
          ON t.driver_id=s.driver_id AND t.report_date=s.report_date AND t.session=s.session
        WHEN MATCHED THEN
          UPDATE SET note=@note, present=@present, absent=@absent, leave_count=@leave_count,
                     distance_km=@distance_km, start_time=@start_time, end_time=@end_time, updated_at=GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (driver_id, bus_id, report_date, session, note, present, absent, leave_count, distance_km, start_time, end_time)
          VALUES (@driver_id,@bus_id,@report_date,@session,@note,@present,@absent,@leave_count,@distance_km,@start_time,@end_time);
      `);
    res.json({ message: 'Đã gửi báo cáo' });
  } catch (e) {
    // Table chưa có → tạo tự động
    if (e.message.includes('Invalid object name')) {
      try {
        const pool = await getPool();
        await pool.request().query(`
          IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='DriverReports')
          CREATE TABLE DriverReports (
            id           INT IDENTITY(1,1) PRIMARY KEY,
            driver_id    INT NOT NULL REFERENCES Drivers(id),
            bus_id       INT REFERENCES Buses(id),
            report_date  DATE NOT NULL,
            session      NVARCHAR(20) NOT NULL CHECK (session IN ('morning','afternoon')),
            present      INT DEFAULT 0,
            absent       INT DEFAULT 0,
            leave_count  INT DEFAULT 0,
            distance_km  FLOAT DEFAULT 0,
            start_time   NVARCHAR(10),
            end_time     NVARCHAR(10),
            note         NVARCHAR(1000),
            created_at   DATETIME2 DEFAULT GETDATE(),
            updated_at   DATETIME2 DEFAULT GETDATE(),
            UNIQUE (driver_id, report_date, session)
          );
        `);
        return res.json({ message: 'Table created. Vui lòng gửi lại.' });
      } catch (e2) { return res.status(500).json({ error: e2.message }); }
    }
    res.status(500).json({ error: e.message });
  }
});

// ADMIN: Xem tất cả báo cáo của tài xế
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  const { date, driver_id } = req.query;
  try {
    const pool = await getPool();
    let q = `
      SELECT r.*, d.name AS driver_name, d.phone AS driver_phone,
             b.plate AS bus_plate, b.route AS bus_route
      FROM   DriverReports r
      JOIN   Drivers d ON r.driver_id = d.id
      LEFT JOIN Buses b ON r.bus_id = b.id
      WHERE 1=1
    `;
    const req2 = pool.request();
    if (date)      { q += ` AND r.report_date = @date`;      req2.input('date', sql.Date, date); }
    if (driver_id) { q += ` AND r.driver_id   = @driver_id`; req2.input('driver_id', sql.Int, driver_id); }
    q += ' ORDER BY r.report_date DESC, r.session';
    const r = await req2.query(q);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DRIVER: Xem báo cáo của mình
router.get('/mine', authMiddleware, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Không phải tài xế' });
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('driver_id', sql.Int, req.user.id)
      .query(`
        SELECT TOP 30 * FROM DriverReports
        WHERE driver_id = @driver_id
        ORDER BY report_date DESC, session
      `);
    res.json(r.recordset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
