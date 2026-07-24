<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Bảng điều khiển - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS làm đẹp các thẻ Thống kê */
        .stat-card {
            border-radius: 16px;
            border: 1px solid #eef2f5;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
        }
        .icon-box {
            width: 54px;
            height: 54px;
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.6rem;
        }
        /* Phối màu pastel cho icon giống hệt ảnh mẫu */
        .bg-blue-light { background-color: #e0f2fe; color: #0284c7; }
        .bg-green-light { background-color: #dcfce7; color: #16a34a; }
        .bg-purple-light { background-color: #f3e8ff; color: #9333ea; }
        .bg-orange-light { background-color: #ffedd5; color: #ea580c; }
    </style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">

    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5">
            <h4 class="fw-bold mb-4" style="color: #2b3643;">Tổng quan hệ thống</h4>
            
            <div class="row g-4 mb-4">
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card shadow-sm h-100 p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 class="text-muted fw-bold mb-1" style="font-size: 0.85rem;">Học sinh</h6>
                                <h3 class="fw-bold text-dark mb-0">${stats.totalStudents}</h3>
                            </div>
                            <div class="icon-box bg-blue-light">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                        </div>
                        <div class="mt-2">
                            <span class="text-success small fw-bold"><i class="fas fa-arrow-up me-1"></i> ${newStudents}</span> 
                            <span class="text-muted small">so với tháng trước</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card shadow-sm h-100 p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 class="text-muted fw-bold mb-1" style="font-size: 0.85rem;">Phụ huynh</h6>
                                <h3 class="fw-bold text-dark mb-0">${totalParents}</h3>
                            </div>
                            <div class="icon-box bg-green-light">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="mt-2">
                            <span class="text-success small fw-bold"><i class="fas fa-arrow-up me-1"></i> ${newParents}</span> 
                            <span class="text-muted small">so với tháng trước</span>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card shadow-sm h-100 p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 class="text-muted fw-bold mb-1" style="font-size: 0.85rem;">Tài xế</h6>
                                <h3 class="fw-bold text-dark mb-0">${stats.totalDrivers}</h3>
                            </div>
                            <div class="icon-box bg-purple-light">
                                <i class="fas fa-steering-wheel"></i>
                            </div>
                        </div>
                        <div class="mt-2">
                            <span class="text-success small fw-bold"><i class="fas fa-arrow-up me-1"></i> ${newDrivers}</span> 
                            <span class="text-muted small">so với tháng trước</span>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card shadow-sm h-100 p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 class="text-muted fw-bold mb-1" style="font-size: 0.85rem;">Xe đưa đón</h6>
                                <h3 class="fw-bold text-dark mb-0">${stats.totalVehicles}</h3>
                            </div>
                            <div class="icon-box bg-orange-light">
                                <i class="fas fa-bus-alt"></i>
                            </div>
                        </div>
                        <div class="mt-2">
                            <span class="text-success small fw-bold"><i class="fas fa-arrow-up me-1"></i> ${newVehicles}</span> 
                            <span class="text-muted small">so với tháng trước</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card stat-card shadow-sm border-0 h-100 p-4">
                        <h6 class="fw-bold text-dark mb-4">Danh sách chuyến đi hôm nay</h6>
                        <div class="d-flex align-items-center justify-content-center rounded" style="background-color: #f8fafc; height: 300px; border: 1px dashed #cbd5e1;">
                            <span class="text-muted"><i class="fas fa-chart-area me-2"></i>Tính năng quản lý chuyến đi sẽ cập nhật tại đây</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card stat-card shadow-sm border-0 h-100 p-4">
                        <h6 class="fw-bold text-dark mb-4">Thông báo hệ thống</h6>
                        <div class="d-flex align-items-center justify-content-center rounded" style="background-color: #f8fafc; height: 300px; border: 1px dashed #cbd5e1;">
                            <span class="text-muted"><i class="fas fa-bell me-2"></i>Chưa có thông báo mới</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>