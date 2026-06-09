package controllleradmin;

import dao.ParentDAO;
import dao.ParentAreaDAO;
import model.Parent;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "UpdateParentServlet", urlPatterns = {"/admin/update-parent"})
public class UpdateParentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int parentId = Integer.parseInt(request.getParameter("id"));
            Parent p = new ParentDAO().getParentById(parentId);
            if (p != null) {
                request.setAttribute("parent", p);
                request.setAttribute("areaList", new ParentAreaDAO().getAllAreas());
                request.getRequestDispatcher("/admin/update-parent.jsp").forward(request, response);
            } else {
                response.sendRedirect("manage-parents?error=notfound");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-parents");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            int parentId = Integer.parseInt(request.getParameter("parentId"));
            String address = request.getParameter("address");
            String emergencyPhone = request.getParameter("emergencyPhone");
            int areaId = Integer.parseInt(request.getParameter("areaId"));

            // Gọi DAO để update
            ParentDAO dao = new ParentDAO();
            if (dao.updateParent(parentId, address, emergencyPhone, areaId)) {
                response.sendRedirect("manage-parents?msg=update_success");
            } else {
                response.sendRedirect("update-parent?id=" + parentId + "&error=failed");
            }
        } catch (Exception e) {
            response.sendRedirect("manage-parents?error=invalid");
        }
    }
}