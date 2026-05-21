<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
    /* Gradient cho Header */
    .parent-navbar {
        background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    .navbar-brand-custom {
        font-size: 1.4rem;
        letter-spacing: 0.5px;
    }
    /* Thẻ hiển thị người dùng */
    .user-profile-badge {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50rem;
        padding: 6px 16px 6px 6px;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
    }
    .user-profile-badge:hover {
        background: rgba(255, 255, 255, 0.25);
    }
    /* Avatar mini */
    .avatar-sm {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

<nav class="navbar navbar-expand-lg navbar-dark parent-navbar py-2">
    <div class="container-fluid px-lg-5">
        <a class="navbar-brand fw-bold navbar-brand-custom" href="${pageContext.request.contextPath}/parent/dashboard">
            <i class="fas fa-bus text-warning me-2 fs-4 align-middle"></i>
            <span class="align-middle">SchoolBus Parent</span>
        </a>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div class="d-flex align-items-center mt-3 mt-lg-0">

                <div class="user-profile-badge d-flex align-items-center me-3">
                    <div class="bg-white text-primary fw-bold avatar-sm me-2 shadow-sm">
                        ${sessionScope.user.fullName != null ? sessionScope.user.fullName.substring(0, 1).toUpperCase() : 'P'}
                    </div>
                    <span class="text-white small fw-medium">Xin chào, ${sessionScope.user.fullName != null ? sessionScope.user.fullName : 'Phụ huynh'}</span>
                </div>

                <a href="${pageContext.request.contextPath}/auth/logout" class="btn btn-sm btn-light text-danger fw-bold rounded-pill px-4 shadow-sm">
                    <i class="fas fa-sign-out-alt me-1"></i> Đăng xuất
                </a>

            </div>
        </div>
    </div>
</nav>