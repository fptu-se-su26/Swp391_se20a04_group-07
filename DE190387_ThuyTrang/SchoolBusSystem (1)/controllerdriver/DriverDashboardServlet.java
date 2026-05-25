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
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            DriverDAO driverDAO = new DriverDAO();
            TripDAO tripDAO = new TripDAO();

            Driver driver = driverDAO.getDriverByUserId(loggedInUser.getUserId());
            if (driver != null) {
                List<Trip> trips = tripDAO.getTripsByDriver(driver.getDriverId());
                request.setAttribute("trips", trips);
                request.setAttribute("driverInfo", driver);
            }
        }
        
        request.getRequestDispatcher("/driver/dashboard.jsp").forward(request, response);
    }
}