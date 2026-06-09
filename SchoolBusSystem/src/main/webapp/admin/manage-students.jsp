<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Quản lý Học sinh - Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
                font-family: 'Inter', sans-serif;
            }
            .main-content-wrapper {
                margin-left: 260px;
                min-height: 100vh;
                background-color: #f8fafc; 
            }
            .card-custom {
                border: none;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02);
            }
            .table-custom thead th {
                background-color: #f1f5f9;
                color: #64748b;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.75rem;
                letter-spacing: 0.5px;
                padding: 16px;
                border: none;
            }
            .table-custom tbody td {
                padding: 18px 16px;
                vertical-align: middle;
                color: #334155;
                font-size: 0.875rem;
                border-bottom: 1px solid #f1f5f9;
            }
            .table-custom tbody tr:hover {
                background-color: #f8fafc;
            }
            /* [MỚI BỔ SUNG] Style cho Icon Avatar thay thế cho ảnh */
            .icon-avatar {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
                color: #0284c7;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .badge-custom {
                padding: 6px 12px;
                border-radius: 30px;
                font-size: 0.75rem;
                font-weight: 600;
            }
            .badge-area {
                background-color: #f0fdf4;
                color: #166534;
                border: 1px solid #bbf7d0;
            }
            .btn-action {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                border: none;
            }
            .btn-edit {
                background-color: #eff6ff;
                color: #2563eb;
            }
            .btn-edit:hover {
                background-color: #2563eb;
                color: #ffffff;
            }
            .btn-delete {
                background-color: #fef2f2;
                color: #dc2626;
            }
            .btn-delete:hover {
                background-color: #dc2626;
                color: #ffffff;
            }
            .back-link {
                color: #64748b;
                text-decoration: none;
                font-size: 0.875rem;
                font-weight: 500;
                transition: color 0.2s;
            }
            .back-link:hover {
                color: #0f172a;
            }
        </style>
    </head>
    <body style="background-color: #f8fafc; margin: 0;">

        <jsp:include page="admin-sidebar.jsp" />

        <div class="main-content-wrapper">
            <jsp:include page="admin-header.jsp" />

            <div class="container-fluid p-4 px-lg-5">

                <div class="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
                    <div>
                        <a href="${pageContext.request.contextPath}/admin/manage-classes" class="back-link mb-2 d-inline-block">
                            <i class="fas fa-arrow-left me-1"></i> Quay lại danh sách lớp
                        </a>
                        <h4 class="fw-bold m-0 text-dark">Danh sách Học sinh</h4>
                        <p class="text-muted small mb-0 mt-1">Quản lý hồ sơ và cập nhật thông tin học sinh của lớp</p>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-success shadow-sm rounded-pill px-3 fw-semibold" style="font-size: 0.875rem;">
                            <i class="fas fa-file-excel me-1"></i> Nhập Excel
                        </button>
                        <a href="${pageContext.request.contextPath}/admin/add-student?classId=${param.classId}" class="btn btn-primary shadow-sm rounded-pill px-3 fw-semibold" style="font-size: 0.875rem;">
                            <i class="fas fa-plus me-1"></i> Thêm Học sinh
                        </a>
                    </div>
                </div>

                <c:if test="${param.msg eq 'delete_success'}">
                    <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-4 fw-bold p-3 mb-4" role="alert">
                        <i class="fas fa-check-circle me-2"></i>Đã xóa học sinh khỏi hệ thống thành công!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </c:if>
                <c:if test="${param.error eq 'delete_failed'}">
                    <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm rounded-4 fw-bold p-3 mb-4" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>Xóa học sinh thất bại. Vui lòng kiểm tra lại liên kết dữ liệu!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </c:if>

                <div class="card card-custom bg-white mt-2">
                    <div class="card-body p-4">
                        <div class="table-responsive">
                            <table class="table table-custom align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Mã Học Sinh</th>
                                        <th>Học Sinh</th>
                                        <th>Ngày Sinh</th>
                                        <th class="text-center">Giới Tính</th>
                                        <th>Khu Vực</th>
                                        <th>Phụ Huynh</th>
                                        <th class="text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty studentList}">
                                            <c:forEach var="s" items="${studentList}">
                                                <tr>
                                                    <td class="fw-bold text-primary">#${s.studentCode}</td>
                                                    <td>
                                                        <div class="d-flex align-items-center gap-3">
                                                            <div class="icon-avatar">
                                                                <i class="fas fa-user-graduate"></i>
                                                            </div>
                                                            <div>
                                                                <div class="fw-bold text-dark" style="font-size: 0.9rem;">${s.fullName}</div>
                                                                <span class="text-muted" style="font-size: 0.8rem;">${s.schoolName}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="text-secondary"><fmt:formatDate value="${s.dateOfBirth}" pattern="dd/MM/yyyy"/></td>
                                                    <td class="text-center">
                                                        <span class="badge-custom ${s.gender eq 'Nam' ? 'bg-primary-subtle text-primary' : 'bg-danger-subtle text-danger'}">
                                                            ${s.gender}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${not empty s.areaName && s.areaName != 'Chưa xác định'}">
                                                                <span class="badge-custom badge-area">
                                                                    <i class="fas fa-map-marker-alt me-1"></i>${s.areaName}
                                                                </span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="text-muted small fst-italic">Chưa xác định</span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${not empty s.parentName}">
                                                                <span class="fw-semibold text-dark" style="font-size: 0.875rem;">${s.parentName}</span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="text-muted small"><i class="fas fa-link-slash me-1"></i>Chưa liên kết</span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                    <td class="text-center">
                                                        <a href="${pageContext.request.contextPath}/admin/edit-student?studentId=${s.studentId}&classId=${param.classId}" class="btn-action btn-edit me-1" title="Chỉnh sửa thông tin">
                                                            <i class="fas fa-pencil-alt small"></i>
                                                        </a>

                                                        <form action="${pageContext.request.contextPath}/admin/manage-students" method="post" class="d-inline" onsubmit="return confirm('Bạn có chắc chắn muốn xóa học sinh ${s.fullName} không?');">
                                                            <input type="hidden" name="action" value="delete">
                                                            <input type="hidden" name="studentId" value="${s.studentId}">
                                                            <input type="hidden" name="classId" value="${param.classId}">
                                                            <button type="submit" class="btn-action btn-delete" title="Xóa học sinh">
                                                                <i class="fas fa-trash-alt small"></i>
                                                            </button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="7" class="text-center py-5 text-muted">
                                                    <div class="mb-3 text-secondary opacity-25">
                                                        <i class="fas fa-user-graduate fa-4x"></i>
                                                    </div>
                                                    <span class="fw-bold text-dark d-block mb-1">Hiện tại lớp này chưa có học sinh nào!</span>
                                                    <p class="small text-muted mb-0">Hãy sử dụng nút <b>Thêm Học sinh</b> hoặc <b>Nhập Excel</b> ở góc trên bên phải.</p>
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
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>