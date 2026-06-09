package dao;

import model.Trip;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TripDAO extends DBContext {

    // Hàm cũ
    public List<Trip> getTripsByDriver(int driverId) {
        List<Trip> list = new ArrayList<>();
        String sql = "SELECT * FROM trips WHERE driver_id = ? ORDER BY trip_date DESC";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, driverId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(mapTrip(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Trip getTripById(int tripId) {
        String sql = "SELECT * FROM trips WHERE trip_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return mapTrip(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateTripStatus(int tripId, String status) {
        String sql = "UPDATE trips SET status = ? WHERE trip_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, status);
            st.setInt(2, tripId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // [BỔ SUNG] Lấy toàn bộ chuyến đi (Cho Admin quản lý)
// [ĐÃ NÂNG CẤP] Sử dụng LEFT JOIN để lấy Tên tuyến và Tên tài xế
    public List<Trip> getAllTrips() {
        List<Trip> list = new ArrayList<>();
        // Giả sử bảng users lưu tên tài xế (full_name) và routes lưu tên tuyến (route_name)
        String sql = "SELECT t.*, u.full_name AS driver_name, r.route_name "
                + "FROM trips t "
                + "LEFT JOIN drivers d ON t.driver_id = d.driver_id "
                + "LEFT JOIN users u ON d.user_id = u.user_id "
                + "LEFT JOIN routes r ON t.route_id = r.route_id "
                + "ORDER BY t.trip_date DESC";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Trip t = mapTrip(rs);
                // Gán tên vào object
                try {
                    t.setDriverName(rs.getString("driver_name"));
                } catch (Exception e) {
                }
                try {
                    t.setRouteName(rs.getString("route_name"));
                } catch (Exception e) {
                }
                list.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // =========================================================================
    // LẤY TẤT CẢ CHUYẾN ĐI KHẢ DỤNG CHO HỌC SINH ĐĂNG KÝ (CÓ JOIN LẤY TÊN)
    // =========================================================================
    public List<Trip> getAllAvailableTrips() {
        List<Trip> list = new ArrayList<>();
        String sql = "SELECT t.*, r.route_name, u.full_name AS driver_name "
                + "FROM trips t "
                + "LEFT JOIN routes r ON t.route_id = r.route_id "
                + "LEFT JOIN drivers d ON t.driver_id = d.driver_id "
                + "LEFT JOIN users u ON d.user_id = u.user_id "
                + "WHERE t.status = 'ACTIVE' OR t.status = 'PENDING' "
                + "ORDER BY t.trip_date ASC, t.start_time ASC";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Trip trip = new Trip();
                trip.setTripId(rs.getInt("trip_id"));
                trip.setRouteId(rs.getInt("route_id"));
                trip.setVehicleId(rs.getInt("vehicle_id"));
                trip.setDriverId(rs.getInt("driver_id"));
                trip.setTripDate(rs.getDate("trip_date"));
                trip.setTripType(rs.getString("trip_type"));
                trip.setStartTime(rs.getTimestamp("start_time"));
                trip.setEndTime(rs.getTimestamp("end_time"));
                trip.setStatus(rs.getString("status"));

                // Gán thuộc tính hiển thị (DTO)
                trip.setRouteName(rs.getString("route_name"));
                trip.setDriverName(rs.getString("driver_name"));

                list.add(trip);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

// =========================================================================
    // CÁC HÀM XỬ LÝ ĐĂNG KÝ CHUYẾN ĐI (Dành cho chức năng của Học sinh)
    // =========================================================================
    // 1. Học sinh đăng ký chuyến đi
    public boolean registerTrip(int tripId, int studentId) {
        String sql = "INSERT INTO trip_registrations (trip_id, student_id, status) VALUES (?, ?, 'REGISTERED')";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            st.setInt(2, studentId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Lỗi đăng ký chuyến đi: " + e.getMessage());
        }
        return false;
    }

    // 2. Học sinh hủy đăng ký chuyến đi
    public boolean cancelRegistration(int tripId, int studentId) {
        String sql = "DELETE FROM trip_registrations WHERE trip_id = ? AND student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            st.setInt(2, studentId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // 3. Kiểm tra xem Học sinh đã đăng ký chuyến này chưa (Để ẩn/hiện nút Đăng ký trên JSP)
    public boolean isStudentRegistered(int tripId, int studentId) {
        String sql = "SELECT 1 FROM trip_registrations WHERE trip_id = ? AND student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, tripId);
            st.setInt(2, studentId);
            try (ResultSet rs = st.executeQuery()) {
                return rs.next(); // Nếu có dòng dữ liệu trả về nghĩa là đã đăng ký
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // [BỔ SUNG] Hàm cập nhật Chuyến đi
    public boolean updateTrip(Trip t) {
        String sql = "UPDATE trips SET route_id=?, vehicle_id=?, driver_id=?, trip_date=?, trip_type=?, status=? WHERE trip_id=?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, t.getRouteId());
            st.setInt(2, t.getVehicleId());
            st.setInt(3, t.getDriverId());
            st.setDate(4, t.getTripDate());
            st.setString(5, t.getTripType());
            st.setString(6, t.getStatus());
            st.setInt(7, t.getTripId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    // Lấy danh sách ID các chuyến đi mà một học sinh đã đăng ký
    public List<Integer> getRegisteredTripIdsByStudent(int studentId) {
        List<Integer> list = new ArrayList<>();
        String sql = "SELECT trip_id FROM trip_registrations WHERE student_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, studentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(rs.getInt("trip_id"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // [BỔ SUNG] Tạo chuyến đi mới (Admin)
    public boolean insertTrip(Trip t) {
        String sql = "INSERT INTO trips (route_id, vehicle_id, driver_id, trip_date, trip_type, status) VALUES (?, ?, ?, ?, ?, 'PENDING')";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, t.getRouteId());
            st.setInt(2, t.getVehicleId());
            st.setInt(3, t.getDriverId());
            st.setDate(4, t.getTripDate());
            st.setString(5, t.getTripType());
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // =========================================================================
    // CÁC HÀM BỔ SUNG LẤY DỮ LIỆU ĐỔ VÀO DROPDOWN (SELECT BOX) TRÊN GIAO DIỆN
    // =========================================================================
    public List<Map<String, Object>> getAllRoutesForDropdown() {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT route_id, route_name, driver_id FROM routes";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("route_id", rs.getInt("route_id"));
                map.put("route_name", rs.getString("route_name"));
                map.put("driver_id", rs.getInt("driver_id"));
                list.add(map);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Map<String, Object>> getAllVehiclesForDropdown() {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT vehicle_id, vehicle_name, license_plate FROM vehicles";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("vehicle_id", rs.getInt("vehicle_id"));
                map.put("vehicle_name", rs.getString("vehicle_name"));
                map.put("license_plate", rs.getString("license_plate"));
                list.add(map);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Map<String, Object>> getAllDriversForDropdown() {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT d.driver_id, u.full_name FROM drivers d JOIN users u ON d.user_id = u.user_id";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("driver_id", rs.getInt("driver_id"));
                map.put("full_name", rs.getString("full_name"));
                list.add(map);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    private Trip mapTrip(ResultSet rs) throws SQLException {
        return new Trip(rs.getInt("trip_id"), rs.getInt("route_id"), rs.getInt("vehicle_id"), rs.getInt("driver_id"),
                rs.getDate("trip_date"), rs.getString("trip_type"), rs.getTimestamp("start_time"), rs.getTimestamp("end_time"), rs.getString("status"));
    }
}
