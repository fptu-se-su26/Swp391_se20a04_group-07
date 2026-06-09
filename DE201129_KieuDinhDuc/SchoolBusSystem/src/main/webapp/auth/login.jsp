<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - SchoolBus</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        body, html {
            height: 100%; margin: 0;
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #123466; 
            overflow-x: hidden;
        }

        .bg-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(16, 47, 94, 0.95) 0%, rgba(26, 82, 158, 0.85) 100%), 
                        url('${pageContext.request.contextPath}/images/school-bus-bg.jpg') center/cover;
            z-index: 1;
        }

        .main-wrapper {
            position: relative; z-index: 2; min-height: 100vh;
        }

        .left-panel {
            color: white; padding: 3rem 4rem;
            display: flex; flex-direction: column;
            justify-content: space-between; height: 100vh;
        }
        
        .brand-logo { display: flex; align-items: center; gap: 15px; }
        .brand-logo i { color: #fbc531; font-size: 3rem; }
        .brand-text h3 { font-weight: 800; margin: 0; font-size: 1.6rem; letter-spacing: 0.5px; }
        .brand-text p { font-size: 0.7rem; font-weight: 600; margin: 0; opacity: 0.8; letter-spacing: 1px; }

        .main-content { margin-top: -3rem; }
        .main-heading { font-size: 2.5rem; font-weight: 700; line-height: 1.4; margin-bottom: 1.5rem; }
        .text-yellow { color: #fbc531; }
        .sub-heading { font-size: 1.05rem; opacity: 0.85; line-height: 1.6; max-width: 90%; }

        .features-row {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 2rem;
        }
        .feature-box {
            background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px; padding: 1.2rem; display: flex; align-items: flex-start; gap: 12px;
        }
        .feature-icon-wrapper {
            background: rgba(255, 255, 255, 0.1); min-width: 38px; height: 38px;
            border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
        }
        .feature-text h6 { font-weight: 700; margin-bottom: 5px; font-size: 0.95rem; }
        .feature-text p { font-size: 0.75rem; opacity: 0.7; margin: 0; line-height: 1.4; }

        .right-panel {
            display: flex; align-items: center; justify-content: center;
            padding: 2rem; position: relative;
        }

        .login-card {
            background: #ffffff; border-radius: 20px;
            padding: 3rem 3.5rem; width: 100%; max-width: 480px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }

        .user-icon-circle {
            width: 60px; height: 60px; border-radius: 50%;
            background: #eff6ff; color: #2563eb;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.8rem; margin: 0 auto 1rem auto;
        }

        .form-label { font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.5rem; }
        
        .input-icon-wrapper { position: relative; }
        .input-icon-wrapper i.icon-left {
            position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
            color: #94a3b8; font-size: 1.1rem;
        }
        .input-icon-wrapper i.icon-right {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            color: #94a3b8; cursor: pointer; font-size: 1.1rem;
        }
        
        .form-control {
            padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 8px;
            border: 1px solid #e2e8f0; font-size: 0.95rem; color: #334155; background-color: #fafafa;
        }
        .form-control:focus {
            background-color: #ffffff; border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .form-check-label, .forgot-link { font-size: 0.85rem; font-weight: 500; }
        .forgot-link { color: #2563eb; text-decoration: none; }
        .forgot-link:hover { text-decoration: underline; }

        .btn-login {
            background-color: #1d4ed8; border: none; padding: 0.8rem;
            font-weight: 700; border-radius: 8px; font-size: 1rem; margin-top: 0.5rem;
        }
        .btn-login:hover { background-color: #1e40af; }

        .divider {
            display: flex; align-items: center; text-align: center;
            color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 1.8rem 0;
        }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e2e8f0; }
        .divider:not(:empty)::before { margin-right: 1rem; }
        .divider:not(:empty)::after { margin-left: 1rem; }

        .copyright {
            position: absolute; bottom: 20px; width: 100%; text-align: center;
            color: rgba(255,255,255,0.6); font-size: 0.8rem;
        }
    </style>
</head>
<body>

<div class="bg-overlay"></div>

<div class="container-fluid main-wrapper p-0">
    <div class="row m-0 h-100">
        
        <div class="col-lg-7 left-panel d-none d-lg-flex">
            <div class="brand-logo mt-3">
                <i class="fas fa-bus"></i>
                <div class="brand-text">
                    <h3>SchoolBus</h3>
                    <p>HỆ THỐNG QUẢN LÝ<br>ĐƯA ĐÓN HỌC SINH</p>
                </div>
            </div>

            <div class="main-content">
                <div class="main-heading">
                    <span class="text-yellow">An toàn</span> trên mỗi hành trình<br>
                    <span class="text-yellow">Yên tâm</span> trên mỗi chặng đường
                </div>
                <p class="sub-heading">
                    Hệ thống quản lý đưa đón học sinh giúp nhà trường, phụ huynh và tài xế kết nối hiệu quả, đảm bảo an toàn cho học sinh trên mỗi hành trình.
                </p>
            </div>

            <div class="features-row">
                <div class="feature-box">
                    <div class="feature-icon-wrapper"><i class="fas fa-shield-alt"></i></div>
                    <div class="feature-text">
                        <h6>An toàn</h6>
                        <p>Giám sát hành trình<br>24/7</p>
                    </div>
                </div>
                <div class="feature-box">
                    <div class="feature-icon-wrapper"><i class="fas fa-user-friends"></i></div>
                    <div class="feature-text">
                        <h6>Kết nối</h6>
                        <p>Kết nối nhà trường,<br>phụ huynh và tài xế</p>
                    </div>
                </div>
                <div class="feature-box">
                    <div class="feature-icon-wrapper"><i class="fas fa-chart-line"></i></div>
                    <div class="feature-text">
                        <h6>Hiệu quả</h6>
                        <p>Quản lý thông minh,<br>tiết kiệm thời gian</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-lg-5 right-panel">
            <div class="login-card">
                
                <div class="text-center mb-4">
                    <div class="user-icon-circle">
                        <i class="far fa-user"></i>
                    </div>
                    <h3 class="fw-bold mb-1 fs-4">Đăng nhập hệ thống</h3>
                    <p class="text-muted small">Vui lòng chọn phương thức đăng nhập</p>
                </div>

                <c:choose>
                    <c:when test="${param.error == 'not_registered'}">
                        <div class="alert alert-warning py-2 small text-center fw-bold border-0 shadow-sm" style="background-color: #fffbeb; color: #d97706;">
                            <i class="fas fa-exclamation-triangle me-1"></i> Email này chưa được nhà trường đăng ký. Vui lòng liên hệ Admin!
                        </div>
                    </c:when>
                    <c:when test="${param.error == 'google_failed'}">
                        <div class="alert alert-danger py-2 small text-center fw-bold border-0 shadow-sm">
                            <i class="fas fa-times-circle me-1"></i> Đăng nhập Google thất bại. Vui lòng thử lại!
                        </div>
                    </c:when>
                    <c:when test="${not empty error}">
                        <div class="alert alert-danger py-2 small text-center fw-bold border-0 shadow-sm">
                            <i class="fas fa-exclamation-circle me-1"></i> ${error}
                        </div>
                    </c:when>
                </c:choose>

                <a href="${pageContext.request.contextPath}/login-google" class="btn btn-outline-danger w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 shadow-sm mb-3" style="border-radius: 8px; border-width: 2px;">
                    <i class="fab fa-google fs-5"></i>
                    <span>Đăng nhập với tư cách Phụ huynh</span>
                </a>

                <div class="divider">Dành cho Admin & Tài xế</div>

                <form action="${pageContext.request.contextPath}/auth/login" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Email hoặc số điện thoại</label>
                        <div class="input-icon-wrapper">
                            <i class="far fa-envelope icon-left"></i>
                            <input type="text" class="form-control" name="email" placeholder="Nhập tài khoản cấp phát..." required>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Mật khẩu</label>
                        <div class="input-icon-wrapper">
                            <i class="fas fa-lock icon-left"></i>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Nhập mật khẩu..." required>
                            <i class="far fa-eye-slash icon-right" id="togglePassword"></i>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4 mt-3">
                        <div class="form-check mb-0">
                            <input class="form-check-input shadow-none" type="checkbox" id="remember">
                            <label class="form-check-label text-muted" for="remember">Ghi nhớ</label>
                        </div>
                        <a href="forgot-password.jsp" class="forgot-link">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 btn-login shadow-sm">
                        <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập Nội bộ
                    </button>
                </form>

            </div>
            
            <div class="copyright d-none d-lg-block">
                © 2026 School Bus System. Tất cả quyền được bảo lưu.
            </div>
        </div>
        
    </div>
</div>

<script>
    // Kịch bản ẩn/hiện mật khẩu
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
</script>

</body>
</html>