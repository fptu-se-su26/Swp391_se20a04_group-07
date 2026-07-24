<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
    /* Ép luôn hiển thị thanh cuộn dọc để chống giật/nhảy trang */
    html {
        overflow-y: scroll !important;
    }
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    /* CSS CHO SIDEBAR DARK THEME */
    .admin-sidebar-dark {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 260px;
        background-color: #0b1c30; /* Màu nền xanh đen y hệt ảnh */
        color: #8a9bb0; /* Màu chữ xám nhạt */
        z-index: 1040;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
    }

    /* Tùy chỉnh thanh cuộn riêng cho sidebar */
    .admin-sidebar-dark::-webkit-scrollbar {
        width: 4px;
    }
    .admin-sidebar-dark::-webkit-scrollbar-track {
        background: transparent;
    }
    .admin-sidebar-dark::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
    }

    /* Logo Header */
    .sidebar-brand {
        padding: 24px 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        color: #ffffff;
        font-weight: 700;
        font-size: 1.3rem;
    }

    /* Khu vực menu cuộn được */
    .nav-menu {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px 16px;
    }

    /* Các thẻ Menu */
    .nav-item {
        display: flex;
        align-items: center;
        padding: 12px 18px;
        color: #8a9bb0;
        text-decoration: none;
        border-radius: 8px; /* Bo góc 4 chiều y hệt ảnh */
        margin-bottom: 5px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.2s ease;
    }

    .nav-item i {
        width: 25px;
        font-size: 1.1rem;
        text-align: left;
    }

    .nav-item:hover {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.05);
    }

    /* Trạng thái đang chọn (Active) */
    .nav-item.active {
        background-color: #0d6efd !important; /* Xanh dương đậm */
        color: #ffffff !important;
        box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
    }

    /* Profile dưới cùng */
    .sidebar-user {
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
    }

    .sidebar-user-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0b1c30;
        font-size: 1.2rem;
    }

    .sidebar-user-info {
        flex-grow: 1;
        overflow: hidden;
    }
    .sidebar-user-info h6 {
        margin: 0;
        color: #ffffff;
        font-size: 0.9rem;
        font-weight: 700;
    }
    .sidebar-user-info p {
        margin: 0;
        font-size: 0.75rem;
        color: #8a9bb0;
    }

    /* Không gian trống đẩy nội dung chính (Áp dụng chung) */
    .main-content-wrapper {
        margin-left: 260px;
        min-height: 100vh;
        background-color: #f8fafc;
        display: flex;
        flex-direction: column;
    }
</style>

<div class="admin-sidebar-dark">
    <a href="javascript:location.reload();" class="sidebar-brand" style="text-decoration: none; cursor: pointer;">
        <i class="fas fa-bus text-warning fs-2"></i>
        <div style="line-height: 1.1;">
            <div>SchoolBus</div>
            <div style="font-size: 0.55rem; font-weight: 500; color: #8a9bb0; letter-spacing: 0.5px;">
                HỆ THỐNG QUẢN LÝ<br>ĐƯA ĐÓN HỌC SINH
            </div>
        </div>
    </a>

    <div class="nav-menu">
        <a href="${pageContext.request.contextPath}/admin/dashboard" class="nav-item ${pageContext.request.requestURI.contains('dashboard') ? 'active' : ''}">
            <i class="fas fa-home"></i> Trang chủ
        </a>

        <a href="${pageContext.request.contextPath}/admin/manage-classes" class="nav-item mt-3 ${pageContext.request.requestURI.contains('class') || pageContext.request.requestURI.contains('student') ? 'active' : ''}">
            <i class="fas fa-user-friends"></i> Lớp học
        </a>
        <a href="${pageContext.request.contextPath}/admin/parent-areas" class="nav-item ${pageContext.request.requestURI.contains('parent-areas') ? 'active' : ''}">
            <i class="fas fa-map-marker-alt"></i> Khu vực Phụ huynh
        </a>
        <a href="${pageContext.request.contextPath}/admin/manage-parents" class="nav-item ${(pageContext.request.requestURI.contains('parent') && !pageContext.request.requestURI.contains('parent-areas')) ? 'active' : ''}">
            <i class="fas fa-users"></i> Phụ huynh
        </a>
        <a href="${pageContext.request.contextPath}/admin/manage-drivers" class="nav-item ${pageContext.request.requestURI.contains('driver') ? 'active' : ''}">
            <i class="fas fa-id-card"></i> Tài xế
        </a>

        <a href="${pageContext.request.contextPath}/admin/manage-vehicles" class="nav-item mt-3 ${pageContext.request.requestURI.contains('vehicle') ? 'active' : ''}">
            <i class="fas fa-bus-alt"></i> Xe đưa đón
        </a>
        <a href="${pageContext.request.contextPath}/admin/manage-routes" class="nav-item ${pageContext.request.requestURI.contains('route') ? 'active' : ''}">
            <i class="fas fa-map-marker-alt"></i> Tuyến đường
        </a>
        <a href="${pageContext.request.contextPath}/admin/manage-trips" class="nav-item ${pageContext.request.requestURI.contains('trip') ? 'active' : ''}">
            <i class="fas fa-calendar-check"></i> Chuyến đi
        </a>
        <a href="${pageContext.request.contextPath}/admin/manage-attendance" class="nav-item ${pageContext.request.requestURI.contains('attendance') ? 'active' : ''}">
            <i class="fas fa-check-circle"></i> Điểm danh
        </a>
        
        <a href="${pageContext.request.contextPath}/admin/manage-leave-requests" class="nav-item ${pageContext.request.requestURI.contains('leave-request') ? 'active' : ''}">
            <i class="fas fa-envelope-open-text"></i> Đơn xin nghỉ
        </a>

        <a href="${pageContext.request.contextPath}/admin/manage-feedbacks" class="nav-item mt-3 ${pageContext.request.requestURI.contains('feedback') ? 'active' : ''}">
            <i class="fas fa-comments"></i> FeedBack
        </a>
        <a href="${pageContext.request.contextPath}/admin/manage-notifications" class="nav-item ${pageContext.request.requestURI.contains('notification') ? 'active' : ''}">
            <i class="fas fa-bell"></i> Thông báo
        </a>
    </div>

    <div class="sidebar-user">
        <div class="sidebar-user-avatar"><i class="fas fa-user-tie"></i></div>
        <div class="sidebar-user-info">
            <h6>Administrator</h6>
            <p>admin@gmail.com</p>
        </div>
        <i class="fas fa-chevron-down" style="font-size: 0.8rem;"></i>
    </div>
</div>