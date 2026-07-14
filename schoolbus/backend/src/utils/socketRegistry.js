// ============================================================
// SOCKET REGISTRY
// Giữ tham chiếu tới io instance để các service REST thông thường
// (không có sẵn `io`, ví dụ parent.service.js, driver.service.js)
// vẫn có thể emit sự kiện real-time mà không cần truyền io qua
// nhiều lớp gọi hàm hay sửa lại toàn bộ route handler hiện có.
// ============================================================
let ioInstance = null;

module.exports = {
  setIO(io) {
    ioInstance = io;
  },
  getIO() {
    return ioInstance;
  },
};
