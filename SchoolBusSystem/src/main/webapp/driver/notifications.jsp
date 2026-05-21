<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Thông báo - Tài xế</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            .notif-card { transition: all 0.2s ease; border-left: 4px solid transparent; }
            .notif-card:hover { transform: translateX(5px); background-color: #f8fafc; }
            .notif-admin { border-left-color: #0d6efd; } /* Viền xanh cho Admin */
            .notif-leave { border-left-color: #fd7e14; } /* Viền cam cho báo nghỉ */
            .icon-box { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        </style>
    </head>
    <body class="bg-light">
        <jsp:include page="/driver/driver-header.jsp" />
        <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
            <div class="row g-4">
                <aside class="col-lg-3 col-md-4">
                    <jsp:include page="/driver/driver-sidebar.jsp" />
                </aside>
                <div class="col-lg-9 col-md-8">

                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                        <h4 class="fw-bold m-0 text-uppercase"><i class="fas fa-bell text-primary me-2"></i>Thông báo của bạn</h4>
                        
                        <div class="d-flex align-items-center">
                            <label for="filterNotif" class="fw-bold text-secondary me-2 text-nowrap"><i class="fas fa-filter me-1"></i>Lọc theo:</label>
                            <select id="filterNotif" class="form-select form-select-sm border-secondary-subtle shadow-sm bg-white" style="width: 220px;" onchange="filterNotifications()">
                                <option value="ALL">📋 Tất cả thông báo</option>
                                <option value="ADMIN">📢 Thông báo từ Admin</option>
                                <option value="LEAVE">👨‍👩‍👧‍👦 Đơn báo nghỉ từ Phụ huynh</option>
                            </select>
                        </div>
                    </div>

                    <div class="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                        <div class="card-body p-0">
                            
                            <c:choose>
                                <%-- Nếu DB không có thông báo nào --%>
                                <c:when test="${empty notifications}">
                                    <div class="text-center py-5 text-muted">
                                        <i class="fas fa-envelope-open-text fs-1 mb-3 opacity-50"></i>
                                        <h5>Hiện tại bạn không có thông báo nào</h5>
                                    </div>
                                </c:when>
                                
                                <%-- Nếu có thông báo thì in ra --%>
                                <c:otherwise>
                                    <div class="list-group list-group-flush" id="notifListContainer">
                                        
                                        <c:forEach var="n" items="${notifications}">
                                            
                                            <%-- Thêm class 'notif-item' và thuộc tính 'data-type' để JS dễ dàng nhận diện và lọc --%>
                                            <div class="list-group-item p-4 notif-card notif-item ${n.notificationType == 'ADMIN' || n.notificationType == 'SYSTEM' ? 'notif-admin' : 'notif-leave'}" data-type="${n.notificationType}">
                                                <div class="d-flex gap-3">
                                                    
                                                    <%-- Icon đổi theo loại (Bao gồm cả loại SYSTEM khi Admin gửi cho tất cả) --%>
                                                    <c:choose>
                                                        <c:when test="${n.notificationType == 'ADMIN' || n.notificationType == 'SYSTEM'}">
                                                            <div class="icon-box bg-primary bg-opacity-10 text-primary flex-shrink-0">
                                                                <i class="fas fa-bullhorn fs-5"></i>
                                                            </div>
                                                        </c:when>
                                                        <c:otherwise>
                                                            <div class="icon-box bg-warning bg-opacity-10 text-warning flex-shrink-0">
                                                                <i class="fas fa-bed fs-5"></i>
                                                            </div>
                                                        </c:otherwise>
                                                    </c:choose>

                                                    <div class="flex-grow-1">
                                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 class="mb-0 fw-bold ${n.notificationType == 'ADMIN' || n.notificationType == 'SYSTEM' ? 'text-primary' : 'text-dark'}">
                                                                ${n.title}
                                                            </h6>
                                                            <small class="text-muted fw-semibold">
                                                                <fmt:formatDate value="${n.createdAt}" pattern="HH:mm - dd/MM/yyyy" />
                                                            </small>
                                                        </div>
                                                        <p class="mb-0 text-secondary lh-base">${n.message}</p>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            
                                        </c:forEach>
                                        
                                        <div id="emptyFilterState" class="text-center py-5 text-muted" style="display: none;">
                                            <i class="fas fa-search fs-1 mb-3 opacity-25"></i>
                                            <h5>Không tìm thấy thông báo thuộc danh mục này</h5>
                                        </div>

                                    </div>
                                </c:otherwise>
                            </c:choose>

                        </div>
                    </div>
                </div>
            </div>
        </main>
        <jsp:include page="/driver/driver-footer.jsp" />

        <script>
            function filterNotifications() {
                // 1. Lấy giá trị đang chọn trong Select Box
                const filterValue = document.getElementById('filterNotif').value;
                // 2. Lấy tất cả các thẻ div chứa thông báo
                const items = document.querySelectorAll('.notif-item');
                let visibleCount = 0;

                // 3. Quét qua từng thông báo để kiểm tra
                items.forEach(item => {
                    const type = item.getAttribute('data-type');
                    let isMatch = false;

                    if (filterValue === 'ALL') {
                        isMatch = true;
                    } else if (filterValue === 'ADMIN' && (type === 'ADMIN' || type === 'SYSTEM')) {
                        // Nhóm Admin bao gồm cả thông báo đích danh (ADMIN) và thông báo hàng loạt (SYSTEM)
                        isMatch = true;
                    } else if (filterValue === 'LEAVE' && type === 'LEAVE') {
                        isMatch = true;
                    }

                    // Hiện thẻ nếu khớp, Ẩn thẻ nếu không khớp
                    if (isMatch) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // 4. Nếu lọc xong mà không có cái nào hiển thị -> Hiện bảng báo "Không tìm thấy"
                const emptyState = document.getElementById('emptyFilterState');
                if (visibleCount === 0 && items.length > 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
            }
        </script>
    </body>
</html>