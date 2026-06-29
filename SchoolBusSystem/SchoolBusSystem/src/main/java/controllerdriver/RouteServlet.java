package controllerdriver;

import dao.RouteStopDAO;
import model.RouteStop;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "RouteServlet", urlPatterns = {"/driver/route"})
public class RouteServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String routeIdParam = request.getParameter("routeId");
        
        if (routeIdParam != null && !routeIdParam.isEmpty()) {
            try {
                int routeId = Integer.parseInt(routeIdParam);
                RouteStopDAO routeStopDAO = new RouteStopDAO();
                
                List<RouteStop> stops = routeStopDAO.getStopsByRouteId(routeId);
                request.setAttribute("routeStops", stops);
                request.setAttribute("routeId", routeId);
                
                request.getRequestDispatcher("/driver/route.jsp").forward(request, response);
                return;
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        
        // Nếu không có ID tuyến đường, đẩy về dashboard
        response.sendRedirect(request.getContextPath() + "/driver/dashboard");
    }
}