<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng ký chuyến đi - SchoolBus</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background-color: #f8fafc; margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .main-wrapper { margin-left: 260px; min-height: 100vh; display: flex; flex-direction: column; }
        .content-wrapper { padding: 40px; flex-grow: 1; }
        .card-custom { border: none; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); background-color: #ffffff; }
        .table-custom th { background-color: #f8fafc; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 12px; padding: 16px; border-bottom: 1px solid #e2e8f0; }
        .table-custom td { padding: 16px; vertical-align: middle; color: #334155; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .badge-status { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }
        .badge-active { background-color: #dcfce7; color: #15803d; }
        .badge-pending { background-color: #fef9c3; color: #a16207; }
        .student-info-list li { padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
        .student-info-list li:last-child { border-bottom: none; }
    </style>
</head>
<body>

    <jsp:include page="student-sidebar.jsp">
        <jsp:param name="page" value="register-trip" />
    </jsp:include>

    <div class="main-wrapper">
        <jsp:include page="student-header.jsp" />

        <div class="content-wrapper">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="fw-bold text-slate-900 mb-1">Đăng ký chuyến đi</h4>
                    <p class="text-muted small mb-0">Lựa chọn lộ trình di chuyển phù hợp với lịch học của bạn.</p>
                </div>
            </div>

            <c:if test="${param.msg == 'register_success'}">
                <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm" role="alert">
                    <i class="fas fa-check-circle me-2"></i><strong>Thành công!</strong> Bạn đã đăng ký chuyến xe.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </c:if>
            <c:if test="${param.msg == 'cancel_success'}">
                <div class="alert alert-warning alert-dismissible fade show border-0 shadow-sm" role="alert">
                    <i class="fas fa-info-circle me-2"></i>Bạn đã hủy đăng ký chuyến xe.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </c:if>

            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card card-custom p-4">
                        <h5 class="fw-bold mb-4" style="color: #1e293b;">Danh sách chuyến xe khả dụng</h5>
                        
                        <div class="table-responsive">
                            <table class="table table-custom align-middle">
                                <thead>
                                    <tr>
                                        <th>Tuyến đường</th>
                                        <th>Tài xế</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th class="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty tripList}">
                                            <c:forEach var="trip" items="${tripList}">
                                                <tr>
                                                    <td>
                                                        <div class="fw-bold text-dark">${trip.routeName}</div>
                                                        <span class="text-muted small">Mã: #${trip.tripId}</span>
                                                    </td>
                                                    <td>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <i class="far fa-user-circle text-muted fs-5"></i>
                                                            <span>${trip.driverName}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="small fw-semibold text-slate-700">
                                                            <i class="far fa-clock me-1 text-muted"></i>
                                                            <fmt:formatDate value="${trip.startTime}" pattern="HH:mm" />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span class="badge-status badge-active">Khả dụng</span>
                                                    </td>
                                                    <td class="text-end">
                                                        <c:choose>
                                                            <c:when test="${registeredTripIds.contains(trip.tripId)}">
                                                                <form action="${pageContext.request.contextPath}/student/choose-trip" method="post" class="d-inline">
                                                                    <input type="hidden" name="tripId" value="${trip.tripId}">
                                                                    <input type="hidden" name="action" value="cancel">
                                                                    <button type="submit" class="btn btn-outline-danger btn-sm rounded-3 px-3" onclick="return confirm('Bạn có chắc chắn muốn hủy chuyến xe này?');">
                                                                        <i class="fas fa-times me-1"></i> Hủy chuyến
                                                                    </button>
                                                                </form>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <form action="${pageContext.request.contextPath}/student/choose-trip" method="post" class="d-inline">
                                                                    <input type="hidden" name="tripId" value="${trip.tripId}">
                                                                    <input type="hidden" name="action" value="register">
                                                                    <button type="submit" class="btn btn-primary btn-sm rounded-3 px-3 shadow-sm">
                                                                        <i class="fas fa-plus me-1"></i> Đăng ký
                                                                    </button>
                                                                </form>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="5" class="text-center py-5 text-muted">
                                                    <i class="fas fa-bus-alt d-block mb-3 fs-2 text-slate-300"></i>
                                                    Hiện không có chuyến xe nào khả dụng.
                                                </td>
                                            </tr>
                                        </c:otherwise>
                                    </c:choose>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card card-custom p-4">
                        <div class="d-flex align-items-center gap-3 mb-3 border-bottom pb-3">
                            <div class="bg-primary bg-opacity-10 p-3 rounded-4 text-primary">
                                <i class="far fa-id-card fs-4"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0" style="color: #1e293b;">Thông tin học sinh</h6>
                                <span class="text-muted small">Dữ liệu đăng ký đồng bộ</span>
                            </div>
                        </div>
                        
                        <ul class="list-unstyled student-info-list mb-0">
                            <li><span class="text-muted">Học sinh:</span><strong class="text-dark">${sessionScope.user.fullName}</strong></li>
                            <li><span class="text-muted">Mã định danh:</span><strong class="text-primary">${student.studentCode}</strong></li>
                            <li><span class="text-muted">Lớp học:</span><strong class="text-dark">${student.classNameDisplay}</strong></li>
                            <li><span class="text-muted">Trường học:</span><strong class="text-dark text-truncate text-end ms-2" style="max-width: 180px;">${student.schoolName}</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <jsp:include page="student-footer.jsp" />
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>