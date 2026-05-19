package controllerdriver;

import dao.TripDAO;
import model.Trip;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "TripServlet", urlPatterns = {"/driver/trip"})
public class TripServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String tripIdParam = request.getParameter("tripId");
        
        if (tripIdParam != null && !tripIdParam.isEmpty()) {
            try {
                int tripId = Integer.parseInt(tripIdParam);
                TripDAO tripDAO = new TripDAO();
                Trip trip = tripDAO.getTripById(tripId);
                
                if (trip != null) {
                    request.setAttribute("trip", trip);
                    request.getRequestDispatcher("/driver/trip.jsp").forward(request, response);
                    return;
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        
        response.sendRedirect(request.getContextPath() + "/driver/dashboard");
    }
}