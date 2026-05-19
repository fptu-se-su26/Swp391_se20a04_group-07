<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thêm mới học sinh</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container mt-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="fas fa-user-plus me-2"></i>Thêm học sinh mới</h5>
            </div>
            <div class="card-body p-4">
                <form action="${pageContext.request.contextPath}/admin/add-student" method="POST">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Email Phụ huynh</label>
                            <input type="email" class="form-control" name="parentEmail" placeholder="Nhập Email để hệ thống nhận diện..." required>
                            <small class="text-muted fst-italic">Nếu phụ huynh chưa có tài khoản, hãy nhập Email dự kiến. Hệ thống sẽ bỏ trống ID để liên kết sau.</small>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Họ và tên học sinh</label>
                            <input type="text" class="form-control" name="fullName" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Ngày sinh</label>
                            <input type="date" class="form-control" name="dob" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Giới tính</label>
                            <select name="gender" class="form-select">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Tên trường</label>
                            <input type="text" class="form-control" name="schoolName" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Lớp học</label>
                            <select name="classId" class="form-select" required>
                                <option value="">-- Chọn lớp học --</option>
                                <c:forEach var="c" items="${classList}">
                                    <option value="${c.classId}" ${param.classId == c.classId ? 'selected' : ''}>${c.className} (${c.academicYear})</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="col-md-12 mb-4">
                            <label class="form-label fw-bold">Địa chỉ</label>
                            <input type="text" class="form-control" name="address" required>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary px-4"><i class="fas fa-plus me-1"></i> Thêm mới</button>
                        <a href="manage-students?classId=${param.classId}" class="btn btn-secondary px-4">Quay lại</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>