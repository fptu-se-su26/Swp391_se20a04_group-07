<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Quản lý Lớp học - Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            .class-card {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                border-radius: 16px;
                border: 1px solid #eef2f5;
                position: relative; /* Định vị tuyệt đối cho nút chỉnh sửa */
            }
            .class-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
            }
            .icon-circle-bg {
                width: 65px;
                height: 65px;
                background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
                color: #0284c7;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                margin: 0 auto 15px;
            }
            .btn-view {
                background-color: #f8fafc;
                color: #0d6efd;
                font-weight: 600;
                border: 1px solid #e2e8f0;
            }
            .btn-view:hover {
                background-color: #0d6efd;
                color: white;
            }
            /* Style cho nút bấm chỉnh sửa tinh tế tại góc card */
            .btn-edit-trigger {
                position: absolute;
                top: 12px;
                right: 12px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                color: #64748b;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                cursor: pointer;
                z-index: 2;
            }
            .btn-edit-trigger:hover {
                background: #e0f2fe;
                color: #0369a1;
                border-color: #bae6fd;
            }
        </style>
    </head>
    <body style="background-color: #f4f7f6; margin: 0;">

        <jsp:include page="admin-sidebar.jsp" />

        <div class="main-content-wrapper">
            <jsp:include page="admin-header.jsp" />

            <div class="container-fluid p-4 px-lg-5">
                <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <div>
                        <h4 class="fw-bold m-0" style="color: #2b3643;">Quản lý Lớp học</h4>
                        <p class="text-muted small mb-0 mt-1">Danh sách tất cả các lớp và học sinh trực thuộc</p>
                    </div>
                    <a href="${pageContext.request.contextPath}/admin/add-class" class="btn btn-primary shadow-sm rounded-pill px-4 fw-bold">
                        <i class="fas fa-plus me-1"></i> Thêm Lớp
                    </a>
                </div>

                <c:if test="${param.msg == 'add_success'}">
                    <div class="alert alert-success alert-dismissible fade show rounded-4 fw-bold shadow-sm" role="alert">
                        <i class="fas fa-check-circle me-2"></i>Đã thêm lớp học mới thành công!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </c:if>
                <c:if test="${param.msg == 'update_success'}">
                    <div class="alert alert-success alert-dismissible fade show rounded-4 fw-bold shadow-sm" role="alert">
                        <i class="fas fa-check-circle me-2"></i>Đã cập nhật thông tin lớp học thành công!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </c:if>
                <c:if test="${param.error == 'update_failed'}">
                    <div class="alert alert-danger alert-dismissible fade show rounded-4 fw-bold shadow-sm" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>Cập nhật lớp học thất bại. Vui lòng thử lại!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </c:if>
            </div>

            <div class="row g-4 px-lg-5 pb-5">
                <c:choose>
                    <c:when test="${not empty classList}">
                        <c:forEach var="c" items="${classList}">
                            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                <div class="card class-card shadow-sm bg-white h-100">
                                    
                                    <button class="btn-edit-trigger shadow-none" title="Chỉnh sửa thông tin" 
                                            onclick="openEditModal('${c.classId}', '${c.className}', '${c.teacherName}', '${c.academicYear}')">
                                        <i class="fas fa-pencil-alt small"></i>
                                    </button>

                                    <div class="card-body text-center p-4">

                                        <div class="icon-circle-bg">
                                            <i class="fas fa-chalkboard-teacher"></i>
                                        </div>

                                        <h4 class="fw-bold text-dark mb-1">Lớp ${c.className}</h4>
                                        <div class="mt-2 mb-3">
                                            <span class="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                                                Niên khóa: ${c.academicYear}
                                            </span>
                                        </div>

                                        <div class="bg-light rounded-3 p-3 mb-4 text-start border" style="border-color: #f1f5f9 !important;">
                                            <div class="text-muted small text-uppercase fw-bold mb-1" style="font-size: 0.7rem;">Giáo viên chủ nhiệm</div>
                                            <div class="text-dark fw-bold"><i class="fas fa-user-tie text-primary me-2"></i>${c.teacherName}</div>
                                        </div>

                                        <a href="manage-students?classId=${c.classId}" class="btn btn-view w-100 rounded-pill transition">
                                            <i class="fas fa-users me-2"></i>Xem học sinh
                                        </a>

                                    </div>
                                </div>
                            </div>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <div class="col-12">
                            <div class="card border-0 shadow-sm rounded-4 py-5 text-center bg-white">
                                <div style="width: 80px; height: 80px; background-color: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                                    <i class="fas fa-school fa-3x text-secondary opacity-50"></i>
                                </div>
                                <h5 class="text-dark fw-bold">Chưa có lớp học nào</h5>
                                <p class="text-muted mb-0">Hệ thống hiện tại chưa có dữ liệu lớp học.</p>
                            </div>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>

        </div>

        <div class="modal fade" id="editClassModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow rounded-4 bg-white">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold text-dark">
                            <i class="fas fa-edit text-primary me-2"></i>Chỉnh sửa thông tin
                        </h5>
                        <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="${pageContext.request.contextPath}/admin/manage-classes" method="post">
                        <div class="modal-body py-4">
                            <input type="hidden" name="classId" id="modalClassId">
                            
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">Tên lớp học</label>
                                <input type="text" name="className" id="modalClassName" class="form-control rounded-3 shadow-none border-light-subtle" required>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">Giáo viên chủ nhiệm</label>
                                <input type="text" name="teacherName" id="modalTeacherName" class="form-control rounded-3 shadow-none border-light-subtle" required>
                            </div>

                            <div class="mb-0">
                                <label class="form-label text-muted small fw-bold">Niên khóa</label>
                                <input type="text" name="academicYear" id="modalAcademicYear" class="form-control rounded-3 shadow-none border-light-subtle" required>
                            </div>
                        </div>
                        <div class="modal-footer border-0 pt-0">
                            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Lưu cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // Nhận thêm tham số year và gán vào input tương ứng trong form Modal
            function openEditModal(id, name, teacher, year) {
                document.getElementById('modalClassId').value = id;
                document.getElementById('modalClassName').value = name;
                document.getElementById('modalTeacherName').value = teacher;
                document.getElementById('modalAcademicYear').value = year; // Gán niên khóa
                
                var myModal = new bootstrap.Modal(document.getElementById('editClassModal'));
                myModal.show();
            }
        </script>
    </body>
</html>