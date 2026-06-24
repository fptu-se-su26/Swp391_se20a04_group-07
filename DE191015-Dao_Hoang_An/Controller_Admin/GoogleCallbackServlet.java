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

/**
 * GoogleCallbackServlet - Xử lý callback OAuth2 từ Google.
 *
 * BẢO MẬT:
 *  - Kiểm tra state parameter để chống CSRF
 *  - Session fixation protection: invalidate session cũ trước khi gán user mới
 *  - Timeout connection để tránh treo request
 *  - Không log access_token, không expose lỗi hệ thống ra response
 *
 * ⚠️ CLIENT_SECRET nên đưa vào biến môi trường hoặc web.xml context-param
 *    thay vì hard-code trong source code.
 */
@WebServlet(name = "GoogleCallbackServlet", urlPatterns = {"/GoogleCallbackServlet"})
public class GoogleCallbackServlet extends HttpServlet {

    // ⚠️ Production: đọc từ System.getenv("GOOGLE_CLIENT_ID")
    private static final String CLIENT_ID     = "856732490349-vpcvp2dolapdlnh5tejgp193u4smda7p.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";
    private static final String REDIRECT_URI  = "http://localhost:8080/SchoolBusSystem/GoogleCallbackServlet";

    private static final String TOKEN_URL    = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    private static final int CONNECT_TIMEOUT = 5000; // 5 giây
    private static final int READ_TIMEOUT    = 5000;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String code  = request.getParameter("code");
        String state = request.getParameter("state");
        String error = request.getParameter("error");

        // ── Người dùng từ chối cấp quyền ──────────────────────────────────
        if (error != null) {
            response.sendRedirect(request.getContextPath() + "/auth/login?error=google_denied");
            return;
        }

        if (code == null || code.isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/auth/login?error=google_failed");
            return;
        }

        // ── Kiểm tra CSRF state ────────────────────────────────────────────
        HttpSession oldSession = request.getSession(false);
        String expectedState = (oldSession != null)
                ? (String) oldSession.getAttribute("oauth_state") : null;

        if (expectedState != null && !expectedState.equals(state)) {
            response.sendRedirect(request.getContextPath() + "/auth/login?error=csrf_detected");
            return;
        }

        try {
            String accessToken = getAccessToken(code);
            String email       = getUserEmail(accessToken);

            if (email == null || email.isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/auth/login?error=google_no_email");
                return;
            }

            UserDAO userDAO = new UserDAO();
            User account = userDAO.getUserByEmail(email);

            if (account == null) {
                response.sendRedirect(request.getContextPath() + "/auth/login?error=google_not_found");
                return;
            }

            // ── Session fixation protection ────────────────────────────────
            // Invalidate session cũ, tạo session mới trước khi gán dữ liệu
            if (oldSession != null) {
                oldSession.invalidate();
            }
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("user", account);
            newSession.setMaxInactiveInterval(30 * 60); // 30 phút

            // ── Điều hướng theo role (tương thích Java 8+) ────────────────
            int roleId = account.getRoleId();
            if (roleId == 1) {
                response.sendRedirect("admin/manage-classes");
            } else if (roleId == 2) {
                response.sendRedirect("driver/dashboard");
            } else if (roleId == 3) {
                response.sendRedirect("parent/notifications");
            } else if (roleId == 4) {
                response.sendRedirect("student/dashboard");
            } else {
                response.sendRedirect(request.getContextPath() + "/auth/login?error=invalid_role");
            }

        } catch (Exception e) {
            // Không log chi tiết exception ra response (tránh lộ thông tin hệ thống)
            getServletContext().log("[GoogleCallback] Lỗi OAuth2", e);
            response.sendRedirect(request.getContextPath() + "/auth/login?error=google_exception");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

    // =========================================================================
    // ĐỔI CODE LẤY ACCESS TOKEN
    // =========================================================================
    private String getAccessToken(String code) throws IOException {
        URL url = new URL(TOKEN_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setConnectTimeout(CONNECT_TIMEOUT);
        conn.setReadTimeout(READ_TIMEOUT);
        conn.setDoOutput(true);

        String params = "code="         + URLEncoder.encode(code,         StandardCharsets.UTF_8.name())
                + "&client_id="         + URLEncoder.encode(CLIENT_ID,    StandardCharsets.UTF_8.name())
                + "&client_secret="     + URLEncoder.encode(CLIENT_SECRET, StandardCharsets.UTF_8.name())
                + "&redirect_uri="      + URLEncoder.encode(REDIRECT_URI,  StandardCharsets.UTF_8.name())
                + "&grant_type=authorization_code";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(params.getBytes(StandardCharsets.UTF_8));
        }

        return readResponse(conn).getString("access_token");
    }

    // =========================================================================
    // LẤY EMAIL TỪ ACCESS TOKEN
    // =========================================================================
    private String getUserEmail(String accessToken) throws IOException {
        URL url = new URL(USERINFO_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
        conn.setConnectTimeout(CONNECT_TIMEOUT);
        conn.setReadTimeout(READ_TIMEOUT);
        return readResponse(conn).getString("email");
    }

    // =========================================================================
    // HELPER ĐỌC RESPONSE JSON
    // =========================================================================
    private JSONObject readResponse(HttpURLConnection conn) throws IOException {
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line.trim());
            }
            return new JSONObject(sb.toString());
        }
    }
}