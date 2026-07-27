import { api } from "./client";
import { Role } from "./auth";

// ============================================================
// Lớp API dùng chung cho cả Student & Parent — che đi khác biệt
// giữa /student/... và /parent/children/:id/... để UI không cần
// quan tâm role đang gọi API nào.
// ============================================================

export async function getMyRoute(role: Role, studentId?: string) {
  const url = role === "student" ? "/student/my-route" : `/parent/children/${studentId}/bus-status`;
  const { data } = await api.get(url);
  return data.data;
}

export async function getCurrentTrip(role: Role, studentId?: string) {
  const url = role === "student" ? "/student/trips/current" : `/parent/children/${studentId}/trip/current`;
  const { data } = await api.get(url);
  return data.data;
}

export async function getClassSchedule(role: Role) {
  // Lưu ý: endpoint này cần được thêm ở backend (GET /student/class-schedule)
  // theo thiết kế bảng ClassSchedules đã thống nhất trước đó.
  if (role !== "student") return null;
  const { data } = await api.get("/student/class-schedule");
  return data.data as { semester: string; schedule: Record<string, any[]> };
}

export async function getBusWeekSchedule(role: Role, studentId?: string) {
  if (role === "student") {
    const { data } = await api.get("/student/schedule/week");
    return data.data;
  }
  const { data } = await api.get(`/parent/children/${studentId}/attendance`);
  return data.data;
}

export async function getNotifications(role: Role, page = 1) {
  const url = role === "student" ? "/student/notifications" : "/parent/notifications";
  const { data } = await api.get(url, { params: { page, limit: 20 } });
  return data.data;
}

export async function markNotificationRead(role: Role, id: string) {
  if (role !== "parent") return; // route đánh dấu đã đọc hiện chỉ có ở parent module
  await api.patch(`/parent/notifications/${id}/read`);
}

export async function getAttendanceHistory(role: Role, studentId: string | undefined, month: number, year: number) {
  if (role === "parent" && studentId) {
    const { data } = await api.get(`/parent/children/${studentId}/attendance`, { params: { month, year } });
    return data.data;
  }
  // Student chưa có endpoint lịch sử điểm danh riêng theo tháng —
  // tạm dùng /student/schedule/week (chỉ tuần hiện tại) làm fallback.
  const { data } = await api.get("/student/schedule/week");
  return data.data;
}
