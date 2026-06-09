package controllleradmin;

import dao.VehicleDAO;
import model.Vehicle;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "UpdateVehicleServlet", urlPatterns = {"/admin/update-vehicle"})
public class UpdateVehicleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int vehicleId = Integer.parseInt(request.getParameter("id"));
            Vehicle vehicle = new VehicleDAO().getVehicleById(vehicleId);

            if (vehicle != null) {
                request.setAttribute("vehicle", vehicle);
                request.getRequestDispatcher("/admin/update-vehicle.jsp").forward(request, response);
            } else {
                response.sendRedirect("manage-vehicles?error=notfound");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-vehicles?error=invalid_id");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        
        try {
            int vehicleId = Integer.parseInt(request.getParameter("vehicleId"));
            String plateNumber = request.getParameter("plateNumber");
            int seatCapacity = Integer.parseInt(request.getParameter("seatCapacity"));
            String vehicleType = request.getParameter("vehicleType");
            String status = request.getParameter("status"); // "Hoạt động" hoặc "Bảo trì"

            Vehicle v = new Vehicle(vehicleId, plateNumber, seatCapacity, vehicleType, status);
            VehicleDAO dao = new VehicleDAO();
            
            if(dao.updateVehicle(v)) {
                response.sendRedirect("manage-vehicles?msg=update_success");
            } else {
                response.sendRedirect("update-vehicle?id=" + vehicleId + "&error=failed");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-vehicles?error=invalid_data");
        }
    }
}