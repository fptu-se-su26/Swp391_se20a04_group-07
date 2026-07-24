<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Cập nhật Phụ Huynh - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>.form-control, .form-select { padding: 0.75rem 1rem; border-radius: 10px; background-color: #f8fafc; }</style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">
    <jsp:include page="admin-sidebar.jsp" />
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        <div class="container-fluid p-4 px-lg-5 mt-3">
            <div class="card shadow-sm border-0 rounded-4 mx-auto" style="max-width: 800px;">
                <div class="card-header bg-white border-bottom p-4 rounded-top-4">
                    <h5 class="mb-0 fw-bold text-dark"><i class="fas fa-edit text-primary me-2"></i>Cập nhật thông tin Phụ Huynh</h5>
                </div>
                <div class="card-body p-4 p-lg-5">
                    <form action="${pageContext.request.contextPath}/admin/update-parent" method="POST">
                        <input type="hidden" name="parentId" value="${parent.parentId}">
                        
                        <div class="row g-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Mã User (User ID)</label>
                                <input type="number" class="form-control" name="userId" value="${parent.userId}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">SĐT Khẩn Cấp</label>
                                <input type="text" class="form-control" name="emergencyPhone" value="${parent.emergencyPhone}" required>
                            </div>

                            <div class="col-md-12">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Khu vực quản lý</label>
                                <select name="areaId" class="form-select" required>
                                    <option value="">-- Chọn khu vực --</option>
                                    <c:forEach items="${areaList}" var="a">
                                        <option value="${a.areaId}" ${parent.areaId == a.areaId ? 'selected' : ''}>${a.areaName}</option>
                                    </c:forEach>
                                </select>
                            </div>

                            <div class="col-md-12">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Địa Chỉ Chi Tiết</label>
                                <input type="text" class="form-control" name="address" value="${parent.address}" required>
                            </div>
                        </div>
                        <hr class="my-5 text-muted">
                        <div class="d-flex justify-content-end gap-3">
                            <a href="manage-parents" class="btn btn-light border fw-bold px-4 rounded-pill">Hủy bỏ</a>
                            <button type="submit" class="btn btn-success fw-bold px-4 rounded-pill shadow-sm"><i class="fas fa-check me-1"></i> Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>