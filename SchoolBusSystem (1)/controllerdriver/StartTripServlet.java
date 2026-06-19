package controllerdriver;

import dao.TripDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "StartTripServlet", urlPatterns = {"/driver/start-trip"})
public class StartTripServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/driver/dashboard");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String tripIdParam = request.getParameter("tripId");
        
        if (tripIdParam != null && !tripIdParam.isEmpty()) {
            try {
                int tripId = Integer.parseInt(tripIdParam);
                TripDAO tripDAO = new TripDAO();
                
                boolean isUpdated = tripDAO.updateTripStatus(tripId, "IN_PROGRESS");
                
                if (isUpdated) {
                    response.sendRedirect(request.getContextPath() + "/driver/trip?tripId=" + tripId);
                    return;
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        response.sendRedirect(request.getContextPath() + "/driver/dashboard?error=start_failed");
    }
}