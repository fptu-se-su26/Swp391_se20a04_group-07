<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Báo cáo & Thống kê - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-light">
    <jsp:include page="/admin/admin-header.jsp" />
    <main class="container-fluid mt-4 mb-5">
        <div class="row">
            <aside class="col-lg-2"><jsp:include page="/admin/admin-sidebar.jsp" /></aside>
            <div class="col-lg-10 px-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-bold">BÁO CÁO VẬN HÀNH & DOANH THU</h4>
                    <button class="btn btn-success"><i class="fas fa-file-excel me-2"></i>Xuất Excel</button>
                </div>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm bg-primary text-white p-4 text-center">
                            <h6>DOANH THU THÁNG NÀY</h6>
                            <h2 class="fw-bold mb-0">125,000,000 VND</h2>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm bg-info text-white p-4 text-center">
                            <h6>TỔNG CHUYẾN ĐI ĐÃ HOÀN THÀNH</h6>
                            <h2 class="fw-bold mb-0">842 Chuyến</h2>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm p-5 text-center">
                    <i class="fas fa-chart-bar fa-4x text-muted mb-3"></i>
                    <h5 class="text-muted">Khu vực hiển thị Biểu đồ (Sử dụng Chart.js)</h5>
                    <p class="text-muted small">Vui lòng tích hợp dữ liệu JSON từ ReportServlet vào đây.</p>
                </div>
            </div>
        </div>
    </main>
    <jsp:include page="/admin/admin-footer.jsp" />
</body>
</html>