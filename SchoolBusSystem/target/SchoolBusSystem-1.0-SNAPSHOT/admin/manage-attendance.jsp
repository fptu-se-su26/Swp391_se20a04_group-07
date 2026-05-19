<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý Điểm danh - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .hover-card:hover { transform: translateY(-3px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; transition: all 0.3s ease; cursor: pointer; }
        .table-custom th { background-color: #f1f5f9; color: #4b5563; font-weight: 600; }
    </style>
</head>
<body style="background-color: #f4f7f6; margin: 0;">
    <jsp:include page="admin-sidebar.jsp" />
    <div class="main-content-wrapper">
        <jsp:include page="admin-header.jsp" />
        
        <div class="container-fluid p-4 px-lg-5 mt-3">
            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h4 class="fw-bold m-0" style="color: #2b3643;">LỊCH SỬ ĐIỂM DANH HỆ THỐNG</h4>
                    <p class="text-muted small mb-0 mt-1">Theo dõi lịch trình lên xuống xe của học sinh (Dữ liệu từ Tài xế)</p>
                </div>
            </div>

            <c:choose>
                <%-- ================= MÀN HÌNH 1: DANH SÁCH LỚP ================= --%>
                <c:when test="${viewType == 'ALL_CLASSES'}">
                    <div class="row g-4">
                        <c:forEach items="${classList}" var="c">
                            <div class="col-md-4 col-lg-3">
                                <a href="manage-attendance?classId=${c.classId}" class="text-decoration-none">
                                    <div class="card border-0 shadow-sm rounded-4 p-4 hover-card text-center bg-white h-100">
                                        <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block mx-auto mb-3">
                                            <i class="fas fa-chalkboard-teacher fa-2x"></i>
                                        </div>
                                        <h5 class="fw-bold text-dark mb-1">Lớp ${c.className}</h5>
                                        <div class="small text-muted mb-2 border-bottom pb-2">
                                            GVCN: <strong class="text-dark">${c.teacherName != null ? c.teacherName : 'Chưa xếp'}</strong>
                                        </div>
                                        <div class="d-flex justify-content-between small text-muted">
                                            <span>Khối: ${c.gradeLevel}</span>
                                            <span>NH: ${c.academicYear}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </c:forEach>
                    </div>
                </c:when>

                <%-- ================= MÀN HÌNH 2: DANH SÁCH HỌC SINH TRONG LỚP ================= --%>
                <c:when test="${viewType == 'CLASS_STUDENTS'}">
                    <div class="mb-3">
                        <a href="manage-attendance" class="btn btn-sm btn-light border fw-bold rounded-pill shadow-sm">
                            <i class="fas fa-arrow-left me-1"></i> Quay lại Danh sách Lớp
                        </a>
                    </div>
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0 table-custom">
                                <thead>
                                    <tr>
                                        <th class="ps-4 py-3">Mã HS</th>
                                        <th>Họ và Tên Học sinh</th>
                                        <th class="text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach items="${studentList}" var="s">
                                        <tr>
                                            <td class="ps-4 text-muted fw-bold">#HS${s.studentId}</td>
                                            <td class="fw-bold text-dark">
                                                <i class="fas fa-user-graduate text-primary me-2"></i>${s.fullName}
                                            </td>
                                            <td class="text-center">
                                                <a href="manage-attendance?studentId=${s.studentId}&cId=${classId}" class="btn btn-sm btn-primary rounded-pill px-3 shadow-sm">
                                                    <i class="fas fa-history me-1"></i> Lịch sử điểm danh
                                                </a>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </c:when>

                <%-- ================= MÀN HÌNH 3: CHI TIẾT ĐIỂM DANH HỌC SINH ================= --%>
                <c:when test="${viewType == 'STUDENT_DETAIL'}">
                    <div class="mb-4 d-flex align-items-center">
                        <a href="manage-attendance?classId=${classId}" class="btn btn-sm btn-light border fw-bold rounded-pill shadow-sm me-3">
                            <i class="fas fa-arrow-left me-1"></i> Quay lại
                        </a>
                        <h5 class="fw-bold m-0 text-dark">Điểm danh: <span class="text-primary">${student.fullName}</span></h5>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div class="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h6 class="fw-bold text-primary mb-0"><i class="fas fa-calendar-alt me-2"></i>Bảng kê chi tiết (Thứ 2 - Thứ 6)</h6>
                            <span class="badge bg-info-subtle text-info px-3 py-2 rounded-pill"><i class="fas fa-id-badge me-1"></i> Dữ liệu do Tài xế cập nhật</span>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0 table-custom">
                                <thead>
                                    <tr>
                                        <th class="ps-4 py-3">Ngày tháng</th>
                                        <th>Giờ Lên Xe (Check-in)</th>
                                        <th>Trạng Thái</th>
                                        <th>Ghi chú từ Tài xế</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach items="${attendanceList}" var="a">
                                        <tr>
                                            <td class="ps-4 fw-bold text-dark">
                                                <fmt:formatDate value="${a.tripDate}" pattern="EEEE, dd/MM/yyyy" />
                                            </td>
                                            <td>
                                                <span class="badge bg-light border text-dark fs-6 px-3 py-2">
                                                    <i class="far fa-clock text-warning me-1"></i> 
                                                    ${a.checkInTime != null ? a.checkInTime : '<span class="text-danger small">Không ghi nhận</span>'}
                                                </span>
                                            </td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${a.status == 'Có mặt'}">
                                                        <span class="badge bg-success rounded-pill px-3 py-2"><i class="fas fa-check me-1"></i> Có mặt</span>
                                                    </c:when>
                                                    <c:when test="${a.status == 'Vắng mặt'}">
                                                        <span class="badge bg-danger rounded-pill px-3 py-2"><i class="fas fa-times me-1"></i> Vắng mặt</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="badge bg-secondary rounded-pill px-3 py-2">${a.status}</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td class="text-muted small">${not empty a.notes ? a.notes : '---'}</td>
                                        </tr>
                                    </c:forEach>
                                    <c:if test="${empty attendanceList}">
                                        <tr><td colspan="4" class="text-center py-5 text-muted">Học sinh chưa có dữ liệu điểm danh trong tuần.</td></tr>
                                    </c:if>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </c:when>
            </c:choose>

        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>