<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Cập nhật Tài xế - Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            .form-control, .form-select {
                padding: 0.75rem 1rem;
                border-radius: 12px;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
            }
            .form-control:focus, .form-select:focus {
                background-color: #fff;
                border-color: #3b82f6;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            }
            .card-custom {
                border-radius: 20px;
                border: none;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
        </style>
    </head>
    <body style="background-color: #f4f7f6; margin: 0;">

        <jsp:include page="admin-sidebar.jsp" />

        <div class="main-content-wrapper">
            <jsp:include page="admin-header.jsp" />

            <div class="container-fluid p-4 px-lg-5 mt-3">
                <div class="card card-custom mx-auto" style="max-width: 850px;">
                    <div class="card-header bg-white border-bottom p-4">
                        <h5 class="mb-0 fw-bold text-dark">
                            <i class="fas fa-user-edit text-primary me-2"></i>Cập nhật thông tin Tài xế
                        </h5>
                        <p class="text-muted small mb-0 mt-1">Chỉnh sửa hồ sơ và phương tiện của tài xế #${driver.driverId}</p>
                    </div>

                    <div class="card-body p-4 p-lg-5">
                        <form action="${pageContext.request.contextPath}/admin/update-driver" method="POST">
                            <input type="hidden" name="driverId" value="${driver.driverId}">

                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Mã User (Tài khoản)</label>
                                    <input type="number" class="form-control" name="userId" value="${driver.userId}" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Họ và Tên tài xế</label>
                                    <input type="text" class="form-control" name="fullName" value="${driver.fullName}" placeholder="Nhập tên đầy đủ..." required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Năm sinh</label>
                                    <input type="number" class="form-control" name="birthYear" value="${driver.birthYear}" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Số năm kinh nghiệm</label>
                                    <input type="number" class="form-control" name="experienceYears" value="${driver.experienceYears}" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Số Giấy phép lái xe</label>
                                    <input type="text" class="form-control" name="licenseNumber" value="${driver.licenseNumber}" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Gắn Phương tiện (Xe)</label>
                                    <select name="vehicleId" class="form-select" required>
                                        <option value="">-- Chọn xe từ đội xe --</option>
                                        <c:forEach items="${vehicleList}" var="v">
                                            <option value="${v.vehicleId}" ${driver.vehicleId == v.vehicleId ? 'selected' : ''}>
                                                Biển số: ${v.plateNumber} - ${v.vehicleType} (${v.seatCapacity} chỗ)
                                            </option>
                                        </c:forEach>
                                    </select>
                                </div>

                                <div class="col-md-12">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Khu vực phân công chạy</label>
                                    <select name="areaId" class="form-select" required>
                                        <option value="">-- Chọn khu vực --</option>
                                        <c:forEach items="${areaList}" var="a">
                                            <option value="${a.areaId}" ${driver.areaId == a.areaId ? 'selected' : ''}>
                                                📍 ${a.areaName}
                                            </option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <hr class="my-5 text-muted">

                            <div class="d-flex justify-content-end gap-3">
                                <a href="manage-drivers" class="btn btn-light border fw-bold px-4 rounded-pill">
                                    <i class="fas fa-times me-1"></i> Hủy bỏ
                                </a>
                                <button type="submit" class="btn btn-success fw-bold px-5 rounded-pill shadow-sm">
                                    <i class="fas fa-check me-1"></i> Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>