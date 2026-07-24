package dao;

import model.Driver;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DriverDAO extends DBContext {

    public Driver getDriverByUserId(int userId) {
        String sql = "SELECT d.*, a.area_name, v.license_plate FROM drivers d "
                + "LEFT JOIN parent_areas a ON d.area_id = a.area_id "
                + "LEFT JOIN vehicles v ON d.vehicle_id = v.vehicle_id "
                + "WHERE d.user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Driver d = new Driver(rs.getInt("driver_id"), rs.getInt("user_id"), rs.getString("license_number"),
                            rs.getInt("experience_years"), rs.getString("full_name"), rs.getInt("birth_year"),
                            rs.getInt("area_id"), rs.getInt("vehicle_id"));
                    d.setAreaNameDisplay(rs.getString("area_name"));
                    d.setVehiclePlateDisplay(rs.getString("license_plate")); // Đã fix tên cột
                    return d;
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean updateDriverProfile(int driverId, String licenseNumber, int experienceYears) {
        String sql = "UPDATE drivers SET license_number = ?, experience_years = ? WHERE driver_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, licenseNumber);
            st.setInt(2, experienceYears);
            st.setInt(3, driverId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public List<Driver> getAllDrivers() {
        List<Driver> list = new ArrayList<>();
        String sql = "SELECT d.*, a.area_name, v.license_plate FROM drivers d "
                + "LEFT JOIN parent_areas a ON d.area_id = a.area_id "
                + "LEFT JOIN vehicles v ON d.vehicle_id = v.vehicle_id";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Driver d = new Driver(rs.getInt("driver_id"), rs.getInt("user_id"), rs.getString("license_number"),
                        rs.getInt("experience_years"), rs.getString("full_name"), rs.getInt("birth_year"),
                        rs.getInt("area_id"), rs.getInt("vehicle_id"));
                d.setAreaNameDisplay(rs.getString("area_name"));
                d.setVehiclePlateDisplay(rs.getString("license_plate")); // Đã fix tên cột
                list.add(d);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public Driver getDriverById(int driverId) {
        String sql = "SELECT d.*, a.area_name, v.license_plate FROM drivers d "
                + "LEFT JOIN parent_areas a ON d.area_id = a.area_id "
                + "LEFT JOIN vehicles v ON d.vehicle_id = v.vehicle_id "
                + "WHERE d.driver_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, driverId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Driver d = new Driver(rs.getInt("driver_id"), rs.getInt("user_id"), rs.getString("license_number"),
                            rs.getInt("experience_years"), rs.getString("full_name"), rs.getInt("birth_year"),
                            rs.getInt("area_id"), rs.getInt("vehicle_id"));
                    d.setAreaNameDisplay(rs.getString("area_name"));
                    d.setVehiclePlateDisplay(rs.getString("license_plate")); // Đã fix tên cột
                    return d;
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean insertDriver(Driver d) {
        String sql = "INSERT INTO drivers (user_id, license_number, experience_years, full_name, birth_year, area_id, vehicle_id) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, d.getUserId());
            st.setString(2, d.getLicenseNumber());
            st.setInt(3, d.getExperienceYears());
            st.setString(4, d.getFullName());
            st.setInt(5, d.getBirthYear());
            st.setInt(6, d.getAreaId());
            st.setInt(7, d.getVehicleId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateDriver(Driver d) {
        String sql = "UPDATE drivers SET license_number=?, experience_years=?, full_name=?, birth_year=?, area_id=?, vehicle_id=? WHERE driver_id=?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, d.getLicenseNumber());
            st.setInt(2, d.getExperienceYears());
            st.setString(3, d.getFullName());
            st.setInt(4, d.getBirthYear());
            st.setInt(5, d.getAreaId());
            st.setInt(6, d.getVehicleId());
            st.setInt(7, d.getDriverId());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteDriver(int driverId) {
        String sql = "DELETE FROM drivers WHERE driver_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, driverId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
    // Thêm hàm này vào file DriverDAO.java của bạn
    public int getDriverIdByUserId(int userId) {
        String sql = "SELECT driver_id FROM drivers WHERE user_id = ?";
        try (java.sql.PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (java.sql.ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("driver_id");
                }
            }
        } catch (java.sql.SQLException e) {
            System.out.println("====== LỖI LẤY DRIVER_ID ======");
            e.printStackTrace();
        }
        return -1; // Trả về -1 nếu không tìm thấy (User này không phải tài xế)
    }
}