<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Duyệt đơn xin nghỉ - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CHỈ THÊM CSS NÀY ĐỂ FIX LỖI CHE HEADER */
        .main-content-wrapper {
            margin-left: 260px; /* Né thanh sidebar */
            min-height: 100vh;
            background-color: #f8f9fa;
        }
    </style>
</head>
<body style="margin: 0; background-color: #f8f9fa;">
    
    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 mt-4">
            <h4 class="text-primary fw-bold mb-4"><i class="fas fa-envelope-open-text me-2"></i>Duyệt đơn xin nghỉ học</h4>
            
            <c:if test="${not empty param.msg}">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-1"></i> Đã cập nhật trạng thái đơn nghỉ học!
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </c:if>

            <div class="card shadow-sm border-0">
                <div class="card-body p-0">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-primary text-center">
                            <tr>
                                <th>ID Đơn</th>
                                <th>ID Học sinh</th>
                                <th>Ngày xin nghỉ</th>
                                <th>Lý do</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:choose>
                                <c:when test="${not empty requestList}">
                                    <c:forEach var="lr" items="${requestList}">
                                        <tr>
                                            <td class="text-center">#${lr.leaveRequestId}</td>
                                            <td class="text-center fw-bold text-primary">HS-${lr.studentId}</td>
                                            <td class="text-center text-danger fw-bold">${lr.leaveDate}</td>
                                            <td>${lr.reason}</td>
                                            <td class="text-center">
                                                <c:choose>
                                                    <c:when test="${lr.status == 'PENDING'}"><span class="badge bg-warning text-dark">Chờ duyệt</span></c:when>
                                                    <c:when test="${lr.status == 'APPROVED'}"><span class="badge bg-success">Đã duyệt</span></c:when>
                                                    <c:otherwise><span class="badge bg-danger">Từ chối</span></c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td class="text-center">
                                                <c:if test="${lr.status == 'PENDING'}">
                                                    <form action="${pageContext.request.contextPath}/admin/manage-leave-requests" method="POST" class="d-inline">
                                                        <input type="hidden" name="requestId" value="${lr.leaveRequestId}">
                                                        <input type="hidden" name="action" value="APPROVED">
                                                        <button type="submit" class="btn btn-sm btn-success" title="Duyệt"><i class="fas fa-check"></i></button>
                                                    </form>
                                                    <form action="${pageContext.request.contextPath}/admin/manage-leave-requests" method="POST" class="d-inline">
                                                        <input type="hidden" name="requestId" value="${lr.leaveRequestId}">
                                                        <input type="hidden" name="action" value="REJECTED">
                                                        <button type="submit" class="btn btn-sm btn-danger" title="Từ chối"><i class="fas fa-times"></i></button>
                                                    </form>
                                                </c:if>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                                <c:otherwise>
                                    <tr><td colspan="6" class="text-center py-4 text-muted">Không có đơn xin nghỉ nào.</td></tr>
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