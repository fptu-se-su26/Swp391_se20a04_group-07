package controllerdriver;

import dao.AttendanceDAO;
import dao.StudentDAO;
// import dao.ParentDAO;         // Mở comment khi bạn code xong DAO này
// import dao.LeaveRequestDAO;   // Mở comment khi bạn code xong DAO này
import model.Student;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "AttendanceServlet", urlPatterns = {"/driver/attendance"})
public class AttendanceServlet extends HttpServlet {

    // HÀM 1: LẤY DANH SÁCH HIỂN THỊ LÊN GIAO DIỆN
// HÀM 1: LẤY DANH SÁCH HIỂN THỊ LÊN GIAO DIỆN
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String tripIdParam = request.getParameter("tripId");

        if (tripIdParam != null && !tripIdParam.isEmpty()) {
            try {
                int tripId = Integer.parseInt(tripIdParam);
                request.setAttribute("tripId", tripId);

                // Lấy danh sách học sinh của chuyến đi này (Đã lọc chuẩn theo khu vực)
                StudentDAO studentDAO = new StudentDAO();
                List<Student> studentList = studentDAO.getStudentsByTripArea(tripId);
                request.setAttribute("studentList", studentList);

                // --- MAP LƯU TRỮ SỐ ĐIỆN THOẠI & TRẠNG THÁI XIN NGHỈ ---
                Map<Integer, String> parentPhones = new HashMap<>();
                Map<Integer, Boolean> leaveStatuses = new HashMap<>();

                for (Student s : studentList) {
                    parentPhones.put(s.getStudentId(), "0901234567"); // Dữ liệu mẫu
                    leaveStatuses.put(s.getStudentId(), false); // Dữ liệu mẫu
                }

                request.setAttribute("parentPhones", parentPhones);
                request.setAttribute("leaveStatuses", leaveStatuses);

                // ==============================================================
                // --- [ĐOẠN BẠN QUÊN CHÈN] TRUY VẤN TRẠNG THÁI ĐÃ ĐIỂM DANH ---
                // ==============================================================
                AttendanceDAO attendanceDAO = new AttendanceDAO();
                Map<Integer, String> currentAttendance = attendanceDAO.getAttendanceStatusByTrip(tripId);
                request.setAttribute("currentAttendance", currentAttendance);

            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }

        request.getRequestDispatcher("/driver/attendance.jsp").forward(request, response);
    }

    // HÀM 2: XỬ LÝ KHI TÀI XẾ BẤM NÚT ĐIỂM DANH LƯU XUỐNG DB
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Cài đặt Encoding để đọc đúng tiếng Việt từ các nút "Có mặt" / "Vắng mặt"
        request.setCharacterEncoding("UTF-8");
        
        String tripIdStr = request.getParameter("tripId");
        String studentIdStr = request.getParameter("studentId");
        String status = request.getParameter("attendanceStatus"); 
        
        if (tripIdStr != null && studentIdStr != null && status != null) {
            try {
                int tripId = Integer.parseInt(tripIdStr);
                int studentId = Integer.parseInt(studentIdStr);
                
                AttendanceDAO attendanceDAO = new AttendanceDAO();
                
                // Gọi hàm lưu điểm danh (Dùng logic Upsert: có rồi thì update, chưa có thì insert)
                boolean isSaved = attendanceDAO.saveAttendance(tripId, studentId, status);
                
                if (isSaved) {
                    // Lưu thành công -> Tải lại đúng trang điểm danh của chuyến đó
                    response.sendRedirect(request.getContextPath() + "/driver/attendance?tripId=" + tripId + "&msg=success");
                } else {
                    // Lưu thất bại
                    response.sendRedirect(request.getContextPath() + "/driver/attendance?tripId=" + tripId + "&msg=error");
                }
                
            } catch (Exception e) {
                e.printStackTrace();
                response.sendRedirect(request.getContextPath() + "/driver/dashboard?error=true");
            }
        } else {
            // Nếu thiếu tham số thì đẩy về trang chủ
            response.sendRedirect(request.getContextPath() + "/driver/dashboard");
        }
    }
}