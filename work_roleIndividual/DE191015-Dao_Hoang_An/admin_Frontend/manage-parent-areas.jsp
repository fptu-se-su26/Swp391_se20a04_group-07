<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Khu vực Phụ huynh</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-light">
    <jsp:include page="admin-sidebar.jsp" />
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        <div class="container-fluid p-4">
            <h4 class="fw-bold mb-4 text-primary"><i class="fas fa-map-marked-alt me-2"></i>Khu vực Phụ huynh</h4>
            <div class="row g-4">
                <c:forEach items="${areaList}" var="a">
                    <div class="col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm border-0">
                            <div class="card-body text-center p-4">
                                <div class="mb-3 text-primary" style="font-size: 2.5rem;"><i class="fas fa-house-user"></i></div>
                                <h5 class="fw-bold">${a.areaName}</h5>
                                <p class="text-muted small">${a.description}</p>
                                <a href="manage-parents?areaId=${a.areaId}" class="btn btn-outline-primary rounded-pill w-100">
                                    Xem danh sách
                                </a>
                            </div>
                        </div>
                    </div>
                </c:forEach>
            </div>
        </div>
    </div>
</body>
</html>