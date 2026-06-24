package controllerdriver;

import dao.DriverDAO;
import dao.TripDAO;
import model.Driver;
import model.Trip;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "DriverDashboardServlet", urlPatterns = {"/driver/dashboard"})
public class DriverDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User loggedInUser = (session != null) ? (User) session.getAttribute("user") : null;

        // Chưa đăng nhập → redirect
        if (loggedInUser == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        DriverDAO driverDAO = new DriverDAO();
        Driver driver = driverDAO.getDriverByUserId(loggedInUser.getUserId());

        if (driver != null) {
            TripDAO tripDAO = new TripDAO();
            // Lấy các chuyến xe được phân công cho tài xế này (hôm nay)
            List<Trip> trips = tripDAO.getTodayTripsByDriver(driver.getDriverId());
            request.setAttribute("trips", trips);
            request.setAttribute("driverInfo", driver);
        } else {
            // User đăng nhập nhưng không phải tài xế trong hệ thống
            response.sendRedirect(request.getContextPath() + "/login?error=notDriver");
            return;
        }

        request.getRequestDispatcher("/driver/dashboard.jsp").forward(request, response);
    }
}
