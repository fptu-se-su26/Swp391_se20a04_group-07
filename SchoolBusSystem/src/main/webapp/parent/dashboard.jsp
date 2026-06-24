<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theo dõi xe — Phụ huynh</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        :root {
            --primary:   #2563eb;
            --success:   #10b981;
            --warning:   #f59e0b;
            --danger:    #ef4444;
            --bg-body:   #f8fafc;
            --radius:    20px;
        }

        body {
            background-color: var(--bg-body);
            color: #1e293b;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .workspace-layout {
            padding: 24px;
        }

        /* Đồng bộ chiều cao cố định để không bị đẩy giao diện xuống dưới */
        .content-view-height {
            height: calc(100vh - 160px);
            min-height: 580px;
        }

        /* Khung bản đồ bo cong hiện đại */
        .map-container-wrapper {
            height: 100%;
            border-radius: var(--radius);
            overflow: hidden;
            border: 1px solid #e2e8f0;
            position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
            background: #ffffff;
        }

        #map {
            width: 100%;
            height: 100%;
        }

        /* Thẻ HUD trạng thái nổi trên bản đồ */
        .map-hud-panel {
            position: absolute;
            top: 15px;
            left: 15px;
            z-index: 10;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #e2e8f0;
            padding: 10px 18px;
            border-radius: 12px;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        /* Sidebar chi tiết thông tin bên phải ngoài cùng */
        .info-sidebar-scroll {
            height: 100%;
            overflow-y: auto;
            padding-right: 5px;
        }

        .detail-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius);
            padding: 22px;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
        }

        .card-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 12px;
        }

        /* Biểu tượng định vị hình tròn chứa xe bus */
        .live-bus-marker {
            background: #ffffff;
            border: 4px solid var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
            transition: all 0.3s ease;
        }

        /* Đèn nháy phát tín hiệu trực tuyến */
        .live-pulse-badge {
            background: #fee2e2;
            color: var(--danger);
            padding: 6px 14px;
            border-radius: 50rem;
            font-size: 0.75rem;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: var(--danger);
            border-radius: 50%;
            animation: pulse-red-effect 2s infinite;
        }

        @keyframes pulse-red-effect {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .status-pill-box {
            background: #f1f5f9;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.85rem;
            border: 1px solid #e2e8f0;
        }

        /* Tùy chỉnh thanh cuộn của sidebar thông tin */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        /* ── FIX: Override parent-sidebar.jsp body overflow ── */
        html, body { height: 100vh !important; overflow: hidden !important; }
        .workspace-layout { height: calc(100vh - 56px); overflow: hidden; padding: 16px !important; }
        .content-view-height { height: calc(100vh - 130px) !important; }
        .col-xl-2, .col-lg-3, .col-md-4 { height: 100%; overflow-y: auto; }
        .map-container-wrapper { height: 100% !important; background: #f8fafc; }
        #map { width: 100% !important; height: 100% !important; min-height: 400px; }
    </style>
</head>
<body>

    <jsp:include page="parent-header.jsp" />

    <div class="container-fluid workspace-layout">
        <div class="row g-4">
            
            <div class="col-xl-2 col-lg-3 col-md-4">
                <jsp:include page="parent-sidebar.jsp" />
            </div>

            <div class="col-xl-10 col-lg-9 col-md-8">
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h4 class="fw-bold text-dark m-0"><i class="fas fa-map-location-dot text-primary me-2"></i>Hành trình của con</h4>
                        <p class="text-muted small mb-0 mt-0.5">Giám sát vị trí di chuyển trực tuyến thời gian thực.</p>
                    </div>
                    <div class="live-pulse-badge shadow-sm">
                        <div class="pulse-dot"></div> LIVE TRACKING
                    </div>
                </div>

                <div class="row g-4 content-view-height">
                    
                    <div class="col-xl-8 col-lg-12 h-100">
                        <div class="map-container-wrapper">
                            <div id="map"></div>
                            
                            <div class="map-hud-panel d-flex align-items-center gap-3">
                                <div class="small">
                                    <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">TÍN HIỆU XE</span>
                                    <span id="connText" class="fw-bold text-warning">
                                        <i class="fas fa-spinner fa-spin me-1"></i> Đang thiết lập kết nối...
                                    </span>
                                </div>
                                <div class="border-start ps-3 small">
                                    <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">CẬP NHẬT CUỐI</span>
                                    <span class="fw-bold text-dark" id="lastUpdate">--:--:--</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-12 h-100 info-sidebar-scroll">
                        
                        <div class="detail-card">
                            <span class="card-label">Kênh truyền dữ liệu</span>
                            <div id="connStatusBox" class="status-pill-box text-secondary fw-semibold">
                                <i class="fas fa-circle-notch fa-spin me-2 text-warning"></i> Chờ đồng bộ luồng dữ liệu...
                            </div>
                        </div>

                        <!-- DANH SÁCH CON + NÚT CHỌN CHUYẾN -->
                        <c:choose>
                            <c:when test="${not empty children}">
                                <c:forEach var="child" items="${children}" varStatus="st">
                                    <div class="detail-card" style="cursor:pointer;transition:border 0.15s"
                                         id="childCard${st.index}"
                                         onclick="switchTrip('${child.tripId}', ${st.index})">
                                        <span class="card-label">Con #${st.index + 1}</span>
                                        <div class="d-flex align-items-center gap-3 mb-2">
                                            <div class="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                                                 style="width:40px;height:40px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);font-size:16px;flex-shrink:0">
                                                ${child.fullName.substring(0,1)}
                                            </div>
                                            <div>
                                                <h6 class="fw-bold mb-0">${child.fullName}</h6>
                                                <small class="text-muted">${child.classNameDisplay}</small>
                                            </div>
                                        </div>
                                        <c:choose>
                                            <c:when test="${child.tripId > 0}">
                                                <div class="small">
                                                    <div class="d-flex justify-content-between mb-1">
                                                        <span class="text-secondary"><i class="fas fa-user me-1"></i>Tài xế</span>
                                                        <b>${child.driverName}</b>
                                                    </div>
                                                    <div class="d-flex justify-content-between mb-1">
                                                        <span class="text-secondary"><i class="fas fa-bus me-1"></i>Biển số</span>
                                                        <b>${child.vehiclePlate}</b>
                                                    </div>
                                                    <div class="d-flex justify-content-between">
                                                        <span class="text-secondary"><i class="fas fa-route me-1"></i>Lộ trình</span>
                                                        <b>${child.routeName}</b>
                                                    </div>
                                                </div>
                                                <button class="btn btn-primary w-100 rounded-pill btn-sm fw-bold mt-2 py-2"
                                                        id="watchBtn${st.index}"
                                                        onclick="event.stopPropagation(); switchTrip('${child.tripId}', ${st.index})">
                                                    <i class="fas fa-satellite-dish me-1"></i> Theo dõi trực tiếp
                                                </button>
                                            </c:when>
                                            <c:otherwise>
                                                <div class="text-muted small"><i class="fas fa-moon me-1"></i> Chưa có chuyến hôm nay</div>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <div class="detail-card text-center text-muted">
                                    <i class="fas fa-child fa-2x mb-2 opacity-50"></i>
                                    <p class="small mb-0">Không tìm thấy thông tin học sinh</p>
                                </div>
                            </c:otherwise>
                        </c:choose>

                        <div class="detail-card">
                            <span class="card-label">Nhân sự vận hành</span>
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <div class="d-flex align-items-center justify-content-center rounded-3 style" style="width: 48px; height: 48px; background: #eff6ff; color: var(--primary); font-size: 1.4rem;">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark">Tài xế chuyến đi</h6>
                                    <p class="text-muted small mb-0">Hạng bằng lái: Hạng D / E</p>
                                </div>
                            </div>
                            <a href="tel:0905123456" class="btn btn-outline-primary w-100 rounded-pill fw-bold btn-sm py-2">
                                <i class="fas fa-phone-alt me-2"></i> Liên hệ khẩn cấp
                            </a>
                        </div>

                        <div class="detail-card">
                            <span class="card-label">Thông tin phương tiện</span>
                            <div class="small">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-secondary">Biển kiểm soát:</span>
                                    <span class="fw-bold text-dark">
                                        <c:forEach var="child" items="${children}">
                                            <c:if test="${child.tripId > 0}">${child.vehiclePlate}</c:if>
                                        </c:forEach>
                                    </span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-secondary">Dòng xe:</span>
                                    <span class="fw-bold text-dark">Hyundai Universe 29 chỗ</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="text-secondary">Phân vùng:</span>
                                    <span class="fw-bold text-dark">Đưa đón nội thành</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>

    <jsp:include page="parent-footer.jsp" />

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Cấu hình Token Mapbox chính chủ
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFvaG9hbmdhbjI1IiwiYSI6ImNtcW9pNHJnZzIzdTgyeHB6YmdxbDVvdnQifQ.DpMXP3shm5pGV-WChVV9oA';

        let map, busMarker, ws;
        
        // Hệ tọa độ mặc định của Mapbox: [Kinh độ Lng, Vĩ độ Lat]
        const DEFAULT_CENTER = [108.2022, 16.0544];

        // Khởi tạo bản đồ đường phố sáng sủa để ăn nhập màu nền trắng/xám
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: DEFAULT_CENTER,
            zoom: 14,
            pitch: 0
        });

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Bắt sự kiện map load để ép tính toán lại size container, loại bỏ lỗi mảng xám ô vuông
        map.on('load', () => {
            map.resize();
            initWebSocketConnection();
        });

        window.addEventListener('load', () => {
            setTimeout(() => map.resize(), 150);
            setTimeout(() => map.resize(), 500);
        });

        // Hàm tạo Icon xe bus hình tròn bằng mã HTML
        function createBusMarker(lngLatArray) {
            const containerEl = document.createElement('div');
            containerEl.className = 'live-bus-marker';
            containerEl.style.width = '38px';
            containerEl.style.height = '38px';
            containerEl.innerHTML = '<i class="fas fa-bus text-primary" style="font-size: 16px;"></i>';

            busMarker = new mapboxgl.Marker(containerEl)
                .setLngLat(lngLatArray)
                .addTo(map);
        }

        // Khởi tạo điểm đứng ban đầu
        createBusMarker(DEFAULT_CENTER);

        // Quản lý kết nối WebSocket lắng nghe sóng từ tài xế phát đi
        function initWebSocketConnection() {
            const connBox = document.getElementById("connStatusBox");
            const connText = document.getElementById("connText");

            // TripId lấy từ server-side (chuyến xe của con phụ huynh hôm nay)
            // Được set bởi ParentDashboardServlet qua Student.getTripId()
            const allTripIds = [
                <c:forEach var="child" items="${children}" varStatus="st">
                    <c:if test="${child.tripId > 0}">"${child.tripId}"<c:if test="${!st.last}">,</c:if></c:if>
                </c:forEach>
            ].filter(id => id && id !== "0");

            // Kết nối vào trip đầu tiên có sẵn (hoặc trip được chọn)
            const tripId = window._selectedTripId || allTripIds[0] || null;
            if (!tripId) {
                connBox.innerHTML = "<i class='fas fa-info-circle text-warning me-2'></i> Con bạn chưa có chuyến xe hôm nay.";
                connBox.className = "status-pill-box text-warning fw-semibold";
                connText.innerHTML = "<i class='fas fa-moon text-secondary me-1'></i> Chưa có chuyến";
                connText.className = "fw-bold text-muted";
                return;
            }
            const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
            const wsUrl = protocol + window.location.host + "${pageContext.request.contextPath}/ws/tracking/" + tripId + "/parent";
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                connBox.innerHTML = "<i class='fas fa-check-circle text-success me-2'></i> Trạm liên lạc thông suốt! Đang đợi dữ liệu xe...";
                connBox.className = "status-pill-box text-success fw-semibold";
                connText.innerHTML = "<i class='fas fa-satellite text-success me-1'></i> Đã kết nối kênh";
                connText.className = "fw-bold text-success";
            };

            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.lat && data.lng) {
                        const targetLngLat = [data.lng, data.lat]; // Cú pháp Mapbox bắt buộc là Lng trước Lat sau

                        // Di chuyển tịnh tiến biểu tượng xe
                        if (busMarker) {
                            busMarker.setLngLat(targetLngLat);
                        }
                        
                        // Camera di chuyển mượt mà bám theo xe
                        map.panTo(targetLngLat, { duration: 600 });

                        // In mốc thời gian phản hồi tin nhắn lên HUD
                        const timeStr = new Date().toLocaleTimeString('vi-VN');
                        document.getElementById('lastUpdate').textContent = timeStr;
                        
                        connBox.innerHTML = `<i class='fas fa-bus-alt text-primary me-2'></i> Xe đang chạy ổn định trên đường hành trình.`;
                        connBox.className = "status-pill-box text-primary fw-semibold";
                    }
                } catch (e) {
                    console.warn("Lỗi phân tích cú pháp tọa độ JSON nhận về:", e);
                }
            };

            ws.onclose = () => {
                connBox.innerHTML = "<i class='fas fa-exclamation-triangle text-danger me-2'></i> Mất kết nối tới máy chủ điều hành. Vui lòng F5.";
                connBox.className = "status-pill-box text-danger fw-semibold";
                connText.innerHTML = "<i class='fas fa-circle text-secondary me-1'></i> Đã ngắt luồng";
                connText.className = "fw-bold text-muted";
            };

            ws.onerror = () => {
                connBox.innerHTML = "<i class='fas fa-wifi-slash text-danger me-2'></i> Lỗi đường truyền mạng Internet.";
            };
        }

        // ── Switch trip khi phụ huynh chọn con ──
        function switchTrip(tripId, cardIndex) {
            if (!tripId || tripId === '0') return;

            // Highlight card
            document.querySelectorAll('[id^="childCard"]').forEach(c => {
                c.style.borderColor = '#e2e8f0';
            });
            const card = document.getElementById('childCard' + cardIndex);
            if (card) card.style.borderColor = '#3b82f6';

            // Cập nhật nút
            document.querySelectorAll('[id^="watchBtn"]').forEach(b => {
                b.innerHTML = '<i class="fas fa-satellite-dish me-1"></i> Theo dõi trực tiếp';
                b.className = 'btn btn-primary w-100 rounded-pill btn-sm fw-bold mt-2 py-2';
            });
            const watchBtn = document.getElementById('watchBtn' + cardIndex);
            if (watchBtn) {
                watchBtn.innerHTML = '<i class="fas fa-check-circle me-1"></i> Đang theo dõi...';
                watchBtn.className = 'btn btn-success w-100 rounded-pill btn-sm fw-bold mt-2 py-2';
            }

            // Đóng WS cũ nếu đang mở
            if (ws && ws.readyState === WebSocket.OPEN) ws.close();

            // Kết nối WS mới
            window._selectedTripId = tripId;
            const connBox = document.getElementById("connStatusBox");
            const connText = document.getElementById("connText");

            const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
            const wsUrl = protocol + window.location.host + "${pageContext.request.contextPath}/ws/tracking/" + tripId + "/parent";
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                connBox.innerHTML = "<i class='fas fa-check-circle text-success me-2'></i> Đã kết nối — đang chờ vị trí tài xế...";
                connBox.className = "status-pill-box text-success fw-semibold";
                connText.innerHTML = "<i class='fas fa-satellite text-success me-1'></i> Kênh live: #" + tripId;
                connText.className = "fw-bold text-success";
            };

            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.status === 'driver_offline') {
                        connBox.innerHTML = "<i class='fas fa-moon text-warning me-2'></i> Tài xế đã tắt GPS.";
                        connBox.className = "status-pill-box text-warning fw-semibold";
                        return;
                    }
                    if (data.lat && data.lng) {
                        const lngLat = [data.lng, data.lat];
                        if (busMarker) busMarker.setLngLat(lngLat);
                        map.panTo(lngLat, { duration: 600 });
                        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('vi-VN');
                        connBox.innerHTML = "<i class='fas fa-bus text-primary me-2'></i> Xe đang di chuyển · " + (data.speed || 0) + " km/h";
                        connBox.className = "status-pill-box text-primary fw-semibold";
                    }
                } catch(e) { console.warn(e); }
            };

            ws.onclose = () => {
                connBox.innerHTML = "<i class='fas fa-exclamation-triangle text-danger me-2'></i> Mất kết nối.";
                connBox.className = "status-pill-box text-danger fw-semibold";
                connText.innerHTML = "<i class='fas fa-circle text-secondary me-1'></i> Đã ngắt";
                connText.className = "fw-bold text-muted";
            };
            ws.onerror = () => {
                connBox.innerHTML = "<i class='fas fa-wifi-slash text-danger me-2'></i> Lỗi kết nối mạng.";
            };
        }

        // Tự động kết nối vào trip đầu tiên khi trang load
        window.addEventListener('load', () => {
            const firstTrip = allTripIds[0];
            if (firstTrip) setTimeout(() => switchTrip(firstTrip, 0), 600);
        });

        // Tự động giải phóng cổng WebSocket khi phụ huynh tắt tab/chuyển trang
        window.addEventListener('beforeunload', () => {
            if (ws) ws.close();
        });
    </script>
</body>
</html>