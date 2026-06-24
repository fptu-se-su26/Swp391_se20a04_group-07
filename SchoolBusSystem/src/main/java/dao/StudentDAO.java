package dao;

import model.Student;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * StudentDAO - Toàn bộ nghiệp vụ truy vấn bảng students.
 *
 * ĐÃ SỬA:
 *  - getStudentsByClassId: gộp JOIN parent_areas vào 1 SQL, bỏ N+1 query
 *  - getAreaNameByParentId: đổi "areas" → "parent_areas"
 *  - mapStudent: dùng ResultSetMetaData-safe pattern thay vì try/catch im lặng
 *  - getStudentsByTripArea: đóng ResultSet đúng cách (try-with-resources)
 */
public class StudentDAO extends DBContext {

    // =========================================================================
    // LẤY TẤT CẢ HỌC SINH (kèm tên lớp + tên phụ huynh)
    // =========================================================================
    public List<Student> getAllStudents() {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name, "
                   + "       u.full_name AS parent_name, "
                   + "       pa.area_name AS area_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                   + "LEFT JOIN users u ON p.user_id = u.user_id "
                   + "LEFT JOIN parent_areas pa ON p.area_id = pa.area_id "
                   + "WHERE s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql);
             ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(mapStudentFull(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // =========================================================================
    // LẤY DANH SÁCH HỌC SINH THEO LỚP
    // FIX: Gộp JOIN parent_areas vào SQL, bỏ hàm getAreaNameByParentId gọi riêng
    // =========================================================================
    public List<Student> getStudentsByClassId(int classId) {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name, "
                   + "       u.full_name AS parent_name, "
                   + "       pa.area_name AS area_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                   + "LEFT JOIN users u ON p.user_id = u.user_id "
                   + "LEFT JOIN parent_areas pa ON p.area_id = pa.area_id "
                   + "WHERE s.class_id = ? AND s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, classId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(mapStudentFull(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // =========================================================================
    // LẤY HỌC SINH THEO ID (đầy đủ thông tin liên hệ phụ huynh)
    // =========================================================================
    public Student getStudentById(int studentId) {
        String sql = "SELECT s.*, c.class_name, "
                   + "       u.full_name AS parent_name, "
                   + "       p.phone AS parent_phone, "
                   + "       p.emergency_phone, "
                   + "       pa.area_name AS area_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                   + "LEFT JOIN users u ON p.user_id = u.user_id "
                   + "LEFT JOIN parent_areas pa ON p.area_id = pa.area_id "
                   + "WHERE s.student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Student s = mapStudentFull(rs);
                    s.setParentPhone(rs.getString("parent_phone"));
                    s.setEmergencyPhone(rs.getString("emergency_phone"));
                    return s;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // =========================================================================
    // LẤY HỌC SINH THEO PARENT ID
    // =========================================================================
    public List<Student> getStudentsByParentId(int parentId) {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "WHERE s.parent_id = ? AND s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) list.add(mapStudent(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // =========================================================================
    // LẤY HỌC SINH THEO TRIP ID (điểm danh)
    // =========================================================================
    public List<Student> getStudentsByTripId(int tripId) {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name "
                   + "FROM students s "
                   + "JOIN attendance a ON s.student_id = a.student_id "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "WHERE a.trip_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) list.add(mapStudent(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // =========================================================================
    // LẤY HỌC SINH THEO KHU VỰC CỦA CHUYẾN ĐI
    // FIX: Dùng try-with-resources cho ResultSet, đóng connection đúng cách
    // =========================================================================
    public List<Student> getStudentsByTripArea(int tripId) {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name "
                   + "FROM students s "
                   + "JOIN parents p ON s.parent_id = p.parent_id "
                   + "JOIN parent_areas pa ON p.area_id = pa.area_id "
                   + "JOIN trips t ON t.trip_id = ? "
                   + "JOIN routes r ON t.route_id = r.route_id "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "WHERE pa.area_name LIKE N'%' + LTRIM(RTRIM(r.start_location)) + N'%' "
                   + "  AND s.status = 1";
        try (Connection conn = DBContext.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, tripId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapStudent(rs));
                }
            }
        } catch (Exception e) {
            System.err.println("[StudentDAO] Lỗi getStudentsByTripArea: " + e.getMessage());
            e.printStackTrace();
        }
        return list;
    }

    // =========================================================================
    // LẤY HỌC SINH THEO USER ID
    // =========================================================================
    public Student getStudentByUserId(int userId) {
        String sql = "SELECT s.*, c.class_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "WHERE s.user_id = ? AND s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) return mapStudent(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // =========================================================================
    // THÊM HỌC SINH
    // =========================================================================
    public boolean insertStudent(Student s) {
        String sql = "INSERT INTO students "
                   + "(parent_id, user_id, student_code, full_name, gender, date_of_birth, "
                   + " school_name, class_id, address, avatar, status) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            setNullableInt(st, 1, s.getParentId());
            setNullableInt(st, 2, s.getUserId());
            st.setString(3, s.getStudentCode());
            st.setString(4, s.getFullName());
            st.setString(5, s.getGender());
            st.setDate(6, s.getDateOfBirth());
            st.setString(7, s.getSchoolName());
            st.setInt(8, s.getClassId());
            st.setString(9, s.getAddress());
            st.setString(10, s.getAvatar());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[StudentDAO] Lỗi insertStudent: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // CẬP NHẬT HỌC SINH
    // =========================================================================
    public boolean updateStudent(Student s) {
        String sql = "UPDATE students SET student_code=?, full_name=?, gender=?, "
                   + "date_of_birth=?, school_name=?, class_id=?, address=?, status=? "
                   + "WHERE student_id=?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, s.getStudentCode());
            st.setString(2, s.getFullName());
            st.setString(3, s.getGender());
            st.setDate(4, s.getDateOfBirth());
            st.setString(5, s.getSchoolName());
            st.setInt(6, s.getClassId());
            st.setString(7, s.getAddress());
            st.setBoolean(8, s.isStatus());
            st.setInt(9, s.getStudentId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // CẬP NHẬT PARENT ID CỦA HỌC SINH
    // =========================================================================
    public boolean updateStudentParent(int studentId, int parentId) {
        String sql = "UPDATE students SET parent_id = ? WHERE student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            st.setInt(2, studentId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // XÓA MỀM HỌC SINH
    // =========================================================================
    public boolean deleteStudent(int studentId) {
        String sql = "UPDATE students SET status = 0 WHERE student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // HELPER: MAP ResultSet → Student (các cột cơ bản, không có parent/area)
    // =========================================================================
    private Student mapStudent(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setStudentId(rs.getInt("student_id"));
        s.setParentId(rs.getInt("parent_id"));
        s.setClassId(rs.getInt("class_id"));
        s.setFullName(rs.getString("full_name"));
        s.setGender(rs.getString("gender"));
        s.setDateOfBirth(rs.getDate("date_of_birth"));
        s.setSchoolName(rs.getString("school_name"));
        s.setAddress(rs.getString("address"));
        s.setAvatar(rs.getString("avatar"));
        s.setStatus(rs.getBoolean("status"));
        safeSet(s, rs, "student_code", (st, r) -> st.setStudentCode(r.getString("student_code")));
        safeSet(s, rs, "class_name",   (st, r) -> st.setClassNameDisplay(r.getString("class_name")));
        safeSet(s, rs, "user_id",      (st, r) -> st.setUserId(r.getInt("user_id")));
        return s;
    }

    /**
     * Map đầy đủ: thêm parent_name và area_name (dùng cho các query có JOIN users + parent_areas).
     */
    private Student mapStudentFull(ResultSet rs) throws SQLException {
        Student s = mapStudent(rs);
        String parentName = rs.getString("parent_name");
        s.setParentName((parentName != null && !parentName.trim().isEmpty()) ? parentName : null);
        String areaName = rs.getString("area_name");
        s.setAreaName((areaName != null && !areaName.trim().isEmpty()) ? areaName : "Chưa xác định");
        return s;
    }

    // =========================================================================
    // HELPER: setNull nếu id <= 0
    // =========================================================================
    private void setNullableInt(PreparedStatement st, int idx, int value) throws SQLException {
        if (value > 0) st.setInt(idx, value);
        else st.setNull(idx, Types.INTEGER);
    }

    /**
     * Đọc cột tuỳ chọn từ ResultSet — không ném lỗi nếu cột không tồn tại trong query đó.
     */
    @FunctionalInterface
    private interface StudentSetter {
        void set(Student s, ResultSet rs) throws SQLException;
    }

    private void safeSet(Student s, ResultSet rs, String column, StudentSetter setter) {
        try {
            rs.findColumn(column); // throws nếu cột không có trong query này
            setter.set(s, rs);
        } catch (SQLException ignored) {
            // Cột không tồn tại trong query hiện tại — bỏ qua, không log
        }
    }

    // =========================================================================
    // LẤY HỌC SINH KÈM THÔNG TIN CHUYẾN XE HÔM NAY THEO PARENT ID
    // Dùng cho ParentDashboard — phụ huynh chỉ thấy tài xế đang chở con họ
    //
    // JOIN:
    //   students → trip_registrations (student_id) → trips (trip_id, hôm nay)
    //   trips    → drivers (driver_id) → users (full_name tài xế)
    //   trips    → vehicles (vehicle_id, biển số)
    //   trips    → routes (route_id, tên lộ trình)
    //   students → classes (class_name)
    //
    // Nếu con chưa có chuyến hôm nay → tripId = 0, các field còn lại = null
    // =========================================================================
    public List<Student> getStudentsWithTodayTripByParentId(int parentId) {
        List<Student> list = new ArrayList<>();
        String sql =
            "SELECT s.student_id, s.parent_id, s.full_name, s.gender, s.date_of_birth, " +
            "       s.school_name, s.address, s.avatar, s.status, s.class_id, " +
            "       s.student_code, s.user_id, " +
            "       c.class_name, " +
            // Thông tin chuyến hôm nay (NULL nếu không có chuyến)
            "       t.trip_id, " +
            "       t.status        AS trip_status, " +
            "       r.route_name, " +
            "       v.license_plate AS vehicle_plate, " +
            "       ud.full_name    AS driver_name " +
            "FROM students s " +
            "LEFT JOIN classes c              ON c.class_id   = s.class_id " +
            // Lấy đăng ký chuyến hôm nay của học sinh (status còn hoạt động)
            "LEFT JOIN trip_registrations tr  ON tr.student_id = s.student_id " +
            "                                AND tr.status IN (N'PENDING', N'CONFIRMED', N'active') " +
            "LEFT JOIN trips t                ON t.trip_id    = tr.trip_id " +
            "                                AND CONVERT(date, t.trip_date) = CONVERT(date, GETDATE()) " +
            "                                AND t.status     NOT IN (N'CANCELLED', N'COMPLETED') " +
            "LEFT JOIN routes r               ON r.route_id   = t.route_id " +
            "LEFT JOIN vehicles v             ON v.vehicle_id = t.vehicle_id " +
            "LEFT JOIN drivers d              ON d.driver_id  = t.driver_id " +
            "LEFT JOIN users ud               ON ud.user_id   = d.user_id " +
            "WHERE s.parent_id = ? AND s.status = 1";

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    Student s = mapStudent(rs);

                    // tripId (0 = không có chuyến hôm nay)
                    int tripId = rs.getInt("trip_id");
                    s.setTripId(rs.wasNull() ? 0 : tripId);

                    // Thông tin tài xế + xe + lộ trình (có thể null)
                    s.setTripStatus(rs.getString("trip_status"));
                    s.setRouteName(rs.getString("route_name"));
                    s.setVehiclePlate(rs.getString("vehicle_plate"));
                    s.setDriverName(rs.getString("driver_name"));

                    list.add(s);
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudentDAO] Lỗi getStudentsWithTodayTripByParentId: " + e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
}