<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Phụ huynh - Theo dõi vị trí xe trực tuyến</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        .map-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            background: white;
            overflow: hidden;
        }
        /* Ép khung hiển thị bản đồ chuẩn kích thước, chống lỗi vỡ ô vuông */
        #map { 
            height: 600px; 
            width: 100%;
            z-index: 1;
        }
        /* Style cho khung tròn bao quanh icon xe bus trên bản đồ */
        .bus-div-icon {
            background: white;
            border: 3px solid #0284c7;
            border-radius: 50%;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
            transition: all 0.3s ease;
        }
        .status-bar {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
    </style>
</head>
<body class="py-4">

    <div class="container" style="max-width: 1100px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold text-dark m-0">
                    <i class="fas fa-map-marked-alt text-primary me-2"></i>Hành trình xe trực tuyến
                </h4>
                <p class="text-muted small mb-0 mt-1">Giám sát vị trí thời gian thực của chuyến xe: <span class="fw-bold text-primary">TRIP001</span></p>
            </div>
            <a href="${pageContext.request.contextPath}/parent/dashboard" class="btn btn-light border rounded-pill px-3 fw-semibold small">
                <i class="fas fa-arrow-left me-1"></i> Quay lại
            </a>
        </div>

        <div class="card map-card mb-3">
            <div id="map"></div>
        </div>

        <div class="status-bar d-flex justify-content-between align-items-center shadow-sm">
            <div id="statusText" class="text-secondary">
                <i class="fas fa-circle-notch fa-spin me-2 text-warning"></i> Đang thiết lập kết nối đến trạm phát sóng...
            </div>
            <span class="badge bg-primary rounded-pill px-3 py-2 fw-semibold" style="font-size: 0.75rem;">
                <i class="fas fa-sync-alt fa-spin me-1"></i> REAL-TIME
            </span>
        </div>
    </div>

    <script>
        // 1. Khởi tạo bản đồ tại vị trí trung tâm mặc định (Ví dụ: Đà Nẵng)
        // Mức thu phóng 16 để nhìn rõ từng cung đường, số nhà
        const map = L.map('map').setView([16.0544, 108.2022], 16);
        
        // Tải các ô gạch bản đồ từ OpenStreetMap vệ tinh miễn phí
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // 2. GIẢI PHÁP: Sử dụng L.divIcon của FontAwesome để vẽ xe thay vì load file ảnh ngoài
        let busIcon = L.divIcon({
            html: '<i class="fas fa-bus text-primary" style="font-size: 20px;"></i>',
            className: 'bus-div-icon',
            iconSize: [38, 38],
            iconAnchor: [19, 19] // Đặt tâm neo chính xác vào giữa hình tròn
        });

        // Tạo marker xe bus ban đầu đặt trên bản đồ
        let busMarker = L.marker([16.0544, 108.2022], {icon: busIcon}).addTo(map);
        busMarker.bindPopup("<b class='text-primary'>Xe đưa đón trường học</b><br>Vị trí cập nhật liên tục.").openPopup();

        // 3. Khởi tạo đường dẫn mạng WebSocket an toàn
        const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        // Tự động nhận diện context path động từ dự án của bạn
        const wsUrl = wsProtocol + window.location.host + "${pageContext.request.contextPath}/ws/tracking/TRIP001";
        const ws = new WebSocket(wsUrl);

        ws.onopen = function() {
            const statusBox = document.getElementById("statusText");
            statusBox.innerHTML = "<i class='fas fa-check-circle text-success me-2'></i> Đã kết nối thông suốt! Đang chờ tín hiệu GPS từ tài xế...";
            statusBox.className = "text-success fw-semibold";
        };

        ws.onmessage = function(event) {
            try {
                // Tiếp nhận gói tin JSON tọa độ được phát đi từ tài xế
                const data = JSON.parse(event.data);
                if (data.lat && data.lng) {
                    const newLatLng = new L.LatLng(data.lat, data.lng);
                    
                    // Di chuyển xe đến tọa độ mới một cách mượt mà
                    busMarker.setLatLng(newLatLng);
                    
                    // Đưa camera bản đồ trượt theo xe mà không thay đổi độ zoom
                    map.panTo(newLatLng);
                    
                    // Cập nhật mốc thời gian nhận gói tin lên thanh trạng thái
                    const now = new Date().toLocaleTimeString();
                    document.getElementById("statusText").innerHTML = `<i class='fas fa-satellite-dish text-primary blink me-2'></i> Xe đang di chuyển. Cập nhật lúc: <b class='text-dark'>${now}</b>`;
                    document.getElementById("statusText").className = "text-primary fw-semibold";
                }
            } catch (e) {
                console.error("Lỗi parse dữ liệu tọa độ: ", e);
            }
        };

        ws.onclose = function() {
            const statusBox = document.getElementById("statusText");
            statusBox.innerHTML = "<i class='fas fa-exclamation-triangle text-danger me-2'></i> Mất kết nối tới máy chủ. Vui lòng tải lại trang!";
            statusBox.className = "text-danger fw-semibold";
        };
    </script>
</body>
</html>