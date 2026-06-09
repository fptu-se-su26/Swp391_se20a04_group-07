package dao;

import model.Notification;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class NotificationDAO extends DBContext {

    /**
     * 1. Lấy danh sách thông báo của một User cụ thể (Dành cho phân hệ Phụ huynh / Cá nhân)
     */
    public List<Notification> getNotificationsByUserId(int userId) {
        List<Notification> list = new ArrayList<>();
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    Notification n = new Notification();
                    n.setNotificationId(rs.getInt("notification_id"));
                    n.setUserId(rs.getInt("user_id"));
                    n.setTitle(rs.getString("title"));
                    n.setMessage(rs.getString("message"));
                    n.setRead(rs.getBoolean("is_read"));
                    n.setCreatedAt(rs.getTimestamp("created_at"));
                    n.setNotificationType(rs.getString("notification_type")); // Lấy trường phân loại hệ thống
                    list.add(n);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 2. Lấy toàn bộ lịch sử thông báo kèm phân tích nhóm người nhận thực tế (Dành cho Admin)
     */
    public List<Notification> getAllNotifications() {
        List<Notification> list = new ArrayList<>();
        String sql = "SELECT n.*, "
                + "CASE "
                + "  WHEN d.user_id IS NOT NULL THEN 'DRIVER' "
                + "  WHEN p.user_id IS NOT NULL THEN 'PARENT' "
                + "  ELSE 'ADMIN' "
                + "END AS receiver_type "
                + "FROM notifications n "
                + "LEFT JOIN drivers d ON n.user_id = d.user_id "
                + "LEFT JOIN parents p ON n.user_id = p.user_id "
                + "ORDER BY n.created_at DESC";
        try (PreparedStatement st = connection.prepareStatement(sql); 
             ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Notification n = new Notification();
                n.setNotificationId(rs.getInt("notification_id"));
                n.setUserId(rs.getInt("user_id"));
                n.setTitle(rs.getString("title"));
                n.setMessage(rs.getString("message"));
                n.setRead(rs.getBoolean("is_read"));
                n.setCreatedAt(rs.getTimestamp("created_at"));
                n.setNotificationType(rs.getString("notification_type"));
                n.setReceiverType(rs.getString("receiver_type")); // Phân loại để hiển thị Tab/Badge trên giao diện Admin
                list.add(n);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 3. Gửi thông báo đích danh tới một cá nhân dựa vào User ID cụ thể
     */
    public boolean insertNotification(Notification n) {
        String sql = "INSERT INTO notifications (user_id, title, message, is_read, created_at, notification_type) VALUES (?, ?, ?, 0, GETDATE(), ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, n.getUserId());
            st.setString(2, n.getTitle());
            st.setString(3, n.getMessage());
            st.setString(4, n.getNotificationType() != null ? n.getNotificationType() : "SYSTEM");
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 4. Phát hành thông báo diện rộng (Broadcast) theo nhóm đối tượng chỉ định
     */
 // 1. CẬP NHẬT HÀM GỬI THÔNG BÁO HÀNG LOẠT (Phân loại rõ Râu ông nọ - Cằm bà kia)
    public boolean insertBroadcastNotification(String targetGroup, String title, String message) {
        String sql = "";
        if ("DRIVERS".equals(targetGroup)) {
            // [ĐÃ SỬA]: Đổi 'SYSTEM' thành 'DRIVER_SYS'
            sql = "INSERT INTO notifications (user_id, title, message, is_read, created_at, notification_type) "
                    + "SELECT user_id, ?, ?, 0, GETDATE(), 'DRIVER_SYS' FROM drivers";
        } else if ("PARENTS".equals(targetGroup)) {
            // [ĐÃ SỬA]: Đổi 'SYSTEM' thành 'PARENT_SYS'
            sql = "INSERT INTO notifications (user_id, title, message, is_read, created_at, notification_type) "
                    + "SELECT user_id, ?, ?, 0, GETDATE(), 'PARENT_SYS' FROM parents";
        } else if ("ALL".equals(targetGroup)) {
            // Gửi toàn trường thì dùng 'ALL_SYS'
            sql = "INSERT INTO notifications (user_id, title, message, is_read, created_at, notification_type) "
                    + "SELECT user_id, ?, ?, 0, GETDATE(), 'ALL_SYS' FROM drivers "
                    + "UNION "
                    + "SELECT user_id, ?, ?, 0, GETDATE(), 'ALL_SYS' FROM parents";
        } else {
            return false;
        }

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, title);
            st.setString(2, message);
            if ("ALL".equals(targetGroup)) {
                st.setString(3, title);
                st.setString(4, message);
            }
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("====== LỖI GỬI THÔNG BÁO HÀNG LOẠT ======");
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 5. Tổng hợp thông tin thông báo chuyên biệt hiển thị trên màn hình Tài xế
     */
    public List<Notification> getDriverNotifications(int userId, int driverId) {
        List<Notification> list = new ArrayList<>();
        
        // ĐÃ SỬA: Lấy động trường notification_type gốc từ DB thay vì gán cứng chuỗi 'ADMIN'
        String sql = "SELECT notification_id AS id, notification_type, title, message, created_at "
                + "FROM notifications WHERE user_id = ? "
                + "UNION ALL "
                + "SELECT lr.leave_request_id AS id, 'LEAVE' AS notification_type, "
                + "N'Học sinh nghỉ học: ' + s.full_name AS title, "
                + "N'Lý do: ' + ISNULL(lr.reason, N'Không có') AS message, lr.created_at "
                + "FROM leave_requests lr "
                + "JOIN students s ON lr.student_id = s.student_id "
                + "JOIN parents p ON s.parent_id = p.parent_id "
                + "JOIN parent_areas pa ON p.area_id = pa.area_id "
                + "JOIN trips t ON t.route_id = pa.area_id "
                + "WHERE t.driver_id = ? "
                + "AND CAST(t.trip_date AS DATE) = CAST(GETDATE() AS DATE) "
                + "AND CAST(lr.leave_date AS DATE) = CAST(GETDATE() AS DATE) "
                + "AND lr.status = 'APPROVED' "
                + "ORDER BY created_at DESC";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, driverId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Notification n = new Notification();
                    n.setNotificationId(rs.getInt("id"));
                    n.setNotificationType(rs.getString("notification_type"));
                    n.setTitle(rs.getString("title"));
                    n.setMessage(rs.getString("message"));
                    n.setCreatedAt(rs.getTimestamp("created_at"));
                    n.setRead(false);
                    list.add(n);
                }
            }
        } catch (SQLException e) {
            System.out.println("====== LỖI Ở NOTIFICATION DAO (DRIVER) ======");
            e.printStackTrace();
        }
        return list;
    }
    
    // 2. THÊM HÀM MỚI DÀNH RIÊNG CHO PHỤ HUYNH
    public List<Notification> getParentNotifications(int userId) {
        List<Notification> list = new ArrayList<>();
        // Màng lọc: Lấy thông báo của user này, NHƯNG phải LOẠI BỎ các thông báo gửi riêng cho Tài xế ('DRIVER_SYS')
        String sql = "SELECT * FROM notifications WHERE user_id = ? "
                   + "AND (notification_type IS NULL OR notification_type NOT IN ('DRIVER_SYS')) "
                   + "ORDER BY created_at DESC";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    Notification n = new Notification();
                    n.setNotificationId(rs.getInt("notification_id"));
                    n.setUserId(rs.getInt("user_id"));
                    n.setTitle(rs.getString("title"));
                    n.setMessage(rs.getString("message"));
                    n.setRead(rs.getBoolean("is_read"));
                    n.setCreatedAt(rs.getTimestamp("created_at"));
                    n.setNotificationType(rs.getString("notification_type"));
                    list.add(n);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}