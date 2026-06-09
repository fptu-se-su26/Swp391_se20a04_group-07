package dao;

import model.Student;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentDAO extends DBContext {

// 2. Cập nhật hàm lấy tất cả học sinh
    public List<Student> getAllStudents() {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name, u.full_name AS parent_name "
                + "FROM students s "
                + "LEFT JOIN classes c ON s.class_id = c.class_id "
                + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                + "LEFT JOIN users u ON p.user_id = u.user_id "
                + "WHERE s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(mapStudent(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

// Sửa lại hàm insertStudent trong StudentDAO.java
    public boolean insertStudent(Student s) {
        // [ĐÃ BỔ SUNG]: Thêm user_id và student_code vào SQL
        String sql = "INSERT INTO students (parent_id, user_id, student_code, full_name, gender, date_of_birth, school_name, class_id, address, avatar, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {

            // 1. Xử lý Parent ID
            if (s.getParentId() > 0) {
                st.setInt(1, s.getParentId());
            } else {
                st.setNull(1, java.sql.Types.INTEGER);
            }

            // 2. Xử lý User ID của Học sinh (Tài khoản đăng nhập)
            if (s.getUserId() > 0) {
                st.setInt(2, s.getUserId());
            } else {
                st.setNull(2, java.sql.Types.INTEGER);
            }

            // Các dữ liệu còn lại
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
            System.out.println("====== LỖI INSERT HỌC SINH ======");
            e.printStackTrace();
        }
        return false;
    }

    public Student getStudentById(int studentId) {
        String sql = "SELECT s.*, c.class_name, u.full_name AS parent_name, p.phone AS parent_phone, p.emergency_phone "
                + "FROM students s "
                + "LEFT JOIN classes c ON s.class_id = c.class_id "
                + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                + "LEFT JOIN users u ON p.user_id = u.user_id "
                + "WHERE s.student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Student s = new Student();
                    s.setStudentId(rs.getInt("student_id"));
                    s.setParentId(rs.getInt("parent_id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setStudentCode(rs.getString("student_code"));
                    s.setFullName(rs.getString("full_name"));
                    s.setGender(rs.getString("gender"));
                    s.setDateOfBirth(rs.getDate("date_of_birth"));
                    s.setSchoolName(rs.getString("school_name"));
                    s.setClassId(rs.getInt("class_id"));
                    s.setAddress(rs.getString("address"));
                    s.setAvatar(rs.getString("avatar"));
                    s.setStatus(rs.getBoolean("status"));
                    s.setParentName(rs.getString("parent_name"));

                    // Nạp 2 số điện thoại lên Model
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

    public List<Student> getStudentsByParentId(int parentId) {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name FROM students s LEFT JOIN classes c ON s.class_id = c.class_id WHERE s.parent_id = ? AND s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(mapStudent(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Student> getStudentsByTripId(int tripId) {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT s.*, c.class_name FROM students s JOIN attendance a ON s.student_id = a.student_id LEFT JOIN classes c ON s.class_id = c.class_id WHERE a.trip_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(mapStudent(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

// =========================================================================
    // HÀM BỔ TRỢ: LẤY TÊN KHU VỰC DỰA VÀO PARENT ID (ÁNH XẠ TỪ PARENT DAO)
    // =========================================================================
    private String getAreaNameByParentId(int parentId) {
        if (parentId <= 0) {
            return "Chưa xác định";
        }

        // Câu lệnh này quét bảng parents JOIN areas theo ParentID
        String sql = "SELECT a.area_name FROM parents p JOIN areas a ON p.area_id = a.area_id WHERE p.parent_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("area_name");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "Chưa xác định";
    }

// =========================================================================
    // LẤY DANH SÁCH HỌC SINH THEO LỚP (ÉP HIỂN THỊ ĐÚNG TÊN PHỤ HUYNH & KHU VỰC)
    // =========================================================================
    public List<Student> getStudentsByClassId(int classId) {
        List<Student> list = new ArrayList<>();
        
        // Câu lệnh SQL chuẩn đảm bảo lấy u.full_name làm parent_name từ bảng users
        String sql = "SELECT s.*, c.class_name, u.full_name AS parent_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                   + "LEFT JOIN users u ON p.user_id = u.user_id "
                   + "WHERE s.class_id = ? AND s.status = 1";
                   
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, classId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    // 1. Gọi hàm mapStudent(rs) gốc của bạn để nạp các thông số học sinh
                    Student s = mapStudent(rs);
                    
                    if (s != null) {
                        // 2. GIẢI PHÁP CHỮA LỖI: Lấy trực tiếp cột parent_name từ câu lệnh JOIN công khai
                        // Đoạn này sẽ ghi đè hoàn toàn chữ "Phụ huynh của..." đang bị tự động gán trong mapStudent
                        String realParentName = rs.getString("parent_name");
                        if (realParentName != null && !realParentName.trim().isEmpty()) {
                            s.setParentName(realParentName); // Đưa tên thật (Ví dụ: Nguyễn Văn A) vào đối tượng
                        } else {
                            s.setParentName("Chưa liên kết");
                        }
                        
                        // 3. Lấy mã parent_id thực tế để tra cứu tiếp Khu vực đưa đón
                        int parentId = rs.getInt("parent_id");
                        String areaName = getAreaNameByParentId(parentId);
                        s.setAreaName(areaName);
                        
                        list.add(s);
                    }
                }
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return list;
    }

// =========================================================================
    // XÓA MỀM HỌC SINH (CHUYỂN TRẠNG THÁI STATUS THÀNH 0 ĐỂ BẢO TOÀN KHÓA NGOẠI)
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

    public boolean updateStudent(Student s) {
        // Câu lệnh SQL đầy đủ 9 tham số
        String sql = "UPDATE students SET student_code=?, full_name=?, gender=?, date_of_birth=?, school_name=?, class_id=?, address=?, status=? WHERE student_id=?";
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

    private Student mapStudent(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setStudentId(rs.getInt("student_id"));
        s.setParentId(rs.getInt("parent_id"));

        // [MỚI BỔ SUNG]: Đọc Mã số học sinh (MSHS) từ Database
        try {
            s.setStudentCode(rs.getString("student_code"));
        } catch (SQLException e) {
        }

        s.setClassId(rs.getInt("class_id"));
        s.setFullName(rs.getString("full_name"));
        s.setGender(rs.getString("gender"));
        s.setDateOfBirth(rs.getDate("date_of_birth"));
        s.setSchoolName(rs.getString("school_name"));
        s.setAddress(rs.getString("address"));
        s.setAvatar(rs.getString("avatar"));
        s.setStatus(rs.getBoolean("status"));

        try {
            s.setClassNameDisplay(rs.getString("class_name"));
        } catch (SQLException e) {
        }

        // [BỔ SUNG]: Bắt tên phụ huynh từ câu SQL
        try {
            s.setParentName(rs.getString("parent_name"));
        } catch (SQLException e) {
        }

        return s;
    }

    public List<Student> getStudentsByTripArea(int tripId) {
        List<Student> list = new ArrayList<>();

        // Bỏ JOIN classes vì students đã có class_name trực tiếp
// Thay dòng JOIN classes
// ❌ JOIN classes c ON s.class_id = c.class_id  -- Bỏ dòng này
// ✅ Lấy class_name trực tiếp từ bảng students
        String sql = "SELECT s.*, s.class_name AS class_name_display "
                + "FROM students s "
                + "JOIN parents p ON s.parent_id = p.parent_id "
                + "JOIN parent_areas pa ON p.area_id = pa.area_id "
                + "JOIN trips t ON t.trip_id = ? "
                + "JOIN routes r ON t.route_id = r.route_id "
                + "WHERE pa.area_name LIKE N'%' + LTRIM(RTRIM(r.start_location)) + N'%' "
                + "  AND s.status = 1";

        try (Connection conn = DBContext.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, tripId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Student s = new Student();
                s.setStudentId(rs.getInt("student_id"));
                s.setParentId(rs.getInt("parent_id"));
                s.setFullName(rs.getString("full_name"));
                s.setGender(rs.getString("gender"));
                s.setSchoolName(rs.getString("school_name"));
                s.setAddress(rs.getString("address"));
                s.setAvatar(rs.getString("avatar"));
                s.setStatus(rs.getBoolean("status"));

                try {
                    s.setDateOfBirth(rs.getDate("date_of_birth"));
                } catch (Exception e) {
                    s.setDateOfBirth(null);
                }

                // Lấy class_name trực tiếp từ bảng students
                s.setClassNameDisplay(rs.getString("class_name_display"));
                s.setClassName(rs.getString("class_name_display"));
                list.add(s);
            }

            System.out.println(">>> Số học sinh tìm được: " + list.size()); // Log debug

        } catch (Exception e) {
            System.out.println("====== LỖI getStudentsByTripArea ======");
            e.printStackTrace(); // Xem lỗi thật trong Tomcat console
        }
        return list;
    }
    // Hàm này tự động gắn Parent ID cho Học sinh

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

//STUDENT
// =========================================================================
    // LẤY HỒ SƠ HỌC SINH TỪ TÀI KHOẢN ĐĂNG NHẬP (USER ID)
    // =========================================================================
    public Student getStudentByUserId(int userId) {
        String sql = "SELECT s.*, c.class_name "
                + "FROM students s "
                + "LEFT JOIN classes c ON s.class_id = c.class_id "
                + "WHERE s.user_id = ? AND s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return mapStudent(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

}
