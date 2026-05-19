<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý Học sinh - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>.main-content-wrapper { margin-left: 260px; min-height: 100vh; background-color: #f4f7f6; }</style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">

    <jsp:include page="admin-sidebar.jsp" />
    
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5">
            
            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h4 class="fw-bold m-0" style="color: #2b3643;">Danh sách Học sinh</h4>
                    <p class="text-muted small mb-0 mt-1">Quản lý toàn bộ học sinh trong lớp</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="manage-classes" class="btn btn-light border shadow-sm rounded-pill px-4 fw-bold text-secondary">
                        <i class="fas fa-arrow-left me-1"></i> Trở về Lớp
                    </a>
                    <a href="add-student?classId=${param.classId}" class="btn btn-primary shadow-sm rounded-pill px-4 fw-bold">
                        <i class="fas fa-user-plus me-1"></i> Thêm học sinh
                    </a>
                </div>
            </div>

            <c:if test="${param.msg == 'add_success_linked'}">
                <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-4"><i class="fas fa-check-circle me-2"></i>Thêm học sinh thành công và <b>tự động liên kết</b> với Phụ huynh có Email trùng khớp!<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
            </c:if>
            <c:if test="${param.msg == 'add_success_no_parent'}">
                <div class="alert alert-warning alert-dismissible fade show border-0 shadow-sm rounded-4"><i class="fas fa-exclamation-circle me-2"></i>Thêm học sinh thành công. Email này chưa tồn tại, vui lòng <b>bấm nút Chi tiết</b> để khởi tạo Phụ huynh mới.<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
            </c:if>
            <c:if test="${param.msg == 'link_success'}">
                <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-4"><i class="fas fa-link me-2"></i>Đã gán Phụ huynh cho học sinh thành công!<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
            </c:if>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0 text-center">
                        <thead style="background-color: #f1f5f9; color: #4b5563;">
                            <tr>
                                <th class="ps-4 py-3 text-start">Họ tên</th>
                                <th>Lớp</th>
                                <th>Phụ huynh</th>
                                <th>Trạng thái</th>
                                <th class="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:choose>
                                <c:when test="${not empty studentList}">
                                    <c:forEach items="${studentList}" var="s">
                                        <tr>
                                            <td class="ps-4 text-start">
                                                <span class="fw-bold text-dark d-block">${s.fullName}</span>
                                                <small class="text-muted">ID: #${s.studentId}</small>
                                            </td>
                                            <td><span class="badge bg-info text-dark rounded-pill px-3">${s.classNameDisplay}</span></td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${s.parentId != 0}">
                                                        <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="fas fa-check-circle me-1"></i>ID:${s.parentId} - ${s.parentName}</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1"><i class="fas fa-exclamation-triangle me-1"></i>Trống</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td>
                                                <span class="badge ${s.status ? 'bg-success' : 'bg-danger'} rounded-pill px-3">${s.status ? 'Hoạt động' : 'Đã nghỉ'}</span>
                                            </td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-light border text-info rounded-3 me-1 shadow-sm" data-bs-toggle="modal" data-bs-target="#detailModal${s.studentId}" title="Xem chi tiết & Phân bổ">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <a href="update-student?id=${s.studentId}" class="btn btn-sm btn-light border text-primary rounded-3 me-1" title="Sửa"><i class="fas fa-edit"></i></a>
                                                <form action="delete-student" method="POST" class="d-inline" onsubmit="return confirm('Bạn có chắc chắn muốn xóa?')">
                                                    <input type="hidden" name="studentId" value="${s.studentId}">
                                                    <button class="btn btn-sm btn-light border text-danger rounded-3" title="Xóa"><i class="fas fa-trash"></i></button>
                                                </form>
                                            </td>
                                        </tr>

                                        <div class="modal fade text-start" id="detailModal${s.studentId}" tabindex="-1" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content rounded-4 border-0 shadow">
                                                    <div class="modal-header bg-light py-3 border-bottom-0">
                                                        <h5 class="modal-title fw-bold text-dark"><i class="fas fa-id-card text-primary me-2"></i>Hồ sơ Học sinh #${s.studentId}</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>
                                                    <div class="modal-body px-4 text-center">
                                                        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px; font-size: 24px;">
                                                            <i class="fas fa-user-graduate"></i>
                                                        </div>
                                                        <h5 class="fw-bold mb-0">${s.fullName}</h5>
                                                        <p class="text-muted small">Lớp: ${s.classNameDisplay}</p>
                                                        <hr>
                                                        
                                                        <c:choose>
                                                            <c:when test="${s.parentId != 0}">
                                                                <div class="alert alert-success border-0 py-2"><i class="fas fa-check-circle me-2"></i> Đã liên kết với Phụ huynh: <strong>${s.parentName}</strong> (ID: ${s.parentId})</div>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <div class="alert alert-warning border-0 py-3 mb-0 text-start">
                                                                    <div class="d-flex align-items-center mb-3">
                                                                        <i class="fas fa-exclamation-triangle text-warning fs-4 me-2"></i>
                                                                        <h6 class="mb-0 fw-bold">Học sinh chưa có phụ huynh!</h6>
                                                                    </div>
                                                                    
                                                                    <div class="p-3 bg-white rounded-3 shadow-sm mb-3 border">
                                                                        <span class="badge bg-primary mb-2">Trường hợp 1</span>
                                                                        <p class="small fw-semibold mb-2">Nếu phụ huynh đã có tài khoản (có anh/chị đang học):</p>
                                                                        <form action="link-parent" method="POST" class="d-flex gap-2">
                                                                            <input type="hidden" name="studentId" value="${s.studentId}">
                                                                            <input type="hidden" name="classId" value="${param.classId}">
                                                                            <select name="parentId" class="form-select form-select-sm" required>
                                                                                <option value="">-- Chọn Phụ huynh --</option>
                                                                                <c:forEach items="${parentList}" var="p">
                                                                                    <option value="${p.parentId}">ID:${p.parentId} - SĐT: ${p.emergencyPhone}</option>
                                                                                </c:forEach>
                                                                            </select>
                                                                            <button type="submit" class="btn btn-sm btn-success fw-bold text-nowrap"><i class="fas fa-link me-1"></i> Gán</button>
                                                                        </form>
                                                                    </div>

                                                                    <div class="p-3 bg-white rounded-3 shadow-sm border text-center">
                                                                        <span class="badge bg-secondary mb-2">Trường hợp 2</span>
                                                                        <p class="small fw-semibold mb-2">Nếu là người dùng mới hoàn toàn:</p>
                                                                        <a href="add-parent?studentId=${s.studentId}&classId=${param.classId}" class="btn btn-primary btn-sm rounded-pill fw-bold px-4">
                                                                            <i class="fas fa-user-plus me-1"></i> Khởi tạo Phụ huynh mới
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </c:forEach>
                                </c:when>
                                <c:otherwise>
                                    <tr><td colspan="5" class="text-center py-5 text-muted"><i class="fas fa-user-graduate fa-3x mb-3 opacity-50"></i><br>Không tìm thấy học sinh nào!</td></tr>
                                </c:otherwise>
                            </c:choose>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>