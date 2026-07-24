package controllleradmin;

import dao.ParentAreaDAO;
import model.ParentArea;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageParentAreaServlet", urlPatterns = {"/admin/parent-areas"})
public class ManageParentAreaServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ParentAreaDAO dao = new ParentAreaDAO();
        List<ParentArea> list = dao.getAllAreas();
        request.setAttribute("areaList", list);
        request.getRequestDispatcher("/admin/manage-parent-areas.jsp").forward(request, response);
    }
}