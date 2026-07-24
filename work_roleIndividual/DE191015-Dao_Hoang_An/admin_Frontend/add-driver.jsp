<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Thêm Tài xế</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>.form-control, .form-select {
            border-radius: 10px;
            background-color: #f8fafc;
        }</style>
    </head>
    <body style="background-color: #f4f7f6; margin: 0;">
        <jsp:include page="admin-sidebar.jsp" />
        <div class="main-content-wrapper">
            <jsp:include page="admin-header.jsp" />
            <div class="container-fluid p-4 px-lg-5 mt-3">
                <div class="card shadow-sm border-0 rounded-4 mx-auto" style="max-width: 800px;">
                    <div class="card-header bg-white border-bottom p-4">
                        <h5 class="mb-0 fw-bold"><i class="fas fa-steering-wheel text-primary me-2"></i>Thêm Tài xế mới</h5>
                    </div>
                    <div class="card-body p-4 p-lg-5">
                        <form action="add-driver" method="POST">

                            <h6 class="fw-bold text-primary mb-3 border-bottom pb-2"><i class="fas fa-key me-2"></i>TÀI KHOẢN HỆ THỐNG</h6>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Email đăng nhập</label>
                                    <input type="email" name="email" class="form-control" placeholder="vd: taixe1@schoolbus.com" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Mật khẩu cấp phát</label>
                                    <input type="password" name="password" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Họ và Tên Tài xế</label>
                                    <input type="text" name="fullName" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Số điện thoại</label>
                                    <input type="text" name="phone" class="form-control" required>
                                </div>
                            </div>

                            <h6 class="fw-bold text-success mb-3 border-bottom pb-2"><i class="fas fa-id-card me-2"></i>HỒ SƠ & PHƯƠNG TIỆN</h6>
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold text-muted">Sinh năm</label>
                                    <input type="number" name="birthYear" class="form-control" required>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold text-muted">Năm kinh nghiệm</label>
                                    <input type="number" name="experienceYears" class="form-control" required>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold text-muted">Giấy phép lái xe</label>
                                    <input type="text" name="licenseNumber" class="form-control" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Gắn Phương tiện (Xe)</label>
                                    <select name="vehicleId" class="form-select" required>
                                        <option value="">-- Chọn xe từ đội xe --</option>
                                        <c:forEach items="${vehicleList}" var="v">
                                            <option value="${v.vehicleId}">Biển số: ${v.plateNumber} - ${v.vehicleType} (${v.seatCapacity} chỗ)</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Khu vực phân công</label>
                                    <select name="areaId" class="form-select" required>
                                        <option value="">-- Chọn khu vực --</option>
                                        <c:forEach items="${areaList}" var="a">
                                            <option value="${a.areaId}">📍 ${a.areaName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="mt-5 text-end">
                                <a href="manage-drivers" class="btn btn-light border px-4 rounded-pill fw-bold">Hủy bỏ</a>
                                <button type="submit" class="btn btn-primary px-5 rounded-pill ms-2 fw-bold shadow-sm">
                                    <i class="fas fa-check me-2"></i>Cấp tài khoản & Lưu hồ sơ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>