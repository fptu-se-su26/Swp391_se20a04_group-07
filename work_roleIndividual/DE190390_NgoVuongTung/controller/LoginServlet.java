package auth;

import dao.UserDAO;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(name = "LoginServlet", urlPatterns = {"/auth/login"})
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Nếu đã đăng nhập rồi thì không cho vào trang login nữa
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
            return;
        }
        request.getRequestDispatcher("/auth/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password"); // Thực tế nên dùng Utils để mã hóa MD5/SHA-256

        UserDAO userDAO = new UserDAO();
        User user = userDAO.login(email, password);

        if (user != null) {
            HttpSession session = request.getSession();
            session.setAttribute("user", user);

            // Phân quyền điều hướng dựa trên role_id
            // Giả sử: 1 = Admin, 2 = Driver, 3 = Parent
            switch (user.getRoleId()) {
                case 1:
                    response.sendRedirect(request.getContextPath() + "/admin/dashboard");
                    break;
                case 2:
                    response.sendRedirect(request.getContextPath() + "/driver/dashboard");
                    break;
                case 3:
                    response.sendRedirect(request.getContextPath() + "/parent/dashboard");
                    break;
                default:
                    response.sendRedirect(request.getContextPath() + "/index.jsp");
                    break;
            }
        } else {
            request.setAttribute("error", "Email hoặc mật khẩu không chính xác, hoặc tài khoản đã bị khóa!");
            request.getRequestDispatcher("/auth/login.jsp").forward(request, response);
        }
    }
}