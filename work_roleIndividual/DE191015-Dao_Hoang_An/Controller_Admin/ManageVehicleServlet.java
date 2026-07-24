package controllleradmin;

import dao.VehicleDAO;
import model.Vehicle;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageVehicleServlet", urlPatterns = {"/admin/manage-vehicles"})
public class ManageVehicleServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        VehicleDAO vDAO = new VehicleDAO();
        List<Vehicle> list = vDAO.getAllVehicles();
        request.setAttribute("vehicleList", list);
        request.getRequestDispatcher("/admin/manage-vehicles.jsp").forward(request, response);
    }
}