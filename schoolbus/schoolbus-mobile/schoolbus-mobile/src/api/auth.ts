import { api } from "./client";

export type Role = "student" | "parent";

export interface AuthUser {
  id: string;
  role: Role;
  email: string;
  full_name: string;
  avatar_url?: string;
  class_name?: string;
  student_name?: string; // khi role = parent
  [key: string]: any;
}

export async function loginWithGoogle(idToken: string) {
  const { data } = await api.post("/auth/google", { idToken });
  return data.data as { accessToken: string; refreshToken: string; user: AuthUser };
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.data as AuthUser;
}

export async function logout(refreshToken: string) {
  await api.post("/auth/logout", { refreshToken });
}
