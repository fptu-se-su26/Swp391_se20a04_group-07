<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quên mật khẩu - SchoolBus</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background: #f4f7f6; height: 100vh; display: flex; align-items: center; }
        .auth-card { border: none; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card auth-card p-4">
                    <h5 class="text-center mb-3 fw-bold">Khôi phục mật khẩu</h5>
                    <p class="text-muted small text-center mb-4">Nhập email của bạn để nhận mã xác minh.</p>
                    
                    <c:if test="${not empty msg}">
                        <div class="alert alert-info py-2 small">${msg}</div>
                    </c:if>

                    <form action="${pageContext.request.contextPath}/auth/forgot-password" method="POST">
                        <div class="mb-4">
                            <label class="form-label small fw-bold">Email tài khoản</label>
                            <input type="email" class="form-control" name="email" placeholder="example@mail.com" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 mb-3">Gửi yêu cầu</button>
                        <div class="text-center">
                            <a href="login.jsp" class="text-decoration-none small"><i class="fas fa-arrow-left me-1"></i> Quay lại đăng nhập</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>