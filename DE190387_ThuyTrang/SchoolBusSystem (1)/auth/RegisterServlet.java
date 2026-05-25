package auth;

import dao.UserDAO;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "RegisterServlet", urlPatterns = {"/auth/register"})
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/auth/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            User newUser = new User();
            newUser.setFullName(request.getParameter("fullName"));
            newUser.setEmail(request.getParameter("email"));
            newUser.setPassword(request.getParameter("password")); 
            newUser.setPhone(request.getParameter("phone"));
            newUser.setAvatar("default_avatar.png");
            newUser.setRoleId(3); // Giả sử 3 là role Parent (người dùng tự đăng ký thường là phụ huynh)

            UserDAO userDAO = new UserDAO();
            boolean success = userDAO.insertUser(newUser);

            if (success) {
                response.sendRedirect(request.getContextPath() + "/auth/login?msg=register_success");
            } else {
                response.sendRedirect(request.getContextPath() + "/auth/register?error=email_exists");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/auth/register?error=invalid_data");
        }
    }
}