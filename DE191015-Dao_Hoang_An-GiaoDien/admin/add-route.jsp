<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thêm Tuyến Đường - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .main-content-wrapper { margin-left: 260px; min-height: 100vh; background-color: #f4f7f6; }
    </style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">
    
    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3 d-flex justify-content-center">
            <div class="card shadow-sm border-0 rounded-4 w-100" style="max-width: 800px;">
                <div class="card-header bg-white border-bottom p-4">
                    <h5 class="mb-0 fw-bold"><i class="fas fa-route text-primary me-2"></i>Thêm Tuyến Đường Mới</h5>
                </div>
                
                <div class="card-body p-4">
                    <form action="add-route" method="POST">
                        <div class="row g-4">
                            
                            <div class="col-md-12">
                                <label class="form-label fw-bold text-muted small">Tên Tuyến (Dựa theo Khu vực)</label>
                                <select name="routeName" class="form-select" required>
                                    <option value="">-- Chọn Khu vực mở Tuyến --</option>
                                    <c:forEach items="${areaList}" var="a">
                                        <option value="Tuyến ${a.area_name}">Tuyến ${a.area_name}</option>
                                    </c:forEach>
                                </select>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-muted small">Điểm Đầu</label>
                                <input type="text" name="startPoint" class="form-control" placeholder="Nhập điểm xuất phát..." required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-muted small">Điểm Cuối</label>
                                <input type="text" name="endPoint" class="form-control" placeholder="Nhập điểm kết thúc..." required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-muted small">Giờ Đón</label>
                                <input type="time" name="pickupTime" class="form-control" required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-muted small">Giờ Trả</label>
                                <input type="time" name="dropoffTime" class="form-control" required>
                            </div>
                            
                            <div class="col-md-12">
                                <label class="form-label fw-bold text-muted small">Phân công Tài xế</label>
                                <select name="driverId" class="form-select" required>
                                    <option value="">-- Chọn tài xế phụ trách --</option>
                                    <c:forEach items="${driverList}" var="d">
                                        <option value="${d.driverId}">${d.fullName} (Kinh nghiệm: ${d.experienceYears} năm)</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mt-5 d-flex justify-content-end gap-2">
                            <a href="manage-routes" class="btn btn-light border px-4 rounded-pill">Hủy</a>
                            <button type="submit" class="btn btn-primary px-4 rounded-pill fw-bold shadow-sm">
                                <i class="fas fa-save me-2"></i>Khởi tạo Tuyến
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