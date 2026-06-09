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

@WebServlet(name = "AddParentServlet", urlPatterns = {"/admin/add-parent"})
public class AddParentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String targetStudentId = request.getParameter("studentId");
        String classId = request.getParameter("classId"); // Lấy thêm classId từ URL
        
        if (targetStudentId != null && !targetStudentId.isEmpty()) {
            request.setAttribute("targetStudentId", targetStudentId);
            request.setAttribute("classId", classId); // Đẩy classId sang JSP để giữ lại
        }

        request.setAttribute("areaList", new ParentAreaDAO().getAllAreas());
        request.getRequestDispatcher("/admin/add-parent.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        UserDAO userDAO = new UserDAO();
        ParentDAO parentDAO = new ParentDAO();

        try {
            String fullName = request.getParameter("fullName");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String phone = request.getParameter("phone");
            
            String address = request.getParameter("address");
            String emergencyPhone = request.getParameter("emergencyPhone");
            int areaId = Integer.parseInt(request.getParameter("areaId"));

            int parentRoleId = 3; 

            int newUserId = userDAO.insertUserAndReturnId(email, password, phone, fullName, parentRoleId);

            if (newUserId != -1) {
                if (parentDAO.insertParent(newUserId, address, emergencyPhone, areaId)) {
                    
                    // =========================================================
                    // KIỂM TRA VÀ TỰ ĐỘNG LIÊN KẾT HỌC SINH
                    // =========================================================
                    String targetStudentId = request.getParameter("targetStudentId");
                    String classId = request.getParameter("classId"); // Hứng classId từ form gửi lên
                    
                    if (targetStudentId != null && !targetStudentId.isEmpty()) {
                        int studentId = Integer.parseInt(targetStudentId);
                        int newParentId = parentDAO.getParentIdByUserId(newUserId);
                        
                        if (newParentId != -1) {
                            StudentDAO studentDAO = new StudentDAO();
                            studentDAO.updateStudentParent(studentId, newParentId); // Thực hiện nối ID
                            
                            // Nối thành công, đẩy về trang quản lý học sinh của đúng lớp đó
                            response.sendRedirect("manage-students?classId=" + classId + "&msg=parent_linked");
                            return; 
                        }
                    }
                    
                    // Nếu thêm bình thường (không đi từ trang quản lý HS sang) thì về trang phụ huynh
                    response.sendRedirect("manage-parents?msg=add_success");
                } else {
                    userDAO.deleteUser(newUserId);
                    response.sendRedirect("add-parent?error=parent_profile_failed");
                }
            } else {
                response.sendRedirect("add-parent?error=user_exists");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("add-parent?error=invalid_data");
        }
    }
}