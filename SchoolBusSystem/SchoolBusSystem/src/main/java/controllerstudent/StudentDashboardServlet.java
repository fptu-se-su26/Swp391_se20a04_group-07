package controllerstudent; // Đổi lại theo đúng tên package của bạn

import dao.StudentDAO;
import model.Student;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

// Mapping đường dẫn gọn gàng, chuyên nghiệp
@WebServlet(name = "StudentDashboardServlet", urlPatterns = {"/student/dashboard"})
public class StudentDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Kiểm tra đăng nhập và Quyền (Role 4 = Student)
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRoleId() != 4) {
            response.sendRedirect(request.getContextPath() + "/auth/login.jsp");
            return;
        }

        // 2. Lấy hồ sơ học sinh từ User ID
        StudentDAO studentDAO = new StudentDAO();
        Student student = studentDAO.getStudentByUserId(user.getUserId()); // Hoặc user.getId() tùy model của bạn
        
        if (student != null) {
            // Đẩy dữ liệu học sinh sang giao diện
            request.setAttribute("student", student);
// Thêm đường dẫn vào thư mục student/
request.getRequestDispatcher("/student/studentdashboard.jsp").forward(request, response);        } else {
            // Trường hợp user có tài khoản nhưng Admin chưa gán vào Học sinh nào
            response.sendRedirect(request.getContextPath() + "/auth/login.jsp?error=not_linked");
        }
    }
}