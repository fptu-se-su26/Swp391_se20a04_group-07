package controllleradmin;

import dao.StudentDAO;
import dao.ParentDAO;
import model.Student;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageStudentServlet", urlPatterns = {"/admin/manage-students"})
public class ManageStudentServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String classIdParam = request.getParameter("classId");
        if (classIdParam != null && !classIdParam.isEmpty()) {
            try {
                int classId = Integer.parseInt(classIdParam);
                StudentDAO sDAO = new StudentDAO();
                
                request.setAttribute("studentList", sDAO.getStudentsByClassId(classId));
                request.setAttribute("parentList", new ParentDAO().getAllParents());
                
                request.getRequestDispatcher("/admin/manage-students.jsp").forward(request, response);
            } catch (NumberFormatException e) {
                response.sendRedirect(request.getContextPath() + "/admin/manage-classes");
            }
        } else {
            response.sendRedirect(request.getContextPath() + "/admin/manage-classes");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        String classIdParam = request.getParameter("classId");

        if ("delete".equals(action)) {
            try {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                StudentDAO sDAO = new StudentDAO();
                boolean isDeleted = sDAO.deleteStudent(studentId);

                if (isDeleted) {
                    response.sendRedirect(request.getContextPath() + "/admin/manage-students?classId=" + classIdParam + "&msg=delete_success");
                } else {
                    response.sendRedirect(request.getContextPath() + "/admin/manage-students?classId=" + classIdParam + "&error=delete_failed");
                }
                return;
            } catch (Exception e) {
                e.printStackTrace();
                response.sendRedirect(request.getContextPath() + "/admin/manage-students?classId=" + classIdParam + "&error=invalid_data");
                return;
            }
        }
        response.sendRedirect(request.getContextPath() + "/admin/manage-classes");
    }
}