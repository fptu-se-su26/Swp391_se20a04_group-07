package controllleradmin;

import dao.ClassDAO;
import dao.ParentDAO;
import dao.StudentDAO;
import model.Student;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;

@WebServlet(name = "UpdateStudentServlet", urlPatterns = {"/admin/update-student"})
public class UpdateStudentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idParam = request.getParameter("id");
        String classId = request.getParameter("classId");
        if (classId == null) classId = "";

        if (idParam != null && !idParam.isEmpty()) {
            try {
                int studentId = Integer.parseInt(idParam);
                StudentDAO sDAO = new StudentDAO();
                Student student = sDAO.getStudentById(studentId);

                if (student != null) {
                    ClassDAO classDAO = new ClassDAO();
                    request.setAttribute("classList", classDAO.getAllClasses());
                    request.setAttribute("student", student);
                    
                    // Trỏ thẳng sang trang JSP cập nhật
                    request.getRequestDispatcher("/admin/update-student.jsp").forward(request, response);
                    return; 
                }
            } catch (Exception e) {
                System.out.println("LỖI KHI LOAD HỌC SINH: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // [TỐI ƯU MỚI]: Nếu có lỗi data, giữ Admin ở lại trang lớp học đó, không văng ra ngoài
        response.sendRedirect("manage-students?classId=" + classId + "&error=notfound");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            int studentId = Integer.parseInt(request.getParameter("studentId"));
            String studentCode = request.getParameter("studentCode");
            String fullName = request.getParameter("fullName");
            String classIdStr = request.getParameter("classId");
            String gender = request.getParameter("gender");
            Date dob = Date.valueOf(request.getParameter("dob"));
            String schoolName = request.getParameter("schoolName");
            int classId = Integer.parseInt(classIdStr);
            String address = request.getParameter("address");
            boolean status = Boolean.parseBoolean(request.getParameter("status"));

            String parentPhone = request.getParameter("parentPhone");
            String emergencyPhone = request.getParameter("emergencyPhone");
            if (emergencyPhone == null) emergencyPhone = "";

            StudentDAO sDAO = new StudentDAO();
            Student existingStudent = sDAO.getStudentById(studentId);

            Student s = new Student();
            s.setStudentId(studentId);
            s.setStudentCode(studentCode);
            s.setFullName(fullName);
            s.setGender(gender);
            s.setDateOfBirth(dob);
            s.setSchoolName(schoolName);
            s.setClassId(classId);
            s.setAddress(address);
            s.setStatus(status);

            if (sDAO.updateStudent(s)) {
                if (existingStudent != null && existingStudent.getParentId() > 0) {
                    ParentDAO pDAO = new ParentDAO();
                    pDAO.updateParentPhones(existingStudent.getParentId(), parentPhone, emergencyPhone);
                }
                response.sendRedirect("manage-students?classId=" + classIdStr + "&msg=update_success");
            } else {
                response.sendRedirect("update-student?id=" + studentId + "&classId=" + classIdStr + "&error=failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Nếu POST lỗi nặng, mới văng ra ngoài
            response.sendRedirect("manage-classes?error=invalid_data");
        }
    }
}