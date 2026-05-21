<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Bảng điều khiển - SchoolBus Parent</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background-color: #f0f4f8; display: flex; flex-direction: column; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        main { flex-grow: 1; }
        .stat-card { border: none; border-radius: 16px; transition: all 0.3s ease; overflow: hidden; position: relative; z-index: 1; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .stat-card::after { content: ''; position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; z-index: -1; }
        .card-table { border-radius: 16px; border: none; }
        .card-table-header { border-top-left-radius: 16px !important; border-top-right-radius: 16px !important; }
        .avatar-img { object-fit: cover; border: 2px solid #e2e8f0; }
    </style>
</head>
<body>
    <jsp:include page="/parent/parent-header.jsp" />

    <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
        <div class="row g-4">
            <aside class="col-lg-3 col-md-4">
                <jsp:include page="/parent/parent-sidebar.jsp" />
            </aside>

            <div class="col-lg-9 col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div>
                        <h4 class="fw-bold m-0" style="color: #0b1a30;">TỔNG QUAN HOẠT ĐỘNG</h4>
                        <p class="text-muted small mb-0 mt-1">Theo dõi thông tin và lộ trình của con bạn trong ngày</p>
                    </div>
                </div>
                
                <div class="row g-4 mb-5">
                    <div class="col-md-4">
                        <div class="card stat-card shadow-sm text-white" style="background: linear-gradient(135deg, #0d6efd, #0a58ca);">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-uppercase small fw-semibold opacity-75 mb-1">Số lượng con cái</h6>
                                        <h2 class="fw-bold mb-0">${children.size() > 0 ? children.size() : 0}</h2>
                                    </div>
                                    <div class="bg-white bg-opacity-25 rounded-circle p-3 d-flex justify-content-center align-items-center" style="width: 60px; height: 60px;">
                                        <i class="fas fa-user-graduate fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card stat-card shadow-sm text-white" style="background: linear-gradient(135deg, #198754, #146c43);">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-uppercase small fw-semibold opacity-75 mb-1">Trạng thái xe hôm nay</h6>
                                        <h4 class="fw-bold mb-0 mt-2">${not empty vehicleStatus ? vehicleStatus : 'Chưa có thông tin'}</h4>
                                    </div>
                                    <div class="bg-white bg-opacity-25 rounded-circle p-3 d-flex justify-content-center align-items-center" style="width: 60px; height: 60px;">
                                        <i class="fas fa-bus fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card stat-card shadow-sm text-white" style="background: linear-gradient(135deg, #f59f00, #e67700);">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-uppercase small fw-semibold opacity-75 mb-1">Thông báo hệ thống</h6>
                                        <h2 class="fw-bold mb-0">${not empty notificationCount ? notificationCount : '0'}</h2>
                                    </div>
                                    <div class="bg-white bg-opacity-25 rounded-circle p-3 d-flex justify-content-center align-items-center" style="width: 60px; height: 60px;">
                                        <i class="fas fa-bell fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card card-table shadow-sm">
                    <div class="card-header card-table-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0" style="color: #0b1a30;"><i class="fas fa-users text-primary me-2"></i>Danh sách con cái</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead style="background-color: #f8fafc;">
                                    <tr>
                                        <th class="ps-4 py-3 text-secondary small text-uppercase">Học sinh</th>
                                        <th class="text-secondary small text-uppercase">Lớp</th>
                                        <th class="text-secondary small text-uppercase">Trường học</th>
                                        <th class="text-center text-secondary small text-uppercase">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty children}">
                                            <c:forEach items="${children}" var="s">
                                                <tr>
                                                    <td class="ps-4 py-3">
                                                        <div class="d-flex align-items-center">
                                                            <img src="${pageContext.request.contextPath}/images/avatars/${s.avatar != null ? s.avatar : 'default.png'}" 
                                                                 class="rounded-circle me-3 avatar-img shadow-sm" width="48" height="48">
                                                            <div>
                                                                <div class="fw-bold text-dark fs-6">${s.fullName}</div>
                                                                <div class="small text-muted">Mã HS: #${s.studentId}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span class="badge bg-light text-dark border px-2 py-1">
                                                            <i class="fas fa-chalkboard text-muted me-1"></i> ${s.className != null ? s.className : 'Đang tải...'}
                                                        </span>
                                                    </td>
                                                    <td class="fw-semibold text-muted small">
                                                        <i class="fas fa-school text-primary opacity-50 me-1"></i> ${s.schoolName != null ? s.schoolName : 'Đang tải...'}
                                                    </td>
                                                    <td class="text-center">
                                                        <a href="${pageContext.request.contextPath}/parent/tracking?studentId=${s.studentId}" 
                                                           class="btn btn-sm btn-primary rounded-pill px-4 shadow-sm fw-bold">
                                                            <i class="fas fa-map-marker-alt me-1"></i> Theo dõi lộ trình
                                                        </a>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="4" class="text-center py-5 text-muted">
                                                    <div class="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style="width: 80px; height: 80px;">
                                                        <i class="fas fa-user-graduate fa-2x text-secondary opacity-50"></i>
                                                    </div>
                                                    <br><span class="fw-bold">Chưa có thông tin học sinh được liên kết!</span>
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
    </main>

    <jsp:include page="/parent/parent-footer.jsp" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>