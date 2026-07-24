package dao;
import model.RouteStop;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RouteStopDAO extends DBContext {
    public List<RouteStop> getStopsByRouteId(int routeId) {
        List<RouteStop> list = new ArrayList<>();
        String sql = "SELECT * FROM route_stops WHERE route_id = ? ORDER BY stop_order ASC";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, routeId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) list.add(new RouteStop(rs.getInt("stop_id"), rs.getInt("route_id"), rs.getString("stop_name"), rs.getInt("stop_order"), rs.getTime("estimated_time")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
    // [BỔ SUNG] Thêm điểm dừng mới
    public boolean insertStop(RouteStop stop) {
        String sql = "INSERT INTO route_stops (route_id, stop_name, stop_order, estimated_time) VALUES (?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, stop.getRouteId()); st.setString(2, stop.getStopName());
            st.setInt(3, stop.getStopOrder()); st.setTime(4, stop.getEstimatedTime());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    // [BỔ SUNG] Xóa điểm dừng
    public boolean deleteStop(int stopId) {
        String sql = "DELETE FROM route_stops WHERE stop_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, stopId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
}