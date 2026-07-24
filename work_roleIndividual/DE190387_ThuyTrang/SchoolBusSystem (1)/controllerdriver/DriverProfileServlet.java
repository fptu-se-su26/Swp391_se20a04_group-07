package controllerdriver;

import dao.DriverDAO;
import dao.UserDAO;
import model.Driver;
import model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(name = "DriverProfileServlet", urlPatterns = {"/driver/profile"})
public class DriverProfileServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            DriverDAO driverDAO = new DriverDAO();
            Driver driver = driverDAO.getDriverByUserId(loggedInUser.getUserId());
            request.setAttribute("driverProfile", driver);
        }
        
        request.getRequestDispatcher("/driver/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("user");

        if (loggedInUser != null) {
            String phone = request.getParameter("phone");
            String licenseNumber = request.getParameter("licenseNumber");
            String experienceYearsParam = request.getParameter("experienceYears");

            try {
                // 1. Cập nhật bảng User (Số điện thoại)
                UserDAO userDAO = new UserDAO();
                userDAO.updateUserProfile(loggedInUser.getUserId(), phone);
                loggedInUser.setPhone(phone); // Cập nhật lại session hiện tại
                
                // 2. Cập nhật bảng Driver (Bằng lái, kinh nghiệm)
                if (experienceYearsParam != null && !experienceYearsParam.isEmpty()) {
                    int experienceYears = Integer.parseInt(experienceYearsParam);
                    DriverDAO driverDAO = new DriverDAO();
                    Driver currentDriver = driverDAO.getDriverByUserId(loggedInUser.getUserId());
                    
                    if (currentDriver != null) {
                        driverDAO.updateDriverProfile(currentDriver.getDriverId(), licenseNumber, experienceYears);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                response.sendRedirect(request.getContextPath() + "/driver/profile?error=update_failed");
                return;
            }
        }
        response.sendRedirect(request.getContextPath() + "/driver/profile?success=true");
    }
}