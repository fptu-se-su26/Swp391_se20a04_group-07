package controllleradmin;

import dao.DashboardDAO;
import model.DashboardStatistic;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "AdminDashboardServlet", urlPatterns = {"/admin/dashboard"})
public class AdminDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        DashboardDAO dbDAO = new DashboardDAO();

        // 1. Lấy tổng số liệu từ Model cũ của bạn
        DashboardStatistic stats = dbDAO.getAdminStatistics();
        request.setAttribute("stats", stats);

        // [QUAN TRỌNG] Lấy tổng Phụ huynh (Vì Model DashboardStatistic đang thiếu Phụ huynh)
        request.setAttribute("totalParents", dbDAO.getTotalParents());
        // [QUAN TRỌNG] Lấy số liệu TĂNG TRƯỞNG TRONG THÁNG NÀY (Đập bỏ số ảo)
        request.setAttribute("newStudents", dbDAO.getGrowthThisMonth("students"));
        request.setAttribute("newParents", dbDAO.getGrowthThisMonth("parents"));
        request.setAttribute("newDrivers", dbDAO.getGrowthThisMonth("drivers"));
        request.setAttribute("newVehicles", dbDAO.getGrowthThisMonth("vehicles"));

        // 2. Thống kê chuyến đi trong tháng
        int completedTrips = dbDAO.getCompletedTripsThisMonth();
        request.setAttribute("completedTrips", completedTrips);

        // 3. Biểu đồ
        List<Integer> chartData = dbDAO.getTripsChartData();
        request.setAttribute("chartData", chartData);

        request.getRequestDispatcher("/admin/dashboard.jsp").forward(request, response);
    }
}
