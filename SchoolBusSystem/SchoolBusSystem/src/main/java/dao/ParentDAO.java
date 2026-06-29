package dao;

import model.Parent;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ParentDAO extends DBContext {

    public Parent getParentByUserId(int userId) {
        String sql = "SELECT * FROM parents WHERE user_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return new Parent(rs.getInt("parent_id"), rs.getInt("user_id"), rs.getString("address"), rs.getString("emergency_phone"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

// [ĐÃ SỬA LỖI] Lấy danh sách tất cả phụ huynh (Kèm theo Tên Khu vực)
    public List<Parent> getAllParents() {
        List<Parent> list = new ArrayList<>();
        String sql = "SELECT p.*, a.area_name, "
                + "(SELECT s.full_name + ' (Lớp ' + ISNULL(c.class_name, N'Chưa xếp') + '), ' "
                + " FROM students s LEFT JOIN classes c ON s.class_id = c.class_id "
                + " WHERE s.parent_id = p.parent_id "
                + " FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)') AS children_names "
                + "FROM parents p LEFT JOIN parent_areas a ON p.area_id = a.area_id";

        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                Parent p = new Parent(rs.getInt("parent_id"), rs.getInt("user_id"), rs.getString("address"), rs.getString("emergency_phone"));
                p.setAreaId(rs.getInt("area_id"));
                p.setAreaNameDisplay(rs.getString("area_name"));

                // Lấy chuỗi đã fix font từ cột 'children_names'
                String rawNames = rs.getString("children_names");
                if (rawNames != null && rawNames.endsWith(", ")) {
                    rawNames = rawNames.substring(0, rawNames.length() - 2); // Cắt bỏ dấu phẩy thừa ở cuối
                }
                p.setChildrenNames(rawNames);
                list.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // [BỔ SUNG] Lấy Phụ huynh theo Lớp (Join với bảng students)
    public List<Parent> getParentsByClassId(int classId) {
        List<Parent> list = new ArrayList<>();
        String sql = "SELECT DISTINCT p.* FROM parents p JOIN students s ON p.parent_id = s.parent_id WHERE s.class_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, classId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    list.add(new Parent(rs.getInt("parent_id"), rs.getInt("user_id"), rs.getString("address"), rs.getString("emergency_phone")));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // [BỔ SUNG] Lấy 1 Phụ huynh theo ID để Sửa
    public Parent getParentById(int parentId) {
        String sql = "SELECT * FROM parents WHERE parent_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Parent p = new Parent(rs.getInt("parent_id"), rs.getInt("user_id"), rs.getString("address"), rs.getString("emergency_phone"));
                    p.setAreaId(rs.getInt("area_id")); // Lấy thêm area_id
                    return p;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

// =========================================================================
    // HÀM MỚI: CHÈN DỮ LIỆU VÀO BẢNG PARENTS
    // =========================================================================
    public boolean insertParent(int userId, int areaId, String phone, String emergencyPhone) {
        String sql = "INSERT INTO parents (user_id, area_id, phone, emergency_phone) VALUES (?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            st.setInt(2, areaId);
            st.setString(3, phone);
            st.setString(4, emergencyPhone);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // [BỔ SUNG] Cập nhật Phụ huynh
    public boolean updateParent(int parentId, String address, String emergencyPhone, int areaId) {
        String sql = "UPDATE parents SET address = ?, emergency_phone = ?, area_id = ? WHERE parent_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, address);
            st.setString(2, emergencyPhone);
            st.setInt(3, areaId);
            st.setInt(4, parentId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
// Cập nhật số điện thoại phụ huynh (phone và emergency_phone đều trong bảng parents)
public boolean updateParentPhones(int parentId, String phone, String emergencyPhone) {
        String sql = "UPDATE parents SET phone = ?, emergency_phone = ? WHERE parent_id = ?";
        try (java.sql.PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, phone);
            st.setString(2, emergencyPhone);
            st.setInt(3, parentId);
            return st.executeUpdate() > 0;
        } catch (java.sql.SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    //Update profile
    public boolean updateParentProfile(int parentId, String address, String emergencyPhone) {
        String sql = "UPDATE parents SET address = ?, emergency_phone = ? WHERE parent_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, address);
            st.setString(2, emergencyPhone);
            st.setInt(3, parentId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Thêm hàm này vào trong class ParentDAO
    public List<Parent> getParentsByArea(int areaId) {
        List<Parent> list = new ArrayList<>();
        String sql = "SELECT p.*, a.area_name, "
                + "(SELECT s.full_name + ' (Lớp ' + ISNULL(c.class_name, N'Chưa xếp') + '), ' "
                + " FROM students s LEFT JOIN classes c ON s.class_id = c.class_id "
                + " WHERE s.parent_id = p.parent_id "
                + " FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)') AS children_names "
                + "FROM parents p LEFT JOIN parent_areas a ON p.area_id = a.area_id "
                + "WHERE p.area_id = ?";

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, areaId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    Parent p = new Parent(rs.getInt("parent_id"), rs.getInt("user_id"), rs.getString("address"), rs.getString("emergency_phone"));
                    p.setAreaId(rs.getInt("area_id"));
                    p.setAreaNameDisplay(rs.getString("area_name"));

                    String rawNames = rs.getString("children_names");
                    if (rawNames != null && rawNames.endsWith(", ")) {
                        rawNames = rawNames.substring(0, rawNames.length() - 2);
                    }
                    p.setChildrenNames(rawNames);
                    list.add(p);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
    
    // Hàm này giúp lấy ra ID của Parent vừa được tạo ra
    public int getParentIdByUserId(int userId) {
        String sql = "SELECT parent_id FROM parents WHERE user_id = ?";
        try (java.sql.PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (java.sql.ResultSet rs = st.executeQuery()) {
                if (rs.next()) return rs.getInt("parent_id");
            }
        } catch (java.sql.SQLException e) { e.printStackTrace(); }
        return -1;
    }
    
    // HÀM MỚI: Tra cứu ID Phụ huynh dựa vào Email
public int getParentIdByEmail(String email) {
        // Nối bảng parents và users để quét email
        String sql = "SELECT p.parent_id FROM parents p JOIN users u ON p.user_id = u.user_id WHERE u.email = ?";
        try (java.sql.PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email);
            try (java.sql.ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("parent_id"); // Tìm thấy, trả về ID
                }
            }
        } catch (java.sql.SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }
}
