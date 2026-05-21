package dao;

import model.Attendance;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.AttendanceDetail;
import java.util.Map;
import java.util.HashMap;

public class AttendanceDAO extends DBContext {

    public boolean markAttendance(Attendance a) {
        String sql = "INSERT INTO attendance (trip_id, student_id, checkin_time, attendance_status, note) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, a.getTripId());
            st.setInt(2, a.getStudentId());
            st.setTimestamp(3, a.getCheckinTime());
            st.setString(4, a.getAttendanceStatus());
            st.setString(5, a.getNote());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // [BỔ SUNG] Xem lịch sử điểm danh theo Chuyến đi (Admin)
    public List<Attendance> getAttendanceByTripId(int tripId) {
        List<Attendance> list = new ArrayList<>();
        String sql = "SELECT * FROM attendance WHERE trip_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(new Attendance(rs.getInt("attendance_id"), rs.getInt("trip_id"),
                            rs.getInt("student_id"), rs.getTimestamp("checkin_time"),
                            rs.getTimestamp("checkout_time"), rs.getString("attendance_status"),
                            rs.getString("note")));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy toàn bộ lịch sử điểm danh cho Admin xem
    public List<Attendance> getAllAttendances() {
        List<Attendance> list = new ArrayList<>();
        String sql = "SELECT * FROM attendance ORDER BY checkin_time DESC";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(new Attendance(rs.getInt("attendance_id"), rs.getInt("trip_id"),
                        rs.getInt("student_id"), rs.getTimestamp("checkin_time"),
                        rs.getTimestamp("checkout_time"), rs.getString("attendance_status"),
                        rs.getString("note")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<AttendanceDetail> getStudentAttendanceHistory(int studentId) {
        List<AttendanceDetail> list = new ArrayList<>();
        // SQL lọc Thứ 2 (2) đến Thứ 6 (6). Lưu ý: DATEPART phụ thuộc cài đặt server (thông thường CN là 1)
        String sql = "SELECT t.trip_date, a.check_in_time, a.status, a.notes "
                + "FROM attendance a "
                + "JOIN trips t ON a.trip_id = t.trip_id "
                + "WHERE a.student_id = ? "
                + "AND DATEPART(dw, t.trip_date) BETWEEN 2 AND 6 "
                + "ORDER BY t.trip_date DESC";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    AttendanceDetail ad = new AttendanceDetail();
                    ad.setTripDate(rs.getDate("trip_date"));
                    ad.setCheckInTime(rs.getTime("check_in_time"));
                    ad.setStatus(rs.getString("status"));
                    ad.setNotes(rs.getString("notes"));
                    list.add(ad);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

// Lấy điểm danh chi tiết từ Thứ 2 đến Thứ 6
    public List<AttendanceDetail> getWeeklyAttendance(int studentId) {
        List<AttendanceDetail> list = new ArrayList<>();
        String sql = "SELECT t.trip_date, a.checkin_time, a.attendance_status, a.note "
                + "FROM attendance a JOIN trips t ON a.trip_id = t.trip_id "
                + "WHERE a.student_id = ? AND DATEPART(dw, t.trip_date) BETWEEN 2 AND 6 "
                + "ORDER BY t.trip_date DESC";

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    AttendanceDetail ad = new AttendanceDetail();
                    ad.setTripDate(rs.getDate("trip_date"));

                    // Chuyển Timestamp sang Time để lấy giờ:phút
                    Timestamp checkin = rs.getTimestamp("checkin_time");
                    if (checkin != null) {
                        ad.setCheckInTime(new java.sql.Time(checkin.getTime()));
                    }

                    ad.setStatus(rs.getString("attendance_status"));
                    ad.setNotes(rs.getString("note"));
                    list.add(ad);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean saveAttendance(int tripId, int studentId, String status) {
        String sql = "IF EXISTS (SELECT 1 FROM attendance WHERE trip_id = ? AND student_id = ?) "
                + "BEGIN "
                + "   UPDATE attendance SET attendance_status = ?, checkin_time = GETDATE() "
                + "   WHERE trip_id = ? AND student_id = ?; "
                + "END "
                + "ELSE "
                + "BEGIN "
                + "   INSERT INTO attendance (trip_id, student_id, attendance_status, checkin_time) "
                + "   VALUES (?, ?, ?, GETDATE()); "
                + "END";

        try (PreparedStatement ps = connection.prepareStatement(sql)) { // ✅ Dùng connection
            ps.setInt(1, tripId);
            ps.setInt(2, studentId);
            ps.setString(3, status);
            ps.setInt(4, tripId);
            ps.setInt(5, studentId);
            ps.setInt(6, tripId);
            ps.setInt(7, studentId);
            ps.setString(8, status);

            ps.executeUpdate();
            return true; // ✅ IF/ELSE luôn chạy 1 trong 2 nhánh, không cần check rowsAffected

        } catch (Exception e) {
            System.out.println("Lỗi tại saveAttendance: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }
    
    // Bổ sung hàm này vào AttendanceDAO.java
    public Map<Integer, String> getAttendanceStatusByTrip(int tripId) {
        Map<Integer, String> map = new HashMap<>();
        String sql = "SELECT student_id, attendance_status FROM attendance WHERE trip_id = ?";
        try (Connection conn = DBContext.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, tripId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                map.put(rs.getInt("student_id"), rs.getString("attendance_status"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }
}
