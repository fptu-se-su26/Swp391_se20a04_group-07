package dao;
import model.Route;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RouteDAO extends DBContext {
    
// Lấy tất cả tuyến đường (ĐÃ SỬA LỖI JOIN: Phải liên kết qua bảng users để lấy full_name)
    public List<Route> getAllRoutes() {
        List<Route> list = new ArrayList<>();
        String sql = "SELECT r.*, u.full_name AS driver_name "
                   + "FROM routes r "
                   + "LEFT JOIN drivers d ON r.driver_id = d.driver_id "
                   + "LEFT JOIN users u ON d.user_id = u.user_id";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Route r = new Route(rs.getInt("route_id"), rs.getString("route_name"), rs.getString("start_location"),
                        rs.getString("end_location"), rs.getTime("pickup_time"), rs.getTime("dropoff_time"), rs.getBoolean("status"));
                r.setDriverId(rs.getInt("driver_id"));
                r.setDriverName(rs.getString("driver_name"));
                list.add(r);
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return list;
    }

    // Thêm tuyến đường mới (Đã bổ sung driver_id)
    public boolean insertRoute(Route r) {
        String sql = "INSERT INTO routes (route_name, start_location, end_location, pickup_time, dropoff_time, driver_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, r.getRouteName()); 
            st.setString(2, r.getStartLocation());
            st.setString(3, r.getEndLocation()); 
            st.setTime(4, r.getPickupTime());
            st.setTime(5, r.getDropoffTime()); 
            st.setInt(6, r.getDriverId());
            st.setBoolean(7, r.isStatus());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
    
    // Lấy 1 tuyến đường theo ID để fill vào form Edit
    public Route getRouteById(int routeId) {
        String sql = "SELECT * FROM routes WHERE route_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, routeId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Route r = new Route(rs.getInt("route_id"), rs.getString("route_name"), rs.getString("start_location"),
                        rs.getString("end_location"), rs.getTime("pickup_time"), rs.getTime("dropoff_time"), rs.getBoolean("status"));
                    r.setDriverId(rs.getInt("driver_id"));
                    return r;
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    // Cập nhật tuyến đường (Đã bổ sung driver_id)
    public boolean updateRoute(Route r) {
        String sql = "UPDATE routes SET route_name=?, start_location=?, end_location=?, pickup_time=?, dropoff_time=?, driver_id=?, status=? WHERE route_id=?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, r.getRouteName()); 
            st.setString(2, r.getStartLocation());
            st.setString(3, r.getEndLocation()); 
            st.setTime(4, r.getPickupTime());
            st.setTime(5, r.getDropoffTime()); 
            st.setInt(6, r.getDriverId());
            st.setBoolean(7, r.isStatus());
            st.setInt(8, r.getRouteId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteRoute(int routeId) {
        String sql = "UPDATE routes SET status = 0 WHERE route_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, routeId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
    
    // =========================================================================
    // HÀM LẤY DANH SÁCH KHU VỰC ĐỂ ĐỔ VÀO DROPDOWN TÊN TUYẾN
    // =========================================================================
    public List<Map<String, Object>> getAllAreasForDropdown() {
        List<Map<String, Object>> list = new ArrayList<>();
        // LƯU Ý: Nếu bảng khu vực của bạn tên khác (VD: areas, district...), hãy đổi chữ 'parent_areas' nhé
        String sql = "SELECT area_id, area_name FROM parent_areas"; 
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("area_id", rs.getInt("area_id"));
                map.put("area_name", rs.getString("area_name"));
                list.add(map);
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return list;
    }
}