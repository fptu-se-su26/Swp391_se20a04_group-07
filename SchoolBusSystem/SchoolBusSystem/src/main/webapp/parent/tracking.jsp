<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Theo dõi hành trình - SchoolBus Parent</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background-color: #f0f4f8; display: flex; flex-direction: column; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        main { flex-grow: 1; }
        .custom-card { border-radius: 20px; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.03); background-color: #ffffff; overflow: hidden; }
        .map-wrapper { height: 500px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #cbd5e1; position: relative; }
        .radar-icon { color: #0d6efd; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
        .info-list-item { padding: 1rem 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; }
        .info-list-item:last-child { border-bottom: none; }
        .icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; justify-content: center; align-items: center; background-color: #f0f7ff; color: #0d6efd; margin-right: 15px; }
        .btn-call { border-radius: 12px; padding: 0.9rem; background: linear-gradient(135deg, #ff6b6b, #ee5253); border: none; color: white; font-weight: bold; transition: all 0.3s ease; }
        .btn-call:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(238, 82, 83, 0.4); color: white; }
    </style>
</head>
<body>
    <jsp:include page="/parent/parent-header.jsp" />

    <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
        <div class="row g-4">
            <aside class="col-lg-3 col-md-4">
                <jsp:include page="/parent/parent-sidebar.jsp" />
            </aside>

            <div class="col-lg-9 col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div>
                        <h4 class="fw-bold m-0" style="color: #0b1a30;"><i class="fas fa-map-marked-alt text-primary me-2"></i>THEO DÕI HÀNH TRÌNH</h4>
                        <p class="text-muted small mb-0 mt-1">Định vị GPS trực tuyến xe đưa đón của con bạn</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-lg-8">
                        <div class="card custom-card p-3 h-100">
                            <div class="map-wrapper">
                                <i class="fas fa-satellite-dish fa-4x radar-icon mb-3"></i>
                                <h5 class="fw-bold text-secondary mb-1">Đang kết nối GPS...</h5>
                                <p class="text-muted small">Hệ thống đang tải bản đồ lộ trình trực tuyến</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card custom-card h-100">
                            <div class="card-header bg-white p-4 border-bottom">
                                <h6 class="fw-bold text-dark mb-0"><i class="fas fa-id-card text-primary me-2"></i>Chi tiết chuyến đi</h6>
                            </div>
                            <div class="card-body p-4">
                                <div class="info-list-item pt-0">
                                    <div class="icon-box"><i class="fas fa-user-tie"></i></div>
                                    <div class="flex-grow-1">
                                        <p class="text-muted small text-uppercase mb-0 fw-bold">Tài xế phụ trách</p>
                                        <p class="fw-bold text-dark mb-0 fs-6">${not empty trip.driverName ? trip.driverName : 'Chưa phân công'}</p>
                                    </div>
                                </div>
                                
                                <div class="info-list-item">
                                    <div class="icon-box bg-success bg-opacity-10 text-success"><i class="fas fa-bus"></i></div>
                                    <div class="flex-grow-1">
                                        <p class="text-muted small text-uppercase mb-0 fw-bold">Biển số xe</p>
                                        <p class="fw-bold text-dark mb-0 fs-6">${not empty trip.licensePlate ? trip.licensePlate : 'Chưa có thông tin'}</p>
                                    </div>
                                </div>

                                <div class="info-list-item">
                                    <div class="icon-box bg-warning bg-opacity-10 text-warning"><i class="fas fa-broadcast-tower"></i></div>
                                    <div class="flex-grow-1">
                                        <p class="text-muted small text-uppercase mb-0 fw-bold">Trạng thái</p>
                                        <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 mt-1">
                                            <i class="fas fa-circle ms-1 small text-success radar-icon" style="font-size: 8px;"></i> Đang di chuyển
                                        </span>
                                    </div>
                                </div>

                                <div class="info-list-item border-0 pb-0">
                                    <div class="icon-box bg-danger bg-opacity-10 text-danger"><i class="fas fa-map-marker-alt"></i></div>
                                    <div class="flex-grow-1">
                                        <p class="text-muted small text-uppercase mb-0 fw-bold">Vị trí hiện tại</p>
                                        <p class="fw-bold text-dark mb-0">${not empty currentLocation ? currentLocation : 'Đang cập nhật...'}</p>
                                    </div>
                                </div>
                                
                                <hr class="my-4 text-muted opacity-25">
                                
                                <button class="btn btn-call w-100 d-flex justify-content-center align-items-center">
                                    <i class="fas fa-phone-alt me-2 fs-5"></i> <span>Liên hệ Tài xế ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <jsp:include page="/parent/parent-footer.jsp" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>