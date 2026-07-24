<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Quản lý Tài xế - Admin</title>
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
                        <h4 class="fw-bold m-0" style="color: #2b3643;">Danh sách Tài xế</h4>
                        <p class="text-muted small mb-0 mt-1">Quản lý đội ngũ tài xế và phương tiện</p>
                    </div>
                    <div class="d-flex gap-3 align-items-center">
                        <a href="${pageContext.request.contextPath}/admin/add-driver" class="btn btn-primary shadow-sm rounded-pill px-4 fw-bold">
                            <i class="fas fa-plus me-1"></i> Thêm Tài xế mới
                        </a>
                    </div>
                </div>

                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead style="background-color: #f1f5f9; color: #4b5563;">
                                <tr>
                                    <th class="ps-4 py-3">ID</th>
                                    <th>Họ & Tên</th>
                                    <th>Thông tin xe</th>
                                    <th>Khu vực phụ trách</th>
                                    <th>Kinh nghiệm</th>
                                    <th class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty driverList}">
                                        <c:forEach items="${driverList}" var="d">
                                            <tr>
                                                <td class="ps-4 text-muted fw-bold">#${d.driverId}</td>
                                                <td>
                                                    <div class="fw-bold text-dark">${d.fullName != null ? d.fullName : 'Chưa cập nhật'}</div>
                                                    <div class="small text-muted">Sinh năm: ${d.birthYear != 0 ? d.birthYear : '---'}</div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-warning text-dark border px-2 py-1 mb-1">
                                                        <i class="fas fa-bus me-1"></i> Biển số: ${d.vehiclePlateDisplay != null ? d.vehiclePlateDisplay : 'Chưa có'}
                                                    </span><br>
                                                    <span class="small text-muted">GPLX: ${d.licenseNumber}</span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-light text-secondary border px-2 py-1">
                                                        <i class="fas fa-map-marker-alt text-danger me-1"></i> 
                                                        ${d.areaNameDisplay != null ? d.areaNameDisplay : 'Chưa phân công'}
                                                    </span>
                                                </td>
                                                <td><span class="fw-bold text-success">${d.experienceYears} năm</span></td>
                                                <td class="text-center">
                                                    <a href="update-driver?id=${d.driverId}" class="btn btn-sm btn-light border text-primary rounded-3 me-1" title="Sửa thông tin">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <form action="delete-driver" method="POST" class="d-inline" onsubmit="return confirm('Bạn có chắc chắn muốn xóa tài xế này?')">
                                                        <input type="hidden" name="driverId" value="${d.driverId}">
                                                        <button class="btn btn-sm btn-light border text-danger rounded-3" title="Xóa tài xế">
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
                                                <i class="fas fa-user-slash fa-3x mb-3 opacity-50"></i><br>
                                                <span class="fw-bold">Chưa có tài xế nào trong hệ thống!</span>
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