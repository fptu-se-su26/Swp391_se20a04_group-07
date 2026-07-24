package controllleradmin;

import dao.VehicleDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "DeleteVehicleServlet", urlPatterns = {"/admin/delete-vehicle"})
public class DeleteVehicleServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int vehicleId = Integer.parseInt(request.getParameter("vehicleId"));
            VehicleDAO dao = new VehicleDAO();
            
            if(dao.deleteVehicle(vehicleId)) {
                response.sendRedirect("manage-vehicles?msg=delete_success");
            } else {
                response.sendRedirect("manage-vehicles?error=delete_failed");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-vehicles?error=invalid");
        }
    }
}