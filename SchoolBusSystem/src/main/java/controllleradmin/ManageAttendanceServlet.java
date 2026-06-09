package controllleradmin;

import dao.AttendanceDAO;
import dao.ClassDAO;
import dao.StudentDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet(name = "ManageAttendanceServlet", urlPatterns = {"/admin/manage-attendance"})
public class ManageAttendanceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String classIdStr = request.getParameter("classId");
        String studentIdStr = request.getParameter("studentId");

        try {
            if (studentIdStr != null && !studentIdStr.isEmpty()) {
                // TRẠNG THÁI 3: XEM CHI TIẾT 1 HỌC SINH
                int studentId = Integer.parseInt(studentIdStr);
                request.setAttribute("attendanceList", new AttendanceDAO().getWeeklyAttendance(studentId));
                request.setAttribute("student", new StudentDAO().getStudentById(studentId)); // Lấy thông tin HS
                request.setAttribute("classId", request.getParameter("cId")); 
                request.setAttribute("viewType", "STUDENT_DETAIL");

            } else if (classIdStr != null && !classIdStr.isEmpty()) {
                // TRẠNG THÁI 2: XEM DANH SÁCH HỌC SINH TRONG LỚP
                int classId = Integer.parseInt(classIdStr);
                request.setAttribute("studentList", new StudentDAO().getStudentsByClassId(classId));
                request.setAttribute("classId", classId);
                request.setAttribute("viewType", "CLASS_STUDENTS");

            } else {
                // TRẠNG THÁI 1: DANH SÁCH LỚP
                request.setAttribute("classList", new ClassDAO().getAllClasses());
                request.setAttribute("viewType", "ALL_CLASSES");
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("viewType", "ALL_CLASSES");
        }

        request.getRequestDispatcher("/admin/manage-attendance.jsp").forward(request, response);
    }
}