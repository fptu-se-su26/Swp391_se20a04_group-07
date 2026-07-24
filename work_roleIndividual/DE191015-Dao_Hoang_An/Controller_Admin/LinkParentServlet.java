package controllleradmin;

import dao.StudentDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "LinkParentServlet", urlPatterns = {"/admin/link-parent"})
public class LinkParentServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int studentId = Integer.parseInt(request.getParameter("studentId"));
            int parentId = Integer.parseInt(request.getParameter("parentId"));
            String classId = request.getParameter("classId"); // Rất quan trọng để quay lại đúng lớp

            StudentDAO dao = new StudentDAO();
            if (dao.updateStudentParent(studentId, parentId)) {
                response.sendRedirect("manage-students?classId=" + classId + "&msg=link_success");
            } else {
                response.sendRedirect("manage-students?classId=" + classId + "&error=link_failed");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-classes?error=invalid");
        }
    }
}