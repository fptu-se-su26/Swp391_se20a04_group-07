<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Cập nhật Phương tiện</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body style="background-color: #f4f7f6; margin: 0;">
    <jsp:include page="admin-sidebar.jsp" />
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        <div class="container-fluid p-4 px-lg-5 mt-3">
            <div class="card shadow-sm border-0 rounded-4 mx-auto" style="max-width: 600px;">
                <div class="card-header bg-white border-bottom p-4">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-edit text-primary me-2"></i>Cập nhật thông tin Xe</h5>
                </div>
                <div class="card-body p-4">
                    <form action="update-vehicle" method="POST">
                        <input type="hidden" name="vehicleId" value="${vehicle.vehicleId}">
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold text-muted small">Biển số xe</label>
                            <input type="text" name="plateNumber" class="form-control rounded-3" value="${vehicle.plateNumber}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold text-muted small">Loại xe</label>
                            <input type="text" name="vehicleType" class="form-control rounded-3" value="${vehicle.vehicleType}" required>
                        </div>
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-muted small">Sức chứa (Chỗ ngồi)</label>
                                <input type="number" name="seatCapacity" class="form-control rounded-3" value="${vehicle.seatCapacity}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-muted small">Trạng thái</label>
                                <select name="status" class="form-select rounded-3">
                                    <option value="Hoạt động" ${vehicle.status == 'Hoạt động' ? 'selected' : ''}>Hoạt động</option>
                                    <option value="Bảo trì" ${vehicle.status == 'Bảo trì' ? 'selected' : ''}>Bảo trì</option>
                                </select>
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <a href="manage-vehicles" class="btn btn-light border px-4 rounded-pill">Hủy</a>
                            <button type="submit" class="btn btn-primary px-4 rounded-pill ms-2">
                                <i class="fas fa-save me-2"></i>Lưu thay đổi
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