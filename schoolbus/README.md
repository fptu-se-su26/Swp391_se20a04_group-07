# 🚌 School Bus Management System
> **SWP391 - FPT University**  
> Full-stack: Node.js + Express + SQL Server + React + Socket.IO

---

## 📁 Cấu trúc project

```
schoolbus/
├── backend/
│   ├── src/
│   │   ├── app.js                  ← Entry point
│   │   ├── config/
│   │   │   ├── database.js         ← Sequelize + SQL Server
│   │   │   └── logger.js           ← Winston logger
│   │   ├── models/
│   │   │   └── index.js            ← 17 Sequelize models + associations
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  ← verifyToken, authorizeRoles
│   │   │   └── index.js            ← errorHandler, validate, upload
│   │   ├── modules/
│   │   │   ├── auth/               ← Register, Login, OTP, JWT
│   │   │   ├── admin/              ← Users, Vehicles, Routes, Reports
│   │   │   ├── manager/            ← Trips, Fleet, Payments
│   │   │   ├── driver/             ← Trips, Attendance, Incidents
│   │   │   ├── parent/             ← Children, Tracking, Invoices
│   │   │   └── other.routes.js     ← Manager + Student routes
│   │   ├── socket/
│   │   │   └── socket.handler.js   ← GPS real-time, notifications
│   │   └── database/
│   │       ├── schema.sql          ← 17 bảng SQL Server
│   │       └── seed.sql            ← Dữ liệu mẫu
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx                 ← Router + Guards
    │   ├── api/
    │   │   ├── axios.js            ← Axios instance + interceptors
    │   │   └── index.js            ← Tất cả API functions
    │   ├── context/
    │   │   └── index.jsx           ← AuthContext + SocketContext
    │   ├── components/common/      ← Sidebar, Modal, StatCard, Badges...
    │   └── pages/
    │       ├── admin/              ← Dashboard, Users, Vehicles, Routes, Incidents, Report
    │       ├── manager/            ← Dashboard, Trips, Fleet (live map), Payments
    │       ├── driver/             ← Trips, ActiveTrip (GPS + Attendance), History
    │       ├── parent/             ← Dashboard, Tracking, Attendance, Invoices, AbsentRequest, Notifications
    │       └── student/            ← Home (schedule), BusTracker
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ HƯỚNG DẪN CÀI ĐẶT & CHẠY

### Bước 1: Cài đặt SQL Server

1. Cài **SQL Server 2019/2022 Developer** (miễn phí): https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Cài **SQL Server Management Studio (SSMS)**: https://aka.ms/ssmsfullsetup
3. Mở SSMS, kết nối với `localhost`

### Bước 2: Tạo Database

Mở SSMS → New Query → chạy lần lượt:

```sql
-- 1. Tạo schema (17 bảng)
-- Copy nội dung file: backend/src/database/schema.sql

-- 2. Tạo dữ liệu mẫu
-- Copy nội dung file: backend/src/database/seed.sql
```

### Bước 3: Setup Backend

```bash
cd schoolbus/backend

# Copy file env
cp .env.example .env

# Mở .env và sửa thông tin:
# DB_PASSWORD=password_sql_server_của_bạn
# MAIL_USER=email_của_bạn@gmail.com
# MAIL_PASS=app_password_gmail (Bật 2FA -> App Passwords)

# Cài dependencies
npm install

# Chạy server
npm run dev
# → Server chạy tại http://localhost:3000
# → Swagger docs: http://localhost:3000/api-docs
```

### Bước 4: Setup Frontend

```bash
cd schoolbus/frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
# → App chạy tại http://localhost:5173
```

---

## 🔑 Tài khoản đăng nhập (từ seed.sql)

| Role     | Email                   | Mật khẩu   |
|----------|-------------------------|------------|
| Admin    | admin@schoolbus.vn      | Admin@123  |
| Manager  | manager@schoolbus.vn    | Admin@123  |
| Tài xế 1 | driver1@schoolbus.vn   | Admin@123  |
| Tài xế 2 | driver2@schoolbus.vn   | Admin@123  |
| Phụ huynh| parent1@schoolbus.vn   | Admin@123  |
| Học sinh | student1@schoolbus.vn  | Admin@123  |

---

## 🌐 API Endpoints

| Prefix              | Mô tả                           |
|---------------------|---------------------------------|
| POST /api/v1/auth/login    | Đăng nhập                 |
| POST /api/v1/auth/register | Đăng ký                   |
| GET  /api/v1/admin/...     | Admin APIs (xác thực JWT)  |
| GET  /api/v1/manager/...   | Manager APIs               |
| GET  /api/v1/driver/...    | Driver APIs                |
| GET  /api/v1/parent/...    | Parent APIs                |
| GET  /api/v1/student/...   | Student APIs               |

**Swagger UI:** http://localhost:3000/api-docs

---

## 🔌 Socket.IO Events

| Event (Client → Server)     | Mô tả                          |
|-----------------------------|-------------------------------|
| `driver:location`           | Gửi tọa độ GPS (mỗi 5 giây)   |
| `driver:trip_started`       | Bắt đầu chuyến                |
| `driver:trip_completed`     | Kết thúc chuyến               |
| `driver:attendance_updated` | Cập nhật điểm danh            |
| `driver:incident`           | Báo sự cố                     |
| `client:watch_trip`         | Parent/Student theo dõi trip  |
| `manager:watch_all`         | Manager xem tất cả xe         |

| Event (Server → Client)     | Mô tả                          |
|-----------------------------|-------------------------------|
| `bus:location`              | Vị trí xe cập nhật             |
| `notification:new`          | Thông báo mới                 |
| `alert:speed`               | Cảnh báo tốc độ cao           |
| `alert:incident`            | Sự cố mới                     |
| `fleet:current_positions`   | Tất cả vị trí xe hiện tại     |

---

## 🗄️ Database Schema (17 bảng)

```
Auth:    Users, RefreshTokens, OtpCodes
Route:   Vehicles, Routes, RouteStops, RouteSubscriptions
Link:    ParentStudent, AuthorizedPersons
Trip:    Trips, TripAttendance, LocationLogs
Feature: Incidents, AbsentRequests, Notifications,
         PaymentPlans, Invoices, Feedbacks
```

---

## 🛠️ Tech Stack

**Backend:**
- Node.js 20 + Express.js
- Sequelize ORM v6 + tedious (SQL Server driver)
- Socket.IO 4 (real-time GPS)
- JWT (Access 15m + Refresh 7d)
- bcryptjs (salt rounds=12)
- Joi validation, Helmet, rate-limit
- Nodemailer (OTP email)
- Swagger UI

**Frontend:**
- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- Axios + interceptors (auto refresh token)
- Socket.IO client
- React Leaflet (map)
- Recharts (charts)
- react-hot-toast

---

## 📝 Ghi chú quan trọng

1. **GPS**: Cần HTTPS hoặc localhost để dùng `navigator.geolocation`
2. **Email OTP**: Phải bật Gmail App Password (2FA) - xem hướng dẫn tại https://support.google.com/accounts/answer/185833
3. **SQL Server Auth**: Dùng SQL Server Authentication (không dùng Windows Auth)
4. **Port**: Backend=3000, Frontend=5173 (proxy API tự động)
5. **Upload ảnh**: Đang lưu local tại `backend/uploads/`, production nên dùng Cloudinary

---

## 🚀 Demo nhanh (5 phút)

1. Chạy backend + frontend theo hướng dẫn trên
2. Truy cập http://localhost:5173
3. Đăng nhập bằng `admin@schoolbus.vn` / `Admin@123`
4. Vào Admin → Users để xem danh sách tài khoản
5. Mở tab mới, đăng nhập `driver1@schoolbus.vn` → Bắt đầu chuyến
6. Mở tab mới, đăng nhập `parent1@schoolbus.vn` → Theo dõi xe
7. Xem GPS cập nhật real-time trên bản đồ!
