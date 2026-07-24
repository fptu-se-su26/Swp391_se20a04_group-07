package dao;

import model.ParentArea;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ParentAreaDAO extends DBContext {
    public List<ParentArea> getAllAreas() {
        List<ParentArea> list = new ArrayList<>();
        String sql = "SELECT * FROM parent_areas";
        try (PreparedStatement st = connection.prepareStatement(sql); 
             ResultSet rs = st.executeQuery()) {
            while (rs.next()) {
                list.add(new ParentArea(
                    rs.getInt("area_id"),
                    rs.getString("area_name"),
                    rs.getString("description")
                ));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
}