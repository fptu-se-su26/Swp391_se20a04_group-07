package controlllerparent;

import dao.NotificationDAO;
import model.Notification;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "NotificationServlet", urlPatterns = {"/parent/notifications"})
public class NotificationServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            NotificationDAO notifDAO = new NotificationDAO();
            
            // [ĐÃ SỬA]: Gọi hàm getParentNotifications thay vì getNotificationsByUserId
            // Hệ thống sẽ tự động giấu đi các thông báo của Tài xế!
            List<Notification> notifications = notifDAO.getParentNotifications(loggedInUser.getUserId());
            
            request.setAttribute("notifications", notifications);
            request.getRequestDispatcher("/parent/notifications.jsp").forward(request, response);
            
        } else {
            response.sendRedirect(request.getContextPath() + "/login");
        }
    }
}