<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Điểm danh học sinh</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            .table-custom th {
                background-color: #f8fafc;
                color: #64748b;
                text-transform: uppercase;
                font-size: 0.85rem;
                letter-spacing: 0.5px;
            }
            .student-on-leave {
                opacity: 0.6;
                background-color: #f8f9fa;
            } /* Làm mờ học sinh đã xin nghỉ */
            .btn-call-parent {
                width: 38px;
                height: 38px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
        </style>
    </head>
    <body>
        <jsp:include page="/driver/driver-header.jsp" />
        <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
            <div class="row g-4">
                <aside class="col-lg-3 col-md-4">
                    <jsp:include page="/driver/driver-sidebar.jsp" />
                </aside>
                <div class="col-lg-9 col-md-8">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="fw-bold m-0"><i class="fas fa-clipboard-check text-success me-2"></i>ĐIỂM DANH HỌC SINH</h4>
                        <%-- Thông báo sau khi điểm danh --%>
                        <c:if test="${param.msg == 'success'}">
                            <div class="alert alert-success alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
                                <i class="fas fa-check-circle me-2"></i>
                                <strong>Điểm danh thành công!</strong>
                                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
                            </div>
                        </c:if>
                        <c:if test="${param.msg == 'error'}">
                            <div class="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
                                <i class="fas fa-times-circle me-2"></i>
                                <strong>Lưu thất bại! Vui lòng thử lại.</strong>
                                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
                            </div>
                        </c:if>
                        <span class="badge bg-primary px-3 py-2 rounded-pill shadow-sm">Chuyến: #TRP${tripId}</span>
                    </div>

                    <div class="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0 table-custom">
                                <thead>
                                    <tr>
                                        <th class="ps-4 py-3">Học sinh</th>
                                        <th>Lớp</th>
                                        <th class="text-center">Xác nhận lên xe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="s" items="${studentList}">
                                        <c:set var="isOnLeave" value="${leaveStatuses[s.studentId]}" />

                                        <tr class="${isOnLeave ? 'student-on-leave' : ''}">
                                            <td class="ps-4 py-3">
                                                <div class="d-flex align-items-center">
                                                    <img src="${pageContext.request.contextPath}/images/avatars/${s.avatar != null ? s.avatar : 'default.png'}" class="rounded-circle me-3 border shadow-sm" width="45" height="45" style="object-fit: cover;">
                                                    <div>
                                                        <span class="fw-bold text-dark d-block" style="${isOnLeave ? 'text-decoration: line-through;' : ''}">${s.fullName}</span>
                                                        <small class="text-muted">ID: ${s.studentId}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="fw-semibold text-muted">
                                                <span class="badge bg-light text-dark border">${s.classNameDisplay != null ? s.classNameDisplay : 'N/A'}</span>
                                            </td>
                                            <td class="text-center">
                                                <c:choose>
                                                    <%-- 1. NẾU ĐÃ XIN NGHỈ --%>
                                                    <c:when test="${isOnLeave}">
                                                        <span class="badge bg-warning text-dark border border-warning-subtle px-3 py-2 rounded-pill">
                                                            <i class="fas fa-bed me-1"></i> Đã xin phép
                                                        </span>
                                                    </c:when>

                                                    <%-- 2. NẾU ĐÃ ĐIỂM DANH (Lấy từ DB lên) --%>
                                                    <c:when test="${not empty currentAttendance[s.studentId]}">
                                                        <div class="d-flex justify-content-center align-items-center gap-2">
                                                            <c:choose>
                                                                <c:when test="${currentAttendance[s.studentId] == 'Có mặt'}">
                                                                    <span class="badge bg-success px-4 py-2 rounded-pill shadow-sm fs-6">
                                                                        <i class="fas fa-check-circle me-1"></i> Có mặt
                                                                    </span>
                                                                </c:when>
                                                                <c:otherwise>
                                                                    <span class="badge bg-danger px-4 py-2 rounded-pill shadow-sm fs-6">
                                                                        <i class="fas fa-times-circle me-1"></i> Vắng mặt
                                                                    </span>
                                                                </c:otherwise>
                                                            </c:choose>

                                                            <%-- Nút Sửa (Undo) đề phòng tài xế bấm nhầm --%>
                                                            <form action="${pageContext.request.contextPath}/driver/attendance" method="POST" class="m-0">
                                                                <input type="hidden" name="tripId" value="${tripId}">
                                                                <input type="hidden" name="studentId" value="${s.studentId}">
                                                                <input type="hidden" name="attendanceStatus" value="${currentAttendance[s.studentId] == 'Có mặt' ? 'Vắng mặt' : 'Có mặt'}">
                                                                <button type="submit" class="btn btn-sm btn-light border text-secondary rounded-circle shadow-sm" title="Đổi trạng thái" style="width: 32px; height: 32px;">
                                                                    <i class="fas fa-sync-alt"></i>
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </c:when>

                                                    <%-- 3. NẾU CHƯA ĐIỂM DANH (Hiện 2 nút gốc của bạn) --%>
                                                    <c:otherwise>
                                                        <div class="d-flex justify-content-center align-items-center gap-2">
                                                            <form action="${pageContext.request.contextPath}/driver/attendance" method="POST" class="m-0">
                                                                <input type="hidden" name="tripId" value="${tripId}">
                                                                <input type="hidden" name="studentId" value="${s.studentId}">
                                                                <button name="attendanceStatus" value="Có mặt" class="btn btn-outline-success rounded-pill px-4 fw-bold shadow-sm"><i class="fas fa-check me-1"></i> Có mặt</button>
                                                                <button name="attendanceStatus" value="Vắng mặt" class="btn btn-outline-danger rounded-pill px-4 fw-bold shadow-sm"><i class="fas fa-times me-1"></i> Vắng</button>
                                                            </form>

                                                            <c:if test="${not empty parentPhones[s.studentId]}">
                                                                <a href="tel:${parentPhones[s.studentId]}" class="btn btn-light border text-primary btn-call-parent shadow-sm" title="Gọi Phụ huynh">
                                                                    <i class="fas fa-phone-alt"></i>
                                                                </a>
                                                            </c:if>
                                                        </div>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <jsp:include page="/driver/driver-footer.jsp" />
    </body>
</html>