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

@WebServlet(name = "AddStudentServlet", urlPatterns = {"/admin/add-student"})
public class AddStudentServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ClassDAO classDAO = new ClassDAO();
        request.setAttribute("classList", classDAO.getAllClasses());
        request.getRequestDispatcher("/admin/add-student.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8"); 
        
        try {
            Student s = new Student();
            
            // 1. Quét Email để nhận diện phụ huynh (Auto-link)
            String parentEmail = request.getParameter("parentEmail");
            int parentId = new ParentDAO().getParentIdByEmail(parentEmail);
            s.setParentId(parentId); // Sẽ là 0 nếu không tìm thấy
            
            s.setFullName(request.getParameter("fullName"));
            s.setGender(request.getParameter("gender"));
            s.setDateOfBirth(Date.valueOf(request.getParameter("dob")));
            s.setSchoolName(request.getParameter("schoolName"));
            
            String classIdStr = request.getParameter("classId");
            s.setClassId(Integer.parseInt(classIdStr));
            s.setAddress(request.getParameter("address"));
            s.setAvatar("default.png");

            StudentDAO sDAO = new StudentDAO();
            if (sDAO.insertStudent(s)) {
                // Phải kẹp thêm classId vào link để không bị văng
                if (parentId > 0) {
                    response.sendRedirect("manage-students?classId=" + classIdStr + "&msg=add_success_linked");
                } else {
                    response.sendRedirect("manage-students?classId=" + classIdStr + "&msg=add_success_no_parent");
                }
            } else {
                response.sendRedirect("add-student?error=failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("add-student?error=invalid_data");
        }
    }
}