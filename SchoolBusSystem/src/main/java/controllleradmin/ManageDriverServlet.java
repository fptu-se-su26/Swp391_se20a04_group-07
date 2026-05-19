package controllleradmin;

import dao.DriverDAO;
import model.Driver;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageDriverServlet", urlPatterns = {"/admin/manage-drivers"})
public class ManageDriverServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // [ĐÃ SỬA] Lấy danh sách tài xế từ DAO
        DriverDAO driverDAO = new DriverDAO();
        List<Driver> driverList = driverDAO.getAllDrivers();
        request.setAttribute("driverList", driverList);
        
        request.getRequestDispatcher("/admin/manage-drivers.jsp").forward(request, response);
    }
}