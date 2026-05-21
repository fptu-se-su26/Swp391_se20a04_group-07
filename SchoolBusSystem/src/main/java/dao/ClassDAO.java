package dao;

import dao.DBContext;
import model.Class;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ClassDAO extends DBContext {
    
    public List<Class> getAllClasses() {
        List<Class> list = new ArrayList<>();
        String sql = "SELECT * FROM classes WHERE status = 1";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(new Class(rs.getInt("class_id"), rs.getString("class_name"), 
                        rs.getInt("grade_level"), rs.getString("academic_year"), 
                        rs.getString("teacher_name"), rs.getBoolean("status")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public boolean insertClass(Class c) {
        String sql = "INSERT INTO classes (class_name, grade_level, academic_year, teacher_name) VALUES (?, ?, ?, ?)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, c.getClassName());
            st.setInt(2, c.getGradeLevel());
            st.setString(3, c.getAcademicYear());
            st.setString(4, c.getTeacherName());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public Class getClassById(int id) {
        String sql = "SELECT * FROM classes WHERE class_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, id);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) return new Class(rs.getInt("class_id"), rs.getString("class_name"), 
                        rs.getInt("grade_level"), rs.getString("academic_year"), 
                        rs.getString("teacher_name"), rs.getBoolean("status"));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }
}