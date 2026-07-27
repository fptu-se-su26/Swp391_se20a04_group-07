import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000, // mặc định 15s cho hầu hết request — ĐỦ cho các API thường
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - gắn token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// Response interceptor - auto refresh token
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

// Các route auth không cần refresh token khi gặp 401
const AUTH_ROUTES = ['/auth/login', '/auth/google', '/auth/refresh-token'];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const isAuthRoute = AUTH_ROUTES.some(route => original.url?.includes(route));
    // Nếu là route đăng nhập/auth → không refresh, hiện thông báo từ backend, không redirect
    if (err.response?.status === 401 && isAuthRoute) {
      const message = err.response?.data?.message || 'Email hoặc mật khẩu không đúng';
      toast.error(message);
      return Promise.reject(err);
    }
    // Với các route khác bị 401 → thử refresh token
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post('/api/v1/auth/refresh-token', { refreshToken });
        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    // ✅ FIX: timeout (ECONNABORTED) không nên hiện "Có lỗi xảy ra" mập mờ —
    // đặc biệt với các thao tác nặng như xuất hóa đơn hàng loạt, dễ khiến
    // Manager tưởng thao tác thất bại dù backend vẫn đang xử lý ngầm.
    if (err.code === 'ECONNABORTED') {
      toast.error('Thao tác đang mất nhiều thời gian hơn dự kiến. Vui lòng đợi ít phút rồi tải lại trang để kiểm tra kết quả, thay vì thử lại ngay.');
      return Promise.reject(err);
    }
    const message = err.response?.data?.message || 'Có lỗi xảy ra';
    if (err.response?.status !== 401) toast.error(message);
    return Promise.reject(err);
  }
);

export default api;
