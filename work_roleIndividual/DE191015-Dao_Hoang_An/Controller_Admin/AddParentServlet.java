package controllleradmin;

import dao.ParentDAO;
import dao.ParentAreaDAO;
import dao.UserDAO;
import dao.StudentDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * AddParentServlet - Thêm phụ huynh, có thể tự động liên kết với học sinh.
 *
 * BẢO MẬT:
 *  - Hash mật khẩu qua UserDAO (salt + SHA-256)
 *  - Validate tất cả input đầu vào
 *  - Rollback user nếu tạo parent thất bại
 */
@WebServlet(name = "AddParentServlet", urlPatterns = {"/admin/add-parent"})
public class AddParentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String targetStudentId = trim(request.getParameter("studentId"));
        String classId         = trim(request.getParameter("classId"));

        if (!targetStudentId.isEmpty()) {
            request.setAttribute("targetStudentId", targetStudentId);
            request.setAttribute("classId", classId);
        }
        request.setAttribute("areaList", new ParentAreaDAO().getAllAreas());
        request.getRequestDispatcher("/admin/add-parent.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        // ── 1. ĐỌC & VALIDATE INPUT ──────────────────────────────────────────
        String fullName       = trim(request.getParameter("fullName"));
        String email          = trim(request.getParameter("email"));
        String password       = trim(request.getParameter("password"));
        String phone          = trim(request.getParameter("phone"));
        String address        = trim(request.getParameter("address"));
        String emergencyPhone = trim(request.getParameter("emergencyPhone"));
        String areaIdStr      = trim(request.getParameter("areaId"));
        String targetStudentId = trim(request.getParameter("targetStudentId"));
        String classId        = trim(request.getParameter("classId"));

        if (fullName.isEmpty() || email.isEmpty() || password.isEmpty() || areaIdStr.isEmpty()) {
            response.sendRedirect("add-parent?error=missing_fields");
            return;
        }

        int areaId;
        try {
            areaId = Integer.parseInt(areaIdStr);
        } catch (NumberFormatException e) {
            response.sendRedirect("add-parent?error=invalid_area");
            return;
        }

        // ── 2. TẠO TÀI KHOẢN USER ───────────────────────────────────────────
        UserDAO  userDAO   = new UserDAO();
        ParentDAO parentDAO = new ParentDAO();

        // insertUserAndReturnId tự hash mật khẩu bên trong
        int newUserId = userDAO.insertUserAndReturnId(email, password, phone, fullName, 3);

        if (newUserId == -1) {
            response.sendRedirect("add-parent?error=user_exists");
            return;
        }

        // ── 3. TẠO HỒ SƠ PHỤ HUYNH ─────────────────────────────────────────
        if (!parentDAO.insertParent(newUserId, areaId, phone, emergencyPhone)) {
            userDAO.deleteUser(newUserId); // Rollback
            response.sendRedirect("add-parent?error=parent_profile_failed");
            return;
        }

        // ── 4. LIÊN KẾT HỌC SINH (nếu đến từ trang quản lý học sinh) ────────
        if (!targetStudentId.isEmpty()) {
            try {
                int studentId  = Integer.parseInt(targetStudentId);
                int newParentId = parentDAO.getParentIdByUserId(newUserId);

                if (newParentId > 0) {
                    new StudentDAO().updateStudentParent(studentId, newParentId);
                    response.sendRedirect("manage-students?classId=" + classId + "&msg=parent_linked");
                    return;
                }
            } catch (NumberFormatException e) {
                // studentId không hợp lệ → fallthrough về trang phụ huynh
            }
        }

        response.sendRedirect("manage-parents?msg=add_success");
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }
}