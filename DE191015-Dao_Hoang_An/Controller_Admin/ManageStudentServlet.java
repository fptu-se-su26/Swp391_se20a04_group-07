package controllleradmin;

import dao.StudentDAO;
import dao.ParentDAO; // Thêm import này
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String classIdParam = request.getParameter("classId");
        if (classIdParam != null && !classIdParam.isEmpty()) {
            try {
                int classId = Integer.parseInt(classIdParam);
                StudentDAO sDAO = new StudentDAO();
                
                request.setAttribute("studentList", sDAO.getStudentsByClassId(classId));
                
                // [THÊM DÒNG NÀY]: Lấy danh sách toàn bộ Phụ huynh ném sang Modal
                request.setAttribute("parentList", new ParentDAO().getAllParents());
                
                request.getRequestDispatcher("/admin/manage-students.jsp").forward(request, response);
            } catch (NumberFormatException e) {
                response.sendRedirect(request.getContextPath() + "/admin/manage-classes");
            }
        } else {
            response.sendRedirect(request.getContextPath() + "/admin/manage-classes");
        }
    }
}