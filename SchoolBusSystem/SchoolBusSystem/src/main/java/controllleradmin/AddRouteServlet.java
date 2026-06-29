package controllleradmin;

import dao.DriverDAO;
import dao.RouteDAO;
import model.Route;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.Time;

@WebServlet(name = "AddRouteServlet", urlPatterns = {"/admin/add-route"})
public class AddRouteServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Gửi danh sách Tài xế (Code cũ của bạn)
        request.setAttribute("driverList", new DriverDAO().getAllDrivers());

        // [THÊM DÒNG NÀY VÀO]: Gửi danh sách Khu vực sang giao diện JSP
        request.setAttribute("areaList", new RouteDAO().getAllAreasForDropdown());

        request.getRequestDispatcher("/admin/add-route.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            Route r = new Route();
            r.setRouteName(request.getParameter("routeName"));
            r.setStartLocation(request.getParameter("startLocation"));
            r.setEndLocation(request.getParameter("endLocation"));
            r.setDriverId(Integer.parseInt(request.getParameter("driverId")));
            r.setStatus(true);

            // Xử lý chuyển đổi Giờ từ chuỗi HTML5 sang java.sql.Time
            String pickupStr = request.getParameter("pickupTime");
            String dropoffStr = request.getParameter("dropoffTime");
            if (pickupStr.length() == 5) {
                pickupStr += ":00";
            }
            if (dropoffStr.length() == 5) {
                dropoffStr += ":00";
            }

            r.setPickupTime(Time.valueOf(pickupStr));
            r.setDropoffTime(Time.valueOf(dropoffStr));

            if (new RouteDAO().insertRoute(r)) {
                response.sendRedirect("manage-routes?msg=add_success");
            } else {
                response.sendRedirect("add-route?error=failed");
            }
        } catch (Exception e) {
            response.sendRedirect("add-route?error=invalid");
        }
    }
}
