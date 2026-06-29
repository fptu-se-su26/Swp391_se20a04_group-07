-- ============================================================
-- SchoolBus System – SQL Server Schema
-- Chạy file này trong SQL Server Management Studio 21
-- ============================================================

USE master;
GO

-- Tạo database nếu chưa có
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SchoolBusDB')
BEGIN
    CREATE DATABASE SchoolBusDB;
END
GO

USE SchoolBusDB;
GO

-- ============================================================
-- 1. ZONES – Khu vực
-- ============================================================
CREATE TABLE Zones (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    created_at  DATETIME2 DEFAULT GETDATE()
);
GO

-- ============================================================
-- 2. BUSES – Xe đưa đón
-- ============================================================
CREATE TABLE Buses (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    plate       NVARCHAR(20)  NOT NULL UNIQUE,
    capacity    INT           NOT NULL DEFAULT 30,
    route       NVARCHAR(100) NOT NULL,
    status      NVARCHAR(20)  NOT NULL DEFAULT 'idle'
                              CHECK (status IN ('active','idle','maintenance')),
    -- GPS hiện tại
    gps_lat     FLOAT,
    gps_lng     FLOAT,
    gps_updated DATETIME2,
    created_at  DATETIME2 DEFAULT GETDATE()
);
GO

-- ============================================================
-- 3. DRIVERS – Tài xế
-- ============================================================
CREATE TABLE Drivers (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    name       NVARCHAR(100) NOT NULL,
    phone      NVARCHAR(20)  NOT NULL UNIQUE,
    license    NVARCHAR(20)  NOT NULL,
    shift      NVARCHAR(20)  NOT NULL DEFAULT 'morning'
               CHECK (shift IN ('morning','afternoon','both')),
    bus_id     INT REFERENCES Buses(id) ON DELETE SET NULL,
    pin        NVARCHAR(10)  NOT NULL DEFAULT '1234',   -- mã PIN đăng nhập app
    status     NVARCHAR(20)  NOT NULL DEFAULT 'available'
               CHECK (status IN ('active','available','off')),
    last_login DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- ============================================================
-- 4. PARENTS – Phụ huynh (tài khoản Google)
-- ============================================================
CREATE TABLE Parents (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    google_id      NVARCHAR(100) UNIQUE,          -- Google sub
    email          NVARCHAR(255) NOT NULL UNIQUE,
    name           NVARCHAR(100) NOT NULL,
    phone          NVARCHAR(20),
    avatar_url     NVARCHAR(500),
    is_active      BIT NOT NULL DEFAULT 1,
    created_at     DATETIME2 DEFAULT GETDATE(),
    last_login     DATETIME2
);
GO

-- ============================================================
-- 5. STUDENTS – Học sinh
-- ============================================================
CREATE TABLE Students (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    name           NVARCHAR(100) NOT NULL,
    parent_id      INT NOT NULL REFERENCES Parents(id),
    zone_id        INT REFERENCES Zones(id),
    bus_id         INT REFERENCES Buses(id),
    pickup_address NVARCHAR(255) NOT NULL,
    pickup_lat     FLOAT,
    pickup_lng     FLOAT,
    route          NVARCHAR(100),
    status         NVARCHAR(20) NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','inactive')),
    created_at     DATETIME2 DEFAULT GETDATE()
);
GO

-- ============================================================
-- 6. ATTENDANCE – Điểm danh
-- ============================================================
CREATE TABLE Attendance (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    student_id  INT NOT NULL REFERENCES Students(id),
    attend_date DATE NOT NULL,
    session     NVARCHAR(20) NOT NULL CHECK (session IN ('morning','afternoon')),
    status      NVARCHAR(20) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('present','absent','leave','pending')),
    updated_by  INT REFERENCES Drivers(id),   -- tài xế điểm danh
    updated_at  DATETIME2,
    note        NVARCHAR(255),
    UNIQUE (student_id, attend_date, session)
);
GO

-- ============================================================
-- 7. LEAVE_REQUESTS – Đơn xin nghỉ
-- ============================================================
CREATE TABLE LeaveRequests (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    student_id   INT NOT NULL REFERENCES Students(id),
    parent_id    INT NOT NULL REFERENCES Parents(id),
    leave_date   DATE NOT NULL,
    session      NVARCHAR(20) NOT NULL CHECK (session IN ('morning','afternoon','all_day')),
    reason       NVARCHAR(500) NOT NULL,
    status       NVARCHAR(20) NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','approved','rejected')),
    submitted_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    reviewed_by  NVARCHAR(100),   -- tên admin duyệt
    reviewed_at  DATETIME2,
    -- Deadline: phải gửi trước 17:00 ngày hôm trước
    is_on_time   AS (
        CASE
            WHEN CAST(submitted_at AS DATE) < leave_date
                 AND DATEPART(HOUR, submitted_at) < 17
            THEN 1
            ELSE 0
        END
    ) PERSISTED
);
GO

-- ============================================================
-- 8. NOTIFICATIONS – Thông báo
-- ============================================================
CREATE TABLE Notifications (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    target_type NVARCHAR(30) NOT NULL
                CHECK (target_type IN ('all_parents','all_drivers','zone','parent','driver','system')),
    target_id   INT,          -- parent_id hoặc driver_id nếu gửi riêng
    zone_id     INT REFERENCES Zones(id),
    title       NVARCHAR(255) NOT NULL,
    message     NVARCHAR(2000) NOT NULL,
    notif_type  NVARCHAR(30) NOT NULL DEFAULT 'general'
                CHECK (notif_type IN ('general','schedule_change','urgent','reminder','leave_approved','leave_rejected','bus_delay')),
    sent_by     NVARCHAR(100) NOT NULL DEFAULT 'Admin',
    created_at  DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 9. NOTIFICATION_READS – Trạng thái đọc (mỗi parent)
-- ============================================================
CREATE TABLE NotificationReads (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    notification_id INT NOT NULL REFERENCES Notifications(id) ON DELETE CASCADE,
    parent_id       INT NOT NULL REFERENCES Parents(id) ON DELETE CASCADE,
    read_at         DATETIME2 NOT NULL DEFAULT GETDATE(),
    UNIQUE (notification_id, parent_id)
);
GO

-- ============================================================
-- 10. BUS_LOCATIONS – Lịch sử GPS xe (theo dõi lộ trình)
-- ============================================================
CREATE TABLE BusLocations (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    bus_id     INT NOT NULL REFERENCES Buses(id),
    lat        FLOAT NOT NULL,
    lng        FLOAT NOT NULL,
    speed      FLOAT,           -- km/h
    recorded_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Index để query GPS nhanh
CREATE INDEX IX_BusLocations_bus_time ON BusLocations(bus_id, recorded_at DESC);
GO

-- ============================================================
-- 11. DRIVER_REPORTS – Báo cáo ngày của tài xế
-- ============================================================
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
GO

-- ============================================================
-- 12. SCHEDULE – Ca tài xế theo ngày
-- ============================================================
CREATE TABLE DriverSchedules (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    driver_id  INT NOT NULL REFERENCES Drivers(id),
    bus_id     INT NOT NULL REFERENCES Buses(id),
    work_date  DATE NOT NULL,
    shift      NVARCHAR(20) NOT NULL CHECK (shift IN ('morning','afternoon','both')),
    created_at DATETIME2 DEFAULT GETDATE(),
    UNIQUE (driver_id, work_date, shift)
);
GO

-- ============================================================
-- SEED DATA – Dữ liệu mẫu
-- ============================================================

-- Zones
INSERT INTO Zones (name, description) VALUES
(N'Khu A', N'Quận 1 – Trung tâm'),
(N'Khu B', N'Quận 3 – Võ Văn Tần'),
(N'Khu C', N'Quận Bình Thạnh');
GO

-- Buses
INSERT INTO Buses (plate, capacity, route, status, gps_lat, gps_lng) VALUES
('51B-12345', 30, N'Tuyến 1', 'active', 10.7769, 106.7009),
('51B-67890', 25, N'Tuyến 2', 'active', 10.7820, 106.6950),
('51B-11223', 35, N'Tuyến 3', 'idle',   10.7900, 106.7100);
GO

-- Drivers  (PIN mặc định: 1234 – admin cần đổi sau khi tạo)
INSERT INTO Drivers (name, phone, license, shift, bus_id, pin, status) VALUES
(N'Nguyễn Tài Khéo', '0901111222', 'B2', 'morning',   1,    '1234', 'active'),
(N'Trần Văn Lái',    '0902222333', 'B2', 'afternoon', 2,    '1234', 'active'),
(N'Lê Minh Đức',     '0903333444', 'B2', 'both',      NULL, '1234', 'available'),
(N'Phạm Quốc Khánh', '0904444555', 'B2', 'morning',   NULL, '1234', 'available');
GO

-- Parents (email phải khớp với Google Account của phụ huynh)
INSERT INTO Parents (email, name, phone, is_active) VALUES
('nguyen.an@gmail.com',    N'Nguyễn Văn An',   '0901234567', 1),
('tran.binh@gmail.com',    N'Trần Văn Bình',   '0912345678', 1),
('le.cam@gmail.com',       N'Lê Thị Cẩm',     '0923456789', 1),
('pham.dung@gmail.com',    N'Phạm Văn Dũng',   '0934567890', 1),
('hoang.lan@gmail.com',    N'Hoàng Thị Lan',   '0945678901', 1),
('vu.hung@gmail.com',      N'Vũ Văn Hùng',     '0956789012', 1);
GO

-- Students
INSERT INTO Students (name, parent_id, zone_id, bus_id, pickup_address, pickup_lat, pickup_lng, route) VALUES
(N'Nguyễn Minh Khôi', 1, 1, 1, N'12 Lê Lợi, Q.1',             10.7769, 106.7009, N'Tuyến 1'),
(N'Trần Thị Mai',      2, 1, 1, N'45 Nguyễn Huệ, Q.1',         10.7750, 106.7030, N'Tuyến 1'),
(N'Lê Hoàng Nam',      3, 2, 2, N'78 CMT8, Q.3',                10.7820, 106.6950, N'Tuyến 2'),
(N'Phạm Thu Hà',       4, 2, 2, N'23 Võ Văn Tần, Q.3',         10.7800, 106.6980, N'Tuyến 2'),
(N'Hoàng Anh Tuấn',   5, 3, 3, N'56 Điện Biên Phủ, Q.BT',     10.7900, 106.7100, N'Tuyến 3'),
(N'Vũ Thùy Linh',     6, 3, 3, N'89 Nơ Trang Long, Q.BT',     10.7920, 106.7080, N'Tuyến 3');
GO

-- Attendance hôm nay
INSERT INTO Attendance (student_id, attend_date, session, status) VALUES
(1, CAST(GETDATE() AS DATE), 'morning',   'present'),
(2, CAST(GETDATE() AS DATE), 'morning',   'present'),
(3, CAST(GETDATE() AS DATE), 'morning',   'absent'),
(4, CAST(GETDATE() AS DATE), 'morning',   'present'),
(5, CAST(GETDATE() AS DATE), 'morning',   'leave'),
(6, CAST(GETDATE() AS DATE), 'morning',   'present'),
(1, CAST(GETDATE() AS DATE), 'afternoon', 'present'),
(2, CAST(GETDATE() AS DATE), 'afternoon', 'absent'),
(3, CAST(GETDATE() AS DATE), 'afternoon', 'present'),
(4, CAST(GETDATE() AS DATE), 'afternoon', 'present'),
(5, CAST(GETDATE() AS DATE), 'afternoon', 'leave'),
(6, CAST(GETDATE() AS DATE), 'afternoon', 'present');
GO

-- Leave requests
INSERT INTO LeaveRequests (student_id, parent_id, leave_date, session, reason, status) VALUES
(5, 5, DATEADD(DAY,1,CAST(GETDATE() AS DATE)), 'all_day',   N'Bé bị ốm, sốt cao cần nghỉ nguyên ngày', 'pending'),
(2, 2, DATEADD(DAY,1,CAST(GETDATE() AS DATE)), 'afternoon', N'Gia đình có việc buổi chiều',              'pending'),
(6, 6, DATEADD(DAY,2,CAST(GETDATE() AS DATE)), 'morning',   N'Khám sức khỏe định kỳ',                   'pending'),
(3, 3, CAST(GETDATE() AS DATE),                'morning',   N'Dậy muộn, ba chở đi trường',               'approved');
GO

-- Notifications
INSERT INTO Notifications (target_type, title, message, notif_type) VALUES
('all_parents',  N'Thông báo nghỉ lễ',         N'Nhà trường thông báo học sinh nghỉ lễ 30/4 và 1/5. Xe đưa đón sẽ không hoạt động trong 2 ngày này.', 'general'),
('all_parents',  N'Thay đổi giờ đón buổi chiều', N'Kể từ tuần tới, xe buổi chiều sẽ xuất phát lúc 17:00 thay vì 17:15. Phụ huynh lưu ý đón con đúng giờ.', 'schedule_change'),
('all_drivers',  N'Họp tài xế tháng 6',         N'Mời toàn bộ tài xế tham dự họp vào thứ Hai 24/06 lúc 8:00 sáng tại văn phòng trường.', 'reminder');
GO

PRINT 'SchoolBusDB created and seeded successfully!';
GO
