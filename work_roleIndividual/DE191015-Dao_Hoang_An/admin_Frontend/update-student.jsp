<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cập nhật Học sinh</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-light">
<div class="container mt-5 mb-5">
    <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body p-4">
            <form action="${pageContext.request.contextPath}/admin/update-student" method="POST">
                <input type="hidden" name="studentId" value="${student.studentId}">

                <div class="row">
                    <h4 class="mb-4 text-primary fw-bold w-100 border-bottom pb-2">
                        <i class="fas fa-user-edit me-2"></i>Cập nhật thông tin học sinh
                    </h4>
                    
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Mã số học sinh (MSHS)</label>
                        <input type="text" class="form-control" name="studentCode" value="${student.studentCode}" placeholder="VD: HS2026-001" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Họ và tên</label>
                        <input type="text" class="form-control" name="fullName" value="${student.fullName}" required>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Giới tính</label>
                        <select name="gender" class="form-select" required>
                            <option value="Nam" ${student.gender == 'Nam' ? 'selected' : ''}>Nam</option>
                            <option value="Nữ" ${student.gender == 'Nữ' ? 'selected' : ''}>Nữ</option>
                        </select>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Ngày sinh</label>
                        <input type="date" class="form-control" name="dob" value="${student.dateOfBirth}" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Trường học</label>
                        <input type="text" class="form-control" name="schoolName" value="${student.schoolName}" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Lớp học</label>
                        <select name="classId" class="form-select" required>
                            <option value="">-- Chọn lớp học --</option>
                            <c:forEach var="c" items="${classList}">
                                <option value="${c.classId}" ${student.classId == c.classId ? 'selected' : ''}>
                                    ${c.className} (${c.academicYear})
                                </option>
                            </c:forEach>
                        </select>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Trạng thái hồ sơ</label>
                        <select name="status" class="form-select">
                            <option value="true" ${student.status ? 'selected' : ''}>Hoạt động</option>
                            <option value="false" ${!student.status ? 'selected' : ''}>Ngừng hoạt động</option>
                        </select>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Địa chỉ cư trú</label>
                        <input type="text" class="form-control" name="address" value="${student.address}" required>
                    </div>

                    <h5 class="mt-4 mb-3 text-success fw-bold w-100 border-top pt-3">
                        <i class="fas fa-phone-alt me-2"></i>Thông tin Số điện thoại Phụ huynh
                    </h5>
                    
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">Số điện thoại chính</label>
                        <input type="tel" class="form-control" name="parentPhone" value="${student.parentPhone}" placeholder="Nhập SĐT chính liên lạc..." required pattern="[0-9]{9,11}">
                        <small class="text-muted fst-italic">Bắt buộc để nhà trường liên hệ khẩn cấp.</small>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold text-secondary">SĐT khẩn cấp phụ (Tùy chọn)</label>
                        <input type="tel" class="form-control" name="emergencyPhone" value="${student.emergencyPhone}" placeholder="SĐT người thân khác..." pattern="[0-9]{9,11}">
                        <small class="text-muted fst-italic">Để trống nếu không muốn thay đổi hoặc không có số phụ.</small>
                    </div>
                    
                    <div class="d-flex gap-2 w-100 mt-4 border-top pt-3">
                        <button type="submit" class="btn btn-success px-4 fw-bold rounded-pill">
                            <i class="fas fa-save me-1"></i> Cập nhật dữ liệu
                        </button>
                        <a href="manage-students?classId=${student.classId}" class="btn btn-secondary px-4 rounded-pill">
                            Hủy bỏ
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>