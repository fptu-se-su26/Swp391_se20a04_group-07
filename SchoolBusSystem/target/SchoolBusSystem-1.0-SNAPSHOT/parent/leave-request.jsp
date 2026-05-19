<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng ký nghỉ học - SchoolBus Parent</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            background-color: #f0f4f8; /* Nền đồng bộ xám xanh */
            display: flex; flex-direction: column; min-height: 100vh; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        main { flex-grow: 1; }
        
        /* Tối ưu thẻ Card */
        .custom-card {
            border-radius: 20px;
            border: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            overflow: hidden;
        }
        
        /* Form Control hiện đại */
        .form-control, .form-select {
            border-radius: 12px;
            padding: 0.75rem 1rem;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .form-control:focus, .form-select:focus {
            background-color: #ffffff;
            box-shadow: 0 0 0 0.25rem rgba(105, 108, 255, 0.15);
            border-color: #86b7fe;
        }
        
        /* Nút Submit Gradient */
        .btn-custom {
            border-radius: 12px;
            padding: 0.8rem 1.5rem;
            background: linear-gradient(135deg, #696cff, #0d6efd);
            border: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            color: white;
        }
        .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
            color: white;
        }
        
        /* Bảng hiển thị */
        .table-custom th {
            background-color: #f8fafc;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }
        
        /* Badge Trạng thái trong suốt */
        .badge-status {
            padding: 0.5rem 0.8rem;
            border-radius: 50rem;
            font-weight: 600;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>

    <jsp:include page="/parent/parent-header.jsp" />

    <main class="container-fluid mt-4 mb-5 px-lg-5 px-3">
        <div class="row g-4">
            
            <aside class="col-lg-3 col-md-4">
                <jsp:include page="/parent/parent-sidebar.jsp" />
            </aside>

            <div class="col-lg-9 col-md-8">
                
                <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div>
                        <h4 class="fw-bold m-0" style="color: #0b1a30;">
                            <i class="fas fa-calendar-times text-primary me-2"></i>ĐĂNG KÝ NGHỈ HỌC
                        </h4>
                        <p class="text-muted small mb-0 mt-1">Xin phép cho con nghỉ lộ trình xe đưa đón ngày hôm nay hoặc sắp tới</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="card custom-card h-100 bg-white">
                            <div class="card-header bg-white p-4 border-bottom">
                                <h6 class="fw-bold text-dark mb-0"><i class="fas fa-pen-alt text-primary me-2"></i>Tạo đơn xin nghỉ</h6>
                            </div>
                            <div class="card-body p-4">
                                <form action="${pageContext.request.contextPath}/parent/leave-request" method="POST">
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-bold text-secondary small text-uppercase">Chọn học sinh</label>
                                        <select class="form-select" name="studentId" required>
                                            <option value="" disabled selected>-- Vui lòng chọn con --</option>
                                            <c:forEach var="s" items="${children}">
                                                <option value="${s.studentId}">👧👦 ${s.fullName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-bold text-secondary small text-uppercase">Ngày xin nghỉ</label>
                                        <input type="date" class="form-control" name="leaveDate" required>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-bold text-secondary small text-uppercase">Lý do nghỉ</label>
                                        <textarea class="form-control" name="reason" rows="4" placeholder="VD: Bị ốm, Việc gia đình..." required></textarea>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-custom w-100 fw-bold">
                                        <i class="fas fa-paper-plane me-2"></i>Gửi yêu cầu
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-7">
                        <div class="card custom-card h-100 bg-white">
                            <div class="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold text-dark mb-0"><i class="fas fa-history text-primary me-2"></i>Lịch sử xin nghỉ</h6>
                                <span class="badge bg-light text-muted border rounded-pill px-3 py-2">Dữ liệu lưu trữ</span>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0 table-custom">
                                        <thead>
                                            <tr>
                                                <th class="ps-4 py-3">Ngày xin</th>
                                                <th>Lý do</th>
                                                <th class="text-center">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <c:forEach var="req" items="${leaveRequests}">
                                                <tr>
                                                    <td class="ps-4 fw-bold text-dark">
                                                        <i class="far fa-calendar-alt text-muted me-2"></i>
                                                        <fmt:formatDate value="${req.leaveDate}" pattern="dd/MM/yyyy" />
                                                    </td>
                                                    <td class="text-muted small">${req.reason}</td>
                                                    <td class="text-center">
                                                        <c:choose>
                                                            <c:when test="${req.status == 'PENDING'}">
                                                                <span class="badge-status bg-warning-subtle text-warning border border-warning-subtle">
                                                                    <i class="fas fa-spinner fa-spin me-1"></i> Chờ duyệt
                                                                </span>
                                                            </c:when>
                                                            <c:when test="${req.status == 'APPROVED'}">
                                                                <span class="badge-status bg-success-subtle text-success border border-success-subtle">
                                                                    <i class="fas fa-check-circle me-1"></i> Đã duyệt
                                                                </span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="badge-status bg-danger-subtle text-danger border border-danger-subtle">
                                                                    <i class="fas fa-times-circle me-1"></i> Từ chối
                                                                </span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                            
                                            <c:if test="${empty leaveRequests}">
                                                <tr>
                                                    <td colspan="3" class="text-center py-5">
                                                        <div class="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3 text-muted" style="width: 80px; height: 80px;">
                                                            <i class="fas fa-folder-open fa-2x opacity-50"></i>
                                                        </div>
                                                        <br>
                                                        <span class="fw-bold text-muted">Chưa có dữ liệu xin nghỉ nào.</span>
                                                    </td>
                                                </tr>
                                            </c:if>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>

    <jsp:include page="/parent/parent-footer.jsp" />

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>