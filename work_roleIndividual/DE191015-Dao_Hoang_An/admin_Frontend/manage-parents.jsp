<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Quản lý Phụ huynh - Admin</title>
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
                        <h4 class="fw-bold m-0" style="color: #2b3643;">Danh sách Phụ huynh</h4>
                        <p class="text-muted small mb-0 mt-1">Quản lý toàn bộ thông tin phụ huynh trong khu vực</p>
                    </div>
                    
                    <div class="d-flex gap-3 align-items-center">
                        <form action="manage-parents" method="GET" class="m-0">
                            <select name="areaId" class="form-select shadow-sm" onchange="this.form.submit()" style="min-width: 220px; border-radius: 10px; border-color: #cbd5e1; cursor: pointer;">
                                <option value="">-- Tất cả khu vực --</option>
                                <c:forEach var="a" items="${areaList}">
                                    <option value="${a.areaId}" ${selectedAreaId == a.areaId ? 'selected' : ''}>📍 ${a.areaName}</option>
                                </c:forEach>
                            </select>
                        </form>

                        <a href="${pageContext.request.contextPath}/admin/parent-areas" class="btn btn-light border shadow-sm rounded-pill px-4 fw-bold text-secondary">
                            <i class="fas fa-arrow-left me-1"></i> Quay lại
                        </a>
                        <a href="${pageContext.request.contextPath}/admin/add-parent" class="btn btn-primary shadow-sm rounded-pill px-4 fw-bold">
                            <i class="fas fa-user-plus me-1"></i> Thêm Phụ huynh
                        </a>
                    </div>
                </div>

                <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead style="background-color: #f1f5f9; color: #4b5563;">
                                <tr>
                                    <th class="ps-4 py-3">ID Phụ huynh</th>
                                    <th>Mã User</th>
                                    <th>Phụ huynh của</th>
                                    <th>Khu vực</th>
                                    <th>SĐT Khẩn cấp</th>
                                    <th>Địa chỉ chi tiết</th>
                                    <th class="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty parentList}">
                                        <c:forEach items="${parentList}" var="p">
                                            <tr>
                                                <td class="ps-4 text-muted fw-bold">#${p.parentId}</td>
                                                <td><span class="badge bg-info text-dark rounded-pill px-3">USER-${p.userId}</span></td>
                                                
                                                <td>
                                                    <span class="fw-bold text-primary">
                                                        <i class="fas fa-child me-1 text-secondary"></i> 
                                                        ${p.childrenNames != null ? p.childrenNames : '<span class="text-muted fw-normal">Chưa có dữ liệu</span>'}
                                                    </span>
                                                </td>
                                                
                                                <td>
                                                    <span class="badge bg-light text-secondary border px-2 py-1">
                                                        <i class="fas fa-map-marker-alt text-danger me-1"></i> 
                                                        ${p.areaNameDisplay != null ? p.areaNameDisplay : 'Chưa cập nhật'}
                                                    </span>
                                                </td>
                                                <td><span class="fw-bold text-dark"><i class="fas fa-phone-alt text-success me-2"></i>${p.emergencyPhone}</span></td>
                                                <td><span class="text-muted text-truncate d-inline-block" style="max-width: 250px;" title="${p.address}">${p.address}</span></td>
                                                <td class="text-center">
                                                    <a href="update-parent?id=${p.parentId}" class="btn btn-sm btn-light border text-primary rounded-3 me-1" title="Sửa thông tin">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <form action="delete-parent" method="POST" class="d-inline" onsubmit="return confirm('Bạn có chắc chắn muốn xóa phụ huynh này khỏi hệ thống?')">
                                                        <input type="hidden" name="parentId" value="${p.parentId}">
                                                        <button class="btn btn-sm btn-light border text-danger rounded-3" title="Xóa phụ huynh">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <tr>
                                            <td colspan="7" class="text-center py-5 text-muted">
                                                <i class="fas fa-users-slash fa-3x mb-3 opacity-50"></i><br>
                                                <span class="fw-bold">Không có phụ huynh nào trong khu vực này!</span>
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