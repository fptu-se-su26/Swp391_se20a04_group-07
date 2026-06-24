package controlllerparent;

import dao.ParentDAO;
import dao.StudentDAO;
import dao.TripDAO;
import model.Parent;
import model.Student;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

/**
 * ParentDashboardServlet — Servlet dành cho phụ huynh.
 *
 * Business rule:
 *   - Phụ huynh chỉ thấy được tài xế đang chở con họ hôm nay.
 *   - Mỗi Student được gắn với một Trip (nếu có chuyến hôm nay).
 *   - Từ Trip → lấy tripId để tạo URL WebSocket ws://.../ws/tracking/{tripId}/parent
 *
 * Yêu cầu StudentDAO.getStudentsByParentId() phải trả về danh sách Student
 * kèm thông tin TripId, DriverName, VehiclePlate, RouteName của chuyến HÔM NAY.
 * Nếu Student không có chuyến hôm nay, tripId = null.
 *
 * Gợi ý SQL (JOIN trong StudentDAO):
 *   SELECT s.*, t.trip_id, t.route_name, d.full_name AS driver_name, v.plate AS vehicle_plate
 *   FROM students s
 *   LEFT JOIN trips t ON t.trip_id = (
 *       SELECT trip_id FROM trip_students
 *       WHERE student_id = s.student_id
 *         AND DATE(trip_date) = CURDATE()
 *       LIMIT 1
 *   )
 *   LEFT JOIN drivers d ON d.driver_id = t.driver_id
 *   LEFT JOIN vehicles v ON v.vehicle_id = t.vehicle_id
 *   WHERE s.parent_id = ?
 */
@WebServlet(name = "ParentDashboardServlet", urlPatterns = {"/parent/dashboard"})
public class ParentDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User loggedInUser = (session != null) ? (User) session.getAttribute("user") : null;

        // Chưa đăng nhập → redirect
        if (loggedInUser == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        ParentDAO parentDAO = new ParentDAO();
        Parent parent = parentDAO.getParentByUserId(loggedInUser.getUserId());

        if (parent == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=notParent");
            return;
        }

        request.setAttribute("parentInfo", parent);

        // Lấy danh sách con kèm thông tin chuyến xe HÔM NAY của từng con
        // Student model cần có các field: tripId, driverName, vehiclePlate, routeName
        StudentDAO studentDAO = new StudentDAO();
        List<Student> children = studentDAO.getStudentsWithTodayTripByParentId(parent.getParentId());
        request.setAttribute("children", children);

        request.getRequestDispatcher("/parent/dashboard.jsp").forward(request, response);
    }
}
