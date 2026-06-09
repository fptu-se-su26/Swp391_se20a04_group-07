package controllleradmin;

import dao.DriverDAO;
import dao.ParentAreaDAO;
import dao.VehicleDAO;
import model.Driver;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "UpdateDriverServlet", urlPatterns = {"/admin/update-driver"})
public class UpdateDriverServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int driverId = Integer.parseInt(request.getParameter("id"));
            Driver driver = new DriverDAO().getDriverById(driverId);

            if (driver != null) {
                request.setAttribute("driver", driver);
                request.setAttribute("areaList", new ParentAreaDAO().getAllAreas());
                request.setAttribute("vehicleList", new VehicleDAO().getAllActiveVehicles());
                request.getRequestDispatcher("/admin/update-driver.jsp").forward(request, response);
            } else {
                response.sendRedirect("manage-drivers?error=notfound");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-drivers");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            Driver d = new Driver();
            d.setDriverId(Integer.parseInt(request.getParameter("driverId")));
            d.setFullName(request.getParameter("fullName"));
            d.setBirthYear(Integer.parseInt(request.getParameter("birthYear")));
            d.setLicenseNumber(request.getParameter("licenseNumber"));
            d.setExperienceYears(Integer.parseInt(request.getParameter("experienceYears")));
            d.setAreaId(Integer.parseInt(request.getParameter("areaId")));
            d.setVehicleId(Integer.parseInt(request.getParameter("vehicleId")));

            if (new DriverDAO().updateDriver(d)) {
                response.sendRedirect("manage-drivers?msg=update_success");
            } else {
                response.sendRedirect("update-driver?id=" + d.getDriverId() + "&error=failed");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-drivers?error=invalid");
        }
    }
}