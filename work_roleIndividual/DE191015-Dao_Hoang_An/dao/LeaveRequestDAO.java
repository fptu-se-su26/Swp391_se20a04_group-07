package dao;
import model.LeaveRequest;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LeaveRequestDAO extends DBContext {
    public boolean insertLeaveRequest(LeaveRequest lr) {
        String sql = "INSERT INTO leave_requests (student_id, parent_id, leave_date, reason, status) VALUES (?, ?, ?, ?, 'PENDING')";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, lr.getStudentId()); st.setInt(2, lr.getParentId());
            st.setDate(3, lr.getLeaveDate()); st.setString(4, lr.getReason());
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public List<LeaveRequest> getRequestsByParent(int parentId) {
        List<LeaveRequest> list = new ArrayList<>();
        String sql = "SELECT * FROM leave_requests WHERE parent_id = ? ORDER BY created_at DESC";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, parentId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) list.add(mapLeaveRequest(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    // [BỔ SUNG] Lấy toàn bộ đơn xin nghỉ (Cho Admin)
    public List<LeaveRequest> getAllLeaveRequests() {
        List<LeaveRequest> list = new ArrayList<>();
        String sql = "SELECT * FROM leave_requests ORDER BY created_at DESC";
        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            while (rs.next()) list.add(mapLeaveRequest(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    // [BỔ SUNG] Cập nhật trạng thái đơn (Duyệt/Từ chối)
    public boolean updateStatus(int requestId, String status) {
        String sql = "UPDATE leave_requests SET status = ? WHERE leave_request_id = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, status); st.setInt(2, requestId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    private LeaveRequest mapLeaveRequest(ResultSet rs) throws SQLException {
        return new LeaveRequest(rs.getInt("leave_request_id"), rs.getInt("student_id"), rs.getInt("parent_id"), 
                                rs.getDate("leave_date"), rs.getString("reason"), rs.getString("status"), 
                                rs.getTimestamp("created_at"));
    }
}