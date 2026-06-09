package dao;

import model.Vehicle;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VehicleDAO extends DBContext {

    public List<Vehicle> getAllVehicles() {
        List<Vehicle> list = new ArrayList<>();
        String sql = "SELECT * FROM vehicles"; 
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(new Vehicle(
                        rs.getInt("vehicle_id"),
                        rs.getString("license_plate"), // Đã fix tên cột
                        rs.getInt("seat_capacity"),
                        rs.getString("vehicle_name"),  // Đã fix tên cột
                        rs.getInt("status") == 1 ? "Hoạt động" : "Bảo trì"
                ));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public List<Vehicle> getAllActiveVehicles() {
        List<Vehicle> list = new ArrayList<>();
        String sql = "SELECT * FROM vehicles WHERE status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(new Vehicle(
                        rs.getInt("vehicle_id"),
                        rs.getString("license_plate"), 
                        rs.getInt("seat_capacity"),
                        rs.getString("vehicle_name"), 
                        "Hoạt động"
                ));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public Vehicle getVehicleById(int vehicleId) {
        String sql = "SELECT * FROM vehicles WHERE vehicle_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, vehicleId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return new Vehicle(
                            rs.getInt("vehicle_id"),
                            rs.getString("license_plate"),
                            rs.getInt("seat_capacity"),
                            rs.getString("vehicle_name"),
                            rs.getInt("status") == 1 ? "Hoạt động" : "Bảo trì"
                    );
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean insertVehicle(Vehicle v) {
        String sql = "INSERT INTO vehicles (license_plate, seat_capacity, vehicle_name, status) VALUES (?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, v.getPlateNumber());
            st.setInt(2, v.getSeatCapacity());
            st.setString(3, v.getVehicleType());
            st.setInt(4, (v.getStatus() != null && v.getStatus().equals("Hoạt động")) ? 1 : 0);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateVehicle(Vehicle v) {
        String sql = "UPDATE vehicles SET license_plate=?, seat_capacity=?, vehicle_name=?, status=? WHERE vehicle_id=?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, v.getPlateNumber());
            st.setInt(2, v.getSeatCapacity());
            st.setString(3, v.getVehicleType());
            st.setInt(4, (v.getStatus() != null && v.getStatus().equals("Hoạt động")) ? 1 : 0);
            st.setInt(5, v.getVehicleId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteVehicle(int vehicleId) {
        String sql = "UPDATE vehicles SET status = 0 WHERE vehicle_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, vehicleId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
}