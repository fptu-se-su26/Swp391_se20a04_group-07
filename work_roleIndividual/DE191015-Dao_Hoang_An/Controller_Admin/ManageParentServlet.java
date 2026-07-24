package controllleradmin;

import dao.ParentDAO;
import dao.ParentAreaDAO;
import model.Parent;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageParentServlet", urlPatterns = {"/admin/manage-parents"})
public class ManageParentServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        ParentDAO parentDAO = new ParentDAO();
        String areaIdParam = request.getParameter("areaId");
        List<Parent> parentList;

        // Xử lý lọc theo Area ID (Từ trang Khu vực bấm vào, hoặc từ Dropdown chọn)
        if (areaIdParam != null && !areaIdParam.trim().isEmpty()) {
            int areaId = Integer.parseInt(areaIdParam);
            parentList = parentDAO.getParentsByArea(areaId);
            request.setAttribute("selectedAreaId", areaId); // Ghim trạng thái đang chọn
        } else {
            // Hiển thị tất cả
            parentList = parentDAO.getAllParents();
        }
        
        // [BỔ SUNG] Lấy danh sách các khu vực đẩy sang giao diện làm Dropdown
        ParentAreaDAO areaDAO = new ParentAreaDAO();
        request.setAttribute("areaList", areaDAO.getAllAreas());
        
        request.setAttribute("parentList", parentList);
        request.getRequestDispatcher("/admin/manage-parents.jsp").forward(request, response);
    }
}