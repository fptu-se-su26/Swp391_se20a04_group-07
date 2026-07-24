<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
    /* CSS CHO HEADER */
    .admin-header-top {
        height: 75px;
        background-color: #ffffff;
        border-bottom: 1px solid #eef2f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        position: sticky;
        top: 0;
        z-index: 1030;
    }

    .header-welcome {
        font-weight: 700;
        color: #2b3643;
        font-size: 1.15rem;
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .btn-hamburger {
        color: #6c757d;
        font-size: 1.3rem;
        cursor: pointer;
        transition: color 0.2s;
    }
    .btn-hamburger:hover { color: #0d6efd; }

    /* Cụm chức năng bên phải */
    .header-actions {
        display: flex;
        align-items: center;
        gap: 25px;
    }

    /* Icon thông báo có chấm đỏ */
    .action-icon {
        position: relative;
        color: #6c757d;
        font-size: 1.3rem;
        cursor: pointer;
        transition: color 0.2s;
    }
    .action-icon:hover { color: #2b3643; }

    .badge-dot {
        position: absolute;
        top: -6px; right: -6px;
        width: 18px; height: 18px;
        background-color: #dc3545;
        color: #ffffff;
        border-radius: 50%;
        font-size: 0.65rem;
        font-weight: bold;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #ffffff;
    }

    /* Khối Profile góc phải */
    .header-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding-left: 20px;
        border-left: 1px solid #eef2f5;
    }
    
    .header-profile-avatar {
        width: 40px; height: 40px;
        border-radius: 50%;
        background-color: #eff6ff;
        color: #0d6efd;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem;
    }
    
    .header-profile-name {
        font-weight: 700;
        color: #2b3643;
        font-size: 0.95rem;
    }

    /* Tùy chỉnh làm đẹp cho Bootstrap Dropdown Menu */
    .dropdown-menu-custom {
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        border: 1px solid #eef2f5;
        margin-top: 15px !important;
        min-width: 220px;
        padding: 8px 0;
    }

    .dropdown-menu-custom .dropdown-item {
        padding: 10px 20px;
        font-weight: 600;
        color: #4b5563;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .dropdown-menu-custom .dropdown-item:hover {
        background-color: #f8fafc;
        color: #0d6efd;
    }

    .dropdown-menu-custom .dropdown-item.text-danger:hover {
        background-color: #fff5f5;
        color: #dc3545 !important;
    }
</style>

<div class="admin-header-top">
    <div class="header-welcome">
        <i class="fas fa-bars btn-hamburger"></i>
        <span>Xin chào, Administrator! <span style="font-size: 1.3rem; margin-left: 5px;">👋</span></span>
    </div>

    <div class="header-actions">
        <div class="action-icon">
            <i class="far fa-bell"></i>
            <span class="badge-dot">5</span>
        </div>
        
        <div class="action-icon">
            <i class="far fa-envelope"></i>
            <span class="badge-dot">3</span>
        </div>
        
        <div class="dropdown">
            <div class="header-profile" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="header-profile-avatar"><i class="fas fa-user-tie"></i></div>
                <span class="header-profile-name">Administrator</span>
                <i class="fas fa-chevron-down text-muted" style="font-size: 0.8rem;"></i>
            </div>
            
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                <li>
                    <a class="dropdown-item" href="${pageContext.request.contextPath}/admin/profile">
                        <i class="fas fa-user-circle me-2"></i> Hồ sơ của tôi
                    </a>
                </li>
                <li>
                    <a class="dropdown-item" href="${pageContext.request.contextPath}/admin/settings">
                        <i class="fas fa-cog me-2"></i> Cài đặt tài khoản
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item text-danger fw-bold" href="${pageContext.request.contextPath}/auth/logout">
                        <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
                    </a>
                </li>
            </ul>
        </div>
        
    </div>
</div>