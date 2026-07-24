<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thêm Lớp học mới - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .form-control, .form-select {
            padding: 0.75rem 1rem;
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
        }
        .form-control:focus, .form-select:focus {
            background-color: #ffffff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">

    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3">
            
            <div class="card shadow-sm border-0 rounded-4 mx-auto" style="max-width: 800px;">
                <div class="card-header bg-white border-bottom p-4 rounded-top-4">
                    <h5 class="mb-0 fw-bold text-dark"><i class="fas fa-plus-circle text-primary me-2"></i>Thêm Lớp Học Mới</h5>
                </div>
                
                <div class="card-body p-4 p-lg-5">
                    
                    <% if (request.getParameter("error") != null) { %>
                        <div class="alert alert-danger rounded-3 fw-bold small"><i class="fas fa-exclamation-triangle me-2"></i>Thêm lớp học thất bại, vui lòng kiểm tra lại dữ liệu!</div>
                    <% } %>

                    <form action="${pageContext.request.contextPath}/admin/add-class" method="POST">
                        <div class="row g-4">
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Tên Lớp (Ví dụ: 1A1, 10C2)</label>
                                <input type="text" class="form-control fw-bold text-dark" name="className" placeholder="Nhập tên lớp..." required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Khối lớp (Số)</label>
                                <input type="number" class="form-control" name="gradeLevel" placeholder="Ví dụ: 1, 2, 10..." required min="1" max="12">
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Niên khóa / Năm học</label>
                                <input type="text" class="form-control" name="academicYear" placeholder="Ví dụ: 2025-2026" required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-secondary small text-uppercase">Giáo viên Chủ nhiệm</label>
                                <input type="text" class="form-control" name="teacherName" placeholder="Nhập họ tên GVCN..." required>
                            </div>

                        </div>
                        
                        <hr class="my-5 text-muted">
                        
                        <div class="d-flex justify-content-end gap-3">
                            <a href="manage-classes" class="btn btn-light border fw-bold px-4 rounded-pill">Hủy bỏ</a>
                            <button type="submit" class="btn btn-primary fw-bold px-4 rounded-pill shadow-sm">
                                <i class="fas fa-save me-1"></i> Lưu Lớp học
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