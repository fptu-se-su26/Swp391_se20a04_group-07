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
            while (rs.next()) list.add(mapStudent(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

// Sửa lại hàm insertStudent trong StudentDAO.java
public boolean insertStudent(Student s) {
        // [ĐÃ SỬA] Thêm student_code vào câu lệnh SQL
        String sql = "INSERT INTO students (parent_id, student_code, full_name, gender, date_of_birth, school_name, class_id, address, avatar, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            
            if (s.getParentId() > 0) {
                st.setInt(1, s.getParentId());
            } else {
                st.setNull(1, java.sql.Types.INTEGER);
            }
            
            st.setString(2, s.getStudentCode()); // Bổ sung MSHS vào vị trí số 2
            st.setString(3, s.getFullName());
            st.setString(4, s.getGender());
            st.setDate(5, s.getDateOfBirth());
            st.setString(6, s.getSchoolName());
            st.setInt(7, s.getClassId());
            st.setString(8, s.getAddress());
            st.setString(9, s.getAvatar());
            
            return st.executeUpdate() > 0;
        } catch (SQLException e) { 
            System.out.println("====== LỖI INSERT HỌC SINH ======");
            e.printStackTrace(); 
        }
        return false;
    }

public Student getStudentById(int studentId) {
        String sql = "SELECT s.*, c.class_name, u.full_name AS parent_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                   + "LEFT JOIN users u ON p.user_id = u.user_id "
                   + "WHERE s.student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) return mapStudent(rs);
            }
        } catch (SQLException e) { e.printStackTrace(); }
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

// 1. Cập nhật hàm lấy học sinh theo Lớp (Hàm quan trọng nhất cho trang này)
    public List<Student> getStudentsByClassId(int classId) {
        List<Student> list = new ArrayList<>();
        // [ĐÃ SỬA]: JOIN thêm bảng parents và users để lấy tên phụ huynh
        String sql = "SELECT s.*, c.class_name, u.full_name AS parent_name "
                   + "FROM students s "
                   + "LEFT JOIN classes c ON s.class_id = c.class_id "
                   + "LEFT JOIN parents p ON s.parent_id = p.parent_id "
                   + "LEFT JOIN users u ON p.user_id = u.user_id "
                   + "WHERE s.class_id = ? AND s.status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, classId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) list.add(mapStudent(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

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
        try { s.setStudentCode(rs.getString("student_code")); } catch (SQLException e) {}
        
        s.setClassId(rs.getInt("class_id")); 
        s.setFullName(rs.getString("full_name"));
        s.setGender(rs.getString("gender"));
        s.setDateOfBirth(rs.getDate("date_of_birth"));
        s.setSchoolName(rs.getString("school_name"));
        s.setAddress(rs.getString("address"));
        s.setAvatar(rs.getString("avatar"));
        s.setStatus(rs.getBoolean("status"));

        try { s.setClassNameDisplay(rs.getString("class_name")); } catch (SQLException e) {}
        
        // [BỔ SUNG]: Bắt tên phụ huynh từ câu SQL
        try { s.setParentName(rs.getString("parent_name")); } catch (SQLException e) {}
        
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
    
    
}
