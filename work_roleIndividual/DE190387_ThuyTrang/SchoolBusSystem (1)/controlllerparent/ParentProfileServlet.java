package controlllerparent;

import dao.ParentDAO;
import dao.UserDAO;
import model.Parent;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(name = "ParentProfileServlet", urlPatterns = {"/parent/profile"})
public class ParentProfileServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            ParentDAO parentDAO = new ParentDAO();
            Parent parent = parentDAO.getParentByUserId(loggedInUser.getUserId());
            request.setAttribute("parentProfile", parent);
        }
        
        request.getRequestDispatcher("/parent/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            String phone = request.getParameter("phone");
            String emergencyPhone = request.getParameter("emergencyPhone");
            String address = request.getParameter("address");

            try {
                // Cập nhật SĐT ở bảng users
                UserDAO userDAO = new UserDAO();
                userDAO.updateUserProfile(loggedInUser.getUserId(), phone);
                loggedInUser.setPhone(phone); // Update lại session
                
                // Cập nhật Địa chỉ & SĐT khẩn ở bảng parents
                ParentDAO parentDAO = new ParentDAO();
                Parent p = parentDAO.getParentByUserId(loggedInUser.getUserId());
                if (p != null) {
                    parentDAO.updateParentProfile(p.getParentId(), address, emergencyPhone);
                }
                
                response.sendRedirect(request.getContextPath() + "/parent/profile?msg=success");
                return;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        response.sendRedirect(request.getContextPath() + "/parent/profile?error=failed");
    }
}