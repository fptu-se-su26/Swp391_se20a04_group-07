package controllerdriver;

import dao.TripDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "EndTripServlet", urlPatterns = {"/driver/end-trip"})
public class EndTripServlet extends HttpServlet {

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
                
                boolean isUpdated = tripDAO.updateTripStatus(tripId, "COMPLETED");
                
                if (isUpdated) {
                    response.sendRedirect(request.getContextPath() + "/driver/dashboard?msg=trip_ended");
                    return;
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        response.sendRedirect(request.getContextPath() + "/driver/dashboard?error=end_failed");
    }
}