package controllleradmin; 

import dao.UserDAO;
import model.User;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

@WebServlet(name = "GoogleCallbackServlet", urlPatterns = {"/GoogleCallbackServlet"})
public class GoogleCallbackServlet extends HttpServlet {

    private static final String CLIENT_ID = "856732490349-vpcvp2dolapdlnh5tejgp193u4smda7p.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";
    private static final String REDIRECT_URI = "http://localhost:8080/SchoolBusSystem/GoogleCallbackServlet";

    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String code = request.getParameter("code");

        if (code == null || code.isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/auth/login?error=google_failed");
            return;
        }

        try {
            String accessToken = getAccessToken(code);
            String email = getUserEmail(accessToken);

            UserDAO userDAO = new UserDAO();
            User account = userDAO.getUserByEmail(email); 
            HttpSession session = request.getSession();

            if (account == null) {
                // Điều hướng an toàn về trang login qua filter/mapping kèm mã lỗi
                response.sendRedirect(request.getContextPath() + "/auth/login?error=google_not_found");
            } else {
                session.setAttribute("user", account); 

                // GIỮ NGUYÊN 100% CÁC ĐƯỜNG DẪN ĐIỀU HƯỚNG GỐC CỦA BẠN
                if (account.getRoleId() == 1) { 
                    response.sendRedirect("admin/manage-classes");
                } else if (account.getRoleId() == 2) { 
                    response.sendRedirect("driver/dashboard"); 
                } else if (account.getRoleId() == 3) { 
                    response.sendRedirect("parent/notifications");
                } else if (account.getRoleId() == 4) { 
                    response.sendRedirect("student/dashboard"); 
                } else {
                    response.sendRedirect(request.getContextPath() + "/auth/login?error=invalid_role");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/auth/login?error=google_exception");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

    private String getAccessToken(String code) throws IOException {
        URL url = new URL(TOKEN_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setDoOutput(true);

        String params = "code=" + URLEncoder.encode(code, StandardCharsets.UTF_8.name())
                + "&client_id=" + URLEncoder.encode(CLIENT_ID, StandardCharsets.UTF_8.name())
                + "&client_secret=" + URLEncoder.encode(CLIENT_SECRET, StandardCharsets.UTF_8.name())
                + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI, StandardCharsets.UTF_8.name())
                + "&grant_type=authorization_code";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(params.getBytes(StandardCharsets.UTF_8));
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder res = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                res.append(line.trim());
            }
            return new JSONObject(res.toString()).getString("access_token");
        }
    }

    private String getUserEmail(String accessToken) throws IOException {
        URL url = new URL(USERINFO_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder res = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                res.append(line.trim());
            }
            return new JSONObject(res.toString()).getString("email");
        }
    }
}