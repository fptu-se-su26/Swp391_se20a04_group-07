package dao;

import model.DashboardStatistic;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DashboardDAO extends DBContext {
    
    // Hàm lấy thống kê tổng quan
    public DashboardStatistic getAdminStatistics() {
        DashboardStatistic stats = new DashboardStatistic();
        // Lấy tổng số học sinh
        try (PreparedStatement st = connection.prepareStatement("SELECT COUNT(*) FROM students WHERE status = 1"); ResultSet rs = st.executeQuery()) {
            if (rs.next()) stats.setTotalStudents(rs.getInt(1));
        } catch (SQLException e) { e.printStackTrace(); }
        
        // Lấy tổng số tài xế
        try (PreparedStatement st = connection.prepareStatement("SELECT COUNT(*) FROM drivers"); ResultSet rs = st.executeQuery()) {
            if (rs.next()) stats.setTotalDrivers(rs.getInt(1));
        } catch (SQLException e) { e.printStackTrace(); }

        // Lấy tổng số phương tiện
        try (PreparedStatement st = connection.prepareStatement("SELECT COUNT(*) FROM vehicles WHERE status = 1"); ResultSet rs = st.executeQuery()) {
            if (rs.next()) stats.setTotalVehicles(rs.getInt(1));
        } catch (SQLException e) { e.printStackTrace(); }

        // Lấy tổng số tuyến đường
        try (PreparedStatement st = connection.prepareStatement("SELECT COUNT(*) FROM routes WHERE status = 1"); ResultSet rs = st.executeQuery()) {
            if (rs.next()) stats.setTotalRoutes(rs.getInt(1));
        } catch (SQLException e) { e.printStackTrace(); }

        return stats;
    }

    // [ĐÃ BỔ SUNG] Lấy tổng số chuyến đi đã hoàn thành trong tháng hiện tại
    public int getCompletedTripsThisMonth() {
        String sql = "SELECT COUNT(*) FROM trips WHERE status = 'COMPLETED' AND MONTH(trip_date) = MONTH(GETDATE()) AND YEAR(trip_date) = YEAR(GETDATE())";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }
    
    // [BỔ SUNG] Hàm lấy tổng số lượng chung (Hỗ trợ lấy bảng Parents bị thiếu trong Model)
    public int getTotalCount(String tableName) {
        String sql = "SELECT COUNT(*) FROM " + tableName;
        if (!tableName.equals("drivers")) {
            sql += " WHERE status = 1"; // Đếm các bản ghi đang hoạt động
        }
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { System.out.println("Lỗi đếm bảng " + tableName); }
        return 0;
    }
    
    // [BỔ SUNG] Hàm lấy tổng phụ huynh riêng biệt an toàn
    public int getTotalParents() {
        // Lược bỏ điều kiện WHERE status = 1 để tránh lỗi nếu bảng không có cột này
        String sql = "SELECT COUNT(*) FROM parents"; 
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            System.out.println("Lỗi khi đếm bảng parents: " + e.getMessage());
        }
        return 0;
    }

    // [BỔ SUNG] Hàm đếm số bản ghi MỚI ĐƯỢC THÊM TRONG THÁNG NÀY (Thay cho số ảo 12, 8, 2...)
    public int getGrowthThisMonth(String tableName) {
        String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE MONTH(created_at) = MONTH(GETDATE()) AND YEAR(created_at) = YEAR(GETDATE())";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.out.println("Bảng " + tableName + " chưa có cột created_at để tính tăng trưởng.");
        }
        return 0;
    }
    
    // [ĐÃ BỔ SUNG] Lấy dữ liệu 6 tháng gần nhất để vẽ Biểu đồ
    public List<Integer> getTripsChartData() {
        List<Integer> data = new ArrayList<>();
        // Query đếm số chuyến đi hoàn thành nhóm theo tháng (6 tháng gần nhất)
        String sql = "SELECT TOP 6 MONTH(trip_date) AS M, COUNT(*) AS Total FROM trips "
                   + "WHERE status = 'COMPLETED' "
                   + "GROUP BY MONTH(trip_date), YEAR(trip_date) "
                   + "ORDER BY YEAR(trip_date) DESC, MONTH(trip_date) DESC";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                data.add(0, rs.getInt("Total")); // Add vào đầu list để sắp xếp từ cũ đến mới (trái sang phải trên biểu đồ)
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return data;
    }
    
    
}