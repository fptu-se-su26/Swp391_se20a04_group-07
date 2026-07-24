package controllleradmin;

import dao.DriverDAO;
import dao.ParentAreaDAO;
import dao.UserDAO;
import dao.VehicleDAO;
import model.Driver;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "AddDriverServlet", urlPatterns = {"/admin/add-driver"})
public class AddDriverServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("areaList", new ParentAreaDAO().getAllAreas());
        request.setAttribute("vehicleList", new VehicleDAO().getAllActiveVehicles());
        request.getRequestDispatcher("/admin/add-driver.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        UserDAO userDAO = new UserDAO();
        DriverDAO driverDAO = new DriverDAO();

        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");

        // Đã sửa thành role_id = 2 theo yêu cầu của bạn
        int driverRoleId = 2;

        // 1. Tạo User
        int newUserId = userDAO.insertUserAndReturnId(email, password, phone, fullName, driverRoleId);

        if (newUserId != -1) {
            // 2. Tạo hồ sơ Driver
            try {
                Driver d = new Driver();
                d.setUserId(newUserId);
                d.setFullName(fullName);
                d.setBirthYear(Integer.parseInt(request.getParameter("birthYear")));
                d.setLicenseNumber(request.getParameter("licenseNumber"));
                d.setExperienceYears(Integer.parseInt(request.getParameter("experienceYears")));
                d.setAreaId(Integer.parseInt(request.getParameter("areaId")));
                d.setVehicleId(Integer.parseInt(request.getParameter("vehicleId")));

                if (driverDAO.insertDriver(d)) {
                    response.sendRedirect("manage-drivers?msg=add_success");
                } else {
                    userDAO.deleteUser(newUserId); // Xóa user rác nếu lưu driver lỗi
                    response.sendRedirect("add-driver?error=driver_profile_failed");
                }
            } catch (Exception e) {
                userDAO.deleteUser(newUserId);
                response.sendRedirect("add-driver?error=invalid_data");
            }
        } else {
            response.sendRedirect("add-driver?error=user_exists_or_failed");
        }
    }
}
