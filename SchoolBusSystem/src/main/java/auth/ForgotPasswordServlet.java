package auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "ForgotPasswordServlet", urlPatterns = {"/auth/forgot-password"})
public class ForgotPasswordServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/auth/forgot-password.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        
        // Todo: Kiểm tra email có trong DB không bằng UserDAO
        // Todo: Nếu có, sinh mã OTP/Token -> Lưu DB -> Gọi EmailUtils gửi mail cho người dùng
        
        request.setAttribute("msg", "Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.");
        request.getRequestDispatcher("/auth/forgot-password.jsp").forward(request, response);
    }
}