<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Góp ý & Phản hồi - SchoolBus Parent</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            background-color: #f0f4f8; /* Đồng bộ nền xám xanh với dashboard */
            display: flex; flex-direction: column; min-height: 100vh; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        main { flex-grow: 1; }
        
        /* Tối ưu giao diện thẻ Card và Form */
        .feedback-card {
            border-radius: 20px;
            border: none;
            overflow: hidden;
        }
        .form-control {
            border-radius: 12px;
            padding: 0.8rem 1.2rem;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .form-control:focus {
            background-color: #ffffff;
            box-shadow: 0 0 0 0.25rem rgba(105, 108, 255, 0.15);
            border-color: #86b7fe;
        }
        /* Nút Submit hiện đại */
        .btn-custom {
            border-radius: 12px;
            padding: 0.8rem 2rem;
            background: linear-gradient(135deg, #696cff, #0d6efd);
            border: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
            color: white;
        }
        .illustration-col {
            background: linear-gradient(180deg, #f5f7ff 0%, #eef1ff 100%);
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
                            <i class="fas fa-comment-dots text-primary me-2"></i>GỬI GÓP Ý & PHẢN HỒI
                        </h4>
                        <p class="text-muted small mb-0 mt-1">Chúng tôi luôn lắng nghe để nâng cao chất lượng dịch vụ đưa đón</p>
                    </div>
                </div>
                
                <% 
                    String msg = request.getParameter("msg");
                    String error = request.getParameter("error");
                    if("success".equals(msg)) { 
                %>
                    <div class="alert alert-success border-0 shadow-sm rounded-4 mb-4">
                        <i class="fas fa-check-circle me-2"></i> Cảm ơn bạn! Góp ý đã được gửi tới Ban quản trị thành công.
                    </div>
                <% } else if("failed".equals(error)) { %>
                    <div class="alert alert-danger border-0 shadow-sm rounded-4 mb-4">
                        <i class="fas fa-exclamation-circle me-2"></i> Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau!
                    </div>
                <% } %>

                <div class="card feedback-card shadow-sm bg-white">
                    <div class="row g-0">
                        <div class="col-lg-5 d-none d-lg-flex align-items-center justify-content-center p-5 illustration-col">
                            <div class="text-center">
                                <div class="bg-white text-primary rounded-circle shadow-sm d-inline-flex justify-content-center align-items-center mb-4" style="width: 100px; height: 100px;">
                                    <i class="fas fa-envelope-open-text fa-3x"></i>
                                </div>
                                <h5 class="fw-bold text-dark mb-3">Ý kiến của bạn rất quan trọng</h5>
                                <p class="text-muted small mb-0" style="line-height: 1.6;">Mọi đóng góp từ phụ huynh đều giúp nhà trường và đội ngũ tài xế cải thiện sự an toàn và thoải mái cho các em học sinh trên mỗi chuyến đi.</p>
                            </div>
                        </div>

                        <div class="col-lg-7 p-4 p-md-5">
                            <form action="${pageContext.request.contextPath}/parent/feedback" method="POST">
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Chủ đề góp ý</label>
                                    <input type="text" class="form-control" name="subject" placeholder="VD: Khen ngợi tài xế, Góp ý lộ trình..." required>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-secondary small text-uppercase">Nội dung chi tiết</label>
                                    <textarea class="form-control" name="content" rows="6" placeholder="Hãy chia sẻ cụ thể suy nghĩ của bạn tại đây..." required></textarea>
                                </div>
                                <div class="text-end mt-2">
                                    <button type="submit" class="btn btn-primary btn-custom text-white fw-bold">
                                        <i class="fas fa-paper-plane me-2"></i> Gửi phản hồi
                                    </button>
                                </div>
                            </form>
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