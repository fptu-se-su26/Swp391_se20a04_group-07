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

@WebServlet(name = "ImportStudentServlet", urlPatterns = {"/admin/import-student"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10, // 10MB
        maxRequestSize = 1024 * 1024 * 50 // 50MB
)
public class ImportStudentServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        String classId = request.getParameter("classId");
        if (classId == null) {
            classId = "";
        }

        Part filePart = request.getPart("excelFile");
        if (filePart == null || filePart.getSize() == 0) {
            response.sendRedirect("manage-students?classId=" + classId + "&error=no_file");
            return;
        }

        ParentDAO parentDAO = new ParentDAO();
        UserDAO userDAO = new UserDAO();
        StudentDAO studentDAO = new StudentDAO();

        int successCount = 0;
        // Danh sách lưu trữ thông báo lỗi chi tiết của từng dòng để đẩy lên giao diện
        List<String> errorList = new ArrayList<>();

        try (InputStream fileContent = filePart.getInputStream(); Workbook workbook = new XSSFWorkbook(fileContent)) {

            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                String studentCode = "";
                String fullName = "";
                try {
                    // Sử dụng hàm helper an toàn để đọc dữ liệu tránh hoàn toàn NullPointerException
                    studentCode = getSafeCellValue(row, 0, formatter);
                    fullName = getSafeCellValue(row, 1, formatter);
                    String dobStr = getSafeCellValue(row, 2, formatter);
                    String gender = getSafeCellValue(row, 3, formatter);
                    String schoolName = getSafeCellValue(row, 4, formatter);
                    String classIdStr = getSafeCellValue(row, 5, formatter);
                    String address = getSafeCellValue(row, 6, formatter);
                    String parentEmail = getSafeCellValue(row, 7, formatter);
                    String areaIdStr = getSafeCellValue(row, 8, formatter);
                    String studentEmail = getSafeCellValue(row, 9, formatter);

                    // Kiểm tra điều kiện bắt buộc
                    if (studentCode.isEmpty() || fullName.isEmpty()) {
                        errorList.add("Dòng " + (i + 1) + ": Bỏ qua do khuyết thiếu Mã số hoặc Họ tên.");
                        continue;
                    }
                    if (classIdStr.isEmpty() || areaIdStr.isEmpty()) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi - Mã Lớp học hoặc Mã Khu vực không được để trống.");
                        continue;
                    }

                    // Ép kiểu dữ liệu an toàn kèm bắt lỗi định dạng số
                    int rowClassId;
                    int areaId;
                    try {
                        rowClassId = Integer.parseInt(classIdStr);
                        areaId = Integer.parseInt(areaIdStr);
                    } catch (NumberFormatException nfe) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi - Mã Lớp hoặc Mã Khu vực phải là một chữ số nguyên.");
                        continue;
                    }

                    // Kiểm tra định dạng ngày sinh YYYY-MM-DD
                    java.sql.Date dob;
                    try {
                        dob = java.sql.Date.valueOf(dobStr);
                    } catch (IllegalArgumentException iae) {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi - Ngày sinh '" + dobStr + "' sai định dạng. Vui lòng nhập kiểu YYYY-MM-DD.");
                        continue;
                    }

                    // Tái sử dụng logic Phụ huynh (Role 3)
                    int parentId = parentDAO.getParentIdByEmail(parentEmail);
                    if (parentId == 0) {
                        if (parentEmail.isEmpty()) {
                            errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi - Gmail phụ huynh bắt buộc phải điền.");
                            continue;
                        }
                        int newUserId = userDAO.insertUserAndReturnId(parentEmail, "123456", "", "Phụ huynh của " + fullName, 3);
                        if (newUserId > 0) {
                            parentDAO.insertParent(newUserId, "", "", areaId);
                            parentId = parentDAO.getParentIdByUserId(newUserId);
                        } else {
                            errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi - Không thể tạo tài khoản Gmail phụ huynh (Có thể email này đã tồn tại).");
                            continue;
                        }
                    }

                    // Tái sử dụng logic Học sinh (Role 4)
                    int studentUserId = 0;
                    if (!studentEmail.isEmpty()) {
                        studentUserId = userDAO.insertUserAndReturnId(studentEmail, "123456", "", fullName, 4);
                        if (studentUserId == 0) {
                            errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Cảnh báo - Gmail học sinh trùng lặp, tạo tài khoản không thành công.");
                        }
                    }

                    // Lưu hồ sơ học sinh
                    Student s = new Student();
                    s.setParentId(parentId);
                    s.setUserId(studentUserId);
                    s.setStudentCode(studentCode);
                    s.setFullName(fullName);
                    s.setGender(gender);
                    s.setDateOfBirth(dob);
                    s.setSchoolName(schoolName);
                    s.setClassId(rowClassId);
                    s.setAddress(address);
                    s.setAvatar("default.png");

                    if (studentDAO.insertStudent(s)) {
                        successCount++;
                    } else {
                        errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Lỗi hệ thống - Không thể lưu hồ sơ (Kiểm tra trùng lặp MSHS hoặc lỗi Khóa ngoại lớp học).");
                    }

                } catch (Exception rowEx) {
                    errorList.add("Dòng " + (i + 1) + " (" + fullName + "): Phát sinh lỗi không xác định - " + rowEx.getMessage());
                }
            }

            // Đẩy danh sách lỗi chi tiết vào Session để hiển thị ở trang JSP
            if (!errorList.isEmpty()) {
                request.getSession().setAttribute("importErrors", errorList);
            } else {
                request.getSession().removeAttribute("importErrors");
            }

            response.sendRedirect("manage-students?classId=" + classId + "&msg=import_success&count=" + successCount);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("manage-students?classId=" + classId + "&error=import_failed");
        }
    }

    /**
     * Hàm Helper đọc ô dữ liệu an toàn tuyệt đối (Null-Safe)
     */
    private String getSafeCellValue(Row row, int cellIndex, DataFormatter formatter) {
        if (row == null) {
            return "";
        }
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return ""; // Nếu ô trống hoàn toàn, trả về chuỗi rỗng luôn để tránh NullPointerException
        }
        return formatter.formatCellValue(cell).trim();
    }
}
