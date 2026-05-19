<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Bảng điều khiển Tài xế</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { display: flex; flex-direction: column; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        main { flex-grow: 1; }
        .trip-card { border-radius: 16px; transition: all 0.3s ease; }
        .trip-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .status-badge { padding: 8px 16px; border-radius: 50rem; font-weight: 600; font-size: 0.85rem; }
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
                <h4 class="fw-bold mb-4" style="color: #0f172a;"><i class="fas fa-clipboard-list text-primary me-2"></i>DANH SÁCH CHUYẾN ĐI HÔM NAY</h4>
                <div class="row g-4">
                    <c:forEach items="${trips}" var="t">
                        <div class="col-12">
                            <div class="card trip-card shadow-sm border-0 border-start border-5 ${t.status == 'COMPLETED' ? 'border-success' : (t.status == 'IN_PROGRESS' ? 'border-primary' : 'border-warning')}">
                                <div class="card-body p-4">
                                    <div class="row align-items-center">
                                        <div class="col-md-2 text-center border-end d-none d-md-block">
                                            <h6 class="text-muted small text-uppercase mb-1">Mã chuyến</h6>
                                            <h5 class="fw-bold text-dark mb-0">#TRP${t.tripId}</h5>
                                        </div>
                                        <div class="col-md-4 ps-md-4">
                                            <h5 class="mb-1 fw-bold text-dark">
                                                <i class="fas ${t.tripType == 'PICKUP' ? 'fa-home text-info' : 'fa-school text-primary'} me-2"></i>
                                                ${t.tripType == 'PICKUP' ? 'Đón học sinh đến trường' : 'Trả học sinh về nhà'}
                                            </h5>
                                            <p class="text-muted small mb-0"><i class="far fa-calendar-alt me-1"></i> Ngày: ${t.tripDate}</p>
                                        </div>
                                        <div class="col-md-3 text-md-center mt-3 mt-md-0">
                                            <c:choose>
                                                <c:when test="${t.status == 'IN_PROGRESS'}"><span class="status-badge bg-primary-subtle text-primary border border-primary-subtle"><i class="fas fa-spinner fa-spin me-1"></i> Đang chạy</span></c:when>
                                                <c:when test="${t.status == 'COMPLETED'}"><span class="status-badge bg-success-subtle text-success border border-success-subtle"><i class="fas fa-check me-1"></i> Hoàn thành</span></c:when>
                                                <c:otherwise><span class="status-badge bg-warning-subtle text-warning border border-warning-subtle"><i class="fas fa-clock me-1"></i> Chờ xuất phát</span></c:otherwise>
                                            </c:choose>
                                        </div>
                                        <div class="col-md-3 text-md-end mt-3 mt-md-0">
                                            <a href="${pageContext.request.contextPath}/driver/trip?tripId=${t.tripId}" class="btn btn-outline-dark rounded-pill px-4 fw-bold">Chi tiết <i class="fas fa-arrow-right ms-1"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                    <c:if test="${empty trips}">
                        <div class="text-center py-5 bg-white rounded-4 shadow-sm">
                            <i class="fas fa-mug-hot fa-3x text-muted opacity-50 mb-3"></i>
                            <h5 class="fw-bold text-dark">Hôm nay bạn không có ca chạy nào</h5>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>
    </main>
    <jsp:include page="/driver/driver-footer.jsp" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>