package controllleradmin;

import dao.TripDAO;
import model.Trip;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageTripServlet", urlPatterns = {"/admin/manage-trips"})
public class ManageTripServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        TripDAO tripDAO = new TripDAO();
        
        // 1. Lấy danh sách chuyến đi hiện có
        request.setAttribute("tripList", tripDAO.getAllTrips());
        
        // 2. Lấy dữ liệu đổ vào các Select Box (Tuyến, Xe, Tài xế) -> RẤT QUAN TRỌNG
        request.setAttribute("routeList", tripDAO.getAllRoutesForDropdown());
        request.setAttribute("vehicleList", tripDAO.getAllVehiclesForDropdown());
        request.setAttribute("driverList", tripDAO.getAllDriversForDropdown());
        
        request.getRequestDispatcher("/admin/manage-trips.jsp").forward(request, response);
    }

    // Nhận tín hiệu Thêm (Add) hoặc Sửa (Edit) từ form
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        TripDAO tripDAO = new TripDAO();
        
        try {
            if ("add".equals(action)) {
                Trip t = new Trip();
                t.setRouteId(Integer.parseInt(request.getParameter("routeId")));
                t.setVehicleId(Integer.parseInt(request.getParameter("vehicleId")));
                t.setDriverId(Integer.parseInt(request.getParameter("driverId")));
                t.setTripDate(java.sql.Date.valueOf(request.getParameter("tripDate")));
                t.setTripType(request.getParameter("tripType"));
                
                if (tripDAO.insertTrip(t)) {
                    response.sendRedirect("manage-trips?msg=success");
                } else {
                    response.sendRedirect("manage-trips?error=failed");
                }
            } else if ("edit".equals(action)) {
                Trip t = new Trip();
                t.setTripId(Integer.parseInt(request.getParameter("tripId")));
                t.setRouteId(Integer.parseInt(request.getParameter("routeId")));
                t.setVehicleId(Integer.parseInt(request.getParameter("vehicleId")));
                t.setDriverId(Integer.parseInt(request.getParameter("driverId")));
                t.setTripDate(java.sql.Date.valueOf(request.getParameter("tripDate")));
                t.setTripType(request.getParameter("tripType"));
                t.setStatus(request.getParameter("status"));
                
                if (tripDAO.updateTrip(t)) {
                    response.sendRedirect("manage-trips?msg=success");
                } else {
                    response.sendRedirect("manage-trips?error=failed");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("manage-trips?error=exception");
        }
    }
}