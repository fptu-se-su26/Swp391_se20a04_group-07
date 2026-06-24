package controllleradmin;

import dao.ClassDAO;
import dao.ParentDAO;
import dao.StudentDAO;
import dao.UserDAO;
import dao.ParentAreaDAO;
import model.Student;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;

/**
 * AddStudentServlet - Thêm học sinh + xử lý tài khoản phụ huynh.
 *
 * BẢO MẬT:
 *  - Hash mật khẩu thông qua UserDAO.hashPassword (salt + SHA-256)
 *  - Validate & sanitize tất cả input trước khi xử lý
 *  - Không expose thông tin lỗi hệ thống ra URL
 */
@WebServlet(name = "AddStudentServlet", urlPatterns = {"/admin/add-student"})
public class AddStudentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("classList", new ClassDAO().getAllClasses());
        request.setAttribute("areaList", new ParentAreaDAO().getAllAreas());
        request.getRequestDispatcher("/admin/add-student.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        // ── 1. ĐỌC & VALIDATE INPUT ──────────────────────────────────────────
        String parentEmail    = trim(request.getParameter("parentEmail"));
        String parentName     = trim(request.getParameter("parentName"));
        String parentPhone    = trim(request.getParameter("parentPhone"));
        String emergencyPhone = trim(request.getParameter("emergencyPhone"));
        String areaIdStr      = trim(request.getParameter("areaId"));

        String fullName       = trim(request.getParameter("fullName"));
        String studentCode    = trim(request.getParameter("studentCode"));
        String classIdStr     = trim(request.getParameter("classId"));
        String studentEmail   = trim(request.getParameter("studentEmail"));
        String gender         = trim(request.getParameter("gender"));
        String dobStr         = trim(request.getParameter("dob"));
        String schoolName     = trim(request.getParameter("schoolName"));
        String address        = trim(request.getParameter("address"));

        // Kiểm tra các trường bắt buộc
        if (parentEmail.isEmpty() || fullName.isEmpty() || studentCode.isEmpty()
                || classIdStr.isEmpty() || areaIdStr.isEmpty() || dobStr.isEmpty()) {
            response.sendRedirect("add-student?error=missing_fields");
            return;
        }

        int areaId;
        int classId;
        Date dob;
        try {
            areaId  = Integer.parseInt(areaIdStr);
            classId = Integer.parseInt(classIdStr);
            dob     = Date.valueOf(dobStr); // YYYY-MM-DD
        } catch (IllegalArgumentException e) {
            response.sendRedirect("add-student?error=invalid_format");
            return;
        }

        // ── 2. XỬ LÝ TÀI KHOẢN PHỤ HUYNH ────────────────────────────────────
        UserDAO  userDAO   = new UserDAO();
        ParentDAO parentDAO = new ParentDAO();

        int parentUserId = userDAO.getUserIdByEmail(parentEmail);
        boolean isNewParent = false;
        int parentId = -1;

        if (parentUserId > 0) {
            // Email đã tồn tại → lấy parentId hiện có
            parentId = parentDAO.getParentIdByUserId(parentUserId);
        } else {
            // Tạo tài khoản phụ huynh mới, mật khẩu mặc định "123456" đã được hash trong UserDAO
            isNewParent  = true;
            parentUserId = userDAO.insertUserAndReturnId(parentEmail, "123456", parentPhone, parentName, 3);

            if (parentUserId > 0) {
                parentDAO.insertParent(parentUserId, areaId, parentPhone, emergencyPhone);
                parentId = parentDAO.getParentIdByUserId(parentUserId);
            }
        }

        if (parentId <= 0) {
            response.sendRedirect("add-student?classId=" + classId + "&error=parent_failed");
            return;
        }

        // ── 3. XỬ LÝ TÀI KHOẢN HỌC SINH (tuỳ chọn) ─────────────────────────
        int studentUserId = -1;
        if (!studentEmail.isEmpty()) {
            studentUserId = userDAO.insertUserAndReturnId(studentEmail, "123456", "", fullName, 4);
            // Nếu -1 (email trùng) thì studentUserId giữ nguyên -1, không block luồng chính
        }

        // ── 4. LƯU HỌC SINH ─────────────────────────────────────────────────
        Student s = new Student();
        s.setParentId(parentId);
        s.setUserId(studentUserId);
        s.setStudentCode(studentCode);
        s.setFullName(fullName);
        s.setGender(gender);
        s.setDateOfBirth(dob);
        s.setSchoolName(schoolName);
        s.setClassId(classId);
        s.setAddress(address);
        s.setAvatar("default.png");

        StudentDAO sDAO = new StudentDAO();
        if (sDAO.insertStudent(s)) {
            String msg = isNewParent ? "add_success_new_parent" : "add_success_linked";
            response.sendRedirect("manage-students?classId=" + classId + "&msg=" + msg);
        } else {
            response.sendRedirect("add-student?classId=" + classId + "&error=student_failed");
        }
    }

    /** Trả về chuỗi trim, không null */
    private String trim(String value) {
        return value == null ? "" : value.trim();
    }
}