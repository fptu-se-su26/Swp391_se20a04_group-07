<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Cập nhật Tuyến Đường - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .main-content-wrapper { margin-left: 260px; min-height: 100vh; background-color: #f4f7f6; }
    </style>
</head>
<body style="margin: 0; background-color: #f4f7f6;">
    
    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3 d-flex justify-content-center">
            
            <div class="card border-0 shadow-sm rounded-4 w-100" style="max-width: 800px;">
                <div class="card-header bg-white py-3 border-bottom">
                    <h5 class="fw-bold m-0 text-primary">
                        <i class="fas fa-edit me-2"></i>Cập nhật Tuyến Đường #${route.routeId}
                    </h5>
                </div>
                
                <div class="card-body p-4">
                    <form action="${pageContext.request.contextPath}/admin/update-route" method="POST">
                        <input type="hidden" name="routeId" value="${route.routeId}">
                        
                        <div class="mb-4">
                            <label class="form-label fw-bold text-secondary small">Tên Tuyến (Dựa theo Khu vực)</label>
                            <select name="routeName" class="form-select" required>
                                <option value="">-- Chọn Khu vực mở Tuyến --</option>
                                <c:forEach items="${areaList}" var="a">
                                    <c:set var="fullRouteName" value="Tuyến ${a.area_name}" />
                                    <option value="${fullRouteName}" ${route.routeName == fullRouteName ? 'selected' : ''}>
                                        ${fullRouteName}
                                    </option>
                                </c:forEach>
                            </select>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label class="form-label fw-bold text-secondary small">Điểm Đầu</label>
                                <input type="text" class="form-control" name="startLocation" value="${route.startLocation}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small">Điểm Cuối</label>
                                <input type="text" class="form-control" name="endLocation" value="${route.endLocation}">
                            </div>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label class="form-label fw-bold text-secondary small">Giờ Đón</label>
                                <input type="time" class="form-control" name="pickupTime" value="${route.pickupTime}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small">Giờ Trả</label>
                                <input type="time" class="form-control" name="dropoffTime" value="${route.dropoffTime}" required>
                            </div>
                        </div>

                        <div class="row mb-4 align-items-end">
                            <div class="col-md-8 mb-3 mb-md-0">
                                <label class="form-label fw-bold text-secondary small">Phân công Tài xế</label>
                                <select class="form-select" name="driverId" required>
                                    <option value="">-- Chọn tài xế phụ trách --</option>
                                    <c:forEach items="${driverList}" var="d">
                                        <option value="${d.driver_id}" ${route.driverId == d.driver_id ? 'selected' : ''}>
                                            ${d.full_name}
                                        </option>
                                    </c:forEach>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-secondary small">Trạng thái</label>
                                <select class="form-select" name="status" required>
                                    <option value="1" ${route.status ? 'selected' : ''}>Hoạt động</option>
                                    <option value="0" ${!route.status ? 'selected' : ''}>Ngừng chạy</option>
                                </select>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 mt-5">
                            <a href="${pageContext.request.contextPath}/admin/manage-routes" class="btn btn-light border rounded-pill px-4">Hủy</a>
                            <button type="submit" class="btn btn-success rounded-pill px-4 fw-bold shadow-sm">
                                <i class="fas fa-save me-1"></i> Lưu thay đổi
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