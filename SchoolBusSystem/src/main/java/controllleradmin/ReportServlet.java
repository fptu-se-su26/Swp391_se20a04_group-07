package controllleradmin;

import dao.DashboardDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "ReportServlet", urlPatterns = {"/admin/reports"})
public class ReportServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        DashboardDAO dbDAO = new DashboardDAO();
        
        // Đẩy số liệu chuyến đi đã hoàn thành trong tháng sang JSP
        int completedTrips = dbDAO.getCompletedTripsThisMonth();
        request.setAttribute("completedTrips", completedTrips);
        
        // (Tương lai bạn có thể gọi DBDAO để tính doanh thu thật ở đây)
        long monthlyRevenue = completedTrips * 150000; // Giả sử 150k/chuyến
        request.setAttribute("monthlyRevenue", monthlyRevenue);
        
        request.getRequestDispatcher("/admin/reports.jsp").forward(request, response);
    }
}