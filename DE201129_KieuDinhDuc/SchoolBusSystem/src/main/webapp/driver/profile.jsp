<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hồ sơ Tài xế</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .cover-bg { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); height: 140px; border-radius: 20px 20px 0 0; }
        .profile-img { width: 130px; height: 130px; object-fit: cover; border: 5px solid #ffffff; box-shadow: 0 8px 16px rgba(0,0,0,0.1); background-color: #fff; margin-top: -65px; position: relative; z-index: 2; }
    </style>
</head>
<body>
    <jsp:include page="/driver/driver-header.jsp" />
    <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
        <div class="row g-4">
            <aside class="col-lg-3 col-md-4">
                <jsp:include page="/driver/driver-sidebar.jsp" />
            </aside>
            <div class="col-lg-9 col-md-8">
                <h4 class="fw-bold mb-4" style="color: #0f172a;"><i class="fas fa-id-card text-primary me-2"></i>THÔNG TIN TÀI XẾ</h4>
                <div class="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                    <div class="cover-bg"></div>
                    <div class="text-center pb-4 border-bottom">
                        <img src="${pageContext.request.contextPath}/images/avatars/${sessionScope.user.avatar != null ? sessionScope.user.avatar : 'default.png'}" class="rounded-circle profile-img">
                        <h4 class="mt-3 fw-bold text-dark">${sessionScope.user.fullName}</h4>
                        <span class="badge bg-success bg-opacity-10 text-success border border-success-subtle rounded-pill px-3 py-2 mt-1"><i class="fas fa-check-circle me-1"></i> Đối tác Tài xế chính thức</span>
                    </div>
                    <div class="card-body p-5">
                        <h6 class="fw-bold text-dark mb-4"><i class="fas fa-info-circle text-primary me-2"></i>Chi tiết hồ sơ năng lực</h6>
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="bg-light p-3 rounded-3 border">
                                    <small class="text-muted d-block text-uppercase fw-bold mb-1"><i class="fas fa-id-badge me-1"></i> Số bằng lái</small>
                                    <span class="fw-bold fs-5">${driverProfile.licenseNumber}</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="bg-light p-3 rounded-3 border">
                                    <small class="text-muted d-block text-uppercase fw-bold mb-1"><i class="fas fa-star me-1 text-warning"></i> Kinh nghiệm</small>
                                    <span class="fw-bold fs-5">${driverProfile.experienceYears} năm</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="bg-light p-3 rounded-3 border">
                                    <small class="text-muted d-block text-uppercase fw-bold mb-1"><i class="fas fa-envelope me-1"></i> Email liên hệ</small>
                                    <span class="fw-bold text-dark">${sessionScope.user.email}</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="bg-light p-3 rounded-3 border">
                                    <small class="text-muted d-block text-uppercase fw-bold mb-1"><i class="fas fa-phone-alt me-1"></i> Điện thoại</small>
                                    <span class="fw-bold text-dark">${sessionScope.user.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <jsp:include page="/driver/driver-footer.jsp" />
</body>
</html>