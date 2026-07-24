<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý Tuyến Đường - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body style="background-color: #f4f7f6; margin: 0;">

    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3">
            
            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h4 class="fw-bold m-0" style="color: #2b3643;">Danh sách Tuyến đường</h4>
                    <p class="text-muted small mb-0 mt-1">Quản lý lộ trình, giờ giấc và phân công tài xế</p>
                </div>
                <div class="d-flex gap-3 align-items-center">
                    <a href="${pageContext.request.contextPath}/admin/add-route" class="btn btn-primary shadow-sm rounded-pill px-4 fw-bold">
                        <i class="fas fa-plus me-1"></i> Thêm Tuyến mới
                    </a>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead style="background-color: #f1f5f9; color: #4b5563;">
                            <tr>
                                <th class="ps-4 py-3">ID</th>
                                <th>Tên tuyến</th>
                                <th>Lộ trình & Giờ giấc</th>
                                <th>Tài xế phụ trách</th>
                                <th>Trạng thái</th>
                                <th class="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:choose>
                                <c:when test="${not empty routeList}">
                                    <c:forEach items="${routeList}" var="r">
                                        <tr>
                                            <td class="ps-4 text-muted fw-bold">#${r.routeId}</td>
                                            
                                            <td>
                                                <div class="fw-bold text-dark fs-6">${r.routeName}</div>
                                            </td>

                                            <td>
                                                <div class="small text-dark mb-1">
                                                    <i class="fas fa-map-marker-alt text-danger me-1"></i> <span class="fw-bold">${r.startLocation}</span> 
                                                    <i class="fas fa-arrow-right text-muted mx-1"></i> 
                                                    <i class="fas fa-school text-primary me-1"></i> <span class="fw-bold">${r.endLocation}</span>
                                                </div>
                                                <div class="small text-muted mt-1">
                                                    <i class="far fa-clock me-1 text-warning"></i> Đón: <strong>${r.pickupTime}</strong> - Trả: <strong>${r.dropoffTime}</strong>
                                                </div>
                                            </td>

                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="bg-light p-2 rounded-circle me-2">
                                                        <i class="fas fa-id-badge text-success"></i>
                                                    </div>
                                                    <span class="fw-bold text-dark">
                                                        ${r.driverName != null ? r.driverName : '<span class="text-danger small">Chưa phân công</span>'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span class="badge ${r.status ? 'bg-success' : 'bg-secondary'} rounded-pill px-3 py-2 shadow-sm">
                                                    <i class="fas ${r.status ? 'fa-check-circle' : 'fa-ban'} me-1"></i> ${r.status ? 'Hoạt động' : 'Ngừng chạy'}
                                                </span>
                                            </td>

                                            <td class="text-center">
                                                <a href="${pageContext.request.contextPath}/admin/update-route?id=${r.routeId}" class="btn btn-sm btn-light border text-primary rounded-3 me-1 shadow-sm" title="Sửa tuyến đường">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                                <form action="${pageContext.request.contextPath}/admin/delete-route" method="POST" class="d-inline" onsubmit="return confirm('Bạn có chắc chắn muốn ngừng hoạt động tuyến đường này?');">
                                                    <input type="hidden" name="routeId" value="${r.routeId}">
                                                    <button type="submit" class="btn btn-sm btn-light border text-danger rounded-3 shadow-sm" title="Xóa/Ngừng hoạt động">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                                <c:otherwise>
                                    <tr>
                                        <td colspan="6" class="text-center py-5 text-muted">
                                            <i class="fas fa-route fa-3x mb-3 opacity-50"></i><br>
                                            <span class="fw-bold">Chưa có tuyến đường nào trong hệ thống!</span>
                                        </td>
                                    </tr>
                                </c:otherwise>
                            </c:choose>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>