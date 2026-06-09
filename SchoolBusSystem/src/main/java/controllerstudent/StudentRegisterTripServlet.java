package controllerstudent;

import dao.StudentDAO;
import dao.TripDAO;   
import model.Student;
import model.Trip;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "StudentRegisterTripServlet", urlPatterns = {"/student/choose-trip"})
public class StudentRegisterTripServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
            
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRoleId() != 4) {
            response.sendRedirect(request.getContextPath() + "/auth/login");
            return;
        }

        StudentDAO studentDAO = new StudentDAO();
        Student student = studentDAO.getStudentByUserId(user.getUserId());
        request.setAttribute("student", student);

        TripDAO tripDAO = new TripDAO();
        List<Trip> availableTrips = tripDAO.getAllAvailableTrips();
        request.setAttribute("tripList", availableTrips);

        // [MỚI BỔ SUNG] Lấy danh sách các chuyến học sinh ĐÃ ĐĂNG KÝ để đổi màu nút
        if (student != null) {
            List<Integer> registeredTripIds = tripDAO.getRegisteredTripIdsByStudent(student.getStudentId());
            request.setAttribute("registeredTripIds", registeredTripIds);
        }
        
        request.getRequestDispatcher("/student/studentregistertrip.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
            
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRoleId() != 4) {
            response.sendRedirect(request.getContextPath() + "/auth/login");
            return;
        }

        // Nhận dữ liệu từ nút bấm trên form
        String action = request.getParameter("action");
        int tripId = Integer.parseInt(request.getParameter("tripId"));
        
        StudentDAO studentDAO = new StudentDAO();
        Student student = studentDAO.getStudentByUserId(user.getUserId());
        TripDAO tripDAO = new TripDAO();

        if (student != null) {
            int studentId = student.getStudentId();
            
            // Xử lý logic Đăng ký hoặc Hủy
            if ("register".equals(action)) {
                boolean success = tripDAO.registerTrip(tripId, studentId);
                if (success) {
                    response.sendRedirect("choose-trip?msg=register_success");
                } else {
                    response.sendRedirect("choose-trip?error=register_failed");
                }
            } else if ("cancel".equals(action)) {
                boolean success = tripDAO.cancelRegistration(tripId, studentId);
                if (success) {
                    response.sendRedirect("choose-trip?msg=cancel_success");
                } else {
                    response.sendRedirect("choose-trip?error=cancel_failed");
                }
            }
        } else {
            response.sendRedirect("choose-trip?error=student_not_found");
        }
    }
}