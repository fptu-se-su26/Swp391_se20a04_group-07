-- =============================================
-- DATABASE: SchoolBusSystem
-- Exported from BackupSBC.ipynb
-- =============================================

USE [master]
GO

/****** Object:  Database [SchoolBusSystem] ******/
CREATE DATABASE [SchoolBusSystem]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SchoolBusSystem', FILENAME = N'D:\APPLICATION IMPORTANT\SQL Sever Database\MSSQL17.MSSQLSERVER\MSSQL\DATA\SchoolBusSystem.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'SchoolBusSystem_log', FILENAME = N'D:\APPLICATION IMPORTANT\SQL Sever Database\MSSQL17.MSSQLSERVER\MSSQL\DATA\SchoolBusSystem_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SchoolBusSystem].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [SchoolBusSystem] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET ARITHABORT OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SchoolBusSystem] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SchoolBusSystem] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET  DISABLE_BROKER 
GO
ALTER DATABASE [SchoolBusSystem] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SchoolBusSystem] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET RECOVERY FULL 
GO
ALTER DATABASE [SchoolBusSystem] SET  MULTI_USER 
GO
ALTER DATABASE [SchoolBusSystem] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SchoolBusSystem] SET DB_CHAINING OFF 
GO
ALTER DATABASE [SchoolBusSystem] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [SchoolBusSystem] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [SchoolBusSystem] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [SchoolBusSystem] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [SchoolBusSystem] SET QUERY_STORE = ON
GO
ALTER DATABASE [SchoolBusSystem] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO

-- =============================================
-- USE DATABASE
-- =============================================
USE [SchoolBusSystem]
GO

-- =============================================
-- TABLE: attendance
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[attendance](
	[attendance_id] [int] IDENTITY(1,1) NOT NULL,
	[trip_id] [int] NOT NULL,
	[student_id] [int] NOT NULL,
	[checkin_time] [datetime] NULL,
	[checkout_time] [datetime] NULL,
	[attendance_status] [nvarchar](50) NULL,
	[note] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[attendance_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: classes
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[classes](
	[class_id] [int] IDENTITY(1,1) NOT NULL,
	[class_name] [nvarchar](50) NOT NULL,
	[grade_level] [int] NULL,
	[academic_year] [nvarchar](20) NULL,
	[teacher_name] [nvarchar](100) NULL,
	[status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[class_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: drivers
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[drivers](
	[driver_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[license_number] [nvarchar](50) NULL,
	[experience_years] [int] NULL,
	[created_at] [datetime] NULL,
	[full_name] [nvarchar](100) NULL,
	[birth_year] [int] NULL,
	[area_id] [int] NULL,
	[vehicle_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[driver_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: notifications
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[notifications](
	[notification_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[title] [nvarchar](200) NULL,
	[message] [nvarchar](MAX) NULL,
	[is_read] [bit] NULL,
	[created_at] [datetime] NULL,
	[notification_type] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[notification_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: parent_areas
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[parent_areas](
	[area_id] [int] IDENTITY(1,1) NOT NULL,
	[area_name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](255) NULL,
	[status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[area_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: parents
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[parents](
	[parent_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[full_name] [nvarchar](100) NULL,
	[phone_number] [nvarchar](20) NULL,
	[address] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[area_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[parent_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: roles
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[role_id] [int] IDENTITY(1,1) NOT NULL,
	[role_name] [nvarchar](50) NOT NULL,
	[description] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: route_stops
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[route_stops](
	[stop_id] [int] IDENTITY(1,1) NOT NULL,
	[route_id] [int] NOT NULL,
	[stop_name] [nvarchar](100) NULL,
	[stop_order] [int] NULL,
	[latitude] [decimal](9,6) NULL,
	[longitude] [decimal](9,6) NULL,
	[estimated_time] [time](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[stop_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: routes
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[routes](
	[route_id] [int] IDENTITY(1,1) NOT NULL,
	[route_name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](255) NULL,
	[status] [bit] NULL,
	[driver_id] [int] NULL,
	[area_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[route_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: students
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[students](
	[student_id] [int] IDENTITY(1,1) NOT NULL,
	[parent_id] [int] NULL,
	[full_name] [nvarchar](100) NOT NULL,
	[birth_date] [date] NULL,
	[gender] [nvarchar](10) NULL,
	[class_id] [int] NULL,
	[route_id] [int] NULL,
	[status] [bit] NULL,
	[created_at] [datetime] NULL,
	[student_code] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[student_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: trips
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[trips](
	[trip_id] [int] IDENTITY(1,1) NOT NULL,
	[route_id] [int] NOT NULL,
	[driver_id] [int] NOT NULL,
	[vehicle_id] [int] NOT NULL,
	[trip_date] [date] NULL,
	[start_time] [datetime] NULL,
	[end_time] [datetime] NULL,
	[trip_type] [nvarchar](50) NULL,
	[status] [nvarchar](50) NULL,
	[note] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[trip_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: users
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](50) NOT NULL,
	[password_hash] [nvarchar](255) NOT NULL,
	[email] [nvarchar](100) NULL,
	[role_id] [int] NULL,
	[is_active] [bit] NULL,
	[created_at] [datetime] NULL,
	[last_login] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- TABLE: vehicles
-- =============================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[vehicles](
	[vehicle_id] [int] IDENTITY(1,1) NOT NULL,
	[license_plate] [nvarchar](20) NOT NULL,
	[vehicle_type] [nvarchar](50) NULL,
	[capacity] [int] NULL,
	[status] [bit] NULL,
	[created_at] [datetime] NULL,
	[manufacture_year] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[vehicle_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[license_plate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================

-- attendance -> trips
ALTER TABLE [dbo].[attendance] WITH CHECK ADD FOREIGN KEY([trip_id])
REFERENCES [dbo].[trips] ([trip_id])
GO

-- attendance -> students
ALTER TABLE [dbo].[attendance] WITH CHECK ADD FOREIGN KEY([student_id])
REFERENCES [dbo].[students] ([student_id])
GO

-- drivers -> users
ALTER TABLE [dbo].[drivers] WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO

-- notifications -> users
ALTER TABLE [dbo].[notifications] WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO

-- parents -> users
ALTER TABLE [dbo].[parents] WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO

-- parents -> parent_areas
ALTER TABLE [dbo].[parents] WITH CHECK ADD CONSTRAINT [FK_Parents_Areas] FOREIGN KEY([area_id])
REFERENCES [dbo].[parent_areas] ([area_id])
GO
ALTER TABLE [dbo].[parents] CHECK CONSTRAINT [FK_Parents_Areas]
GO

-- route_stops -> routes
ALTER TABLE [dbo].[route_stops] WITH CHECK ADD FOREIGN KEY([route_id])
REFERENCES [dbo].[routes] ([route_id])
GO

-- routes -> drivers
ALTER TABLE [dbo].[routes] WITH CHECK ADD CONSTRAINT [FK_Routes_Drivers] FOREIGN KEY([driver_id])
REFERENCES [dbo].[drivers] ([driver_id])
GO
ALTER TABLE [dbo].[routes] CHECK CONSTRAINT [FK_Routes_Drivers]
GO

-- students -> parents
ALTER TABLE [dbo].[students] WITH CHECK ADD FOREIGN KEY([parent_id])
REFERENCES [dbo].[parents] ([parent_id])
GO

-- students -> classes
ALTER TABLE [dbo].[students] WITH CHECK ADD CONSTRAINT [FK_Student_Class] FOREIGN KEY([class_id])
REFERENCES [dbo].[classes] ([class_id])
GO
ALTER TABLE [dbo].[students] CHECK CONSTRAINT [FK_Student_Class]
GO

-- trips -> drivers
ALTER TABLE [dbo].[trips] WITH CHECK ADD FOREIGN KEY([driver_id])
REFERENCES [dbo].[drivers] ([driver_id])
GO

-- trips -> routes
ALTER TABLE [dbo].[trips] WITH CHECK ADD FOREIGN KEY([route_id])
REFERENCES [dbo].[routes] ([route_id])
GO

-- trips -> vehicles
ALTER TABLE [dbo].[trips] WITH CHECK ADD FOREIGN KEY([vehicle_id])
REFERENCES [dbo].[vehicles] ([vehicle_id])
GO

-- users -> roles
ALTER TABLE [dbo].[users] WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([role_id])
GO

-- =============================================
-- FINALIZE
-- =============================================
USE [master]
GO
ALTER DATABASE [SchoolBusSystem] SET READ_WRITE
GO
