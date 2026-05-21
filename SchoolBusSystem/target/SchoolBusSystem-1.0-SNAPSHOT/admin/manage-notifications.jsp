<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Gửi Thông báo - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Đồng bộ cấu trúc nền và Wrapper giống hoàn toàn trang quản lý feedback */
        .main-content-wrapper {
            margin-left: 240px; /* Độ rộng an toàn tránh đè lên thanh sidebar */
            min-height: 100vh;
            background-color: #f4f7f6;
        }
        /* Cấu hình thanh cuộn mượt cho danh sách lịch sử thông báo */
        .custom-scrollbar {
            max-height: 480px; 
            overflow-y: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">
    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3">
            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h4 class="fw-bold m-0" style="color: #2b3643;"><i class="fas fa-bell text-primary me-2"></i>Gửi Thông báo Hệ thống</h4>
                    <p class="text-muted small mb-0 mt-1">Phát hành và phân loại thông báo đến toàn bộ tài xế và phụ huynh</p>
                </div>
            </div>
            
            <%-- Khối Alert thông báo trạng thái phản hồi kết quả gửi --%>
            <c:if test="${param.msg == 'success'}">
                <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4" role="alert">
                    <i class="fas fa-check-circle me-2 fs-5 align-middle"></i>
                    <span class="align-middle">Đã gửi thông báo thành công đến 
                        <span class="fw-bold text-success-emphasis text-uppercase">
                            <c:choose>
                                <c:when test="${param.group == 'DRIVERS'}">tất cả tài xế</c:when>
                                <c:when test="${param.group == 'PARENTS'}">tất cả phụ huynh</c:when>
                                <c:otherwise>tất cả mọi người (Tài xế & Phụ huynh)</c:otherwise>
                            </c:choose>
                        </span>!
                    </span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </c:if>

            <c:if test="${param.error == 'failed'}">
                <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4" role="alert">
                    <i class="fas fa-exclamation-circle me-2 fs-5 align-middle"></i>
                    <span class="align-middle">Gửi thông báo thất bại! Vui lòng kiểm tra lại kết nối hệ thống dữ liệu.</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </c:if>

            <div class="row g-4">
                <div class="col-lg-5">
                    <div class="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        <form action="manage-notifications" method="POST">
                            <div class="mb-3">
                                <label class="form-label fw-bold" style="color: #4b5563;">Nhóm người nhận</label>
                                <select class="form-select form-select-lg fs-6" name="targetGroup" required>
                                    <option value="ALL">📢 Gửi tất cả (Tài xế & Phụ huynh)</option>
                                    <option value="DRIVERS">🚌 Gửi riêng cho Tất cả Tài xế</option>
                                    <option value="PARENTS">👨‍👩‍👧‍👦 Gửi riêng cho Tất cả Phụ huynh</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold" style="color: #4b5563;">Tiêu đề</label>
                                <input type="text" class="form-control" name="title" placeholder="Nhập tiêu đề thông báo..." required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold" style="color: #4b5563;">Nội dung chi tiết</label>
                                <textarea class="form-control" name="message" rows="5" placeholder="Viết nội dung thông báo tại đây..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-lg w-100 fs-6 fw-bold shadow-sm mt-2">
                                <i class="fas fa-paper-plane me-2"></i>Phát hành thông báo
                            </button>
                        </form>
                    </div>
                </div>
                
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden bg-white">
                        <div class="card-header bg-white pt-3 pb-0 border-bottom-0">
                            <ul class="nav nav-tabs border-bottom-0" id="notifTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active fw-bold text-dark px-3" data-bs-toggle="tab" data-bs-target="#tab-all" type="button" role="tab">
                                        <i class="fas fa-list-ul me-1"></i> Tất cả
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link fw-bold text-success px-3" data-bs-toggle="tab" data-bs-target="#tab-drivers" type="button" role="tab">
                                        <i class="fas fa-bus me-1"></i> Tài xế
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link fw-bold text-warning px-3" data-bs-toggle="tab" data-bs-target="#tab-parents" type="button" role="tab">
                                        <i class="fas fa-users me-1"></i> Phụ huynh
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="card-body p-0">
                            <div class="tab-content" id="notifTabsContent">
                                
                                <div class="tab-pane fade show active" id="tab-all" role="tabpanel">
                                    <div class="list-group list-group-flush custom-scrollbar">
                                        <c:choose>
                                            <c:when test="${empty notificationList}">
                                                <div class="p-5 text-center text-muted">
                                                    <i class="fas fa-envelope-open fs-1 mb-3 opacity-25"></i>
                                                    <p class="mb-0 small">Chưa lưu nhận lịch sử thông báo nào.</p>
                                                </div>
                                            </c:when>
                                            <c:otherwise>
                                                <c:forEach items="${notificationList}" var="n">
                                                    <div class="list-group-item p-3 list-group-item-action border-bottom">
                                                        <div class="d-flex justify-content-between align-items-start mb-1">
                                                            <h6 class="fw-bold mb-0 text-dark" style="max-width: 75%;">${n.title}
                                                                <c:choose>
                                                                    <c:when test="${n.receiverType == 'DRIVER'}">
                                                                        <span class="badge bg-success-subtle text-success border border-success-subtle ms-2 fw-normal small"><i class="fas fa-bus me-1"></i>Tài xế</span>
                                                                    </c:when>
                                                                    <c:when test="${n.receiverType == 'PARENT'}">
                                                                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle ms-2 fw-normal small"><i class="fas fa-users me-1"></i>Phụ huynh</span>
                                                                    </c:when>
                                                                    <c:otherwise>
                                                                        <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle ms-2 fw-normal small"><i class="fas fa-user me-1"></i>ID: ${n.userId}</span>
                                                                    </c:otherwise>
                                                                </c:choose>
                                                            </h6>
                                                            <small class="text-muted text-nowrap"><i class="far fa-clock me-1"></i>${n.createdAt}</small>
                                                        </div>
                                                        <p class="mb-0 text-secondary small mt-2 lh-base">${n.message}</p>
                                                    </div>
                                                </c:forEach>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="tab-drivers" role="tabpanel">
                                    <div class="list-group list-group-flush custom-scrollbar">
                                        <c:set var="hasDriver" value="false" />
                                        <c:forEach items="${notificationList}" var="n">
                                            <c:if test="${n.receiverType == 'DRIVER'}">
                                                <c:set var="hasDriver" value="true" />
                                                <div class="list-group-item p-3 list-group-item-action border-bottom">
                                                    <div class="d-flex justify-content-between align-items-start mb-1">
                                                        <h6 class="fw-bold mb-0 text-success" style="max-width: 75%;">${n.title}</h6>
                                                        <small class="text-muted text-nowrap"><i class="far fa-clock me-1"></i>${n.createdAt}</small>
                                                    </div>
                                                    <p class="mb-0 text-secondary small mt-2 lh-base">${n.message}</p>
                                                </div>
                                            </c:if>
                                        </c:forEach>
                                        <c:if test="${!hasDriver}">
                                            <div class="p-5 text-center text-muted">
                                                <i class="fas fa-bus fs-1 mb-3 opacity-25"></i>
                                                <p class="mb-0 small">Không có lịch sử thông báo cho Khối Tài xế.</p>
                                            </div>
                                        </c:if>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="tab-parents" role="tabpanel">
                                    <div class="list-group list-group-flush custom-scrollbar">
                                        <c:set var="hasParent" value="false" />
                                        <c:forEach items="${notificationList}" var="n">
                                            <c:if test="${n.receiverType == 'PARENT'}">
                                                <c:set var="hasParent" value="true" />
                                                <div class="list-group-item p-3 list-group-item-action border-bottom">
                                                    <div class="d-flex justify-content-between align-items-start mb-1">
                                                        <h6 class="fw-bold mb-0 text-warning" style="max-width: 75%;">${n.title}</h6>
                                                        <small class="text-muted text-nowrap"><i class="far fa-clock me-1"></i>${n.createdAt}</small>
                                                    </div>
                                                    <p class="mb-0 text-secondary small mt-2 lh-base">${n.message}</p>
                                                </div>
                                            </c:if>
                                        </c:forEach>
                                        <c:if test="${!hasParent}">
                                            <div class="p-5 text-center text-muted">
                                                <i class="fas fa-users fs-1 mb-3 opacity-25"></i>
                                                <p class="mb-0 small">Không có lịch sử thông báo cho Khối Phụ huynh.</p>
                                            </div>
                                        </c:if>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <jsp:include page="admin-footer.jsp" />
</body>
</html>