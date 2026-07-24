<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thêm Phụ Huynh - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>.form-control, .form-select { padding: 0.75rem 1rem; border-radius: 10px; background-color: #f8fafc; }</style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">
    <jsp:include page="admin-sidebar.jsp" />
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        <div class="container-fluid p-4 px-lg-5 mt-3">
            <div class="card shadow-sm border-0 rounded-4 mx-auto" style="max-width: 850px;">
                <div class="card-header bg-white border-bottom p-4 rounded-top-4">
                    <h5 class="mb-0 fw-bold text-dark"><i class="fas fa-user-plus text-primary me-2"></i>Thêm Phụ Huynh Mới</h5>
                </div>
                <div class="card-body p-4 p-lg-5">
                    
                    <% 
                        String error = request.getParameter("error");
                        if("user_exists".equals(error)) { 
                    %>
                        <div class="alert alert-danger rounded-3 mb-4 shadow-sm border-0">
                            <i class="fas fa-exclamation-circle me-2"></i> <strong>Lỗi:</strong> Email này đã tồn tại trong hệ thống. Vui lòng sử dụng một Email khác!
                        </div>
                    <% 
                        } else if("parent_profile_failed".equals(error)) { 
                    %>
                        <div class="alert alert-danger rounded-3 mb-4 shadow-sm border-0">
                            <i class="fas fa-exclamation-triangle me-2"></i> <strong>Lỗi:</strong> Không thể lưu thông tin hồ sơ phụ huynh, vui lòng kiểm tra lại!
                        </div>
                    <% 
                        } else if("invalid_data".equals(error)) { 
                    %>
                        <div class="alert alert-warning rounded-3 mb-4 shadow-sm border-0">
                            <i class="fas fa-exclamation-triangle me-2"></i> <strong>Cảnh báo:</strong> Dữ liệu gửi lên không hợp lệ, vui lòng điền đầy đủ các trường!
                        </div>
                    <% 
                        } 
                    %>
                    <form action="${pageContext.request.contextPath}/admin/add-parent" method="POST">
                        
                        <%-- ĐÂY LÀ PHẦN ĐÃ ĐƯỢC BỔ SUNG ĐỂ CHỐNG MẤT ID --%>
                        <c:if test="${not empty targetStudentId}">
                            <input type="hidden" name="targetStudentId" value="${targetStudentId}">
                            <input type="hidden" name="classId" value="${classId}">
                            
                            <div class="alert alert-info rounded-3 mb-4 shadow-sm border-0 d-flex align-items-center">
                                <i class="fas fa-link fs-4 me-3 text-info"></i> 
                                <div>
                                    <h6 class="mb-1 fw-bold text-dark">Chế độ tự động liên kết</h6>
                                    <span class="small">Tài khoản Phụ huynh này sẽ được tự động gán cho <strong>Học sinh ID: #${targetStudentId}</strong> sau khi khởi tạo thành công.</span>
                                </div>
                            </div>
                        </c:if>
                        
                        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2"><i class="fas fa-key me-2"></i>TÀI KHOẢN ĐĂNG NHẬP</h6>
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Email đăng nhập</label>
                                <input type="email" class="form-control" name="email" placeholder="vd: phuhuynh@gmail.com" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Mật khẩu cấp phát</label>
                                <input type="password" class="form-control" name="password" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Họ và Tên</label>
                                <input type="text" class="form-control" name="fullName" placeholder="Nhập tên đầy đủ..." required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">SĐT Cá nhân</label>
                                <input type="text" class="form-control" name="phone" placeholder="Nhập SĐT..." required>
                            </div>
                        </div>

                        <h6 class="fw-bold text-success mb-3 border-bottom pb-2"><i class="fas fa-id-card me-2"></i>HỒ SƠ LIÊN HỆ</h6>
                        <div class="row g-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">SĐT Khẩn Cấp</label>
                                <input type="text" class="form-control" name="emergencyPhone" placeholder="SĐT phụ/người thân..." required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Khu vực quản lý</label>
                                <select name="areaId" class="form-select" required>
                                    <option value="">-- Chọn khu vực --</option>
                                    <c:forEach items="${areaList}" var="a">
                                        <option value="${a.areaId}">📍 ${a.areaName}</option>
                                    </c:forEach>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Địa Chỉ Chi Tiết</label>
                                <input type="text" class="form-control" name="address" placeholder="Nhập địa chỉ nhà..." required>
                            </div>
                        </div>
                        
                        <hr class="my-5 text-muted">
                        <div class="d-flex justify-content-end gap-3">
                            <a href="manage-parents" class="btn btn-light border fw-bold px-4 rounded-pill">Hủy bỏ</a>
                            <button type="submit" class="btn btn-primary fw-bold px-5 rounded-pill shadow-sm">
                                <i class="fas fa-save me-1"></i> Cấp tài khoản & Thêm mới
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>