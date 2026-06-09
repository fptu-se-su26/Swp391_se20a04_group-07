package controllleradmin;

import dao.LeaveRequestDAO;
import model.LeaveRequest;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageLeaveRequestServlet", urlPatterns = {"/admin/manage-leave-requests"})
public class ManageLeaveRequestServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        LeaveRequestDAO lrDAO = new LeaveRequestDAO();
        List<LeaveRequest> requestList = lrDAO.getAllLeaveRequests(); // Hàm đã viết sẵn
        
        request.setAttribute("requestList", requestList);
        request.getRequestDispatcher("/admin/manage-leave-requests.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Xử lý khi Admin bấm nút Duyệt (APPROVED) hoặc Từ chối (REJECTED)
        String requestIdParam = request.getParameter("requestId");
        String action = request.getParameter("action");
        
        if (requestIdParam != null && action != null) {
            try {
                int requestId = Integer.parseInt(requestIdParam);
                LeaveRequestDAO lrDAO = new LeaveRequestDAO();
                lrDAO.updateStatus(requestId, action); // Cập nhật vào Database
                
                response.sendRedirect("manage-leave-requests?msg=updated");
                return;
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        response.sendRedirect("manage-leave-requests?error=failed");
    }
}