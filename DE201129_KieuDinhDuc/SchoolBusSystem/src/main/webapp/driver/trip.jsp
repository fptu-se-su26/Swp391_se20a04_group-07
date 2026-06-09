<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Điều hành chuyến đi</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <jsp:include page="/driver/driver-header.jsp" />
        <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
            <div class="row g-4">
                <aside class="col-lg-3 col-md-4">
                    <jsp:include page="/driver/driver-sidebar.jsp" />
                </aside>
                <div class="col-lg-9 col-md-8">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="fw-bold mb-0" style="color: #0f172a;"><i class="fas fa-route text-primary me-2"></i>ĐIỀU HÀNH CHUYẾN ĐI #TRP${trip.tripId}</h4>
                        <span class="badge bg-dark px-4 py-2 rounded-pill shadow-sm fs-6">Trạng thái: ${trip.status}</span>
                    </div>
                    <div class="card shadow-sm border-0 rounded-4 mb-4 text-center py-5 bg-white">
                        <div class="card-body">
                            <c:choose>
                                <%-- Thêm các trường hợp trạng thái chờ (PENDING, WAITING, v.v.) --%>
                                <c:when test="${trip.status == 'PENDING' || trip.status == 'WAITING'}">
                                    <form action="${pageContext.request.contextPath}/driver/start-trip" method="POST">
                                        <input type="hidden" name="tripId" value="${trip.tripId}">
                                        <button type="submit" class="btn btn-success btn-lg px-5 py-3 shadow">
                                            <i class="fas fa-play me-2"></i> BẮT ĐẦU CHUYẾN ĐI
                                        </button>
                                    </form>
                                </c:when>

                                <%-- Bổ sung thêm 'RUNNING' cho trạng thái đang chạy --%>
                                <c:when test="${trip.status == 'IN_PROGRESS' || trip.status == 'RUNNING'}">
                                    <div class="d-flex justify-content-center gap-3">
                                        <a href="${pageContext.request.contextPath}/driver/attendance?tripId=${trip.tripId}" class="btn btn-info btn-lg text-white">
                                            <i class="fas fa-user-check me-2"></i> ĐIỂM DANH HÀNH KHÁCH
                                        </a>
                                        <form action="${pageContext.request.contextPath}/driver/end-trip" method="POST">
                                            <input type="hidden" name="tripId" value="${trip.tripId}">
                                            <button type="submit" class="btn btn-danger btn-lg shadow">
                                                <i class="fas fa-stop me-2"></i> KẾT THÚC CHUYẾN
                                            </button>
                                        </form>
                                    </div>
                                </c:when>

                                <%-- Các trạng thái còn lại (như COMPLETED, DONE) --%>
                                <c:otherwise>
                                    <h5 class="text-success fw-bold"><i class="fas fa-check-circle me-2"></i>Chuyến đi đã hoàn thành</h5>
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <jsp:include page="/driver/driver-footer.jsp" />
    </body>
</html>