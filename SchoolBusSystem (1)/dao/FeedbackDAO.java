package dao;

import model.Feedback;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FeedbackDAO extends DBContext {

    // Hàm thêm góp ý (Cho Parent)
    public boolean insertFeedback(Feedback f) {
        String sql = "INSERT INTO feedbacks (user_id, subject, content) VALUES (?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, f.getUserId());
            st.setString(2, f.getSubject());
            st.setString(3, f.getContent());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // [ĐÃ BỔ SUNG] Lấy toàn bộ danh sách góp ý (Cho Admin)
    public List<Feedback> getAllFeedbacks() {
        List<Feedback> list = new ArrayList<>();
        // ĐÃ FIX: Sửa tên bảng thành 'feedbacks' và dùng LEFT JOIN để hiển thị dữ liệu an toàn nhất
        String sql = "SELECT f.*, p.parent_id, u.full_name AS parent_name, "
                + "(SELECT s.full_name + ', ' "
                + " FROM students s "
                + " WHERE s.parent_id = p.parent_id "
                + " FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)') AS student_names "
                + "FROM feedbacks f "
                + "LEFT JOIN users u ON f.user_id = u.user_id "
                + "LEFT JOIN parents p ON u.user_id = p.user_id "
                + "ORDER BY f.created_at DESC";

        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {

            while (rs.next()) {
                Feedback fb = new Feedback();

                // Lấy thông tin cơ bản (Đã khớp với tên cột trong DB của bạn)
                fb.setFeedbackId(rs.getInt("feedback_id"));
                fb.setUserId(rs.getInt("user_id"));
                fb.setSubject(rs.getString("subject"));
                fb.setContent(rs.getString("content"));
                fb.setCreatedAt(rs.getTimestamp("created_at"));

                // Lấy thông tin bổ sung (Dùng biến tạm để tránh lỗi Null)
                int parentId = rs.getInt("parent_id");
                fb.setParentId(parentId);

                String pName = rs.getString("parent_name");
                fb.setParentName(pName != null ? pName : "User #" + fb.getUserId());

                // Cắt dấu phẩy thừa ở chuỗi tên học sinh
                String students = rs.getString("student_names");
                if (students != null && students.endsWith(", ")) {
                    students = students.substring(0, students.length() - 2);
                }
                fb.setStudentNames(students);

                list.add(fb);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
