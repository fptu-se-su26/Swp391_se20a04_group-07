package controllleradmin;

import dao.NotificationDAO;
import model.Notification;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageNotificationServlet", urlPatterns = {"/admin/manage-notifications"})
public class ManageNotificationServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Lấy lịch sử tất cả thông báo (Cần thêm hàm getAllNotifications() vào DAO)
        NotificationDAO notifDAO = new NotificationDAO();
        List<Notification> notificationList = notifDAO.getAllNotifications();
        request.setAttribute("notificationList", notificationList);

        request.getRequestDispatcher("/admin/manage-notifications.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            String targetGroup = request.getParameter("targetGroup");
            String title = request.getParameter("title");
            String message = request.getParameter("message");

            NotificationDAO notifDAO = new NotificationDAO();

            if (notifDAO.insertBroadcastNotification(targetGroup, title, message)) {
                // SỬA Ở ĐÂY: Truyền thêm tham số group lên URL để JSP hiển thị đúng đối tượng
                response.sendRedirect("manage-notifications?msg=success&group=" + targetGroup);
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendRedirect("manage-notifications?error=failed");
    }
}
