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

@WebServlet(name = "AddStudentServlet", urlPatterns = {"/admin/add-student"})
public class AddStudentServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("classList", new ClassDAO().getAllClasses());
        request.setAttribute("areaList", new ParentAreaDAO().getAllAreas()); 
        request.getRequestDispatcher("/admin/add-student.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8"); 
        
        try {
            // 1. Lấy tất cả thông tin từ Form trước để không bị lỗi thiếu biến
            String parentEmail = request.getParameter("parentEmail");
            int areaId = Integer.parseInt(request.getParameter("areaId"));
            String parentPhone = request.getParameter("parentPhone");
            String emergencyPhone = request.getParameter("emergencyPhone");
            if (emergencyPhone == null) emergencyPhone = ""; // Xử lý rỗng nếu bỏ qua
            
            String classIdStr = request.getParameter("classId");
            String studentCode = request.getParameter("studentCode");
            String fullName = request.getParameter("fullName");
            
            String studentEmail = request.getParameter("studentEmail");
            if (studentEmail == null) studentEmail = "";
            
            ParentDAO parentDAO = new ParentDAO();
            UserDAO userDAO = new UserDAO();
            
            // 2. Xử lý Phụ huynh (Role 3)
            int parentId = parentDAO.getParentIdByEmail(parentEmail);
            boolean isNewParent = false;
            
            if (parentId == 0) {
                // Tạo User Role 3 (Lúc này fullName đã được khai báo ở trên nên không bị lỗi nữa)
                int newUserId = userDAO.insertUserAndReturnId(parentEmail, "123456", "", "Phụ huynh của " + fullName, 3);
                if(newUserId > 0) {
                    // Truyền đủ SĐT chính và SĐT phụ vào DB
                    parentDAO.insertParent(newUserId, parentPhone, emergencyPhone, areaId);
                    parentId = parentDAO.getParentIdByUserId(newUserId);
                    isNewParent = true;
                }
            }
            
            // 3. Xử lý Học sinh (Role 4)
            int studentUserId = 0;
            if (!studentEmail.isEmpty()) {
                studentUserId = userDAO.insertUserAndReturnId(studentEmail, "123456", "", fullName, 4);
            }
            
            // 4. Lưu hồ sơ Học sinh vào DB
            Student s = new Student();
            s.setParentId(parentId);
            s.setUserId(studentUserId);
            s.setStudentCode(studentCode);
            s.setFullName(fullName);
            s.setGender(request.getParameter("gender"));
            s.setDateOfBirth(Date.valueOf(request.getParameter("dob")));
            s.setSchoolName(request.getParameter("schoolName"));
            s.setClassId(Integer.parseInt(classIdStr));
            s.setAddress(request.getParameter("address"));
            s.setAvatar("default.png");

            StudentDAO sDAO = new StudentDAO();
            if (sDAO.insertStudent(s)) {
                if (isNewParent) {
                    response.sendRedirect("manage-students?classId=" + classIdStr + "&msg=add_success_new_parent");
                } else {
                    response.sendRedirect("manage-students?classId=" + classIdStr + "&msg=add_success_linked");
                }
            } else {
                response.sendRedirect("add-student?classId=" + classIdStr + "&error=failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Bắt lỗi an toàn
            response.sendRedirect("add-student?error=invalid_data");
        }
    }
}