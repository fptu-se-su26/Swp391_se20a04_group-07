<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
    :root { 
        --sidebar-bg: #1e293b; 
        --active-color: #3b82f6; 
    }
    .sidebar {
        width: 260px; height: 100vh; background-color: var(--sidebar-bg);
        position: fixed; top: 0; left: 0; display: flex; flex-direction: column; z-index: 1000;
        box-shadow: 4px 0 10px rgba(0,0,0,0.1);
    }
    .sidebar-brand {
        padding: 30px 24px; display: flex; align-items: center; gap: 12px;
        background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .sidebar-brand i { color: #fbc531; font-size: 28px; }
    .sidebar-brand h4 { margin: 0; font-size: 20px; font-weight: 800; color: white; letter-spacing: 1px; }
    .sidebar-brand p { margin: 0; font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }

    .sidebar-menu { list-style: none; padding: 20px 14px; margin: 0; flex-grow: 1; }
    .sidebar-menu a {
        display: flex; align-items: center; padding: 12px 16px; color: #94a3b8;
        text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 6px;
    }
    .sidebar-menu a i { width: 28px; font-size: 18px; transition: transform 0.3s; }
    .sidebar-menu a:hover { background: rgba(255,255,255,0.05); color: white; }
    .sidebar-menu a:hover i { transform: translateX(3px); }
    
    /* Trạng thái sáng menu khi khớp tham số trang */
    .sidebar-menu a.active { 
        background-color: var(--active-color); 
        color: white; 
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); 
    }

    .logout-box { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
    .btn-logout { 
        background: rgba(239, 68, 68, 0.1); color: #ef4444 !important; border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; display: block; text-decoration: none;
    }
    .btn-logout:hover { background: #ef4444; color: white !important; }
</style>

<div class="sidebar">
    <div class="sidebar-brand">
        <i class="fas fa-bus-alt"></i>
        <div>
            <h4>SchoolBus</h4>
            <p>Smart Student Transit</p>
        </div>
    </div>

    <ul class="sidebar-menu">
        <li>
            <a href="${pageContext.request.contextPath}/student/dashboard" class="${param.page == 'dashboard' ? 'active' : ''}">
                <i class="fas fa-th-large"></i> Bảng điều khiển
            </a>
        </li>
        <li>
            <a href="${pageContext.request.contextPath}/student/choose-trip" class="${param.page == 'register-trip' ? 'active' : ''}">
                <i class="fas fa-route"></i> Đăng ký chuyến
            </a>
        </li>
        <li>
            <a href="${pageContext.request.contextPath}/student/notifications.jsp" class="${param.page == 'notifications' ? 'active' : ''}">
                <i class="fas fa-bell"></i> Thông báo
            </a>
        </li>
    </ul>

    <div class="logout-box">
        <a href="${pageContext.request.contextPath}/auth/logout" class="btn-logout">
            <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
        </a>
    </div>
</div>