package controllleradmin;

import dao.RouteDAO;
import dao.TripDAO; 
import model.Route;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.Time;

@WebServlet(name = "UpdateRouteServlet", urlPatterns = {"/admin/update-route"})
public class UpdateRouteServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int routeId = Integer.parseInt(request.getParameter("id"));
            Route route = new RouteDAO().getRouteById(routeId);
            
            if (route != null) {
                request.setAttribute("route", route);
                request.setAttribute("driverList", new TripDAO().getAllDriversForDropdown());
                
                // [ĐÃ THÊM]: Lấy danh sách khu vực để làm Dropdown cho Tên Tuyến
                request.setAttribute("areaList", new RouteDAO().getAllAreasForDropdown());
                
                request.getRequestDispatcher("/admin/update-route.jsp").forward(request, response);
            } else {
                response.sendRedirect("manage-routes?error=notfound");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-routes?error=invalid_id");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            Route r = new Route();
            r.setRouteId(Integer.parseInt(request.getParameter("routeId")));
            r.setRouteName(request.getParameter("routeName"));
            r.setStartLocation(request.getParameter("startLocation"));
            r.setEndLocation(request.getParameter("endLocation"));
            r.setDriverId(Integer.parseInt(request.getParameter("driverId")));
            r.setStatus(Integer.parseInt(request.getParameter("status")) == 1);

            String pickupStr = request.getParameter("pickupTime");
            String dropoffStr = request.getParameter("dropoffTime");
            if(pickupStr.length() == 5) pickupStr += ":00";
            if(dropoffStr.length() == 5) dropoffStr += ":00";
            r.setPickupTime(Time.valueOf(pickupStr));
            r.setDropoffTime(Time.valueOf(dropoffStr));

            if (new RouteDAO().updateRoute(r)) {
                response.sendRedirect("manage-routes?msg=update_success");
            } else {
                response.sendRedirect("update-route?id=" + r.getRouteId() + "&error=failed");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-routes?error=invalid");
        }
    }
}