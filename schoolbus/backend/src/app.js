require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const logger = require('./config/logger');
const sequelize = require('./config/database');
const { errorHandler } = require('./middlewares');

// Routes
const authRoutes    = require('./modules/auth/auth.route');
const adminRoutes   = require('./modules/admin/admin.route');
const studentRoutes = require('./modules/admin/student.route');  // ← THÊM MỚI
const driverRoutes  = require('./modules/driver/driver.route');
const parentRoutes  = require('./modules/parent/parent.route');
const { managerRouter, studentRouter } = require('./modules/other.routes');

// Socket
const socketHandler = require('./socket/socket.handler');

// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi   = require('swagger-ui-express');

// ============================================================
// APP SETUP
// ============================================================
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET','POST'] }
});

app.set('io', io);

// ============================================================
// MIDDLEWARE STACK
// ============================================================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));

// Rate limit
app.use('/api/v1/auth', rateLimit({ windowMs: 15*60*1000, max: 30, message: { success:false, message:'Too many requests' } }));
app.use('/api/v1', rateLimit({ windowMs: 15*60*1000, max: 200 }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================================
// SWAGGER
// ============================================================
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'School Bus API', version: '1.0.0', description: 'SWP391 - School Bus Management System' },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}/api/v1` }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/modules/**/*.route.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// ============================================================
// ROUTES
// ============================================================
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/admin',    adminRoutes);
app.use('/api/v1/students', studentRoutes);   // ← THÊM MỚI (quản lý học sinh)
app.use('/api/v1/driver',   driverRoutes);
app.use('/api/v1/parent',   parentRoutes);
app.use('/api/v1/manager',  managerRouter);
app.use('/api/v1/student',  studentRouter);   // route cũ (student xem lịch xe)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} không tồn tại` }));

// Error handler
app.use(errorHandler);

// ============================================================
// SOCKET
// ============================================================
socketHandler(io);

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connected successfully');
    server.listen(PORT, () => {
      logger.info(`🚌 School Bus API running on http://localhost:${PORT}`);
      logger.info(`📖 Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();

module.exports = { app, server, io };
