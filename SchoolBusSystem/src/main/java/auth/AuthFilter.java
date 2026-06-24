package auth;

import model.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebFilter;
import java.io.IOException;

/**
 * Filter bảo vệ tất cả URL theo role
 * Tự động redirect về login nếu chưa đăng nhập
 * Tự động chặn nếu không đủ quyền
 */
@WebFilter("/*")
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  req  = (HttpServletRequest)  request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String uri = req.getRequestURI();

        // =============================================
        // CÁC ĐƯỜNG DẪN KHÔNG CẦN ĐĂNG NHẬP
        // =============================================
        if (isPublicPath(uri)) {
            chain.doFilter(request, response);
            return;
        }

        // =============================================
        // KIỂM TRA SESSION
        // =============================================
        HttpSession session = req.getSession(false);
        Object currentUser  = (session != null) ? session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            // Chưa đăng nhập → về trang login
            resp.sendRedirect(req.getContextPath() + "/auth/login");
            return;
        }

        // =============================================
        // KIỂM TRA QUYỀN THEO URL
        // =============================================
        String role = (String) session.getAttribute("userRole");

        if (uri.contains("/admin/") && !"admin".equals(role)) {
            resp.sendRedirect(req.getContextPath() + "/error/403.jsp");
            return;
        }
        if (uri.contains("/manager/") && !("admin".equals(role) || "manager".equals(role))) {
            resp.sendRedirect(req.getContextPath() + "/error/403.jsp");
            return;
        }
        if (uri.contains("/driver/") && !"driver".equals(role)) {
            resp.sendRedirect(req.getContextPath() + "/error/403.jsp");
            return;
        }
        if (uri.contains("/parent/") && !"parent".equals(role)) {
            resp.sendRedirect(req.getContextPath() + "/error/403.jsp");
            return;
        }
        if (uri.contains("/student/") && !"student".equals(role)) {
            resp.sendRedirect(req.getContextPath() + "/error/403.jsp");
            return;
        }

        // Đã đăng nhập và đủ quyền → tiếp tục
        chain.doFilter(request, response);
    }

    // =============================================
    // ĐƯỜNG DẪN CÔNG KHAI (không cần login)
    // =============================================
    private boolean isPublicPath(String uri) {
        return uri.contains("/auth/login")
            || uri.contains("/auth/register")
            || uri.contains("/auth/forgot-password")
            || uri.contains("/auth/google")
            || uri.endsWith(".css")
            || uri.endsWith(".js")
            || uri.endsWith(".png")
            || uri.endsWith(".jpg")
            || uri.endsWith(".ico")
            || uri.endsWith(".woff")
            || uri.endsWith(".woff2")
            || uri.contains("/error/");
    }
}
