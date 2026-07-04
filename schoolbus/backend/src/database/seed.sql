-- ============================================================
-- SEED DATA - School Bus Management System
-- Chạy sau schema.sql
-- ============================================================
USE schoolbus_db;
GO

-- Password cho tất cả tài khoản test: Admin@123
-- Hash bcrypt rounds=12 của "Admin@123"
DECLARE @pwHash NVARCHAR(255) = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfkAuXRJHmDKp3S';

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO Users (id, full_name, email, phone, password_hash, role, is_active, is_verified) VALUES
  ('11111111-1111-1111-1111-111111111111', N'Nguyễn Admin', 'admin@schoolbus.vn', '0901000001', @pwHash, 'admin', 1, 1),
  ('22222222-2222-2222-2222-222222222222', N'Trần Quản Lý', 'manager@schoolbus.vn', '0901000002', @pwHash, 'manager', 1, 1),
  ('33333333-3333-3333-3333-333333333333', N'Lê Văn Tài', 'driver1@schoolbus.vn', '0901000003', @pwHash, 'driver', 1, 1),
  ('44444444-4444-4444-4444-444444444444', N'Phạm Văn Hùng', 'driver2@schoolbus.vn', '0901000004', @pwHash, 'driver', 1, 1),
  ('55555555-5555-5555-5555-555555555555', N'Nguyễn Phụ Huynh', 'parent1@schoolbus.vn', '0901000005', @pwHash, 'parent', 1, 1),
  ('66666666-6666-6666-6666-666666666666', N'Trần Thị Mẹ', 'parent2@schoolbus.vn', '0901000006', @pwHash, 'parent', 1, 1),
  ('77777777-7777-7777-7777-777777777777', N'Nguyễn Văn An', 'student1@schoolbus.vn', '0901000007', @pwHash, 'student', 1, 1),
  ('88888888-8888-8888-8888-888888888888', N'Trần Thị Bình', 'student2@schoolbus.vn', '0901000008', @pwHash, 'student', 1, 1),
  ('99999999-9999-9999-9999-999999999999', N'Lê Văn Cường', 'student3@schoolbus.vn', '0901000009', @pwHash, 'student', 1, 1);

-- ============================================================
-- VEHICLES
-- ============================================================
INSERT INTO Vehicles (id, plate_number, vehicle_name, brand, capacity, current_driver_id, status) VALUES
  ('AAAA0001-0000-0000-0000-000000000001', '51B-12345', N'Xe Buýt 01', 'Toyota', 45, '33333333-3333-3333-3333-333333333333', 'active'),
  ('AAAA0002-0000-0000-0000-000000000002', '51B-67890', N'Xe Buýt 02', 'Ford', 30, '44444444-4444-4444-4444-444444444444', 'active'),
  ('AAAA0003-0000-0000-0000-000000000003', '51B-11111', N'Xe Buýt 03', 'Hyundai', 35, NULL, 'maintenance');

-- ============================================================
-- ROUTES
-- ============================================================
INSERT INTO Routes (id, route_name, route_code, vehicle_id, driver_id, total_distance, estimated_duration, is_active) VALUES
  ('BBBB0001-0000-0000-0000-000000000001', N'Tuyến Quận 1 - Trường', 'R001', 'AAAA0001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 15.5, 45, 1),
  ('BBBB0002-0000-0000-0000-000000000002', N'Tuyến Quận 7 - Trường', 'R002', 'AAAA0002-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 12.0, 35, 1);

-- ============================================================
-- ROUTE STOPS
-- ============================================================
INSERT INTO RouteStops (id, route_id, stop_name, address, latitude, longitude, stop_order, estimated_time) VALUES
  (NEWID(), 'BBBB0001-0000-0000-0000-000000000001', N'Điểm đầu - Bến Thành', N'Quảng trường Bến Thành, Q.1', 10.7721, 106.6980, 1, '06:30:00'),
  (NEWID(), 'BBBB0001-0000-0000-0000-000000000001', N'Ngã tư Nguyễn Huệ', N'Nguyễn Huệ - Lê Lợi, Q.1', 10.7731, 106.7020, 2, '06:40:00'),
  (NEWID(), 'BBBB0001-0000-0000-0000-000000000001', N'Trường học', N'123 Đường ABC, Q.1', 10.7800, 106.7100, 3, '07:00:00'),
  (NEWID(), 'BBBB0002-0000-0000-0000-000000000002', N'Điểm đầu - Phú Mỹ Hưng', N'Khu đô thị Phú Mỹ Hưng, Q.7', 10.7280, 106.7210, 1, '06:30:00'),
  (NEWID(), 'BBBB0002-0000-0000-0000-000000000002', N'Trường học', N'123 Đường ABC, Q.1', 10.7800, 106.7100, 2, '07:10:00');

-- ============================================================
-- PARENT - STUDENT LINKS
-- ============================================================
INSERT INTO ParentStudent (parent_id, student_id, relationship, is_primary, approved_at) VALUES
  ('55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', N'bố', 1, GETDATE()),
  ('55555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', N'bố', 1, GETDATE()),
  ('66666666-6666-6666-6666-666666666666', '99999999-9999-9999-9999-999999999999', N'mẹ', 1, GETDATE());

-- ============================================================
-- ROUTE SUBSCRIPTIONS
-- ============================================================
INSERT INTO RouteSubscriptions (id, student_id, route_id, start_date, status) VALUES
  (NEWID(), '77777777-7777-7777-7777-777777777777', 'BBBB0001-0000-0000-0000-000000000001', GETDATE(), 'active'),
  (NEWID(), '88888888-8888-8888-8888-888888888888', 'BBBB0001-0000-0000-0000-000000000001', GETDATE(), 'active'),
  (NEWID(), '99999999-9999-9999-9999-999999999999', 'BBBB0002-0000-0000-0000-000000000002', GETDATE(), 'active');

-- ============================================================
-- SAMPLE TRIPS (hôm nay)
-- ============================================================
INSERT INTO Trips (id, route_id, vehicle_id, driver_id, trip_type, scheduled_date, scheduled_start, status, total_students) VALUES
  ('CCCC0001-0000-0000-0000-000000000001', 'BBBB0001-0000-0000-0000-000000000001', 'AAAA0001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'morning_pickup', CAST(GETDATE() AS DATE), '06:30:00', 'pending', 2),
  ('CCCC0002-0000-0000-0000-000000000002', 'BBBB0002-0000-0000-0000-000000000002', 'AAAA0002-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'morning_pickup', CAST(GETDATE() AS DATE), '06:30:00', 'pending', 1);

-- TRIP ATTENDANCE
INSERT INTO TripAttendance (id, trip_id, student_id, status) VALUES
  (NEWID(), 'CCCC0001-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777', 'waiting'),
  (NEWID(), 'CCCC0001-0000-0000-0000-000000000001', '88888888-8888-8888-8888-888888888888', 'waiting'),
  (NEWID(), 'CCCC0002-0000-0000-0000-000000000002', '99999999-9999-9999-9999-999999999999', 'waiting');

-- PAYMENT PLAN
INSERT INTO PaymentPlans (id, plan_name, route_id, amount, billing_cycle, due_day) VALUES
  (NEWID(), N'Gói tháng - Tuyến Q1', 'BBBB0001-0000-0000-0000-000000000001', 800000, 'monthly', 5),
  (NEWID(), N'Gói tháng - Tuyến Q7', 'BBBB0002-0000-0000-0000-000000000002', 750000, 'monthly', 5);

PRINT 'Seed data inserted successfully!';
GO
