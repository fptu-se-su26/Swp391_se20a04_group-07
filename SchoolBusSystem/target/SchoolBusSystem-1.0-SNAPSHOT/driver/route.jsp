<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Lộ trình tuyến đường</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <jsp:include page="/driver/driver-header.jsp" />

    <main class="container-fluid mt-4 mb-5 px-4">
        <div class="row g-4">
            <aside class="col-lg-3 col-md-4">
                <jsp:include page="/driver/driver-sidebar.jsp" />
            </aside>

            <div class="col-lg-9 col-md-8">
                <h4 class="fw-bold mb-4">LỘ TRÌNH & ĐIỂM DỪNG</h4>
                
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <div class="timeline">
                            <c:forEach var="stop" items="${routeStops}">
                                <div class="d-flex mb-4">
                                    <div class="flex-shrink-0 text-center" style="width: 80px;">
                                        <span class="badge bg-primary rounded-pill">${stop.estimatedTime}</span>
                                    </div>
                                    <div class="flex-grow-1 ms-3 border-start ps-3 position-relative">
                                        <i class="fas fa-map-marker-alt text-danger position-absolute" style="left: -8px; top: 0;"></i>
                                        <h6 class="fw-bold mb-1">${stop.stopName}</h6>
                                        <p class="small text-muted mb-0">Thứ tự dừng: ${stop.stopOrder}</p>
                                    </div>
                                </div>
                            </c:forEach>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <jsp:include page="/driver/driver-footer.jsp" />
</body>
</html>