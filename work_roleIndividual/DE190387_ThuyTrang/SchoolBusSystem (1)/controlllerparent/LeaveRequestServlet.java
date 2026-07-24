package controlllerparent;

import dao.LeaveRequestDAO;
import dao.ParentDAO;
import dao.StudentDAO;
import model.LeaveRequest;
import model.Parent;
import model.Student;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Date;
import java.util.List;

@WebServlet(name = "LeaveRequestServlet", urlPatterns = {"/parent/leave-request"})
public class LeaveRequestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            ParentDAO parentDAO = new ParentDAO();
            LeaveRequestDAO leaveRequestDAO = new LeaveRequestDAO();
            StudentDAO studentDAO = new StudentDAO();
            
            Parent parent = parentDAO.getParentByUserId(loggedInUser.getUserId());
            if (parent != null) {
                // Lấy lịch sử xin phép nghỉ
                List<LeaveRequest> requests = leaveRequestDAO.getRequestsByParent(parent.getParentId());
                request.setAttribute("leaveRequests", requests);
                
                // [ĐÃ SỬA] Phải truyền cả danh sách con cái sang để hiện lên thẻ <select>
                List<Student> children = studentDAO.getStudentsByParentId(parent.getParentId());
                request.setAttribute("children", children);
            }
        }
        
        request.getRequestDispatcher("/parent/leave-request.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8"); // Sửa lỗi font tiếng Việt khi submit form
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");
        
        try {
            int studentId = Integer.parseInt(request.getParameter("studentId"));
            Date leaveDate = Date.valueOf(request.getParameter("leaveDate")); // Format: YYYY-MM-DD
            String reason = request.getParameter("reason");
            
            ParentDAO parentDAO = new ParentDAO();
            Parent parent = parentDAO.getParentByUserId(loggedInUser.getUserId());
            
            if (parent != null) {
                LeaveRequest lr = new LeaveRequest();
                lr.setStudentId(studentId);
                lr.setParentId(parent.getParentId());
                lr.setLeaveDate(leaveDate);
                lr.setReason(reason);
                
                LeaveRequestDAO dao = new LeaveRequestDAO();
                boolean success = dao.insertLeaveRequest(lr);
                
                if (success) {
                    response.sendRedirect(request.getContextPath() + "/parent/leave-request?msg=success");
                    return;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        response.sendRedirect(request.getContextPath() + "/parent/leave-request?error=failed");
    }
}