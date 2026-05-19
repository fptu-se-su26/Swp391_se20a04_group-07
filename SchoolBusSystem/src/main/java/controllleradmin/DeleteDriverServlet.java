package controllleradmin;

import dao.DriverDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "DeleteDriverServlet", urlPatterns = {"/admin/delete-driver"})
public class DeleteDriverServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int driverId = Integer.parseInt(request.getParameter("driverId"));
        new DriverDAO().deleteDriver(driverId);
        response.sendRedirect("manage-drivers?msg=delete_success");
    }
}