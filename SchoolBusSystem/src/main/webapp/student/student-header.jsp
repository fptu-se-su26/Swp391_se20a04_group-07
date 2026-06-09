<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
    .top-navbar {
        background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
        height: 75px; padding: 0 40px; border-bottom: 1px solid #f1f5f9;
        display: flex; align-items: center; justify-content: space-between;
        position: sticky; top: 0; z-index: 999;
    }
    .user-profile-header { display: flex; align-items: center; gap: 12px; padding: 6px 12px; border-radius: 12px; transition: background 0.2s; cursor: pointer; }
    .user-profile-header:hover { background: #f8fafc; }
    .user-profile-header img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #3b82f6; }
    .user-info-text { line-height: 1.2; }
    .user-info-text b { display: block; font-size: 14px; color: #1e293b; }
    .user-info-text span { font-size: 12px; color: #64748b; font-weight: 500; }
</style>

<div class="top-navbar">
    <div class="d-flex align-items-center">
        <h5 class="mb-0 fw-bold text-dark" style="letter-spacing: -0.5px;">Dashboard <span class="text-muted fw-normal ms-2">/ Student</span></h5>
    </div>
    
    <div class="d-flex align-items-center gap-4">
        <div class="position-relative text-muted" style="cursor: pointer;">
            <i class="far fa-bell fs-5"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1"><span class="visually-hidden">unread messages</span></span>
        </div>
        
        <div class="user-profile-header">
            <div class="user-info-text text-end d-none d-md-block">
                <b>${sessionScope.user.fullName}</b>
                <span>Học sinh</span>
            </div>
            <img src="${pageContext.request.contextPath}/images/default-avatar.png" alt="Profile">
            <i class="fas fa-chevron-down text-muted fs-xs" style="font-size: 10px;"></i>
        </div>
    </div>
</div>