package controlllerparent;

import dao.ParentDAO;
import dao.StudentDAO;
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

@WebServlet(name = "ParentDashboardServlet", urlPatterns = {"/parent/dashboard"})
public class ParentDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            ParentDAO parentDAO = new ParentDAO();
            Parent parent = parentDAO.getParentByUserId(loggedInUser.getUserId());
            
            if (parent != null) {
                request.setAttribute("parentInfo", parent);
                
                // [ĐÃ SỬA] Lấy danh sách con của phụ huynh này để hiện ra bảng
                StudentDAO studentDAO = new StudentDAO();
                List<Student> children = studentDAO.getStudentsByParentId(parent.getParentId());
                request.setAttribute("children", children);
            }
        }
        
        request.getRequestDispatcher("/parent/dashboard.jsp").forward(request, response);
    }
}