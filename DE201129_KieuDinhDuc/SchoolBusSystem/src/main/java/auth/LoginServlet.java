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
        String password = request.getParameter("password"); 

        UserDAO userDAO = new UserDAO();
        User user = userDAO.login(email, password);

        if (user != null) {
            
            // =========================================================
            // CHỐT CHẶN AN NINH: CẤM PHỤ HUYNH ĐĂNG NHẬP BẰNG MẬT KHẨU
            // =========================================================
            if (user.getRoleId() == 3) {
                request.setAttribute("error", "Quý phụ huynh vui lòng đăng nhập bằng tài khoản Google!");
                request.getRequestDispatcher("/auth/login.jsp").forward(request, response);
                return; 
            }

            HttpSession session = request.getSession();
            session.setAttribute("user", user);

            // Khôi phục chính xác toàn bộ các trang đích điều hướng gốc của bạn
            switch (user.getRoleId()) {
                case 1:
                    response.sendRedirect(request.getContextPath() + "/admin/dashboard");
                    break;
                case 2:
                    response.sendRedirect(request.getContextPath() + "/driver/dashboard");
                    break;
                default:
                    response.sendRedirect(request.getContextPath() + "/index.jsp");
                    break;
            }
        } else {
            request.setAttribute("error", "Email hoặc mật khẩu không chính xác!");
            request.getRequestDispatcher("/auth/login.jsp").forward(request, response);
        }
    }
}