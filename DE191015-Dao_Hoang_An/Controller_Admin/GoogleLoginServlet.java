package controllleradmin; // Nhớ đổi tên package cho khớp với project hiện tại

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;

@WebServlet(name = "GoogleLoginServlet", urlPatterns = {"/login-google"})
public class GoogleLoginServlet extends HttpServlet {

    // Client ID của dự án bạn
    private static final String CLIENT_ID = "856732490349-vpcvp2dolapdlnh5tejgp193u4smda7p.apps.googleusercontent.com";
    
    // [ĐÃ SỬA] Đổi link ngrok cũ thành link localhost của SchoolBusSystem
    private static final String REDIRECT_URI = "http://localhost:8080/SchoolBusSystem/GoogleCallbackServlet";
    
    // Quyền truy cập muốn lấy từ Google (Lấy Email và Tên hiển thị)
    private static final String SCOPE = "email profile";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Xây dựng đường dẫn gọi đến hệ thống xác thực của Google
        String url = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + CLIENT_ID
                + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI, "UTF-8")
                + "&response_type=code"
                + "&scope=" + URLEncoder.encode(SCOPE, "UTF-8");

        // Chuyển hướng người dùng sang giao diện Đăng nhập của Google
        response.sendRedirect(url);
    }
}