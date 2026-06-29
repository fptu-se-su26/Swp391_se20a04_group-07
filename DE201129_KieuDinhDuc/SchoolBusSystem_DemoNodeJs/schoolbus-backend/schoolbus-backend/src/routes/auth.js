const express  = require('express');
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getPool, sql } = require('../config/db');

const router = express.Router();

// ── Cấu hình Passport Google OAuth ──────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const pool  = await getPool();
      const email = profile.emails[0].value;

      // Tìm parent theo email (admin đã nhập từ Excel)
      let result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query(`SELECT * FROM Parents WHERE email = @email`);

      let parent = result.recordset[0];

      if (!parent) {
        // Email chưa được đăng ký bởi admin → từ chối
        return done(null, false, { message: 'Email chưa được đăng ký trong hệ thống. Vui lòng liên hệ nhà trường.' });
      }

      // Cập nhật google_id + avatar + last_login nếu lần đầu login
      await pool.request()
        .input('google_id',   sql.NVarChar, profile.id)
        .input('avatar_url',  sql.NVarChar, profile.photos?.[0]?.value || null)
        .input('last_login',  sql.DateTime2, new Date())
        .input('id',          sql.Int, parent.id)
        .query(`
          UPDATE Parents
          SET google_id  = @google_id,
              avatar_url = COALESCE(@avatar_url, avatar_url),
              last_login = @last_login
          WHERE id = @id
        `);

      parent.google_id  = profile.id;
      parent.avatar_url = profile.photos?.[0]?.value || parent.avatar_url;

      return done(null, parent);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const pool = await getPool();
    const r = await pool.request().input('id', sql.Int, id).query('SELECT * FROM Parents WHERE id = @id');
    done(null, r.recordset[0]);
  } catch (e) { done(e); }
});

// ── Routes ────────────────────────────────────────────────────

// Bắt đầu đăng nhập Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback sau khi Google xác thực
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.PARENT_URL}/login?error=not_registered` }),
  (req, res) => {
    // Tạo JWT gửi về client
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name, role: 'parent' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    // Redirect về Parent app kèm token
    res.redirect(`${process.env.PARENT_URL}/auth/callback?token=${token}`);
  }
);

// Lấy thông tin user hiện tại (dùng token)
router.get('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query(`
        SELECT p.id, p.email, p.name, p.phone, p.avatar_url, p.last_login,
               (SELECT COUNT(*) FROM Students WHERE parent_id = p.id) AS student_count
        FROM Parents p WHERE p.id = @id
      `);
    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Đăng xuất
router.post('/logout', (req, res) => {
  res.json({ message: 'Đã đăng xuất' });
});

module.exports = router;
