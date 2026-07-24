package controllerdriver;

import dao.NotificationDAO;
import dao.DriverDAO; // Mở khóa thư viện DAO của tài xế
import model.Notification;
import model.User; // Class User (Hoặc Account tùy bạn đặt tên trong dự án)
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "DriverNotificationServlet", urlPatterns = {"/driver/notifications"})
public class DriverNotificationServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // =========================================================
        // 1. XÁC THỰC BẢO MẬT: KIỂM TRA PHIÊN ĐĂNG NHẬP
        // =========================================================
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user"); 
        
        // Đuổi về trang đăng nhập nếu chưa có Session
        if (loggedInUser == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return; 
        }

        int userId = loggedInUser.getUserId(); 

        // =========================================================
        // 2. LẤY MÃ TÀI XẾ THỰC TẾ & CHỐT CHẶN PHÂN QUYỀN
        // =========================================================
        DriverDAO driverDAO = new DriverDAO();
        int driverId = driverDAO.getDriverIdByUserId(userId);
        
        // Nếu hàm trả về -1 (Nghĩa là User này không phải là Tài xế) -> Chặn truy cập
        if (driverId == -1) {
            response.sendRedirect(request.getContextPath() + "/login.jsp?error=unauthorized");
            return;
        }

        // =========================================================
        // 3. TRUY VẤN VÀ HIỂN THỊ THÔNG BÁO
        // =========================================================
        NotificationDAO notifDAO = new NotificationDAO();
        
        // Dùng đúng ID tài xế và ID User để quét thông báo
        List<Notification> notifications = notifDAO.getDriverNotifications(userId, driverId);
        
        request.setAttribute("notifications", notifications);
        request.getRequestDispatcher("/driver/notifications.jsp").forward(request, response);
    }
}