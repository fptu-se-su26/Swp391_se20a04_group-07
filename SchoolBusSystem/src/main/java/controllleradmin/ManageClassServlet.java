package controllleradmin;

import dao.ClassDAO;
import model.Class;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageClassServlet", urlPatterns = {"/admin/manage-classes"})
public class ManageClassServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ClassDAO classDAO = new ClassDAO();
        List<Class> classList = classDAO.getAllClasses();
        
        request.setAttribute("classList", classList);
        request.getRequestDispatcher("/admin/manage-classes.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        
        try {
            int classId = Integer.parseInt(request.getParameter("classId"));
            String className = request.getParameter("className");
            String teacherName = request.getParameter("teacherName");
            String academicYear = request.getParameter("academicYear"); // Đã bổ sung nhận niên khóa
            
            ClassDAO classDAO = new ClassDAO();
            boolean isUpdated = classDAO.updateClass(classId, className, teacherName, academicYear);
            
            if (isUpdated) {
                response.sendRedirect(request.getContextPath() + "/admin/manage-classes?msg=update_success");
            } else {
                response.sendRedirect(request.getContextPath() + "/admin/manage-classes?error=update_failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/admin/manage-classes?error=invalid_data");
        }
    }
}