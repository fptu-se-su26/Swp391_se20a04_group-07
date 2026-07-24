<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý Góp ý - Admin</title>
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
                    <h4 class="fw-bold m-0" style="color: #2b3643;"><i class="fas fa-comments text-primary me-2"></i>Quản lý Góp ý & Phản hồi</h4>
                    <p class="text-muted small mb-0 mt-1">Theo dõi và xử lý các ý kiến đóng góp từ Phụ huynh</p>
                </div>
            </div>
            
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead style="background-color: #f1f5f9; color: #4b5563;">
                            <tr>
                                <th class="ps-4 py-3" width="5%">ID</th>
                                <th width="20%">Người gửi (Phụ huynh)</th>
                                <th width="20%">Học sinh liên quan</th>
                                <th width="35%">Nội dung Góp ý</th>
                                <th width="15%"><i class="far fa-clock me-1"></i>Thời gian gửi</th>
                                <th width="5%" class="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:choose>
                                <c:when test="${not empty feedbackList}">
                                    <c:forEach var="fb" items="${feedbackList}">
                                        <tr>
                                            <td class="ps-4 fw-bold text-muted">#${fb.feedbackId}</td>
                                            
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="bg-primary bg-opacity-10 p-2 rounded-circle me-2 text-primary">
                                                        <i class="fas fa-user-tie"></i>
                                                    </div>
                                                    <div>
                                                        <div class="fw-bold text-dark">${fb.parentName}</div>
                                                        <span class="badge bg-secondary rounded-pill fw-normal" style="font-size: 0.7rem;">ID: PH${fb.parentId}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div class="small fw-bold text-success">
                                                    <i class="fas fa-user-graduate me-1"></i>
                                                    ${fb.studentNames != null && fb.studentNames != '' ? fb.studentNames : '<span class="text-muted font-weight-normal">Chưa có thông tin</span>'}
                                                </div>
                                            </td>

                                            <td>
                                                <div class="fw-bold text-dark mb-1">${fb.subject}</div>
                                                <div class="small text-muted" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
                                                    ${fb.content}
                                                </div>
                                            </td>

                                            <td>
                                                <div class="small text-dark fw-bold">
                                                    <fmt:formatDate value="${fb.createdAt}" pattern="HH:mm" />
                                                </div>
                                                <div class="small text-muted">
                                                    <fmt:formatDate value="${fb.createdAt}" pattern="dd/MM/yyyy" />
                                                </div>
                                            </td>

                                            <td class="text-center">
                                                <button type="button" class="btn btn-sm btn-light border text-primary rounded-3 shadow-sm" title="Xem chi tiết & Phản hồi" onclick="alert('Tính năng Xem chi tiết đang phát triển!')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </c:when>
                                <c:otherwise>
                                    <tr>
                                        <td colspan="6" class="text-center text-muted py-5">
                                            <i class="fas fa-inbox fa-3x mb-3 text-light"></i><br>
                                            <span class="fw-bold">Hệ thống chưa nhận được góp ý nào.</span>
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