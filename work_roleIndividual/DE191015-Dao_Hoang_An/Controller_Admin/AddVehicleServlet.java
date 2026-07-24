package controllleradmin;

import dao.VehicleDAO;
import model.Vehicle;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "AddVehicleServlet", urlPatterns = {"/admin/add-vehicle"})
public class AddVehicleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("/admin/add-vehicle.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        
        String plateNumber = request.getParameter("plateNumber");
        int seatCapacity = Integer.parseInt(request.getParameter("seatCapacity"));
        String vehicleType = request.getParameter("vehicleType");
        String status = request.getParameter("status"); // "Hoạt động" hoặc "Bảo trì"

        Vehicle v = new Vehicle(0, plateNumber, seatCapacity, vehicleType, status);
        VehicleDAO dao = new VehicleDAO();
        
        if(dao.insertVehicle(v)) {
            response.sendRedirect("manage-vehicles?msg=add_success");
        } else {
            response.sendRedirect("add-vehicle?error=failed");
        }
    }
}