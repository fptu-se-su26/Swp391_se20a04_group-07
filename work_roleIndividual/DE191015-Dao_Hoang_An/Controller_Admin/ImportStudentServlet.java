package controllleradmin;

import dao.ParentDAO;
import dao.StudentDAO;
import dao.UserDAO;
import model.Student;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * ImportStudentServlet - Nhập học sinh hàng loạt từ file Excel (.xlsx).
 *
 * BẢO MẬT & TỐI ƯU:
 *  - Kiểm tra định dạng file (chỉ chấp nhận .xlsx)
 *  - Giới hạn số dòng tối đa (MAX_ROWS) để tránh DoS
 *  - Hash mật khẩu mặc định qua UserDAO
 *  - Validate từng trường bắt buộc trước khi insert
 *  - Log lỗi chi tiết từng dòng, không để lọt NPE im lặng
 */
@WebServlet(name = "ImportStudentServlet", urlPatterns = {"/admin/import-student"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,  // 2 MB
        maxFileSize       = 1024 * 1024 * 10,  // 10 MB
        maxRequestSize    = 1024 * 1024 * 50   // 50 MB
)
public class ImportStudentServlet extends HttpServlet {

    private static final int MAX_ROWS = 500; // Giới hạn số học sinh mỗi lần import

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String classId = trim(request.getParameter("classId"));

        // ── KIỂM TRA FILE ────────────────────────────────────────────────────
        Part filePart = request.getPart("excelFile");
        if (filePart == null || filePart.getSize() == 0) {
            response.sendRedirect("manage-students?classId=" + classId + "&error=no_file");
            return;
        }

        String fileName = filePart.getSubmittedFileName();
        if (fileName == null || !fileName.toLowerCase().endsWith(".xlsx")) {
            response.sendRedirect("manage-students?classId=" + classId + "&error=invalid_file_type");
            return;
        }

        // ── XỬ LÝ EXCEL ─────────────────────────────────────────────────────
        ParentDAO  parentDAO  = new ParentDAO();
        UserDAO    userDAO    = new UserDAO();
        StudentDAO studentDAO = new StudentDAO();

        int successCount = 0;
        List<String> errorList = new ArrayList<>();

        try (InputStream in = filePart.getInputStream();
             Workbook workbook = new XSSFWorkbook(in)) {

            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            int lastRow = Math.min(sheet.getLastRowNum(), MAX_ROWS); // Giới hạn số dòng

            for (int i = 1; i <= lastRow; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String studentCode = "";
                String fullName    = "";

                try {
                    // Đọc dữ liệu từ các cột
                    studentCode   = cell(row, 0, formatter);
                    fullName      = cell(row, 1, formatter);
                    String dobStr       = cell(row, 2, formatter);
                    String gender       = cell(row, 3, formatter);
                    String schoolName   = cell(row, 4, formatter);
                    String rowClassId   = cell(row, 5, formatter);
                    String address      = cell(row, 6, formatter);
                    String parentEmail  = cell(row, 7, formatter);
                    String areaIdStr    = cell(row, 8, formatter);
                    String studentEmail = cell(row, 9, formatter);

                    // ── VALIDATE BẮT BUỘC ─────────────────────────────────
                    if (studentCode.isEmpty() || fullName.isEmpty()) {
                        errorList.add("Dòng " + (i + 1) + ": Thiếu Mã số hoặc Họ tên.");
                        continue;
                    }
                    if (rowClassId.isEmpty() || areaIdStr.isEmpty()) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Thiếu Mã lớp hoặc Mã khu vực.");
                        continue;
                    }
                    if (parentEmail.isEmpty()) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Gmail phụ huynh là bắt buộc.");
                        continue;
                    }

                    // ── PARSE SỐ ──────────────────────────────────────────
                    int parsedClassId;
                    int areaId;
                    try {
                        parsedClassId = Integer.parseInt(rowClassId);
                        areaId        = Integer.parseInt(areaIdStr);
                    } catch (NumberFormatException e) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Mã lớp/khu vực phải là số nguyên.");
                        continue;
                    }

                    // ── PARSE NGÀY SINH ────────────────────────────────────
                    Date dob;
                    try {
                        dob = Date.valueOf(dobStr); // Yêu cầu định dạng YYYY-MM-DD
                    } catch (IllegalArgumentException e) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Ngày sinh '" + dobStr + "' sai định dạng (cần YYYY-MM-DD).");
                        continue;
                    }

                    // ── XỬ LÝ PHỤ HUYNH ───────────────────────────────────
                    int parentId = parentDAO.getParentIdByEmail(parentEmail);
                    if (parentId == 0) {
                        // Mật khẩu "123456" sẽ được hash bên trong insertUserAndReturnId
                        int newUserId = userDAO.insertUserAndReturnId(
                                parentEmail, "123456", "", "Phụ huynh của " + fullName, 3);
                        if (newUserId > 0) {
                            parentDAO.insertParent(newUserId, areaId, "", "");
                            parentId = parentDAO.getParentIdByUserId(newUserId);
                        } else {
                            errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Email phụ huynh đã tồn tại hoặc lỗi tạo tài khoản.");
                            continue;
                        }
                    }

                    // ── XỬ LÝ TÀI KHOẢN HỌC SINH (tuỳ chọn) ──────────────
                    int studentUserId = 0;
                    if (!studentEmail.isEmpty()) {
                        studentUserId = userDAO.insertUserAndReturnId(studentEmail, "123456", "", fullName, 4);
                        if (studentUserId <= 0) {
                            errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Cảnh báo - Gmail học sinh đã tồn tại, bỏ qua tạo tài khoản.");
                            studentUserId = 0;
                        }
                    }

                    // ── LƯU HỌC SINH ──────────────────────────────────────
                    Student s = new Student();
                    s.setParentId(parentId);
                    s.setUserId(studentUserId);
                    s.setStudentCode(studentCode);
                    s.setFullName(fullName);
                    s.setGender(gender);
                    s.setDateOfBirth(dob);
                    s.setSchoolName(schoolName);
                    s.setClassId(parsedClassId);
                    s.setAddress(address);
                    s.setAvatar("default.png");

                    if (studentDAO.insertStudent(s)) {
                        successCount++;
                    } else {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi lưu DB (kiểm tra trùng MSHS hoặc lỗi khóa ngoại).");
                    }

                } catch (Exception e) {
                    errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi không xác định - " + e.getMessage());
                }
            }

            // Đẩy danh sách lỗi vào session để JSP hiển thị
            if (!errorList.isEmpty()) {
                request.getSession().setAttribute("importErrors", errorList);
            } else {
                request.getSession().removeAttribute("importErrors");
            }

            response.sendRedirect("manage-students?classId=" + classId
                    + "&msg=import_success&count=" + successCount);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("manage-students?classId=" + classId + "&error=import_failed");
        }
    }

    /** Đọc giá trị ô an toàn, không bao giờ trả về null */
    private String cell(Row row, int col, DataFormatter fmt) {
        if (row == null) return "";
        Cell c = row.getCell(col);
        return c == null ? "" : fmt.formatCellValue(c).trim();
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }
}