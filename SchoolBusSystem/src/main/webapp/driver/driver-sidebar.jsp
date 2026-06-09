<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
    body { overflow-y: scroll; background-color: #f1f5f9; }
    .driver-sidebar { background: #ffffff; border-radius: 20px; padding: 20px 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); position: sticky; top: 20px; height: fit-content; }
    .sidebar-label { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-bottom: 15px; margin-left: 15px; letter-spacing: 1px; }
    .menu-item { display: flex; align-items: center; padding: 12px 18px; margin-bottom: 8px; color: #475569; text-decoration: none; border-radius: 12px; font-weight: 600; transition: all 0.3s ease; }
    .menu-item i { font-size: 1.2rem; margin-right: 12px; width: 25px; text-align: center; }
    .menu-item:hover { background-color: #f8fafc; color: #10b981; transform: translateX(5px); }
    .menu-item.active { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
</style>
<div class="driver-sidebar">
    <div class="sidebar-label">Điều hành chuyến</div>
    <nav class="nav flex-column">
        <a href="${pageContext.request.contextPath}/driver/dashboard" class="menu-item ${pageContext.request.requestURI.contains('dashboard') ? 'active' : ''}">
            <i class="fas fa-tachometer-alt"></i> <span>Bảng điều khiển</span>
        </a>
        <a href="${pageContext.request.contextPath}/driver/notifications" class="menu-item ${pageContext.request.requestURI.contains('trip') ? 'active' : ''}">
            <i class="fas fa-route"></i> <span>Thông báo</span>
        </a>
        <a href="${pageContext.request.contextPath}/driver/attendance" class="menu-item ${pageContext.request.requestURI.contains('attendance') ? 'active' : ''}">
            <i class="fas fa-user-check"></i> <span>Điểm danh học sinh</span>
        </a>
        <a href="${pageContext.request.contextPath}/driver/route" class="menu-item ${pageContext.request.requestURI.contains('route') ? 'active' : ''}">
            <i class="fas fa-map-signs"></i> <span>Lộ trình & Điểm dừng</span>
        </a>
        
        <div class="sidebar-label mt-4">Cá nhân</div>
        <a href="${pageContext.request.contextPath}/driver/profile" class="menu-item ${pageContext.request.requestURI.contains('profile') ? 'active' : ''}">
            <i class="fas fa-id-card"></i> <span>Hồ sơ tài xế</span>
        </a>
    </nav>
</div>