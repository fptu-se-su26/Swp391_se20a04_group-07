const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ── UserAdmin ─────────────────────────────────────────────────
const UserAdmin = sequelize.define('UserAdmin', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name:     { type: DataTypes.STRING(100), allowNull: false },
  email:         { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone:         DataTypes.STRING(20),
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  avatar_url:    DataTypes.STRING(500),
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login:    DataTypes.DATE,
}, { tableName: 'UserAdmins', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

// ── UserManager ───────────────────────────────────────────────
const UserManager = sequelize.define('UserManager', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name:     { type: DataTypes.STRING(100), allowNull: false },
  email:         { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone:         DataTypes.STRING(20),
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  avatar_url:    DataTypes.STRING(500),
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login:    DataTypes.DATE,
}, { tableName: 'UserManagers', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

// ── UserDriver ────────────────────────────────────────────────
const UserDriver = sequelize.define('UserDriver', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name:      { type: DataTypes.STRING(100), allowNull: false },
  email:          { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone:          DataTypes.STRING(20),
  password_hash:  { type: DataTypes.STRING(255), allowNull: false },
  avatar_url:     DataTypes.STRING(500),
  license_number: DataTypes.STRING(50),
  license_expiry: DataTypes.DATEONLY,
  is_active:      { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login:     DataTypes.DATE,
}, { tableName: 'UserDrivers', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

// ── ClassRoom → bảng Classes ──────────────────────────────────
const ClassRoom = sequelize.define('ClassRoom', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  class_name:  { type: DataTypes.STRING(50), allowNull: false },
  grade:       DataTypes.STRING(10),
  school_year: DataTypes.STRING(20),
  teacher:     DataTypes.STRING(100),
  is_active:   { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'Classes', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── Student → bảng Students (MỚI - thay UserStudent) ─────────
const Student = sequelize.define('Student', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id:    { type: DataTypes.STRING(20),  allowNull: false, unique: true },
  full_name:     { type: DataTypes.STRING(100), allowNull: false },
  dob:           { type: DataTypes.DATEONLY,    allowNull: false },
  gender:        { type: DataTypes.STRING(10),  allowNull: false },
  class_id:      { type: DataTypes.UUID,        allowNull: false },
  student_email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  student_phone: DataTypes.STRING(20),
  parent_name:   { type: DataTypes.STRING(100), allowNull: false },
  parent_gmail:  { type: DataTypes.STRING(150), allowNull: false, unique: true },
  home_address:  DataTypes.STRING(300),
  bus_route_id:  DataTypes.UUID,
  bus_stop_id:   DataTypes.UUID,
  status:        { type: DataTypes.STRING(20), defaultValue: 'active' },
}, { tableName: 'Students', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── RefreshToken ──────────────────────────────────────────────
const RefreshToken = sequelize.define('RefreshToken', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id:   { type: DataTypes.UUID, allowNull: false },
  user_type: { type: DataTypes.STRING(20), allowNull: false },
  token:     { type: DataTypes.STRING(500), allowNull: false, unique: true },
  expires_at:{ type: DataTypes.DATE, allowNull: false },
}, { tableName: 'RefreshTokens', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── OtpCode ───────────────────────────────────────────────────
const OtpCode = sequelize.define('OtpCode', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id:   { type: DataTypes.UUID, allowNull: false },
  user_type: { type: DataTypes.STRING(20), allowNull: false },
  code:      { type: DataTypes.STRING(10), allowNull: false },
  type:      DataTypes.STRING(30),
  expires_at:{ type: DataTypes.DATE, allowNull: false },
  is_used:   { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'OtpCodes', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── Vehicle ───────────────────────────────────────────────────
const Vehicle = sequelize.define('Vehicle', {
  id:                  { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  plate_number:        { type: DataTypes.STRING(20), allowNull: false, unique: true },
  vehicle_name:        DataTypes.STRING(100),
  brand:               DataTypes.STRING(50),
  capacity:            { type: DataTypes.INTEGER, allowNull: false },
  current_driver_id:   DataTypes.UUID,
  status:              { type: DataTypes.STRING(20), defaultValue: 'active' },
  gps_device_id:       DataTypes.STRING(100),
  insurance_expiry:    DataTypes.DATEONLY,
  registration_expiry: DataTypes.DATEONLY,
  last_maintenance:    DataTypes.DATEONLY,
  next_maintenance:    DataTypes.DATEONLY,
  image_url:           DataTypes.STRING(500),
}, { tableName: 'Vehicles', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

// ── Route ─────────────────────────────────────────────────────
const Route = sequelize.define('Route', {
  id:                 { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  route_name:         { type: DataTypes.STRING(100), allowNull: false },
  route_code:         { type: DataTypes.STRING(20), unique: true },
  vehicle_id:         DataTypes.UUID,
  driver_id:          DataTypes.UUID,
  total_distance:     DataTypes.FLOAT,
  estimated_duration: DataTypes.INTEGER,
  is_active:          { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'Routes', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

// ── RouteStop ─────────────────────────────────────────────────
const RouteStop = sequelize.define('RouteStop', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  route_id:       { type: DataTypes.UUID, allowNull: false },
  stop_name:      { type: DataTypes.STRING(150), allowNull: false },
  address:        DataTypes.STRING(300),
  latitude:       DataTypes.DECIMAL(10, 8),
  longitude:      DataTypes.DECIMAL(11, 8),
  stop_order:     { type: DataTypes.INTEGER, allowNull: false },
  estimated_time: DataTypes.TIME,
  radius_meters:  { type: DataTypes.INTEGER, defaultValue: 100 },
}, { tableName: 'RouteStops', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── RouteSubscription ─────────────────────────────────────────
const RouteSubscription = sequelize.define('RouteSubscription', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id:      { type: DataTypes.UUID, allowNull: false },
  route_id:        { type: DataTypes.UUID, allowNull: false },
  pickup_stop_id:  DataTypes.UUID,
  dropoff_stop_id: DataTypes.UUID,
  start_date:      DataTypes.DATEONLY,
  end_date:        DataTypes.DATEONLY,
  status:          { type: DataTypes.STRING(20), defaultValue: 'active' },
}, { tableName: 'RouteSubscriptions', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── ParentStudent ─────────────────────────────────────────────
const ParentStudent = sequelize.define('ParentStudent', {
  parent_id:    { type: DataTypes.UUID, primaryKey: true },
  student_id:   { type: DataTypes.UUID, primaryKey: true },
  relationship: DataTypes.STRING(50),
  is_primary:   { type: DataTypes.BOOLEAN, defaultValue: false },
  approved_at:  DataTypes.DATE,
}, { tableName: 'ParentStudent', timestamps: false });

// ── Trip ──────────────────────────────────────────────────────
const Trip = sequelize.define('Trip', {
  id:                  { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  route_id:            { type: DataTypes.UUID, allowNull: false },
  vehicle_id:          { type: DataTypes.UUID, allowNull: false },
  driver_id:           { type: DataTypes.UUID, allowNull: false },
  trip_type:           { type: DataTypes.STRING(30), allowNull: false },
  scheduled_date:      { type: DataTypes.DATEONLY, allowNull: false },
  scheduled_start:     DataTypes.TIME,
  actual_start:        DataTypes.DATE,
  actual_end:          DataTypes.DATE,
  status:              { type: DataTypes.STRING(20), defaultValue: 'pending' },
  cancellation_reason: DataTypes.STRING(500),
  total_students:      { type: DataTypes.INTEGER, defaultValue: 0 },
  boarded_count:       { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'Trips', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── TripAttendance ────────────────────────────────────────────
const TripAttendance = sequelize.define('TripAttendance', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  trip_id:    { type: DataTypes.UUID, allowNull: false },
  student_id: { type: DataTypes.UUID, allowNull: false },
  stop_id:    DataTypes.UUID,
  status:     { type: DataTypes.STRING(20), defaultValue: 'waiting' },
  boarded_at: DataTypes.DATE,
  dropped_at: DataTypes.DATE,
  noted_by:   DataTypes.UUID,
  note:       DataTypes.STRING(500),
}, { tableName: 'TripAttendance', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── LocationLog ───────────────────────────────────────────────
const LocationLog = sequelize.define('LocationLog', {
  id:         { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  trip_id:    { type: DataTypes.UUID, allowNull: false },
  vehicle_id: { type: DataTypes.UUID, allowNull: false },
  latitude:   { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitude:  { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  speed:      DataTypes.FLOAT,
  heading:    DataTypes.FLOAT,
  accuracy:   DataTypes.FLOAT,
  logged_at:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'LocationLogs', timestamps: false });

// ── Notification ──────────────────────────────────────────────
const Notification = sequelize.define('Notification', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id:   { type: DataTypes.UUID, allowNull: false },
  user_type: { type: DataTypes.STRING(20), allowNull: false },
  type:      DataTypes.STRING(100),
  title:     DataTypes.STRING(200),
  body:      DataTypes.TEXT,
  data:      DataTypes.TEXT,
  is_read:   { type: DataTypes.BOOLEAN, defaultValue: false },
  sent_at:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Notifications', timestamps: false });

// ── Incident ──────────────────────────────────────────────────
const Incident = sequelize.define('Incident', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  trip_id:       DataTypes.UUID,
  reported_by:   { type: DataTypes.UUID, allowNull: false },
  reporter_type: { type: DataTypes.STRING(20), defaultValue: 'driver' },
  type:          { type: DataTypes.STRING(50), allowNull: false },
  severity:      { type: DataTypes.STRING(20), allowNull: false },
  description:   DataTypes.TEXT,
  latitude:      DataTypes.DECIMAL(10, 8),
  longitude:     DataTypes.DECIMAL(11, 8),
  image_urls:    DataTypes.TEXT,
  status:        { type: DataTypes.STRING(20), defaultValue: 'open' },
  resolved_by:   DataTypes.UUID,
  resolved_at:   DataTypes.DATE,
}, { tableName: 'Incidents', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── AbsentRequest ─────────────────────────────────────────────
const AbsentRequest = sequelize.define('AbsentRequest', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id:  { type: DataTypes.UUID, allowNull: false },
  parent_id:   { type: DataTypes.UUID, allowNull: false },
  absent_date: { type: DataTypes.DATEONLY, allowNull: false },
  trip_type:   { type: DataTypes.STRING(20), defaultValue: 'both' },
  reason:      DataTypes.STRING(500),
  status:      { type: DataTypes.STRING(20), defaultValue: 'approved' },
}, { tableName: 'AbsentRequests', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── PaymentPlan ───────────────────────────────────────────────
const PaymentPlan = sequelize.define('PaymentPlan', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  plan_name:     { type: DataTypes.STRING(100), allowNull: false },
  route_id:      DataTypes.UUID,
  amount:        { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  billing_cycle: { type: DataTypes.STRING(20), defaultValue: 'monthly' },
  due_day:       DataTypes.INTEGER,
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'PaymentPlans', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── Invoice ───────────────────────────────────────────────────
const Invoice = sequelize.define('Invoice', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id:     { type: DataTypes.UUID, allowNull: false },
  parent_id:      { type: DataTypes.UUID, allowNull: false },
  plan_id:        DataTypes.UUID,
  amount:         { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status:         { type: DataTypes.STRING(20), defaultValue: 'pending' },
  due_date:       { type: DataTypes.DATEONLY, allowNull: false },
  paid_at:        DataTypes.DATE,
  payment_method: DataTypes.STRING(50),
  transaction_id: DataTypes.STRING(200),
}, { tableName: 'Invoices', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ── Feedback ──────────────────────────────────────────────────
const Feedback = sequelize.define('Feedback', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  trip_id:     DataTypes.UUID,
  from_user:   { type: DataTypes.UUID, allowNull: false },
  from_type:   DataTypes.STRING(20),
  target_type: DataTypes.STRING(20),
  rating:      DataTypes.INTEGER,
  comment:     DataTypes.STRING(1000),
}, { tableName: 'Feedbacks', timestamps: true, createdAt: 'created_at', updatedAt: false });

// ============================================================
// ASSOCIATIONS
// ============================================================
Vehicle.belongsTo(UserDriver, { foreignKey: 'current_driver_id', as: 'driver' });

Route.belongsTo(Vehicle,    { foreignKey: 'vehicle_id' });
Route.belongsTo(UserDriver, { foreignKey: 'driver_id', as: 'driver' });
Route.hasMany(RouteStop,    { foreignKey: 'route_id', onDelete: 'CASCADE' });
Route.hasMany(RouteSubscription, { foreignKey: 'route_id' });
RouteStop.belongsTo(Route,  { foreignKey: 'route_id' });

// Student → dùng bảng Students (MỚI)
Student.belongsTo(ClassRoom, { foreignKey: 'class_id',     as: 'classInfo' });
Student.belongsTo(Route,     { foreignKey: 'bus_route_id', as: 'busRoute'  });
Student.belongsTo(RouteStop, { foreignKey: 'bus_stop_id',  as: 'busStop'   });
ClassRoom.hasMany(Student,   { foreignKey: 'class_id' });

RouteSubscription.belongsTo(Student,   { foreignKey: 'student_id',     as: 'student'     });
RouteSubscription.belongsTo(Route,     { foreignKey: 'route_id' });
RouteSubscription.belongsTo(RouteStop, { foreignKey: 'pickup_stop_id', as: 'pickupStop'  });
RouteSubscription.belongsTo(RouteStop, { foreignKey: 'dropoff_stop_id',as: 'dropoffStop' });

Trip.belongsTo(Route,        { foreignKey: 'route_id' });
Trip.belongsTo(Vehicle,      { foreignKey: 'vehicle_id' });
Trip.belongsTo(UserDriver,   { foreignKey: 'driver_id', as: 'driver' });
Trip.hasMany(TripAttendance, { foreignKey: 'trip_id' });
Trip.hasMany(LocationLog,    { foreignKey: 'trip_id' });

TripAttendance.belongsTo(Trip,      { foreignKey: 'trip_id' });
TripAttendance.belongsTo(Student,   { foreignKey: 'student_id', as: 'student' });
TripAttendance.belongsTo(RouteStop, { foreignKey: 'stop_id',    as: 'stop'    });

Invoice.belongsTo(Student,     { foreignKey: 'student_id', as: 'student' });
Invoice.belongsTo(PaymentPlan, { foreignKey: 'plan_id' });

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  sequelize,
  // Users (nhân viên)
  UserAdmin, UserManager, UserDriver,
  // Học sinh & Lớp (bảng MỚI)
  ClassRoom, Student,
  // Auth
  RefreshToken, OtpCode,
  // Bus
  Vehicle, Route, RouteStop, RouteSubscription, ParentStudent,
  // Operations
  Trip, TripAttendance, LocationLog,
  // Features
  Notification, Incident, AbsentRequest, PaymentPlan, Invoice, Feedback,
};