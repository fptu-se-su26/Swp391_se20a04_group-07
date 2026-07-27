import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string) ||
  "http://localhost:3000/api/v1";

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

// Gắn access token vào mọi request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự động refresh token khi access token hết hạn (401)
let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // Đợi lượt refresh đang chạy xong rồi thử lại
        await new Promise<void>((resolve) => queue.push(resolve));
        return api(original);
      }

      isRefreshing = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw error;
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        await SecureStore.setItemAsync("accessToken", data.data.accessToken);
        queue.forEach((resolve) => resolve());
        queue = [];
        return api(original);
      } catch (refreshErr) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }
    throw error;
  }
);
