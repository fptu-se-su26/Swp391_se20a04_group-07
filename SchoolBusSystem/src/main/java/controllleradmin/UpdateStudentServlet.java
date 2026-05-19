package controllleradmin;

import dao.ClassDAO;
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
        if (idParam != null && !idParam.isEmpty()) {
            try {
                int studentId = Integer.parseInt(idParam);
                StudentDAO sDAO = new StudentDAO();
                Student student = sDAO.getStudentById(studentId);
                
                if (student != null) {
                    // Lấy danh sách lớp học để đẩy lên Dropdown khi Edit
                    ClassDAO classDAO = new ClassDAO();
                    request.setAttribute("classList", classDAO.getAllClasses());
                    
                    request.setAttribute("student", student);
                    request.getRequestDispatcher("/admin/update-student.jsp").forward(request, response);
                    return;
                }
            } catch (NumberFormatException e) { e.printStackTrace(); }
        }
        response.sendRedirect("manage-students?error=not_found");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            Student s = new Student();
            s.setStudentId(Integer.parseInt(request.getParameter("studentId")));
            s.setFullName(request.getParameter("fullName"));
            s.setGender(request.getParameter("gender"));
            s.setDateOfBirth(Date.valueOf(request.getParameter("dob")));
            s.setSchoolName(request.getParameter("schoolName"));
            
            // Lấy classId thay vì className
            s.setClassId(Integer.parseInt(request.getParameter("classId")));
            
            s.setAddress(request.getParameter("address"));
            s.setStatus(Boolean.parseBoolean(request.getParameter("status")));

            StudentDAO sDAO = new StudentDAO();
            if (sDAO.updateStudent(s)) {
                response.sendRedirect("manage-students?msg=update_success");
            } else {
                response.sendRedirect("update-student?id=" + s.getStudentId() + "&error=failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("manage-students?error=invalid_data");
        }
    }
}