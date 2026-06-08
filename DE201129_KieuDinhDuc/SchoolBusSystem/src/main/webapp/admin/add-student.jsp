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
<body style="background-color: #f4f7f6;">
    <div class="container mt-4 mb-5">
        <div class="card shadow-sm border-0 rounded-4">
            <div class="card-header bg-primary text-white p-3 rounded-top-4">
                <h5 class="mb-0 fw-bold"><i class="fas fa-user-plus me-2"></i>Thêm học sinh mới</h5>
            </div>
            <div class="card-body p-4 p-lg-5">
                <form action="${pageContext.request.contextPath}/admin/add-student" method="POST">
                    
                    <h6 class="fw-bold text-primary mb-3 border-bottom pb-2"><i class="fab fa-google me-2"></i>THÔNG TIN PHỤ HUYNH</h6>
                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Gmail Phụ Huynh</label>
                            <input type="email" class="form-control" name="parentEmail" placeholder="Nhập Gmail đăng nhập..." required>
                            <small class="text-muted fst-italic">Hệ thống sẽ tự động ghép nhóm nếu Gmail đã có, hoặc tạo tài khoản mới nếu chưa.</small>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Khu Vực Phụ Huynh</label>
                            <select name="areaId" class="form-select" required>
                                <option value="">-- Chọn khu vực cư trú --</option>
                                <c:forEach var="a" items="${areaList}">
                                    <option value="${a.areaId}">📍 ${a.areaName}</option>
                                </c:forEach>
                            </select>
                            <small class="text-muted fst-italic">Dùng để phân luồng nếu đây là Gmail mới hoàn toàn.</small>
                        </div>
                    </div>

                    <h6 class="fw-bold text-success mb-3 border-bottom pb-2"><i class="fas fa-user-graduate me-2"></i>HỒ SƠ HỌC SINH</h6>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Mã số Học sinh (MSHS)</label>
                            <input type="text" class="form-control" name="studentCode" placeholder="VD: HS2026-001" required>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Họ và tên học sinh</label>
                            <input type="text" class="form-control" name="fullName" required>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Ngày sinh</label>
                            <input type="date" class="form-control" name="dob" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Giới tính</label>
                            <select name="gender" class="form-select">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Tên trường</label>
                            <input type="text" class="form-control" name="schoolName" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Lớp học</label>
                            <select name="classId" class="form-select" required>
                                <option value="">-- Chọn lớp học --</option>
                                <c:forEach var="c" items="${classList}">
                                    <option value="${c.classId}" ${param.classId == c.classId ? 'selected' : ''}>${c.className} (${c.academicYear})</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="col-md-12 mb-4">
                            <label class="form-label fw-bold text-secondary small text-uppercase">Địa chỉ nhà</label>
                            <input type="text" class="form-control" name="address" required>
                        </div>
                    </div>
                    
                    <hr class="mt-2 mb-4 text-muted">
                    <div class="d-flex justify-content-end gap-3">
                        <a href="manage-students?classId=${param.classId}" class="btn btn-light border fw-bold px-4 rounded-pill">Quay lại</a>
                        <button type="submit" class="btn btn-primary fw-bold px-5 rounded-pill shadow-sm"><i class="fas fa-plus me-1"></i> Khởi tạo & Liên kết</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>