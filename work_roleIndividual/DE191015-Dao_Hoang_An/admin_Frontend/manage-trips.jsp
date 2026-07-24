<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý Chuyến Đi - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .main-content-wrapper { 
            margin-left: 260px; 
            min-height: 100vh; 
            background-color: #f4f7f6; 
        }
        .table th { 
            background-color: #f8fafc !important; 
            color: #475569 !important; 
            font-weight: 700; 
            text-transform: uppercase; 
            font-size: 0.8rem; 
            letter-spacing: 0.5px;
            padding: 16px;
        }
        .table td { 
            padding: 16px;
            vertical-align: middle; 
        }
    </style>
</head>
<body style="margin: 0; background-color: #f4f7f6;">
    
    <jsp:include page="/admin/admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="/admin/admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3">
            
            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h4 class="fw-bold m-0" style="color: #2b3643;">
                        <i class="fas fa-calendar-check text-primary me-2"></i>Lịch Trình Chuyến Đi
                    </h4>
                    <p class="text-muted small mb-0 mt-1">Quản lý điều phối, phân công tuyến chạy và phương tiện vận chuyển học sinh</p>
                </div>
                
                <button class="btn btn-primary fw-bold rounded-3 shadow-sm px-3" data-bs-toggle="modal" data-bs-target="#addTripModal">
                    <i class="fas fa-plus me-1"></i> Tạo chuyến mới
                </button>
            </div>

            <c:if test="${not empty param.msg}">
                <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4" role="alert">
                    <i class="fas fa-check-circle me-2 fs-5 align-middle"></i>
                    <span class="align-middle fw-semibold">Cập nhật lịch trình chuyến đi thành công!</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </c:if>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div class="card-body p-0">
                    <table class="table table-hover align-middle mb-0 text-center">
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Tuyến Đường</th>
                                <th>Tài Xế Phụ Trách</th>
                                <th>Ngày Chạy</th>
                                <th>Loại Chuyến</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:choose>
                                <c:when test="${not empty tripList}">
                                    <c:forEach items="${tripList}" var="t">
                                        <tr>
                                            <td class="text-secondary fw-bold">#${t.tripId}</td>
                                            <td class="fw-bold text-dark text-start ps-4">
                                                <i class="fas fa-route text-secondary me-2"></i>
                                                ${t.routeName != null ? t.routeName : 'RT-' += t.routeId}
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center justify-content-center fw-semibold text-primary">
                                                    <i class="fas fa-user-circle me-2 fs-5 opacity-75"></i>
                                                    ${t.driverName != null ? t.driverName : 'DRV-' += t.driverId}
                                                </div>
                                            </td>
                                            <td class="fw-semibold text-secondary">${t.tripDate}</td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${t.tripType == 'PICKUP'}">
                                                        <span class="badge bg-info-subtle text-info border border-info-subtle px-3 py-2 rounded-pill">ĐÓN HỌC SINH</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill">TRẢ HỌC SINH</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${t.status == 'PENDING'}">
                                                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill fw-bold">CHỜ CHẠY</span>
                                                    </c:when>
                                                    <c:when test="${t.status == 'IN_PROGRESS'}">
                                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-bold">ĐANG CHẠY</span>
                                                    </c:when>
                                                    <c:when test="${t.status == 'COMPLETED'}">
                                                        <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">HOÀN TẤT</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-bold">ĐÃ HỦY</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-light border text-primary rounded-3 px-3 shadow-sm" data-bs-toggle="modal" data-bs-target="#editTripModal${t.tripId}">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                            </td>
                                        </tr>

                                        <div class="modal fade text-start" id="editTripModal${t.tripId}" tabindex="-1" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content rounded-4 border-0 shadow">
                                                    <form action="${pageContext.request.contextPath}/admin/manage-trips" method="POST">
                                                        <div class="modal-header bg-light py-3">
                                                            <h5 class="modal-title fw-bold text-dark"><i class="fas fa-edit text-primary me-2"></i>Sửa Chuyến Đi #${t.tripId}</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                        </div>
                                                        <div class="modal-body px-4">
                                                            <input type="hidden" name="action" value="edit">
                                                            <input type="hidden" name="tripId" value="${t.tripId}">
                                                            
                                                            <div class="mb-3">
                                                                <label class="form-label fw-bold small">Tuyến Đường</label>
                                                                <select class="form-select route-select" name="routeId" onchange="autoSelectDriver(this)" required>
                                                                    <option value="">-- Chọn tuyến đường --</option>
                                                                    <c:forEach items="${routeList}" var="r">
                                                                        <option value="${r.route_id}" data-driver="${r.driver_id}" ${t.routeId == r.route_id ? 'selected' : ''}>
                                                                            ${r.route_name}
                                                                        </option>
                                                                    </c:forEach>
                                                                </select>
                                                            </div>
                                                            
                                                            <div class="mb-3">
                                                                <label class="form-label fw-bold small">Xe Đưa Đón</label>
                                                                <select class="form-select" name="vehicleId" required>
                                                                    <option value="">-- Chọn xe đưa đón --</option>
                                                                    <c:forEach items="${vehicleList}" var="v">
                                                                        <option value="${v.vehicle_id}" ${t.vehicleId == v.vehicle_id ? 'selected' : ''}>
                                                                            ${v.vehicle_name} - BS: ${v.license_plate}
                                                                        </option>
                                                                    </c:forEach>
                                                                </select>
                                                            </div>
                                                            
                                                            <div class="mb-3">
                                                                <label class="form-label fw-bold small">Tài Xế Phụ Trách</label>
                                                                <select class="form-select driver-select" name="driverId" required>
                                                                    <option value="">-- Chọn tài xế --</option>
                                                                    <c:forEach items="${driverList}" var="d">
                                                                        <option value="${d.driver_id}" ${t.driverId == d.driver_id ? 'selected' : ''}>
                                                                            ${d.full_name}
                                                                        </option>
                                                                    </c:forEach>
                                                                </select>
                                                            </div>
                                                            
                                                            <div class="mb-3">
                                                                <label class="form-label fw-bold small">Ngày Khởi Hành</label>
                                                                <input type="date" class="form-control" name="tripDate" value="${t.tripDate}" required>
                                                            </div>
                                                            
                                                            <div class="mb-3">
                                                                <label class="form-label fw-bold small">Loại Chuyến</label>
                                                                <select class="form-select" name="tripType" required>
                                                                    <option value="PICKUP" ${t.tripType == 'PICKUP' ? 'selected' : ''}>PICKUP (Đón)</option>
                                                                    <option value="DROPOFF" ${t.tripType == 'DROPOFF' ? 'selected' : ''}>DROPOFF (Trả)</option>
                                                                </select>
                                                            </div>
                                                            
                                                            <div class="mb-3">
                                                                <label class="form-label fw-bold small">Trạng Thái</label>
                                                                <select class="form-select" name="status" required>
                                                                    <option value="PENDING" ${t.status == 'PENDING' ? 'selected' : ''}>PENDING (Chờ chạy)</option>
                                                                    <option value="IN_PROGRESS" ${t.status == 'IN_PROGRESS' ? 'selected' : ''}>IN_PROGRESS (Đang chạy)</option>
                                                                    <option value="COMPLETED" ${t.status == 'COMPLETED' ? 'selected' : ''}>COMPLETED (Đã hoàn tất)</option>
                                                                    <option value="CANCELLED" ${t.status == 'CANCELLED' ? 'selected' : ''}>CANCELLED (Hủy chuyến)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer border-top-0 py-3">
                                                            <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Đóng</button>
                                                            <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> Lưu thay đổi</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </c:forEach>
                                </c:when>
                                <c:otherwise>
                                    <tr>
                                        <td colspan="7" class="text-center text-muted py-5">
                                            <i class="fas fa-bus fa-3x mb-3 opacity-25"></i><br>
                                            <span class="fw-bold small">Hệ thống chưa ghi nhận bất kỳ lịch trình chuyến đi nào.</span>
                                        </td>
                                    </tr>
                                </c:otherwise>
                            </c:choose>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="addTripModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content rounded-4 border-0 shadow">
                <form action="${pageContext.request.contextPath}/admin/manage-trips" method="POST">
                    <div class="modal-header bg-primary text-white py-3">
                        <h5 class="modal-title fw-bold"><i class="fas fa-bus-alt text-warning me-2"></i>Tạo Chuyến Đi Mới</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4 py-3">
                        <input type="hidden" name="action" value="add">
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold small">Tuyến Đường Vận Chuyển</label>
                            <select class="form-select route-select" name="routeId" onchange="autoSelectDriver(this)" required>
                                <option value="">-- Chọn tuyến đường hành trình --</option>
                                <c:forEach items="${routeList}" var="r">
                                    <option value="${r.route_id}" data-driver="${r.driver_id}">${r.route_name}</option>
                                </c:forEach>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold small">Xe Đưa Đón</label>
                            <select class="form-select" name="vehicleId" required>
                                <option value="">-- Chọn xe bus phân công --</option>
                                <c:forEach items="${vehicleList}" var="v">
                                    <option value="${v.vehicle_id}">${v.vehicle_name} - BS: ${v.license_plate}</option>
                                </c:forEach>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold small">Tài Xế Phụ Trách</label>
                            <select class="form-select driver-select" name="driverId" required>
                                <option value="">-- Chọn tài xế phụ trách --</option>
                                <c:forEach items="${driverList}" var="d">
                                    <option value="${d.driver_id}">${d.full_name}</option>
                                </c:forEach>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold small">Ngày Khởi Hành</label>
                            <input type="date" class="form-control" name="tripDate" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold small">Loại Hình Chuyến Đi</label>
                            <select class="form-select" name="tripType" required>
                                <option value="PICKUP">PICKUP (Chuyến đón học sinh buổi sáng)</option>
                                <option value="DROPOFF">DROPOFF (Chuyến trả học sinh buổi chiều)</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 py-3">
                        <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Hủy bỏ</button>
                        <button type="submit" class="btn btn-primary"><i class="fas fa-plus me-1"></i> Xác nhận tạo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        function autoSelectDriver(routeSelect) {
            const selectedOption = routeSelect.options[routeSelect.selectedIndex];
            if (!selectedOption) return;
            
            const assignedDriverId = selectedOption.getAttribute('data-driver');
            const form = routeSelect.closest('form');
            const driverSelect = form.querySelector('.driver-select');
            
            if (!driverSelect) return;
            
            if (assignedDriverId && assignedDriverId !== "0") {
                driverSelect.value = assignedDriverId;
                
                // Hiệu ứng nháy màu xanh nhẹ báo hiệu tự động chọn
                driverSelect.style.transition = "background-color 0.3s";
                driverSelect.style.backgroundColor = "#e8f5e9";
                setTimeout(() => { driverSelect.style.backgroundColor = ""; }, 800);
            } else {
                driverSelect.value = ""; 
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>