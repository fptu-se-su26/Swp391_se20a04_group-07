<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đổi mật khẩu - SchoolBus System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-light">
    <nav class="navbar navbar-dark bg-primary shadow-sm mb-4">
        <div class="container">
            <span class="navbar-brand">Cài đặt tài khoản</span>
            <a href="javascript:history.back()" class="btn btn-sm btn-outline-light">Quay lại</a>
        </div>
    </nav>

    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card shadow-sm border-0 p-4">
                    <h5 class="fw-bold mb-4 text-center">Thay đổi mật khẩu</h5>
                    
                    <c:if test="${not empty error}">
                        <div class="alert alert-danger py-2 small">${error}</div>
                    </c:if>
                    <c:if test="${param.msg == 'success'}">
                        <div class="alert alert-success py-2 small">Đổi mật khẩu thành công!</div>
                    </c:if>

                    <form action="${pageContext.request.contextPath}/auth/change-password" method="POST">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Mật khẩu hiện tại</label>
                            <input type="password" class="form-control" name="oldPassword" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Mật khẩu mới</label>
                            <input type="password" class="form-control" name="newPassword" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label small fw-bold">Xác nhận mật khẩu mới</label>
                            <input type="password" class="form-control" name="confirmPassword" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 fw-bold">Cập nhật mật khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>