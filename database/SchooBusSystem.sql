-- ============================================================
--  SchoolBusSystem - Script tao lai toan bo database
--  Chay file nay tren SQL Server Management Studio (SSMS)
--  Ngay tao: 2026-05-21
-- ============================================================

USE [master]
GO

-- Xoa database cu neu ton tai
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SchoolBusSystem')
BEGIN
    ALTER DATABASE [SchoolBusSystem] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
    DROP DATABASE [SchoolBusSystem]
END
GO

-- Tao database moi
CREATE DATABASE [SchoolBusSystem]
GO

USE [SchoolBusSystem]
GO

-- ============================================================
--  BUOC 1: TAO CAC BANG (khong co khoa ngoai truoc)
-- ============================================================

-- Bang: roles
CREATE TABLE [dbo].[roles] (
    [role_id]   INT           IDENTITY(1,1) NOT NULL,
    [role_name] NVARCHAR(50)  NOT NULL,
    CONSTRAINT PK_roles PRIMARY KEY CLUSTERED ([role_id] ASC),
    CONSTRAINT UQ_roles_name UNIQUE ([role_name])
)
GO

-- Bang: users
CREATE TABLE [dbo].[users] (
    [user_id]    INT           IDENTITY(1,1) NOT NULL,
    [full_name]  NVARCHAR(100) NOT NULL,
    [email]      NVARCHAR(100) NOT NULL,
    [password]   NVARCHAR(255) NOT NULL,
    [phone]      NVARCHAR(20)  NULL,
    [avatar]     NVARCHAR(255) NULL,
    [role_id]    INT           NOT NULL,
    [status]     BIT           NULL CONSTRAINT DF_users_status     DEFAULT ((1)),
    [created_at] DATETIME      NULL CONSTRAINT DF_users_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_users PRIMARY KEY CLUSTERED ([user_id] ASC),
    CONSTRAINT UQ_users_email UNIQUE ([email])
)
GO

-- Bang: parent_areas
CREATE TABLE [dbo].[parent_areas] (
    [area_id]     INT           IDENTITY(1,1) NOT NULL,
    [area_name]   NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(255) NULL,
    CONSTRAINT PK_parent_areas PRIMARY KEY CLUSTERED ([area_id] ASC)
)
GO

-- Bang: vehicles
CREATE TABLE [dbo].[vehicles] (
    [vehicle_id]    INT           IDENTITY(1,1) NOT NULL,
    [license_plate] NVARCHAR(20)  NOT NULL,
    [vehicle_name]  NVARCHAR(100) NULL,
    [seat_capacity] INT           NULL,
    [color]         NVARCHAR(50)  NULL,
    [status]        BIT           NULL CONSTRAINT DF_vehicles_status     DEFAULT ((1)),
    [created_at]    DATETIME      NULL CONSTRAINT DF_vehicles_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_vehicles PRIMARY KEY CLUSTERED ([vehicle_id] ASC),
    CONSTRAINT UQ_vehicles_plate UNIQUE ([license_plate])
)
GO

-- Bang: drivers
CREATE TABLE [dbo].[drivers] (
    [driver_id]        INT           IDENTITY(1,1) NOT NULL,
    [user_id]          INT           NOT NULL,
    [license_number]   NVARCHAR(50)  NULL,
    [experience_years] INT           NULL,
    [full_name]        NVARCHAR(100) NULL,
    [birth_year]       INT           NULL,
    [area_id]          INT           NULL,
    [vehicle_id]       INT           NULL,
    [created_at]       DATETIME      NULL CONSTRAINT DF_drivers_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_drivers  PRIMARY KEY CLUSTERED ([driver_id] ASC),
    CONSTRAINT UQ_drivers_user UNIQUE ([user_id])
)
GO

-- Bang: parents
CREATE TABLE [dbo].[parents] (
    [parent_id]       INT           IDENTITY(1,1) NOT NULL,
    [user_id]         INT           NOT NULL,
    [address]         NVARCHAR(255) NULL,
    [emergency_phone] NVARCHAR(20)  NULL,
    [area_id]         INT           NULL,
    [created_at]      DATETIME      NULL CONSTRAINT DF_parents_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_parents PRIMARY KEY CLUSTERED ([parent_id] ASC),
    CONSTRAINT UQ_parents_user UNIQUE ([user_id])
)
GO

-- Bang: classes
CREATE TABLE [dbo].[classes] (
    [class_id]      INT           IDENTITY(1,1) NOT NULL,
    [class_name]    NVARCHAR(50)  NOT NULL,
    [grade_level]   INT           NULL,
    [academic_year] NVARCHAR(20)  NULL,
    [teacher_name]  NVARCHAR(100) NULL,
    [status]        BIT           NULL CONSTRAINT DF_classes_status DEFAULT ((1)),
    CONSTRAINT PK_classes PRIMARY KEY CLUSTERED ([class_id] ASC)
)
GO

-- Bang: students
CREATE TABLE [dbo].[students] (
    [student_id]    INT           IDENTITY(1,1) NOT NULL,
    [parent_id]     INT           NULL,
    [full_name]     NVARCHAR(100) NOT NULL,
    [gender]        NVARCHAR(10)  NULL,
    [date_of_birth] DATE          NULL,
    [school_name]   NVARCHAR(150) NULL,
    [class_name]    NVARCHAR(50)  NULL,
    [address]       NVARCHAR(255) NULL,
    [avatar]        NVARCHAR(255) NULL,
    [class_id]      INT           NULL,
    [status]        BIT           NULL CONSTRAINT DF_students_status     DEFAULT ((1)),
    [created_at]    DATETIME      NULL CONSTRAINT DF_students_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_students PRIMARY KEY CLUSTERED ([student_id] ASC)
)
GO

-- Bang: routes
CREATE TABLE [dbo].[routes] (
    [route_id]       INT           IDENTITY(1,1) NOT NULL,
    [route_name]     NVARCHAR(100) NOT NULL,
    [start_location] NVARCHAR(255) NULL,
    [end_location]   NVARCHAR(255) NULL,
    [pickup_time]    TIME(7)       NULL,
    [dropoff_time]   TIME(7)       NULL,
    [driver_id]      INT           NULL,
    [area_id]        INT           NULL,
    [status]         BIT           NULL CONSTRAINT DF_routes_status DEFAULT ((1)),
    CONSTRAINT PK_routes PRIMARY KEY CLUSTERED ([route_id] ASC)
)
GO

-- Bang: route_stops
CREATE TABLE [dbo].[route_stops] (
    [stop_id]        INT           IDENTITY(1,1) NOT NULL,
    [route_id]       INT           NOT NULL,
    [stop_name]      NVARCHAR(255) NULL,
    [stop_order]     INT           NULL,
    [estimated_time] TIME(7)       NULL,
    CONSTRAINT PK_route_stops PRIMARY KEY CLUSTERED ([stop_id] ASC)
)
GO

-- Bang: trips
CREATE TABLE [dbo].[trips] (
    [trip_id]    INT          IDENTITY(1,1) NOT NULL,
    [route_id]   INT          NOT NULL,
    [vehicle_id] INT          NOT NULL,
    [driver_id]  INT          NOT NULL,
    [trip_date]  DATE         NOT NULL,
    [trip_type]  NVARCHAR(20) NULL,
    [start_time] DATETIME     NULL,
    [end_time]   DATETIME     NULL,
    [status]     NVARCHAR(50) NULL,
    CONSTRAINT PK_trips PRIMARY KEY CLUSTERED ([trip_id] ASC)
)
GO

-- Bang: attendance
CREATE TABLE [dbo].[attendance] (
    [attendance_id]     INT           IDENTITY(1,1) NOT NULL,
    [trip_id]           INT           NOT NULL,
    [student_id]        INT           NOT NULL,
    [checkin_time]      DATETIME      NULL,
    [checkout_time]     DATETIME      NULL,
    [attendance_status] NVARCHAR(50)  NULL,
    [note]              NVARCHAR(255) NULL,
    CONSTRAINT PK_attendance PRIMARY KEY CLUSTERED ([attendance_id] ASC)
)
GO

-- Bang: leave_requests
CREATE TABLE [dbo].[leave_requests] (
    [leave_request_id] INT           IDENTITY(1,1) NOT NULL,
    [student_id]       INT           NOT NULL,
    [parent_id]        INT           NOT NULL,
    [leave_date]       DATE          NOT NULL,
    [reason]           NVARCHAR(500) NULL,
    [status]           NVARCHAR(50)  NULL CONSTRAINT DF_leave_requests_status     DEFAULT ('PENDING'),
    [created_at]       DATETIME      NULL CONSTRAINT DF_leave_requests_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_leave_requests PRIMARY KEY CLUSTERED ([leave_request_id] ASC)
)
GO

-- Bang: notifications
CREATE TABLE [dbo].[notifications] (
    [notification_id]   INT           IDENTITY(1,1) NOT NULL,
    [user_id]           INT           NOT NULL,
    [title]             NVARCHAR(255) NULL,
    [message]           NVARCHAR(MAX) NULL,
    [is_read]           BIT           NULL CONSTRAINT DF_notifications_is_read           DEFAULT ((0)),
    [notification_type] NVARCHAR(50)  NULL CONSTRAINT DF_notifications_type             DEFAULT ('SYSTEM'),
    [created_at]        DATETIME      NULL CONSTRAINT DF_notifications_created_at       DEFAULT (GETDATE()),
    CONSTRAINT PK_notifications PRIMARY KEY CLUSTERED ([notification_id] ASC)
)
GO

-- Bang: feedbacks
CREATE TABLE [dbo].[feedbacks] (
    [feedback_id] INT           IDENTITY(1,1) NOT NULL,
    [user_id]     INT           NOT NULL,
    [subject]     NVARCHAR(255) NULL,
    [content]     NVARCHAR(MAX) NULL,
    [created_at]  DATETIME      NULL CONSTRAINT DF_feedbacks_created_at DEFAULT (GETDATE()),
    CONSTRAINT PK_feedbacks PRIMARY KEY CLUSTERED ([feedback_id] ASC)
)
GO

-- ============================================================
--  BUOC 2: THEM KHOA NGOAI (FOREIGN KEYS)
-- ============================================================

-- users -> roles
ALTER TABLE [dbo].[users]
    ADD CONSTRAINT FK_users_roles FOREIGN KEY ([role_id]) REFERENCES [dbo].[roles] ([role_id])
GO

-- drivers -> users, parent_areas, vehicles
ALTER TABLE [dbo].[drivers]
    ADD CONSTRAINT FK_drivers_users    FOREIGN KEY ([user_id])    REFERENCES [dbo].[users]        ([user_id]),
        CONSTRAINT FK_Drivers_Areas    FOREIGN KEY ([area_id])    REFERENCES [dbo].[parent_areas] ([area_id]),
        CONSTRAINT FK_Drivers_Vehicles FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles]     ([vehicle_id])
GO

-- parents -> users, parent_areas
ALTER TABLE [dbo].[parents]
    ADD CONSTRAINT FK_parents_users  FOREIGN KEY ([user_id])  REFERENCES [dbo].[users]        ([user_id]),
        CONSTRAINT FK_Parents_Areas  FOREIGN KEY ([area_id])  REFERENCES [dbo].[parent_areas] ([area_id])
GO

-- students -> parents, classes
ALTER TABLE [dbo].[students]
    ADD CONSTRAINT FK_students_parents FOREIGN KEY ([parent_id]) REFERENCES [dbo].[parents] ([parent_id]),
        CONSTRAINT FK_Student_Class    FOREIGN KEY ([class_id])  REFERENCES [dbo].[classes] ([class_id])
GO

-- routes -> drivers, parent_areas
ALTER TABLE [dbo].[routes]
    ADD CONSTRAINT FK_Routes_Drivers FOREIGN KEY ([driver_id]) REFERENCES [dbo].[drivers]     ([driver_id]),
        CONSTRAINT FK_Routes_Areas   FOREIGN KEY ([area_id])   REFERENCES [dbo].[parent_areas] ([area_id])
GO

-- route_stops -> routes
ALTER TABLE [dbo].[route_stops]
    ADD CONSTRAINT FK_route_stops_routes FOREIGN KEY ([route_id]) REFERENCES [dbo].[routes] ([route_id])
GO

-- trips -> routes, vehicles, drivers
ALTER TABLE [dbo].[trips]
    ADD CONSTRAINT FK_trips_routes   FOREIGN KEY ([route_id])   REFERENCES [dbo].[routes]   ([route_id]),
        CONSTRAINT FK_trips_vehicles FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicles] ([vehicle_id]),
        CONSTRAINT FK_trips_drivers  FOREIGN KEY ([driver_id])  REFERENCES [dbo].[drivers]  ([driver_id])
GO

-- attendance -> trips, students
ALTER TABLE [dbo].[attendance]
    ADD CONSTRAINT FK_attendance_trips    FOREIGN KEY ([trip_id])    REFERENCES [dbo].[trips]    ([trip_id]),
        CONSTRAINT FK_attendance_students FOREIGN KEY ([student_id]) REFERENCES [dbo].[students] ([student_id])
GO

-- leave_requests -> students, parents
ALTER TABLE [dbo].[leave_requests]
    ADD CONSTRAINT FK_leave_requests_students FOREIGN KEY ([student_id]) REFERENCES [dbo].[students] ([student_id]),
        CONSTRAINT FK_leave_requests_parents  FOREIGN KEY ([parent_id])  REFERENCES [dbo].[parents]  ([parent_id])
GO

-- notifications -> users
ALTER TABLE [dbo].[notifications]
    ADD CONSTRAINT FK_notifications_users FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([user_id])
GO

-- feedbacks -> users
ALTER TABLE [dbo].[feedbacks]
    ADD CONSTRAINT FK_feedbacks_users FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([user_id])
GO

-- ============================================================
--  BUOC 3: DU LIEU MAU (co the xoa neu khong can)
-- ============================================================

-- Roles
INSERT INTO [dbo].[roles] ([role_name]) VALUES
    (N'Admin'),
    (N'Driver'),
    (N'Parent')
GO

PRINT N'=== Tao database SchoolBusSystem thanh cong! ==='
PRINT N'Cac bang da tao: roles, users, parent_areas, vehicles, drivers, parents,'
PRINT N'                 classes, students, routes, route_stops, trips,'
PRINT N'                 attendance, leave_requests, notifications, feedbacks'
GO

USE SchoolBusSystem;
GO

-- Xóa tài khoản cũ nếu đã tồn tại
DELETE FROM users WHERE email IN (
    'admin@schoolbus.com',
    'driver1@schoolbus.com',
    'driver2@schoolbus.com'
);

-- Tạo lại tài khoản Admin
INSERT INTO users (
    full_name,
    email,
    password,
    phone,
    avatar,
    role_id,
    status,
    created_at
)
VALUES (
    N'Quản trị viên',
    'admin@schoolbus.com',
    '123',
    '0912345678',
    'admin.png',
    1, -- Admin
    1,
    GETDATE()
);

-- Tạo tài khoản Driver 1
INSERT INTO users (
    full_name,
    email,
    password,
    phone,
    avatar,
    role_id,
    status,
    created_at
)
VALUES (
    N'Tài xế 1',
    'driver1@schoolbus.com',
    '123',
    '0988888888',
    NULL,
    2, -- Driver
    1,
    GETDATE()
);

-- Tạo tài khoản Driver 2
INSERT INTO users (
    full_name,
    email,
    password,
    phone,
    avatar,
    role_id,
    status,
    created_at
)
VALUES (
    N'Tài xế 2',
    'driver2@schoolbus.com',
    '123',
    '0977777777',
    NULL,
    2, -- Driver
    1,
    GETDATE()
);


-- Thêm dữ liệu vào bảng parent_areas
INSERT INTO parent_areas (area_name, description) 
VALUES
(N'Quận Hải Châu', N'Khu vực trung tâm thành phố'),
(N'Quận Sơn Trà', N'Khu vực phía đông, ven biển'),
(N'Quận Cẩm Lệ', N'Khu dân cư mới');

-- Kiểm tra lại dữ liệu
SELECT * FROM users;

SELECT * FROM parent_areas;