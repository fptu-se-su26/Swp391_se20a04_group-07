package controlllerparent;

import dao.StudentDAO;
import model.Student;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "StudentTrackingServlet", urlPatterns = {"/parent/tracking"})
public class StudentTrackingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String studentIdParam = request.getParameter("studentId");
        
        if (studentIdParam != null && !studentIdParam.isEmpty()) {
            try {
                int studentId = Integer.parseInt(studentIdParam);
                request.setAttribute("studentId", studentId);
                
                // Lấy thông tin bé để hiển thị tên trên màn hình tracking
                StudentDAO studentDAO = new StudentDAO();
                Student student = studentDAO.getStudentById(studentId);
                request.setAttribute("student", student);
                
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        
        request.getRequestDispatcher("/parent/tracking.jsp").forward(request, response);
    }
}