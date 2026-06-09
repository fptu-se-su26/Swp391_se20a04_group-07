package controllleradmin;

import dao.RouteDAO;
import model.Route;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManagerRouteServlet", urlPatterns = {"/admin/manage-routes"})
public class ManageRouteServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        RouteDAO rDAO = new RouteDAO();
        List<Route> list = rDAO.getAllRoutes();
        request.setAttribute("routeList", list);
        request.getRequestDispatcher("/admin/manage-routes.jsp").forward(request, response);
    }
}