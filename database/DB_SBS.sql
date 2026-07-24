-- ============================================================
--  SCHOOL BUS SYSTEM - Database khớp đúng Sequelize model (models/index.js)
--  Chạy trên SQL Server Management Studio (SSMS)
--  Database name PHẢI là: schoolbus_db (khớp DB_NAME trong file .env)
-- ============================================================

USE [master]
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'schoolbus_db')
BEGIN
    ALTER DATABASE [schoolbus_db] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
    DROP DATABASE [schoolbus_db]
END
GO

CREATE DATABASE [schoolbus_db]
GO

USE [schoolbus_db]
GO

-- ============================================================
-- 1. UserAdmins
-- ============================================================
CREATE TABLE [dbo].[UserAdmins] (
    [id]            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [full_name]     NVARCHAR(100) NOT NULL,
    [email]         NVARCHAR(150) NOT NULL,
    [phone]         NVARCHAR(20)  NULL,
    [password_hash] NVARCHAR(255) NOT NULL,
    [avatar_url]    NVARCHAR(500) NULL,
    [is_active]     BIT NOT NULL DEFAULT 1,
    [last_login]    DATETIME NULL,
    [created_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_UserAdmins PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_UserAdmins_email UNIQUE ([email])
)
GO

-- ============================================================
-- 2. UserManagers
-- ============================================================
CREATE TABLE [dbo].[UserManagers] (
    [id]            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [full_name]     NVARCHAR(100) NOT NULL,
    [email]         NVARCHAR(150) NOT NULL,
    [phone]         NVARCHAR(20)  NULL,
    [password_hash] NVARCHAR(255) NOT NULL,
    [avatar_url]    NVARCHAR(500) NULL,
    [is_active]     BIT NOT NULL DEFAULT 1,
    [last_login]    DATETIME NULL,
    [created_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_UserManagers PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_UserManagers_email UNIQUE ([email])
)
GO

-- ============================================================
-- 3. UserDrivers
-- ============================================================
CREATE TABLE [dbo].[UserDrivers] (
    [id]             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [full_name]      NVARCHAR(100) NOT NULL,
    [email]          NVARCHAR(150) NOT NULL,
    [phone]          NVARCHAR(20)  NULL,
    [password_hash]  NVARCHAR(255) NOT NULL,
    [avatar_url]     NVARCHAR(500) NULL,
    [license_number] NVARCHAR(50)  NULL,
    [license_expiry] DATE NULL,
    [is_active]      BIT NOT NULL DEFAULT 1,
    [last_login]     DATETIME NULL,
    [created_at]     DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at]     DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_UserDrivers PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_UserDrivers_email UNIQUE ([email])
)
GO

-- ============================================================
-- 4. Classes (ClassRoom model)
-- ============================================================
CREATE TABLE [dbo].[Classes] (
    [id]          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [class_name]  NVARCHAR(50) NOT NULL,
    [grade]       NVARCHAR(10) NULL,
    [school_year] NVARCHAR(20) NULL,
    [teacher]     NVARCHAR(100) NULL,
    [is_active]   BIT NOT NULL DEFAULT 1,
    [created_at]  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Classes PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
-- 5. Vehicles
-- ============================================================
CREATE TABLE [dbo].[Vehicles] (
    [id]                  UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [plate_number]        NVARCHAR(20) NOT NULL,
    [vehicle_name]        NVARCHAR(100) NULL,
    [brand]               NVARCHAR(50) NULL,
    [capacity]            INT NOT NULL,
    [current_driver_id]   UNIQUEIDENTIFIER NULL,
    [status]              NVARCHAR(20) NOT NULL DEFAULT 'active',
    [gps_device_id]       NVARCHAR(100) NULL,
    [insurance_expiry]    DATE NULL,
    [registration_expiry] DATE NULL,
    [last_maintenance]    DATE NULL,
    [next_maintenance]    DATE NULL,
    [image_url]           NVARCHAR(500) NULL,
    [created_at]          DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at]          DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Vehicles PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_Vehicles_plate UNIQUE ([plate_number]),
    CONSTRAINT FK_Vehicles_Driver FOREIGN KEY ([current_driver_id]) REFERENCES [dbo].[UserDrivers]([id])
)
GO

-- ============================================================
-- 6. Routes
-- ============================================================
CREATE TABLE [dbo].[Routes] (
    [id]                 UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [route_name]         NVARCHAR(100) NOT NULL,
    [route_code]         NVARCHAR(20) NULL,
    [vehicle_id]         UNIQUEIDENTIFIER NULL,
    [driver_id]          UNIQUEIDENTIFIER NULL,
    [total_distance]     FLOAT NULL,
    [estimated_duration] INT NULL,
    [is_active]          BIT NOT NULL DEFAULT 1,
    [created_at]         DATETIME NOT NULL DEFAULT GETDATE(),
    [updated_at]         DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Routes PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_Routes_code UNIQUE ([route_code]),
    CONSTRAINT FK_Routes_Vehicle FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[Vehicles]([id]),
    CONSTRAINT FK_Routes_Driver  FOREIGN KEY ([driver_id])  REFERENCES [dbo].[UserDrivers]([id])
)
GO

-- ============================================================
-- 7. RouteStops
-- ============================================================
CREATE TABLE [dbo].[RouteStops] (
    [id]             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [route_id]       UNIQUEIDENTIFIER NOT NULL,
    [stop_name]      NVARCHAR(150) NOT NULL,
    [address]        NVARCHAR(300) NULL,
    [latitude]       DECIMAL(10,8) NULL,
    [longitude]      DECIMAL(11,8) NULL,
    [stop_order]     INT NOT NULL,
    [estimated_time] TIME NULL,
    [radius_meters]  INT NOT NULL DEFAULT 100,
    [created_at]     DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_RouteStops PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT FK_RouteStops_Route FOREIGN KEY ([route_id]) REFERENCES [dbo].[Routes]([id]) ON DELETE CASCADE
)
GO

-- ============================================================
-- 8. Students (bảng MỚI - thay UserStudent)
-- ============================================================
CREATE TABLE [dbo].[Students] (
    [id]            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [student_id]    NVARCHAR(20)  NOT NULL,
    [full_name]     NVARCHAR(100) NOT NULL,
    [dob]           DATE NOT NULL,
    [gender]        NVARCHAR(10)  NOT NULL,
    [class_id]      UNIQUEIDENTIFIER NOT NULL,
    [student_email] NVARCHAR(150) NOT NULL,
    [student_phone] NVARCHAR(20)  NULL,
    [parent_name]   NVARCHAR(100) NOT NULL,
    [parent_gmail]  NVARCHAR(150) NOT NULL,
    [home_address]  NVARCHAR(300) NULL,
    [bus_route_id]  UNIQUEIDENTIFIER NULL,
    [bus_stop_id]   UNIQUEIDENTIFIER NULL,
    [status]        NVARCHAR(20)  NOT NULL DEFAULT 'active',
    [created_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Students PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_Students_student_id    UNIQUE ([student_id]),
    CONSTRAINT UQ_Students_student_email UNIQUE ([student_email]),
    CONSTRAINT UQ_Students_parent_gmail  UNIQUE ([parent_gmail]),
    CONSTRAINT FK_Students_Class FOREIGN KEY ([class_id])     REFERENCES [dbo].[Classes]([id]),
    CONSTRAINT FK_Students_Route FOREIGN KEY ([bus_route_id]) REFERENCES [dbo].[Routes]([id]),
    CONSTRAINT FK_Students_Stop  FOREIGN KEY ([bus_stop_id])  REFERENCES [dbo].[RouteStops]([id])
)
GO

-- ============================================================
-- 9. RefreshTokens
-- ============================================================
CREATE TABLE [dbo].[RefreshTokens] (
    [id]         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [user_id]    UNIQUEIDENTIFIER NOT NULL,
    [user_type]  NVARCHAR(20) NOT NULL,
    [token]      NVARCHAR(500) NOT NULL,
    [expires_at] DATETIME NOT NULL,
    [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_RefreshTokens PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT UQ_RefreshTokens_token UNIQUE ([token])
)
GO

-- ============================================================
-- 10. OtpCodes
-- ============================================================
CREATE TABLE [dbo].[OtpCodes] (
    [id]         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [user_id]    UNIQUEIDENTIFIER NOT NULL,
    [user_type]  NVARCHAR(20) NOT NULL,
    [code]       NVARCHAR(10) NOT NULL,
    [type]       NVARCHAR(30) NULL,
    [expires_at] DATETIME NOT NULL,
    [is_used]    BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_OtpCodes PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
-- 11. RouteSubscriptions
-- ============================================================
CREATE TABLE [dbo].[RouteSubscriptions] (
    [id]              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [student_id]      UNIQUEIDENTIFIER NOT NULL,
    [route_id]        UNIQUEIDENTIFIER NOT NULL,
    [pickup_stop_id]  UNIQUEIDENTIFIER NULL,
    [dropoff_stop_id] UNIQUEIDENTIFIER NULL,
    [start_date]      DATE NULL,
    [end_date]        DATE NULL,
    [status]          NVARCHAR(20) NOT NULL DEFAULT 'active',
    [created_at]      DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_RouteSubscriptions PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT FK_RouteSub_Student FOREIGN KEY ([student_id])      REFERENCES [dbo].[Students]([id]),
    CONSTRAINT FK_RouteSub_Route   FOREIGN KEY ([route_id])        REFERENCES [dbo].[Routes]([id]),
    CONSTRAINT FK_RouteSub_Pickup  FOREIGN KEY ([pickup_stop_id])  REFERENCES [dbo].[RouteStops]([id]),
    CONSTRAINT FK_RouteSub_Dropoff FOREIGN KEY ([dropoff_stop_id]) REFERENCES [dbo].[RouteStops]([id])
)
GO

-- ============================================================
-- 12. ParentStudent
-- ============================================================
CREATE TABLE [dbo].[ParentStudent] (
    [parent_id]    UNIQUEIDENTIFIER NOT NULL,
    [student_id]   UNIQUEIDENTIFIER NOT NULL,
    [relationship] NVARCHAR(50) NULL,
    [is_primary]   BIT NOT NULL DEFAULT 0,
    [approved_at]  DATETIME NULL,
    CONSTRAINT PK_ParentStudent PRIMARY KEY CLUSTERED ([parent_id], [student_id]),
    CONSTRAINT FK_ParentStudent_Student FOREIGN KEY ([student_id]) REFERENCES [dbo].[Students]([id])
)
GO

-- ============================================================
-- 13. Trips
-- ============================================================
CREATE TABLE [dbo].[Trips] (
    [id]                  UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [route_id]            UNIQUEIDENTIFIER NOT NULL,
    [vehicle_id]          UNIQUEIDENTIFIER NOT NULL,
    [driver_id]           UNIQUEIDENTIFIER NOT NULL,
    [trip_type]           NVARCHAR(30) NOT NULL,
    [scheduled_date]      DATE NOT NULL,
    [scheduled_start]     TIME NULL,
    [actual_start]        DATETIME NULL,
    [actual_end]          DATETIME NULL,
    [status]              NVARCHAR(20) NOT NULL DEFAULT 'pending',
    [cancellation_reason] NVARCHAR(500) NULL,
    [total_students]      INT NOT NULL DEFAULT 0,
    [boarded_count]       INT NOT NULL DEFAULT 0,
    [created_at]          DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Trips PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT FK_Trips_Route   FOREIGN KEY ([route_id])   REFERENCES [dbo].[Routes]([id]),
    CONSTRAINT FK_Trips_Vehicle FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[Vehicles]([id]),
    CONSTRAINT FK_Trips_Driver  FOREIGN KEY ([driver_id])  REFERENCES [dbo].[UserDrivers]([id])
)
GO

-- ============================================================
-- 14. TripAttendance
-- ============================================================
CREATE TABLE [dbo].[TripAttendance] (
    [id]         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [trip_id]    UNIQUEIDENTIFIER NOT NULL,
    [student_id] UNIQUEIDENTIFIER NOT NULL,
    [stop_id]    UNIQUEIDENTIFIER NULL,
    [status]     NVARCHAR(20) NOT NULL DEFAULT 'waiting',
    [boarded_at] DATETIME NULL,
    [dropped_at] DATETIME NULL,
    [noted_by]   UNIQUEIDENTIFIER NULL,
    [note]       NVARCHAR(500) NULL,
    [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_TripAttendance PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT FK_TripAtt_Trip    FOREIGN KEY ([trip_id])    REFERENCES [dbo].[Trips]([id]),
    CONSTRAINT FK_TripAtt_Student FOREIGN KEY ([student_id]) REFERENCES [dbo].[Students]([id]),
    CONSTRAINT FK_TripAtt_Stop    FOREIGN KEY ([stop_id])    REFERENCES [dbo].[RouteStops]([id])
)
GO

-- ============================================================
-- 15. LocationLogs
-- ============================================================
CREATE TABLE [dbo].[LocationLogs] (
    [id]         BIGINT IDENTITY(1,1) NOT NULL,
    [trip_id]    UNIQUEIDENTIFIER NOT NULL,
    [vehicle_id] UNIQUEIDENTIFIER NOT NULL,
    [latitude]   DECIMAL(10,8) NOT NULL,
    [longitude]  DECIMAL(11,8) NOT NULL,
    [speed]      FLOAT NULL,
    [heading]    FLOAT NULL,
    [accuracy]   FLOAT NULL,
    [logged_at]  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_LocationLogs PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
-- 16. Notifications
-- ============================================================
CREATE TABLE [dbo].[Notifications] (
    [id]          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [user_id]     UNIQUEIDENTIFIER NOT NULL,
    [user_type]   NVARCHAR(20) NOT NULL,
    [type]        NVARCHAR(100) NULL,
    [title]       NVARCHAR(200) NULL,
    [body]        NVARCHAR(MAX) NULL,
    [data]        NVARCHAR(MAX) NULL,
    [is_read]     BIT NOT NULL DEFAULT 0,
    [sent_at]     DATETIME NOT NULL DEFAULT GETDATE(),
    [priority]    NVARCHAR(20) NOT NULL DEFAULT 'normal',
    [pinned]      BIT NOT NULL DEFAULT 0,
    [sender_id]   UNIQUEIDENTIFIER NULL,
    [sender_name] NVARCHAR(100) NULL,
    [sender_role] NVARCHAR(20) NULL,
    [target_role] NVARCHAR(20) NULL,
    [batch_id]    UNIQUEIDENTIFIER NULL,
    [recalled_at] DATETIME NULL,
    CONSTRAINT PK_Notifications PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
-- 17. Incidents
-- ============================================================
CREATE TABLE [dbo].[Incidents] (
    [id]            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [trip_id]       UNIQUEIDENTIFIER NULL,
    [reported_by]   UNIQUEIDENTIFIER NOT NULL,
    [reporter_type] NVARCHAR(20) NOT NULL DEFAULT 'driver',
    [type]          NVARCHAR(50) NOT NULL,
    [severity]      NVARCHAR(20) NOT NULL,
    [description]   NVARCHAR(MAX) NULL,
    [latitude]      DECIMAL(10,8) NULL,
    [longitude]     DECIMAL(11,8) NULL,
    [image_urls]    NVARCHAR(MAX) NULL,
    [status]        NVARCHAR(20) NOT NULL DEFAULT 'open',
    [resolved_by]   UNIQUEIDENTIFIER NULL,
    [resolved_at]   DATETIME NULL,
    [created_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Incidents PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
-- 18. AbsentRequests
-- ============================================================
CREATE TABLE [dbo].[AbsentRequests] (
    [id]          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [student_id]  UNIQUEIDENTIFIER NOT NULL,
    [parent_id]   UNIQUEIDENTIFIER NOT NULL,
    [absent_date] DATE NOT NULL,
    [trip_type]   NVARCHAR(20) NOT NULL DEFAULT 'both',
    [reason]      NVARCHAR(500) NULL,
    [status]      NVARCHAR(20) NOT NULL DEFAULT 'approved',
    [created_at]  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_AbsentRequests PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT FK_AbsentReq_Student FOREIGN KEY ([student_id]) REFERENCES [dbo].[Students]([id])
)
GO

-- ============================================================
-- 19. PaymentPlans
-- ============================================================
CREATE TABLE [dbo].[PaymentPlans] (
    [id]            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [plan_name]     NVARCHAR(100) NOT NULL,
    [route_id]      UNIQUEIDENTIFIER NULL,
    [amount]        DECIMAL(12,2) NOT NULL,
    [billing_cycle] NVARCHAR(20) NOT NULL DEFAULT 'monthly',
    [due_day]       INT NULL,
    [is_active]     BIT NOT NULL DEFAULT 1,
    [created_at]    DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_PaymentPlans PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
-- 20. Invoices
-- ============================================================
CREATE TABLE [dbo].[Invoices] (
    [id]             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [student_id]     UNIQUEIDENTIFIER NOT NULL,
    [parent_id]      UNIQUEIDENTIFIER NOT NULL,
    [plan_id]        UNIQUEIDENTIFIER NULL,
    [amount]         DECIMAL(12,2) NOT NULL,
    [status]         NVARCHAR(20) NOT NULL DEFAULT 'pending',
    [due_date]       DATE NOT NULL,
    [paid_at]        DATETIME NULL,
    [payment_method] NVARCHAR(50) NULL,
    [transaction_id] NVARCHAR(200) NULL,
    [created_at]     DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Invoices PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT FK_Invoices_Student FOREIGN KEY ([student_id]) REFERENCES [dbo].[Students]([id]),
    CONSTRAINT FK_Invoices_Plan    FOREIGN KEY ([plan_id])    REFERENCES [dbo].[PaymentPlans]([id])
)
GO

-- ============================================================
-- 21. Feedbacks
-- ============================================================
CREATE TABLE [dbo].[Feedbacks] (
    [id]          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [trip_id]     UNIQUEIDENTIFIER NULL,
    [from_user]   UNIQUEIDENTIFIER NOT NULL,
    [from_type]   NVARCHAR(20) NULL,
    [target_type] NVARCHAR(20) NULL,
    [rating]      INT NULL,
    [comment]     NVARCHAR(1000) NULL,
    [created_at]  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Feedbacks PRIMARY KEY CLUSTERED ([id])
)
GO

-- ============================================================
--  SEED DATA
-- ============================================================

-- Tài khoản Admin — email: admin@schoolbus.vn / password: Admin@123
INSERT INTO [dbo].[UserAdmins] (full_name, email, phone, password_hash, is_active)
VALUES (N'Nguyễn Admin', 'admin@schoolbus.vn', '0901000001',
        '$2b$12$5Zzlk0oe2EY1Ik1XeCCPWeTZU7RYCFBk6eEsSpbcoyR/eAG.yTl..', 1);
GO

-- 1 lớp mẫu để test CRUD Student (bắt buộc phải có ít nhất 1 lớp)
INSERT INTO [dbo].[Classes] (class_name, grade, school_year, teacher, is_active)
VALUES (N'10A1', N'10', N'2025-2026', N'Trần Thị B', 1);
GO

PRINT N'=== Tạo database schoolbus_db thành công, khớp đúng Sequelize model ==='
PRINT N'Tài khoản đăng nhập Admin: admin@schoolbus.vn / Admin@123'
GO