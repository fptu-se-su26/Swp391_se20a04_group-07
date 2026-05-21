<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thông báo - SchoolBus Parent</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            background-color: #f0f4f8;
            display: flex; flex-direction: column; min-height: 100vh; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        main { flex-grow: 1; }
        
        .custom-card {
            border-radius: 20px;
            border: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            overflow: hidden;
            background-color: #ffffff;
        }

        .notif-item { 
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #f1f5f9;
            transition: all 0.3s ease;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background-color: #f8fafc; }

        .icon-circle {
            width: 45px;
            height: 45px; min-width: 45px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }

        .notif-unread { 
            background-color: #f0f7ff;
            border-left: 4px solid #0d6efd;
        }
        .notif-unread:hover { background-color: #e6f2ff; }
        .unread-dot {
            width: 8px;
            height: 8px; background-color: #0d6efd;
            border-radius: 50%; display: inline-block; margin-right: 8px;
        }
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
                        <h4 class="fw-bold m-0" style="color: #0b1a30;">
                            <i class="fas fa-bell text-primary me-2"></i>THÔNG BÁO HỆ THỐNG
                        </h4>
                        <p class="text-muted small mb-0 mt-1">Cập nhật tin tức và thông báo lộ trình mới nhất</p>
                    </div>
                </div>
                
                <div class="card custom-card">
                    <div class="list-group list-group-flush">
                        <c:forEach items="${notifications}" var="n">
                            <a href="#" class="list-group-item list-group-item-action notif-item ${!n.read ? 'notif-unread' : ''}">
                                <div class="d-flex">
                                    <div class="icon-circle ${!n.read ? 'bg-primary text-white' : 'bg-light text-secondary'} me-3 mt-1">
                                        <i class="fas ${n.title.contains('nghỉ') ? 'fa-calendar-times' : (n.title.contains('xe') ? 'fa-bus' : 'fa-bell')}"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <h6 class="fw-bold text-dark mb-0">
                                                <c:if test="${!n.read}"><span class="unread-dot"></span></c:if>${n.title}
                                            </h6>
                                            <small class="${!n.read ? 'text-primary fw-bold' : 'text-muted'}">
                                                <i class="far fa-clock me-1"></i><fmt:formatDate value="${n.createdAt}" pattern="dd/MM - HH:mm" />
                                            </small>
                                        </div>
                                        <p class="mb-0 text-secondary small lh-base">${n.message}</p>
                                    </div>
                                </div>
                            </a>
                        </c:forEach>

                        <c:if test="${empty notifications}">
                            <div class="text-center py-5">
                                <div class="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3 text-muted" style="width: 80px; height: 80px;">
                                    <i class="fas fa-bell-slash fa-2x opacity-50"></i>
                                </div>
                                <h6 class="fw-bold text-dark mb-1">Bạn đã xem hết thông báo!</h6>
                                <p class="text-muted small mb-0">Hệ thống chưa có tin tức mới nào dành cho bạn.</p>
                            </div>
                        </c:if>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <jsp:include page="/parent/parent-footer.jsp" />
</body>
</html>