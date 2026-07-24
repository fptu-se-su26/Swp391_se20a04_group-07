package controlllerparent;

import dao.FeedbackDAO;
import model.Feedback;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(name = "FeedbackServlet", urlPatterns = {"/parent/feedback"})
public class FeedbackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/parent/feedback.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8"); // [ĐÃ SỬA] Đảm bảo không lỗi font tiếng Việt
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");
        
        String subject = request.getParameter("subject");
        String content = request.getParameter("content");
        
        if (loggedInUser != null && subject != null && content != null) {
            Feedback feedback = new Feedback();
            feedback.setUserId(loggedInUser.getUserId());
            feedback.setSubject(subject);
            feedback.setContent(content);
            
            FeedbackDAO feedbackDAO = new FeedbackDAO();
            boolean success = feedbackDAO.insertFeedback(feedback);
            
            if (success) {
                response.sendRedirect(request.getContextPath() + "/parent/feedback?msg=success");
                return;
            }
        }
        response.sendRedirect(request.getContextPath() + "/parent/feedback?error=failed");
    }
}