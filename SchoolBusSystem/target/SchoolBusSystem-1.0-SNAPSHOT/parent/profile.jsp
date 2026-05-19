<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hồ sơ cá nhân - SchoolBus Parent</title>
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
            background-color: #ffffff;
        }

        /* Avatar & Cover Bìa */
        .cover-bg {
            background: linear-gradient(135deg, #eef1ff 0%, #dbe4ff 100%);
            height: 120px;
            border-radius: 20px 20px 0 0;
            width: 100%;
        }
        .profile-img-wrapper {
            margin-top: -60px;
            position: relative;
            z-index: 2;
        }
        .profile-img { 
            width: 120px; 
            height: 120px; 
            object-fit: cover; 
            border: 4px solid #ffffff; 
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            background-color: #fff;
        }

        /* Form Control hiện đại */
        .form-control {
            border-radius: 12px;
            padding: 0.75rem 1rem;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .form-control:focus {
            background-color: #ffffff;
            box-shadow: 0 0 0 0.25rem rgba(105, 108, 255, 0.15);
            border-color: #86b7fe;
        }
        .form-control[readonly] {
            background-color: #eef2f6;
            color: #6c757d;
            cursor: not-allowed;
        }

        /* Nút Submit Gradient */
        .btn-custom {
            border-radius: 12px;
            padding: 0.8rem 1.5rem;
            background: linear-gradient(135deg, #696cff, #0d6efd);
            border: none;
            color: white;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
            color: white;
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
                            <i class="fas fa-user-edit text-primary me-2"></i>HỒ SƠ CÁ NHÂN
                        </h4>
                        <p class="text-muted small mb-0 mt-1">Quản lý thông tin liên hệ và cài đặt bảo mật tài khoản</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-lg-4">
                        <div class="card custom-card text-center pb-4 h-100">
                            <div class="cover-bg"></div>
                            
                            <div class="profile-img-wrapper">
                                <img src="${pageContext.request.contextPath}/images/avatars/${sessionScope.user.avatar != null ? sessionScope.user.avatar : 'default.png'}" 
                                     class="profile-img rounded-circle mx-auto">
                            </div>
                            
                            <div class="mt-3 px-3">
                                <h5 class="fw-bold mb-1 text-dark">${sessionScope.user.fullName}</h5>
                                <p class="text-muted small mb-3"><span class="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill px-3">Vai trò: Phụ huynh</span></p>
                                <button class="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold">
                                    <i class="fas fa-camera me-1"></i> Thay đổi ảnh
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-8">
                        <div class="card custom-card p-4 p-md-5 h-100">
                            <form action="${pageContext.request.contextPath}/parent/profile" method="POST">
                                <h6 class="fw-bold text-dark mb-4 pb-2 border-bottom"><i class="fas fa-address-card text-primary me-2"></i>Chi tiết liên hệ</h6>
                                
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <label class="form-label text-secondary small fw-bold text-uppercase">Họ và tên <i class="fas fa-lock ms-1 text-muted opacity-50" title="Không thể tự đổi"></i></label>
                                        <input type="text" class="form-control fw-semibold" value="${sessionScope.user.fullName}" readonly>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-secondary small fw-bold text-uppercase">Email <i class="fas fa-lock ms-1 text-muted opacity-50" title="Không thể tự đổi"></i></label>
                                        <input type="email" class="form-control fw-semibold" value="${sessionScope.user.email}" readonly>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-secondary small fw-bold text-uppercase">Số điện thoại chính</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="fas fa-phone-alt"></i></span>
                                            <input type="text" class="form-control border-start-0 ps-0" name="phone" value="${sessionScope.user.phone}" placeholder="Nhập SĐT...">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-secondary small fw-bold text-uppercase">SĐT khẩn cấp</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0 text-danger opacity-75"><i class="fas fa-heartbeat"></i></span>
                                            <input type="text" class="form-control border-start-0 ps-0" name="emergencyPhone" value="${parentProfile.emergencyPhone}" placeholder="Số gọi khi khẩn cấp...">
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-secondary small fw-bold text-uppercase">Địa chỉ cư trú</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="fas fa-map-marker-alt"></i></span>
                                            <textarea class="form-control border-start-0 ps-0" name="address" rows="2" placeholder="Nhập địa chỉ nhà cụ thể...">${parentProfile.address}</textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr class="my-4 text-muted opacity-25">
                                
                                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                                    <a href="${pageContext.request.contextPath}/auth/change-password" class="text-primary text-decoration-none fw-semibold small">
                                        <i class="fas fa-key me-1"></i> Đổi mật khẩu tài khoản
                                    </a>
                                    <button type="submit" class="btn btn-custom fw-bold px-5">
                                        <i class="fas fa-save me-2"></i>Lưu thay đổi
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