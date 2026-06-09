package controllleradmin;

import dao.StudentDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "DeleteStudentServlet", urlPatterns = {"/admin/delete-student"})
public class DeleteStudentServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String idParam = request.getParameter("studentId");
        
        if (idParam != null && !idParam.isEmpty()) {
            try {
                int studentId = Integer.parseInt(idParam);
                StudentDAO studentDAO = new StudentDAO();
                
                // [ĐÃ SỬA] Thực thi hàm xóa mềm
                boolean success = studentDAO.deleteStudent(studentId);
                
                if (success) {
                    response.sendRedirect("manage-students?msg=delete_success");
                    return;
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        response.sendRedirect("manage-students?error=delete_failed");
    }
}