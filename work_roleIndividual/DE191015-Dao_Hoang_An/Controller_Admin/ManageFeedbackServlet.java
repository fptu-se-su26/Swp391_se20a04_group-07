package controllleradmin;

import dao.FeedbackDAO;
import model.Feedback;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageFeedbackServlet", urlPatterns = {"/admin/manage-feedbacks"})
public class ManageFeedbackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        FeedbackDAO fDAO = new FeedbackDAO();
        List<Feedback> list = fDAO.getAllFeedbacks();

        // Gửi danh sách feedbackList sang JSP
        request.setAttribute("feedbackList", list);
        request.getRequestDispatcher("/admin/manage-feedbacks.jsp").forward(request, response);
    }
}
