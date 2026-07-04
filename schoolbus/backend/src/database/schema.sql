-- ============================================================
-- SCHOOL BUS MANAGEMENT SYSTEM - DATABASE SCHEMA
-- SQL Server 2019/2022 | schoolbus_db
-- ============================================================

CREATE DATABASE schoolbus_db COLLATE Vietnamese_CI_AS;
GO
USE schoolbus_db;
GO

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE Users (
  id            UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  full_name     NVARCHAR(100) NOT NULL,
  email         NVARCHAR(150) NOT NULL,
  phone         NVARCHAR(20),
  password_hash NVARCHAR(255),
  role          NVARCHAR(20) NOT NULL CHECK (role IN ('admin','manager','driver','parent','student')),
  avatar_url    NVARCHAR(500),
  is_active     BIT DEFAULT 1,
  is_verified   BIT DEFAULT 0,
  last_login    DATETIME2,
  created_at    DATETIME2 DEFAULT GETDATE(),
  updated_at    DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT UQ_Users_email UNIQUE (email)
);

-- ============================================================
-- 2. REFRESH TOKENS
-- ============================================================
CREATE TABLE RefreshTokens (
  id         UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  user_id    UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
  token      NVARCHAR(500) NOT NULL,
  expires_at DATETIME2 NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT UQ_RefreshToken UNIQUE (token)
);

-- ============================================================
-- 3. OTP CODES
-- ============================================================
CREATE TABLE OtpCodes (
  id         UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  user_id    UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
  code       NVARCHAR(10) NOT NULL,
  type       NVARCHAR(30) NOT NULL CHECK (type IN ('email_verify','password_reset')),
  expires_at DATETIME2 NOT NULL,
  is_used    BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 4. VEHICLES
-- ============================================================
CREATE TABLE Vehicles (
  id                   UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  plate_number         NVARCHAR(20) NOT NULL,
  vehicle_name         NVARCHAR(100),
  brand                NVARCHAR(50),
  capacity             INT NOT NULL,
  current_driver_id    UNIQUEIDENTIFIER REFERENCES Users(id),
  status               NVARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','maintenance','inactive')),
  gps_device_id        NVARCHAR(100),
  insurance_expiry     DATE,
  registration_expiry  DATE,
  last_maintenance     DATE,
  next_maintenance     DATE,
  image_url            NVARCHAR(500),
  created_at           DATETIME2 DEFAULT GETDATE(),
  updated_at           DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT UQ_Vehicles_plate UNIQUE (plate_number)
);

-- ============================================================
-- 5. ROUTES
-- ============================================================
CREATE TABLE Routes (
  id                 UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  route_name         NVARCHAR(100) NOT NULL,
  route_code         NVARCHAR(20),
  vehicle_id         UNIQUEIDENTIFIER REFERENCES Vehicles(id),
  driver_id          UNIQUEIDENTIFIER REFERENCES Users(id),
  total_distance     FLOAT,
  estimated_duration INT,
  is_active          BIT DEFAULT 1,
  created_at         DATETIME2 DEFAULT GETDATE(),
  updated_at         DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT UQ_Routes_code UNIQUE (route_code)
);

-- ============================================================
-- 6. ROUTE STOPS
-- ============================================================
CREATE TABLE RouteStops (
  id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  route_id        UNIQUEIDENTIFIER NOT NULL REFERENCES Routes(id) ON DELETE CASCADE,
  stop_name       NVARCHAR(150) NOT NULL,
  address         NVARCHAR(300),
  latitude        DECIMAL(10,8),
  longitude       DECIMAL(11,8),
  stop_order      INT NOT NULL,
  estimated_time  TIME,
  radius_meters   INT DEFAULT 100,
  created_at      DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 7. ROUTE SUBSCRIPTIONS
-- ============================================================
CREATE TABLE RouteSubscriptions (
  id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  student_id      UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  route_id        UNIQUEIDENTIFIER NOT NULL REFERENCES Routes(id),
  pickup_stop_id  UNIQUEIDENTIFIER REFERENCES RouteStops(id),
  dropoff_stop_id UNIQUEIDENTIFIER REFERENCES RouteStops(id),
  start_date      DATE,
  end_date        DATE,
  status          NVARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','suspended','cancelled')),
  created_at      DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 8. PARENT - STUDENT LINK
-- ============================================================
CREATE TABLE ParentStudent (
  parent_id    UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  student_id   UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  relationship NVARCHAR(50),
  is_primary   BIT DEFAULT 0,
  approved_at  DATETIME2,
  approved_by  UNIQUEIDENTIFIER REFERENCES Users(id),
  PRIMARY KEY (parent_id, student_id)
);

-- ============================================================
-- 9. AUTHORIZED PERSONS
-- ============================================================
CREATE TABLE AuthorizedPersons (
  id           UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  student_id   UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  full_name    NVARCHAR(100) NOT NULL,
  phone        NVARCHAR(20) NOT NULL,
  relationship NVARCHAR(50),
  avatar_url   NVARCHAR(500),
  is_active    BIT DEFAULT 1,
  created_at   DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 10. TRIPS
-- ============================================================
CREATE TABLE Trips (
  id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  route_id            UNIQUEIDENTIFIER NOT NULL REFERENCES Routes(id),
  vehicle_id          UNIQUEIDENTIFIER NOT NULL REFERENCES Vehicles(id),
  driver_id           UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  trip_type           NVARCHAR(30) NOT NULL CHECK (trip_type IN ('morning_pickup','afternoon_dropoff','custom')),
  scheduled_date      DATE NOT NULL,
  scheduled_start     TIME,
  actual_start        DATETIME2,
  actual_end          DATETIME2,
  status              NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  cancellation_reason NVARCHAR(500),
  total_students      INT DEFAULT 0,
  boarded_count       INT DEFAULT 0,
  created_at          DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 11. TRIP ATTENDANCE
-- ============================================================
CREATE TABLE TripAttendance (
  id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  trip_id     UNIQUEIDENTIFIER NOT NULL REFERENCES Trips(id),
  student_id  UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  stop_id     UNIQUEIDENTIFIER REFERENCES RouteStops(id),
  status      NVARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting','boarded','absent','dropped_off')),
  boarded_at  DATETIME2,
  dropped_at  DATETIME2,
  noted_by    UNIQUEIDENTIFIER REFERENCES Users(id),
  note        NVARCHAR(500),
  created_at  DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 12. LOCATION LOGS (GPS)
-- ============================================================
CREATE TABLE LocationLogs (
  id         BIGINT IDENTITY(1,1) PRIMARY KEY,
  trip_id    UNIQUEIDENTIFIER NOT NULL REFERENCES Trips(id),
  vehicle_id UNIQUEIDENTIFIER NOT NULL REFERENCES Vehicles(id),
  latitude   DECIMAL(10,8) NOT NULL,
  longitude  DECIMAL(11,8) NOT NULL,
  speed      FLOAT,
  heading    FLOAT,
  accuracy   FLOAT,
  logged_at  DATETIME2 DEFAULT GETDATE()
);
CREATE INDEX IX_LocationLogs_trip ON LocationLogs(trip_id, logged_at DESC);

-- ============================================================
-- 13. INCIDENTS
-- ============================================================
CREATE TABLE Incidents (
  id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  trip_id     UNIQUEIDENTIFIER REFERENCES Trips(id),
  reported_by UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  type        NVARCHAR(50) NOT NULL CHECK (type IN ('vehicle_breakdown','accident','traffic','student_issue','other')),
  severity    NVARCHAR(20) NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  description NVARCHAR(MAX),
  latitude    DECIMAL(10,8),
  longitude   DECIMAL(11,8),
  image_urls  NVARCHAR(MAX),
  status      NVARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_review','resolved','closed')),
  resolved_by UNIQUEIDENTIFIER REFERENCES Users(id),
  resolved_at DATETIME2,
  created_at  DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 14. ABSENT REQUESTS
-- ============================================================
CREATE TABLE AbsentRequests (
  id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  student_id  UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  parent_id   UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  absent_date DATE NOT NULL,
  trip_type   NVARCHAR(20) DEFAULT 'both' CHECK (trip_type IN ('morning','afternoon','both')),
  reason      NVARCHAR(500),
  note        NVARCHAR(500),
  status      NVARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending','approved','rejected')),
  created_at  DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 15. NOTIFICATIONS
-- ============================================================
CREATE TABLE Notifications (
  id      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  user_id UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  type    NVARCHAR(100),
  title   NVARCHAR(200),
  body    NVARCHAR(MAX),
  data    NVARCHAR(MAX),
  is_read BIT DEFAULT 0,
  sent_at DATETIME2 DEFAULT GETDATE()
);
CREATE INDEX IX_Notifications_user ON Notifications(user_id, is_read, sent_at DESC);

-- ============================================================
-- 16. PAYMENT PLANS & INVOICES
-- ============================================================
CREATE TABLE PaymentPlans (
  id            UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  plan_name     NVARCHAR(100) NOT NULL,
  route_id      UNIQUEIDENTIFIER REFERENCES Routes(id),
  amount        DECIMAL(12,2) NOT NULL,
  billing_cycle NVARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','quarterly','yearly')),
  due_day       INT,
  is_active     BIT DEFAULT 1,
  created_at    DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE Invoices (
  id             UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  student_id     UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  parent_id      UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  plan_id        UNIQUEIDENTIFIER REFERENCES PaymentPlans(id),
  amount         DECIMAL(12,2) NOT NULL,
  status         NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
  due_date       DATE NOT NULL,
  paid_at        DATETIME2,
  payment_method NVARCHAR(50),
  transaction_id NVARCHAR(200),
  created_at     DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- 17. FEEDBACKS
-- ============================================================
CREATE TABLE Feedbacks (
  id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  trip_id     UNIQUEIDENTIFIER REFERENCES Trips(id),
  from_user   UNIQUEIDENTIFIER NOT NULL REFERENCES Users(id),
  target_type NVARCHAR(20) CHECK (target_type IN ('driver','route','system')),
  rating      TINYINT CHECK (rating BETWEEN 1 AND 5),
  comment     NVARCHAR(1000),
  created_at  DATETIME2 DEFAULT GETDATE()
);

-- ============================================================
-- STORED PROCEDURE: Tạo trips hàng ngày tự động
-- ============================================================
GO
CREATE PROCEDURE sp_CreateDailyTrips @scheduled_date DATE
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO Trips (id, route_id, vehicle_id, driver_id, trip_type, scheduled_date, scheduled_start, status, total_students)
  SELECT
    NEWID(), r.id, r.vehicle_id, r.driver_id,
    'morning_pickup', @scheduled_date, '06:30:00', 'pending',
    (SELECT COUNT(*) FROM RouteSubscriptions rs WHERE rs.route_id = r.id AND rs.status = 'active')
  FROM Routes r
  WHERE r.is_active = 1 AND r.vehicle_id IS NOT NULL AND r.driver_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM Trips t WHERE t.route_id = r.id
        AND t.scheduled_date = @scheduled_date AND t.trip_type = 'morning_pickup'
    );

  INSERT INTO Trips (id, route_id, vehicle_id, driver_id, trip_type, scheduled_date, scheduled_start, status, total_students)
  SELECT
    NEWID(), r.id, r.vehicle_id, r.driver_id,
    'afternoon_dropoff', @scheduled_date, '16:30:00', 'pending',
    (SELECT COUNT(*) FROM RouteSubscriptions rs WHERE rs.route_id = r.id AND rs.status = 'active')
  FROM Routes r
  WHERE r.is_active = 1 AND r.vehicle_id IS NOT NULL AND r.driver_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM Trips t WHERE t.route_id = r.id
        AND t.scheduled_date = @scheduled_date AND t.trip_type = 'afternoon_dropoff'
    );
END;
GO
