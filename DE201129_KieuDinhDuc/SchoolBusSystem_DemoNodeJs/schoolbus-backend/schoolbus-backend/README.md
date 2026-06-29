# 🚌 SchoolBus System – Hướng dẫn cài đặt đầy đủ

---

## 📁 Cấu trúc 3 repo

```
schoolbus-backend/   ← Node.js + Express + SQL Server
schoolbus-admin/     ← React Admin Dashboard (port 3000)
schoolbus-parent/    ← React Parent App (port 3001)
```

---

## BƯỚC 1 — Tạo Database SQL Server

1. Mở **SQL Server Management Studio 21**
2. Kết nối vào server của bạn (localhost\SQLEXPRESS hoặc localhost)
3. Mở file `schoolbus-backend/database.sql`
4. Nhấn **F5** (hoặc Execute) để chạy toàn bộ script
5. Kiểm tra: database `SchoolBusDB` xuất hiện với 11 bảng + dữ liệu mẫu

---

## BƯỚC 2 — Tạo Google OAuth Credentials

### 2.1 Tạo Google Cloud Project
1. Vào https://console.cloud.google.com
2. Nhấn **"Select a project"** → **"New Project"**
3. Đặt tên: `SchoolBus System` → **Create**

### 2.2 Cấu hình OAuth Consent Screen
1. Menu trái → **APIs & Services** → **OAuth consent screen**
2. Chọn **External** → Create
3. Điền:
   - App name: `SchoolBus`
   - User support email: email của bạn
   - Developer contact: email của bạn
4. Nhấn **Save and Continue** qua hết các bước

### 2.3 Tạo OAuth Credentials
1. Menu trái → **Credentials** → **+ Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `SchoolBus Web`
4. **Authorized redirect URIs** – thêm:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
5. Nhấn **Create**
6. Copy **Client ID** và **Client Secret**

---

## BƯỚC 3 — Cài đặt Backend

```bash
cd schoolbus-backend

# Copy file môi trường
cp .env.example .env
```

Mở `.env` và điền thông tin:
```env
DB_SERVER=localhost          # hoặc localhost\SQLEXPRESS
DB_DATABASE=SchoolBusDB
DB_USER=sa
DB_PASSWORD=mật_khẩu_sql_của_bạn
DB_TRUST_CERT=true

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

ADMIN_URL=http://localhost:3000
PARENT_URL=http://localhost:3001
```

```bash
# Cài dependencies
npm install

# Chạy backend (dev mode với nodemon)
npm run dev
```

✅ Backend chạy tại: **http://localhost:5000**
Kiểm tra: http://localhost:5000/api/health

---

## BƯỚC 4 — Chạy Admin App

```bash
cd schoolbus-admin
npm install
npm start
```

✅ Admin app tại: **http://localhost:3000**

> ⚠️ Admin hiện dùng mock data. Để kết nối backend thật,
> thêm file `.env` trong schoolbus-admin:
> ```
> REACT_APP_API_URL=http://localhost:5000
> ```
> Và thay các mock data bằng API calls (xem phần nâng cấp bên dưới).

---

## BƯỚC 5 — Chạy Parent App

```bash
cd schoolbus-parent
npm install
npm start
```

✅ Parent app tại: **http://localhost:3001**

> Parent app kết nối thẳng vào backend tại localhost:5000

---

## BƯỚC 6 — Test đăng nhập Parent

1. Trong SSMS, thêm email Google của bạn vào bảng Parents:
```sql
USE SchoolBusDB;
INSERT INTO Parents (email, name, phone)
VALUES ('your.email@gmail.com', N'Tên của bạn', '0901234567');
```

2. Truy cập http://localhost:3001
3. Nhấn **"Đăng nhập bằng Google"**
4. Chọn đúng tài khoản Gmail đã đăng ký
5. Được redirect về app và đăng nhập thành công!

---

## 📋 API Endpoints

| Method | Path | Role | Mô tả |
|--------|------|------|-------|
| GET | /api/health | Public | Kiểm tra server |
| GET | /api/auth/google | Public | Bắt đầu Google OAuth |
| GET | /api/auth/me | All | Thông tin user |
| GET | /api/students | Admin | Tất cả học sinh |
| GET | /api/students/my-children | Parent | Con của tôi |
| POST | /api/students/import-excel | Admin | Import từ Excel |
| GET | /api/buses/:id/location | All | GPS xe |
| POST | /api/buses/:id/location | Driver | Cập nhật GPS |
| GET | /api/attendance | Admin | Điểm danh |
| GET | /api/attendance/my-children | Parent | Điểm danh của con |
| GET | /api/leave-requests | Admin | Tất cả đơn nghỉ |
| GET | /api/leave-requests/mine | Parent | Đơn của tôi |
| POST | /api/leave-requests | Parent | Gửi đơn xin nghỉ |
| PATCH | /api/leave-requests/:id/review | Admin | Duyệt/từ chối |
| GET | /api/notifications/mine | Parent | Thông báo của tôi |
| POST | /api/notifications | Admin | Gửi thông báo |

---

## 📊 Cấu trúc Excel Import

File Excel cần có các cột (tên chính xác):

| Cột | Bắt buộc |
|-----|----------|
| Tên học sinh | ✅ |
| Email phụ huynh | ✅ |
| Tên phụ huynh | ✅ |
| SĐT | - |
| Địa chỉ đón | ✅ |
| Khu vực | - (Khu A / Khu B / Khu C) |
| Tuyến | - (Tuyến 1 / Tuyến 2 ...) |

---

## 🔧 Troubleshoot thường gặp

**Lỗi kết nối SQL Server:**
```
ConnectionError: Failed to connect to localhost:1433
```
→ Kiểm tra SQL Server Browser service đang chạy
→ Thêm `DB_SERVER=localhost\\SQLEXPRESS` nếu dùng Express edition
→ Bật TCP/IP trong SQL Server Configuration Manager

**Lỗi Google OAuth:**
```
redirect_uri_mismatch
```
→ Callback URL trong Google Console phải khớp chính xác với GOOGLE_CALLBACK_URL trong .env

**Parent không đăng nhập được:**
→ Email Google chưa có trong bảng Parents → Thêm thủ công hoặc import Excel
