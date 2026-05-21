<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<style>
    body {
        overflow-y: scroll;
    }
    .sidebar-container {
        background: #ffffff;
        border-radius: 20px;
        padding: 20px 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.03);
        position: sticky;
        top: 20px;
        height: fit-content;
    }
    .sidebar-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 700;
        color: #adb5bd;
        margin-bottom: 15px;
        margin-left: 15px;
        letter-spacing: 1px;
    }
    .menu-item {
        display: flex;
        align-items: center;
        padding: 12px 18px;
        margin-bottom: 8px;
        color: #566a7f;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .menu-item i {
        font-size: 1.2rem;
        margin-right: 12px;
        width: 25px;
        text-align: center;
    }
    .menu-item:hover {
        background-color: #f5f7ff;
        color: #696cff;
        transform: translateX(5px);
    }
    .menu-item.active {
        background: linear-gradient(72deg, #696cff 0%, #8e91ff 100%);
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(105, 108, 255, 0.4);
    }
    .menu-item.active i {
        color: #ffffff;
    }
    .badge-notif {
        margin-left: auto;
        background: #ff3e1d;
        color: white;
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 10px;
    }
</style>

<div class="sidebar-container">
    <div class="sidebar-label">Menu Chính</div>
    <nav class="nav flex-column">
        <a href="${pageContext.request.contextPath}/parent/dashboard" class="menu-item ${pageContext.request.requestURI.contains('dashboard') ? 'active' : ''}">
            <i class="fas fa-th-large"></i> <span>Tổng quan</span>
        </a>
        <a href="${pageContext.request.contextPath}/parent/tracking" class="menu-item ${pageContext.request.requestURI.contains('tracking') ? 'active' : ''}">
            <i class="fas fa-map-marked-alt"></i> <span>Theo dõi con</span>
        </a>
        <a href="${pageContext.request.contextPath}/parent/leave-request" class="menu-item ${pageContext.request.requestURI.contains('leave-request') ? 'active' : ''}">
            <i class="fas fa-file-signature"></i> <span>Đăng ký nghỉ</span>
        </a>
        <a href="${pageContext.request.contextPath}/parent/notifications" class="menu-item ${pageContext.request.requestURI.contains('notifications') ? 'active' : ''}">
            <i class="fas fa-bell"></i> <span>Thông báo</span>
            <c:if test="${not empty unreadCount && unreadCount > 0}">
                <span class="badge-notif">${unreadCount}</span>
            </c:if>
        </a>
        <a href="${pageContext.request.contextPath}/parent/feedback" class="menu-item ${pageContext.request.requestURI.contains('feedback') ? 'active' : ''}">
            <i class="fas fa-comment-dots"></i> <span>Góp ý</span>
        </a>
        <div class="sidebar-label mt-4">Tài khoản</div>
        <a href="${pageContext.request.contextPath}/parent/profile" class="menu-item ${pageContext.request.requestURI.contains('profile') ? 'active' : ''}">
            <i class="fas fa-user-circle"></i> <span>Hồ sơ cá nhân</span>
        </a>
        <a href="${pageContext.request.contextPath}/auth/logout" class="menu-item text-danger">
            <i class="fas fa-sign-out-alt"></i> <span>Đăng xuất</span>
        </a>
    </nav>
</div>