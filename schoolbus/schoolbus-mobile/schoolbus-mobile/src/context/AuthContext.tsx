import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthUser, fetchMe, loginWithGoogle, logout as logoutApi } from "@/api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  loginGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;
      const me = await fetchMe();
      setUser(me);
    } catch {
      // token hỏng/hết hạn -> coi như chưa đăng nhập
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } finally {
      setIsLoading(false);
    }
  }

  async function loginGoogle(idToken: string) {
    const result = await loginWithGoogle(idToken);
    await SecureStore.setItemAsync("accessToken", result.accessToken);
    await SecureStore.setItemAsync("refreshToken", result.refreshToken);
    setUser(result.user);
  }

  async function logout() {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // bỏ qua lỗi network khi logout, vẫn xóa token local
    }
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng trong AuthProvider");
  return ctx;
}
