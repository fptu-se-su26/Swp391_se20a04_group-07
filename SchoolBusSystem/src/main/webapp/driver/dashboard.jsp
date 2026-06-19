<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Bảng điều khiển Tài xế - GPS Realtime</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        main { flex-grow: 1; }
        
        /* Bố cục chia đôi màn hình ứng dụng thông minh */
        .dashboard-container {
            height: calc(100vh - 140px);
            min-height: 550px;
        }
        
        /* Khung bản đồ bên trái */
        .map-wrapper {
            height: 100%;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.03);
            border: 1px solid #e2e8f0;
            position: relative;
            background: #ffffff;
        }
        #driverMap { height: 100%; width: 100%; z-index: 1; }
        
        /* Trạng thái nổi góc bản đồ */
        .map-status-overlay {
            position: absolute;
            top: 15px;
            left: 15px;
            z-index: 999;
            background: rgba(255, 255, 255, 0.95);
            padding: 10px 18px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.85rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            backdrop-filter: blur(4px);
            border: 1px solid #e2e8f0;
        }

        /* Danh sách chuyến xe cuộn bên phải */
        .trip-sidebar {
            height: 100%;
            overflow-y: auto;
            padding-right: 8px;
        }
        .trip-card { 
            border: 1px solid #e2e8f0;
            border-radius: 16px; 
            transition: all 0.3s ease; 
            background: white;
        }
        .trip-card:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.06) !important; 
        }
        .status-badge { padding: 6px 14px; border-radius: 50rem; font-weight: 600; font-size: 0.8rem; }
        
        /* Thiết kế Icon định vị vòng tròn */
        .driver-bus-icon {
            background: #2563eb;
            color: white;
            border: 3px solid white;
            border-radius: 50%;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
            font-size: 1rem;
        }

        .blink { animation: blinker 1.5s linear infinite; }
        @keyframes blinker { 50% { opacity: 0.4; } }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
</head>
<body>
    <jsp:include page="driver-header.jsp" />

    <main class="container-fluid mt-3 mb-4 px-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h4 class="fw-bold text-dark m-0">Không gian làm việc Tài xế</h4>
                <p class="text-muted small mb-0">Xin chào hành trình mới. Hãy bật GPS trên thiết bị khi bắt đầu di chuyển.</p>
            </div>
        </div>

        <div class="row g-4 dashboard-container">
            <div class="col-lg-7 col-xl-8">
                <div class="map-wrapper">
                    <div id="driverMap"></div>
                    <div class="map-status-overlay" id="gpsStatus">
                        <i class="fas fa-satellite text-secondary me-1"></i> Hệ thống liên lạc: Sẵn sàng
                    </div>
                </div>
            </div>

            <div class="col-lg-5 col-xl-4 trip-sidebar">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h6 class="fw-bold text-secondary text-uppercase m-0" style="letter-spacing: 0.5px; font-size: 0.8rem;">Lịch trình hôm nay</h6>
                    <span class="badge bg-primary-subtle text-primary rounded-pill px-2.5">Realtime</span>
                </div>

                <div class="row g-3">
                    <c:forEach var="t" items="${trips}">
                        <div class="col-12">
                            <div class="card trip-card shadow-sm border-0 p-3">
                                <div class="card-body p-0">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <span class="text-muted small d-block mb-1">Mã chuyến đi</span>
                                            <h5 class="fw-bold text-dark mb-0">${t.tripId}</h5>
                                        </div>
                                        <div>
                                            <c:choose>
                                                <c:when test="${t.status == 1}">
                                                    <span class="status-badge bg-success-subtle text-success border border-success-subtle"><i class="fas fa-check-circle me-1"></i> Đã hoàn thành</span>
                                                </c:when>
                                                <c:when test="${t.status == 2}">
                                                    <span id="badge-${t.tripId}" class="status-badge bg-danger-subtle text-danger border border-danger-subtle blink"><i class="fas fa-broadcast-tower me-1"></i> Đang chạy</span>
                                                </c:when>
                                                <c:otherwise>
                                                    <span id="badge-${t.tripId}" class="status-badge bg-warning-subtle text-warning border border-warning-subtle"><i class="fas fa-clock me-1"></i> Chờ xuất phát</span>
                                                </c:otherwise>
                                            </c:choose>
                                        </div>
                                    </div>
                                    
                                    <div class="row my-3 g-2 bg-light p-2.5 rounded-3 border border-light-subtle small">
                                        <div class="col-6 text-secondary"><i class="fas fa-bus me-1 text-muted"></i> Xe: <b class="text-dark">${t.busNumber != null ? t.busNumber : 'Huyndai 29'}</b></div>
                                        <div class="col-6 text-secondary"><i class="fas fa-map-marked-alt me-1 text-muted"></i> Tuyến: <b class="text-dark">Nội thành</b></div>
                                    </div>

                                    <div class="d-flex gap-2 align-items-center pt-1">
                                        <c:if test="${t.status != 1}">
                                            <button id="btn-${t.tripId}" class="btn ${t.status == 2 ? 'btn-danger' : 'btn-primary'} rounded-pill flex-grow-1 fw-bold px-3 py-2 btn-sm" 
                                                    onclick="toggleDriverTracking('${t.tripId}', this)">
                                                <c:choose>
                                                    <c:when test="${t.status == 2}">
                                                        <i class="fas fa-stop me-1"></i> Dừng chuyến đi
                                                    </c:when>
                                                    <c:otherwise>
                                                        <i class="fas fa-play me-1"></i> Bắt đầu chạy
                                                    </c:otherwise>
                                                </c:choose>
                                            </button>
                                        </c:if>
                                        <a href="${pageContext.request.contextPath}/driver/trip?tripId=${t.tripId}" class="btn btn-outline-dark rounded-pill px-3 py-2 btn-sm" title="Chi tiết học sinh">
                                            <i class="fas fa-users"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                    
                    <c:if test="${empty trips}">
                        <div class="col-12 text-center py-5 bg-white rounded-4 shadow-sm border">
                            <i class="fas fa-mug-hot fa-3x text-muted opacity-40 mb-3"></i>
                            <h6 class="fw-bold text-secondary">Hôm nay bạn hoàn thành hết ca chạy!</h6>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>
    </main>

    <jsp:include page="driver-footer.jsp" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        let map, driverMarker, watchId, ws;
        let isBroadcasting = false;
        let activeTripId = null;

        // 1. Khởi tạo bản đồ (Mặc định lấy tâm ở Đà Nẵng)
        map = L.map('driverMap', { zoomControl: false }).setView([16.0544, 108.2022], 15);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        
        // Ép render bản đồ đầy đủ
        setTimeout(() => { map.invalidateSize(); }, 400);

        // 2. Tạo Marker hình xe Bus
        const busIcon = L.divIcon({
            html: '<i class="fas fa-bus"></i>',
            className: 'driver-bus-icon',
            iconSize: [38, 38],
            iconAnchor: [19, 19]
        });
        driverMarker = L.marker([16.0544, 108.2022], { icon: busIcon }).addTo(map);

        // 3. Lắng nghe cảm biến GPS của thiết bị liên tục
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const currentLatLng = new L.LatLng(lat, lng);

                    // Di chuyển xe của tài xế trên map của họ
                    driverMarker.setLatLng(currentLatLng);
                    map.panTo(currentLatLng);

                    // Nếu đang bấm "Bắt đầu chạy" -> Đẩy dữ liệu qua WebSocket lên Server
                    if (isBroadcasting && ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ lat: lat, lng: lng }));
                    }
                },
                (error) => { console.error("Lỗi đọc định vị thiết bị: ", error); },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        }

        // 4. Xử lý bật/tắt chuyến đi
        function toggleDriverTracking(tripId, btn) {
            const overlay = document.getElementById("gpsStatus");
            
            if (isBroadcasting) {
                if (activeTripId !== tripId) {
                    alert("Bạn cần kết thúc chuyến xe hiện tại trước khi bắt đầu chuyến mới!");
                    return;
                }
                // Thực hiện DỪNG phát sóng
                isBroadcasting = false;
                activeTripId = null;
                if (ws) ws.close();

                btn.innerHTML = '<i class="fas fa-play me-1"></i> Bắt đầu chạy';
                btn.className = "btn btn-primary rounded-pill flex-grow-1 fw-bold px-3 py-2 btn-sm";
                overlay.innerHTML = '<i class="fas fa-satellite text-secondary me-1"></i> Đã dừng phát sóng định vị.';
                overlay.style.color = "#64748b";
                
                const badge = document.getElementById("badge-" + tripId);
                if (badge) {
                    badge.className = "status-badge bg-warning-subtle text-warning border border-warning-subtle";
                    badge.innerHTML = "<i class='fas fa-clock me-1'></i> Chờ xuất phát";
                }
            } else {
                // Thực hiện BẮT ĐẦU phát sóng
                activeTripId = tripId;
                const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
                const wsUrl = protocol + window.location.host + "${pageContext.request.contextPath}/ws/tracking/" + tripId;
                
                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    isBroadcasting = true;
                    btn.innerHTML = '<i class="fas fa-stop me-1"></i> Dừng chuyến đi';
                    btn.className = "btn btn-danger rounded-pill flex-grow-1 fw-bold px-3 py-2 btn-sm";
                    overlay.innerHTML = `<i class="fas fa-satellite-dish text-danger blink me-1"></i> HỆ THỐNG ĐANG PHÁT ĐỊNH VỊ REALTIME (Mã: ${tripId})`;
                    overlay.style.color = "#ef4444";
                    
                    const badge = document.getElementById("badge-" + tripId);
                    if (badge) {
                        badge.className = "status-badge bg-danger-subtle text-danger border border-danger-subtle blink";
                        badge.innerHTML = "<i class='fas fa-broadcast-tower me-1'></i> Đang chạy";
                    }
                };

                ws.onerror = () => { alert("Kết nối máy chủ thất bại, vui lòng thử lại!"); };
            }
        }
    </script>
</body>
</html>