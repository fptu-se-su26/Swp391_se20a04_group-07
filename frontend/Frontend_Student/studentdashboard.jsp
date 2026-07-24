<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Học sinh | SchoolBus</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background-color: #f8fafc; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .main-wrapper { margin-left: 260px; min-height: 100vh; }
        .content-area { padding: 40px; }
        .card-custom { border: none; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .bg-soft-blue { background: #e0f2fe; color: #0369a1; }
        .bg-soft-green { background: #dcfce7; color: #15803d; }
        .bg-soft-orange { background: #ffedd5; color: #c2410c; }
    </style>
</head>
<body>

    <jsp:include page="student-sidebar.jsp"><jsp:param name="page" value="dashboard" /></jsp:include>

    <div class="main-wrapper">
        <jsp:include page="student-header.jsp" />

        <div class="content-area">
            <div class="row align-items-center mb-5">
                <div class="col-md-8">
                    <h2 class="fw-bold text-slate-900 mb-1">Chào buổi sáng, ${sessionScope.user.fullName}!</h2>
                    <p class="text-muted mb-0">Chúc bạn có một ngày học tập tuyệt vời và an toàn trên các tuyến xe.</p>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-md-4">
                    <div class="card card-custom p-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="stat-icon bg-soft-blue"><i class="fas fa-bus"></i></div>
                            <div>
                                <small class="text-muted d-block fw-bold">Chuyến tiếp theo</small>
                                <span class="fw-bold fs-5">Tuyến số 01</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card card-custom p-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="stat-icon bg-soft-green"><i class="far fa-clock"></i></div>
                            <div>
                                <small class="text-muted d-block fw-bold">Giờ đón dự kiến</small>
                                <span class="fw-bold fs-5">06:45 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card card-custom p-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="stat-icon bg-soft-orange"><i class="fas fa-check-double"></i></div>
                            <div>
                                <small class="text-muted d-block fw-bold">Điểm danh tháng</small>
                                <span class="fw-bold fs-5">22/22 Ngày</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card card-custom p-4 h-100">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold mb-0">Thông báo từ nhà trường</h5>
                            <a href="#" class="btn btn-sm btn-light text-primary fw-bold">Xem tất cả</a>
                        </div>
                        
                        <div class="alert alert-light border-0 bg-light rounded-4 p-3 mb-3">
                            <div class="d-flex gap-3">
                                <div class="bg-white p-2 rounded-circle shadow-sm" style="height: fit-content;"><i class="fas fa-info-circle text-primary"></i></div>
                                <div>
                                    <h6 class="fw-bold mb-1">Cập nhật lịch trình xe số 02</h6>
                                    <p class="small text-muted mb-0">Từ ngày mai, xe số 02 sẽ khởi hành sớm hơn 5 phút để tránh kẹt xe tại cầu Rồng...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card card-custom p-4 h-100 text-center">
                        <div class="position-relative d-inline-block mx-auto mb-3">
                            <img src="${pageContext.request.contextPath}/images/default-avatar.png" class="rounded-circle shadow-sm" style="width: 100px; height: 100px; border: 4px solid white;" alt="Avatar">
                            <span class="position-absolute bottom-0 end-0 bg-success border border-white border-2 rounded-circle p-2"></span>
                        </div>
                        <h5 class="fw-bold mb-1">${sessionScope.user.fullName}</h5>
                        <p class="text-primary fw-bold small mb-4">${student.studentCode}</p>
                        
                        <div class="text-start space-y-3">
                            <div class="p-3 bg-light rounded-4 mb-2">
                                <div class="d-flex justify-content-between small"><span class="text-muted">Lớp học:</span> <span class="fw-bold">${student.classNameDisplay}</span></div>
                            </div>
                            <div class="p-3 bg-light rounded-4 mb-2">
                                <div class="d-flex justify-content-between small"><span class="text-muted">Cơ sở:</span> <span class="fw-bold">${student.schoolName}</span></div>
                            </div>
                            <div class="p-3 bg-light rounded-4">
                                <div class="d-flex justify-content-between small"><span class="text-muted">Địa chỉ:</span> <span class="fw-bold text-truncate ms-2" style="max-width: 150px;">${student.address}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <jsp:include page="student-footer.jsp" />
    </div>

</body>
</html>