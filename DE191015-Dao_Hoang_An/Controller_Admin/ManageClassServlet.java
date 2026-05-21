package controllleradmin;

import dao.ClassDAO;
import model.Class;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ManageClassServlet", urlPatterns = {"/admin/manage-classes"})
public class ManageClassServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        ClassDAO classDAO = new ClassDAO();
        List<Class> classList = classDAO.getAllClasses();
        
        request.setAttribute("classList", classList);
        request.getRequestDispatcher("/admin/manage-classes.jsp").forward(request, response);
    }
}