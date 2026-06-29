require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const passport = require('passport');
const session  = require('express-session');

const app = express();

// ── Middleware ─────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS – cho phép Admin (3000) và Parent (3001)
app.use(cors({
  origin: [
    process.env.ADMIN_URL  || 'http://localhost:3000',
    process.env.PARENT_URL || 'http://localhost:3001',
  ],
  credentials: true,
}));

// Session (cần cho Passport redirect flow)
app.use(session({
  secret: process.env.SESSION_SECRET || 'schoolbus_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 ngày
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/auth',          require('./routes/driverAuth'));   // driver PIN login
app.use('/api/students',      require('./routes/students'));
app.use('/api/buses',         require('./routes/buses'));
app.use('/api/drivers',       require('./routes/drivers'));
app.use('/api/attendance',    require('./routes/attendance'));
app.use('/api/leave-requests',require('./routes/leaveRequests'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/parents',       require('./routes/parents'));
app.use('/api/reports',       require('./routes/reports'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} không tồn tại` });
});

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ── Start ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚌 SchoolBus Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Docs:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/auth/google          ← Đăng nhập Google`);
  console.log(`   GET  /api/auth/me              ← Thông tin user`);
  console.log(`   GET  /api/students             ← [Admin] Danh sách HS`);
  console.log(`   GET  /api/students/my-children ← [Parent] Con của tôi`);
  console.log(`   POST /api/students/import-excel← [Admin] Import Excel`);
  console.log(`   GET  /api/buses/:id/location   ← GPS xe theo thời gian thực`);
  console.log(`   POST /api/leave-requests       ← [Parent] Gửi đơn nghỉ`);
  console.log(`   GET  /api/notifications/mine   ← [Parent] Thông báo\n`);
});
