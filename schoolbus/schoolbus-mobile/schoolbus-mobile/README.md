# SchoolBus Mobile

App di động cho Student & Parent — thời khóa biểu, lịch xe buýt, theo dõi lộ trình
realtime, điểm danh, thông báo. Dùng chung 1 codebase, phân biệt role qua tài khoản
Google đăng nhập (backend tự xác định `student` hay `parent` dựa trên
`student_email`/`parent_gmail`).

## Cài đặt

```bash
npm install
```

## Cấu hình bắt buộc trước khi chạy

### 1. API base URL
Sửa `apiBaseUrl` trong `app.json` → `expo.extra.apiBaseUrl` trỏ đến backend
(ví dụ `http://<ip-máy-bạn>:3000/api/v1` — **không dùng `localhost`** khi test
trên điện thoại thật, vì điện thoại không hiểu `localhost` là máy tính của bạn).

### 2. Google OAuth Client ID
Trong `app.json` → `expo.extra`, điền:
- `googleExpoClientId` — dùng khi test qua Expo Go (tạo loại **Web application**
  trên Google Cloud Console, Authorized redirect URI: `https://auth.expo.io/@your-username/schoolbus-mobile`)
- `googleIosClientId` — loại **iOS**, bundle ID trùng `ios.bundleIdentifier` trong app.json
- `googleAndroidClientId` — loại **Android**, package trùng `android.package`, cần SHA-1 của keystore

Cả 3 client ID này phải **cùng một Google Cloud Project** với `GOOGLE_CLIENT_ID`
đang cấu hình ở backend (`.env` → `GOOGLE_CLIENT_ID`) — vì backend verify token
bằng `audience: process.env.GOOGLE_CLIENT_ID`. Cách đơn giản nhất: dùng đúng
`GOOGLE_CLIENT_ID` (loại Web) hiện có trong backend `.env` làm `googleExpoClientId`.

## Chạy app

```bash
npx expo start
```
Quét QR bằng app Expo Go (Android/iOS) hoặc nhấn `a` / `i` để mở giả lập.

## Cấu trúc thư mục

```
app/
  (auth)/login.tsx        Màn hình đăng nhập Google
  (tabs)/index.tsx         Trang chủ - dashboard
  (tabs)/schedule.tsx      Thời khóa biểu (chỉ student)
  (tabs)/bus.tsx            Lộ trình + theo dõi xe buýt
  (tabs)/notifications.tsx Thông báo
  (tabs)/profile.tsx        Thông tin cá nhân, đăng xuất
src/
  api/          Gọi API backend (auth, student, parent)
  context/      AuthContext - quản lý phiên đăng nhập
  components/   TicketCard, RouteTimeline, StatusPill
  theme/        Bảng màu dùng chung
```

## ⚠️ Việc cần làm ở backend trước khi app chạy đầy đủ

1. **`GET /api/v1/student/class-schedule`** — endpoint thời khóa biểu chưa có
   trong `other.routes.js`, cần thêm theo thiết kế bảng `ClassSchedules` +
   `Semesters` đã thống nhất trước đó. Thiếu endpoint này thì tab "Lịch học"
   sẽ luôn trống.
2. **Refresh token cho student/parent** — `authService.loginGoogle()` hiện
   sinh `refreshToken` nhưng không lưu vào bảng `RefreshTokens`, nên
   `POST /auth/refresh-token` sẽ thất bại (401) khi access token hết hạn →
   app sẽ tự đăng xuất người dùng sau ~15 phút (theo `JWT_EXPIRES_IN`).
3. Trường `bus_suspended` / `bus_suspended_reason` trên `Student` — cần có ở
   response của `GET /auth/me` để banner đình chỉ ở trang chủ hoạt động.

## Realtime (Socket.io) — chưa tích hợp trong bản này

Bản hiện tại lấy vị trí xe qua REST polling (kéo lại khi mở tab / kéo-để-làm-mới).
Muốn hiển thị vị trí xe live theo giây thật, cần thêm `socket.io-client`, kết nối
tới `driver:location` → `bus:location` như cơ chế đã có ở `socket.handler.js`,
join room `trip:${tripId}` qua sự kiện `client:watch_trip`.
