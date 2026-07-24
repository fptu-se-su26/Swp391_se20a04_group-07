package controllleradmin;

import dao.ClassDAO;
import model.Class;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "AddClassServlet", urlPatterns = {"/admin/add-class"})
public class AddClassServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Chuyển hướng sang trang giao diện Form Thêm Lớp
        request.getRequestDispatcher("/admin/add-class.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Cấu hình UTF-8 để không bị lỗi font tiếng Việt khi nhập tên Giáo viên
        request.setCharacterEncoding("UTF-8");

        try {
            // Lấy dữ liệu từ Form
            String className = request.getParameter("className");
            int gradeLevel = Integer.parseInt(request.getParameter("gradeLevel"));
            String academicYear = request.getParameter("academicYear");
            String teacherName = request.getParameter("teacherName");

            // Đóng gói vào Object Class
            Class newClass = new Class();
            newClass.setClassName(className);
            newClass.setGradeLevel(gradeLevel);
            newClass.setAcademicYear(academicYear);
            newClass.setTeacherName(teacherName);
            newClass.setStatus(true); // Lớp mới mặc định là hoạt động

            // Gọi DAO để lưu vào Database
            ClassDAO classDAO = new ClassDAO();
            if (classDAO.insertClass(newClass)) {
                // Thành công -> Quay về trang quản lý và báo thành công
                response.sendRedirect("manage-classes?msg=add_success");
            } else {
                response.sendRedirect("add-class?error=failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("add-class?error=invalid_data");
        }
    }
}