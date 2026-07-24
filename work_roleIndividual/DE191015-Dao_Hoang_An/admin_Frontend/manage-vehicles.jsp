<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Quản lý Phương tiện - Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body style="background-color: #f4f7f6; margin: 0;">

        <jsp:include page="admin-sidebar.jsp" />

        <div class="main-content-wrapper">
            <jsp:include page="admin-header.jsp" />

            <div class="container-fluid p-4 px-lg-5">

                <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <div>
                        <h4 class="fw-bold m-0" style="color: #2b3643;">Danh sách Phương tiện</h4>
                        <p class="text-muted small mb-0 mt-1">Quản lý đội xe, sức chứa và trạng thái hoạt động</p>
                    </div>
                    <div class="d-flex gap-3 align-items-center">
                        <a href="${pageContext.request.contextPath}/admin/add-vehicle" class="btn btn-primary shadow-sm rounded-pill px-4 fw-bold">
                            <i class="fas fa-plus me-1"></i> Thêm Phương tiện mới
                        </a>
                    </div>
                </div>

                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead style="background-color: #f1f5f9; color: #4b5563;">
                                <tr>
                                    <th class="ps-4 py-3">ID</th>
                                    <th>Thông tin xe</th>
                                    <th>Sức chứa</th>
                                    <th>Trạng thái</th>
                                    <th class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty vehicleList}">
                                        <c:forEach items="${vehicleList}" var="v">
                                            <tr>
                                                <td class="ps-4 text-muted fw-bold">#${v.vehicleId}</td>

                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="bg-light p-2 rounded-circle me-3">
                                                            <i class="fas fa-bus-alt fa-lg ${v.status == 'Hoạt động' ? 'text-primary' : 'text-secondary'}"></i>
                                                        </div>
                                                        <div>
                                                            <div class="fw-bold text-dark fs-6">${v.plateNumber}</div>
                                                            <div class="small text-muted">${v.vehicleType}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span class="fw-bold text-dark fs-6">${v.seatCapacity}</span> 
                                                    <span class="small text-muted">chỗ ngồi</span>
                                                </td>

                                                <td>
                                                    <span class="badge ${v.status == 'Hoạt động' ? 'bg-success' : 'bg-danger'} rounded-pill px-3 py-2 shadow-sm">
                                                        <i class="fas ${v.status == 'Hoạt động' ? 'fa-check-circle' : 'fa-wrench'} me-1"></i> ${v.status}
                                                    </span>
                                                </td>

                                                <td class="text-center">
                                                    <a href="${pageContext.request.contextPath}/admin/update-vehicle?id=${v.vehicleId}" class="btn btn-sm btn-light border text-primary rounded-3 me-1 shadow-sm" title="Sửa thông tin">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <form action="delete-vehicle" method="POST" class="d-inline" onsubmit="return confirm('Bạn có chắc chắn muốn chuyển xe này sang trạng thái Bảo trì/Ngừng hoạt động?')">
                                                        <input type="hidden" name="vehicleId" value="${v.vehicleId}">
                                                        <button type="submit" class="btn btn-sm btn-light border text-danger rounded-3" title="Ngừng hoạt động">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>

                                    <c:otherwise>
                                        <tr>
                                            <td colspan="5" class="text-center py-5 text-muted">
                                                <i class="fas fa-bus-slash fa-3x mb-3 opacity-50"></i><br>
                                                <span class="fw-bold">Chưa có phương tiện nào trong hệ thống!</span>
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