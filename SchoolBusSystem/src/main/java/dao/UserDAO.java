package dao;

import model.User;
import java.sql.*;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * UserDAO - Xử lý toàn bộ nghiệp vụ liên quan đến bảng users.
 *
 * BẢO MẬT:
 *  - Mật khẩu được băm bằng SHA-256 + Salt ngẫu nhiên (format: salt:hash)
 *  - Tương thích ngược với mật khẩu cũ: plaintext → SHA-256 thuần → salt+SHA-256
 *  - AUTO-UPGRADE: khi user login bằng mật khẩu cũ, tự động nâng lên format mới
 *  - Không lưu mật khẩu plaintext vào DB
 *  - Mọi truy vấn đều dùng PreparedStatement (chống SQL Injection)
 */
public class UserDAO extends DBContext {

    // =========================================================================
    // BẢO MẬT: HASH MẬT KHẨU VỚI SALT
    // Format lưu DB: "<base64_salt>:<hex_hash>"
    // =========================================================================
    private String generateSalt() {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public String hashPassword(String plainPassword) {
        try {
            String salt = generateSalt();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hashBytes = digest.digest(plainPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hashBytes) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) hex.append('0');
                hex.append(h);
            }
            return salt + ":" + hex;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống khi mã hóa mật khẩu", e);
        }
    }

    /**
     * Xác minh mật khẩu — hỗ trợ 3 tầng tương thích ngược:
     *   1. Format mới:  "salt:sha256(salt+password)"
     *   2. Format cũ:   sha256(password)  — không salt
     *   3. Plaintext:   "123", "123456"  — dữ liệu cũ trong DB
     */
    public boolean verifyPassword(String plainPassword, String storedValue) {
        if (storedValue == null || storedValue.isEmpty()) return false;

        // Tầng 1: Format mới "salt:hash"
        if (storedValue.contains(":")) {
            String[] parts = storedValue.split(":", 2);
            String salt = parts[0];
            String storedHash = parts[1];
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                digest.update(salt.getBytes(StandardCharsets.UTF_8));
                byte[] hashBytes = digest.digest(plainPassword.getBytes(StandardCharsets.UTF_8));
                StringBuilder hex = new StringBuilder();
                for (byte b : hashBytes) {
                    String h = Integer.toHexString(0xff & b);
                    if (h.length() == 1) hex.append('0');
                    hex.append(h);
                }
                return storedHash.equals(hex.toString());
            } catch (Exception e) {
                return false;
            }
        }

        // Tầng 2: SHA-256 thuần không salt (64 ký tự hex)
        if (storedValue.length() == 64) {
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hashBytes = digest.digest(plainPassword.getBytes(StandardCharsets.UTF_8));
                StringBuilder hex = new StringBuilder();
                for (byte b : hashBytes) {
                    String h = Integer.toHexString(0xff & b);
                    if (h.length() == 1) hex.append('0');
                    hex.append(h);
                }
                if (storedValue.equals(hex.toString())) return true;
            } catch (Exception e) {
                // fallthrough
            }
        }

        // Tầng 3: Plaintext cũ ("123", "123456", v.v.)
        // Dùng MessageDigest.isEqual để tránh timing attack
        return MessageDigest.isEqual(
            storedValue.getBytes(StandardCharsets.UTF_8),
            plainPassword.getBytes(StandardCharsets.UTF_8)
        );
    }

    // =========================================================================
    // ĐĂNG NHẬP - Hỗ trợ mật khẩu cũ + tự động nâng cấp hash
    // =========================================================================
    public User login(String email, String plainPassword) {
        String sql = "SELECT * FROM users WHERE email = ? AND status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    String storedPassword = rs.getString("password");
                    if (verifyPassword(plainPassword, storedPassword)) {
                        User user = mapUser(rs);

                        // AUTO-UPGRADE: mật khẩu cũ (plaintext hoặc SHA-256 không salt)
                        // → tự động nâng cấp lên salt+SHA-256 ngay khi login thành công
                        boolean isLegacy = !storedPassword.contains(":");
                        if (isLegacy) {
                            upgradePassword(user.getUserId(), hashPassword(plainPassword));
                            System.out.println("[UserDAO] Nâng cấp mật khẩu cho user_id=" + user.getUserId());
                        }

                        return user;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** Nội bộ: cập nhật hash mật khẩu khi auto-upgrade */
    private void upgradePassword(int userId, String newHash) {
        String sql = "UPDATE users SET password = ? WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, newHash);
            st.setInt(2, userId);
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // THÊM USER - Trả về ID, tự hash mật khẩu
    // =========================================================================
    public int insertUserAndReturnId(String email, String plainPassword, String phone, String fullName, int roleId) {
        if (getUserIdByEmail(email) > 0) {
            System.out.println("[UserDAO] Email đã tồn tại: " + email);
            return -1;
        }

        String hashedPassword = hashPassword(plainPassword);
        String sql = "INSERT INTO users (full_name, email, password, phone, role_id, status) "
                   + "VALUES (?, ?, ?, ?, ?, 1)";
        try (PreparedStatement st = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            st.setString(1, sanitize(fullName));
            st.setString(2, email.trim().toLowerCase());
            st.setString(3, hashedPassword);
            st.setString(4, sanitize(phone));
            st.setInt(5, roleId);

            if (st.executeUpdate() > 0) {
                try (ResultSet rs = st.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            System.out.println("[UserDAO] Lỗi insertUser: " + e.getMessage());
        }
        return -1;
    }

    // =========================================================================
    // CẬP NHẬT MẬT KHẨU - Hash trước khi lưu
    // =========================================================================
    public boolean updatePassword(int userId, String newPlainPassword) {
        String hashed = hashPassword(newPlainPassword);
        String sql = "UPDATE users SET password = ? WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, hashed);
            st.setInt(2, userId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // CÁC HÀM TRUY VẤN THÔNG THƯỜNG
    // =========================================================================
    public User getUserByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ? AND status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) return mapUser(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public int getUserIdByEmail(String email) {
        String sql = "SELECT user_id FROM users WHERE email = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) return rs.getInt("user_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public boolean updateUserProfile(int userId, String phone) {
        String sql = "UPDATE users SET phone = ? WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, sanitize(phone));
            st.setInt(2, userId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public void deleteUser(int userId) {
        String sql = "DELETE FROM users WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean insertUser(User u) {
        String sql = "INSERT INTO users (full_name, email, password, phone, avatar, role_id) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, sanitize(u.getFullName()));
            st.setString(2, u.getEmail().trim().toLowerCase());
            st.setString(3, hashPassword(u.getPassword()));
            st.setString(4, sanitize(u.getPhone()));
            st.setString(5, u.getAvatar());
            st.setInt(6, u.getRoleId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // HELPER
    // =========================================================================
    private User mapUser(ResultSet rs) throws SQLException {
        return new User(
            rs.getInt("user_id"),
            rs.getString("full_name"),
            rs.getString("email"),
            rs.getString("password"),
            rs.getString("phone"),
            rs.getString("avatar"),
            rs.getInt("role_id"),
            rs.getBoolean("status"),
            rs.getTimestamp("created_at")
        );
    }

    private String sanitize(String input) {
        if (input == null) return "";
        return input.trim()
                    .replaceAll("[\\x00-\\x1F\\x7F]", "")
                    .substring(0, Math.min(input.trim().length(), 255));
    }
}