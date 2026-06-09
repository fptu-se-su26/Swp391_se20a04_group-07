package dao;

import model.User;
import java.sql.*;

public class UserDAO extends DBContext {
    
    public User login(String email, String password) {
        String sql = "SELECT * FROM users WHERE email = ? AND password = ? AND status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email); st.setString(2, password);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return new User(rs.getInt("user_id"), rs.getString("full_name"), rs.getString("email"), 
                            rs.getString("password"), rs.getString("phone"), rs.getString("avatar"), 
                            rs.getInt("role_id"), rs.getBoolean("status"), rs.getTimestamp("created_at"));
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean insertUser(User u) {
        String sql = "INSERT INTO users (full_name, email, password, phone, avatar, role_id) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, u.getFullName()); st.setString(2, u.getEmail());
            st.setString(3, u.getPassword()); st.setString(4, u.getPhone());
            st.setString(5, u.getAvatar()); st.setInt(6, u.getRoleId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public User getUserByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) return new User(rs.getInt("user_id"), rs.getString("full_name"), rs.getString("email"), rs.getString("password"), rs.getString("phone"), rs.getString("avatar"), rs.getInt("role_id"), rs.getBoolean("status"), rs.getTimestamp("created_at"));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean updatePassword(int userId, String newPassword) {
        String sql = "UPDATE users SET password = ? WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, newPassword); st.setInt(2, userId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateUserProfile(int userId, String phone) {
        String sql = "UPDATE users SET phone = ? WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, phone); st.setInt(2, userId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    // --- HÀM MỚI BẮT BUỘC ĐỂ ADMIN THÊM TÀI KHOẢN ---
// Hàm tạo User và trả về ID
    public int insertUserAndReturnId(String email, String password, String phone, String fullName, int roleId) {
        String sql = "INSERT INTO users (full_name, email, password, phone, role_id, status) VALUES (?, ?, ?, ?, ?, 1)";
        try (PreparedStatement st = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            st.setString(1, fullName);
            st.setString(2, email);
            st.setString(3, password);
            st.setString(4, phone);
            st.setInt(5, roleId);
            
            if (st.executeUpdate() > 0) {
                try (ResultSet rs = st.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
        } catch (SQLException e) { 
            System.out.println("Lỗi tạo User (có thể do trùng Email): " + e.getMessage()); 
        }
        return -1;
    }
    
    // Hàm Rollback: Xóa User nếu tạo Driver thất bại
    public void deleteUser(int userId) {
        String sql = "DELETE FROM users WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            st.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }
}