<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng ký tài khoản - SchoolBus</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background: #f4f7f6; min-height: 100vh; display: flex; align-items: center; padding: 40px 0; }
        .auth-card { border: none; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="card auth-card p-4">
                    <h4 class="text-center mb-4 fw-bold text-primary">Đăng ký Phụ huynh</h4>
                    <form action="${pageContext.request.contextPath}/auth/register" method="POST">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Họ và tên</label>
                            <input type="text" class="form-control" name="fullName" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Email</label>
                            <input type="email" class="form-control" name="email" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold">Số điện thoại</label>
                                <input type="text" class="form-control" name="phone" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label small fw-bold">Mật khẩu</label>
                                <input type="password" class="form-control" name="password" required>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="form-check-label small">
                                <input type="checkbox" class="form-check-input" required> Tôi đồng ý với các điều khoản dịch vụ.
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold rounded-pill">ĐĂNG KÝ TÀI KHOẢN</button>
                    </form>
                    <hr>
                    <div class="text-center small">
                        Đã có tài khoản? <a href="login.jsp" class="fw-bold text-decoration-none">Đăng nhập</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>