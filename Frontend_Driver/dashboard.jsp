<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Tài Xế — GPS Mapbox Realtime</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        :root {
            --bg:        #0f1117;
            --surface:   #1a1d27;
            --border:    #2a2d3a;
            --accent:    #3b82f6;
            --success:   #10b981;
            --danger:    #ef4444;
            --radius:    16px;
        }

        body {
            background-color: #f1f5f9; 
            color: #1e293b;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .workspace-container { padding: 20px; }
        
        /* Cố định chiều cao hiển thị cho cả bản đồ và danh sách trên mọi độ phân giải máy tính */
        .dynamic-view-height { height: calc(100vh - 150px); min-height: 550px; }

        .map-container-box {
            height: 100%;
            border-radius: var(--radius);
            overflow: hidden;
            border: 1px solid #e2e8f0;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            background: #ffffff;
        }

        #map { width: 100%; height: 100%; }

        .map-overlay-panel {
            position: absolute;
            top: 15px; left: 15px;
            z-index: 10;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #e2e8f0;
            padding: 10px 16px;
            border-radius: 12px;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            color: #1e293b;
        }

        .sidebar-scroll { height: 100%; overflow-y: auto; padding-right: 5px; }

        .trip-item-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius);
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
            transition: all 0.25s ease;
        }

        .trip-item-card:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
        }

        .status-pill { padding: 6px 14px; border-radius: 50rem; font-size: 0.8rem; font-weight: 600; }
        .blink { animation: live-pulse 1.5s infinite; }
        @keyframes live-pulse { 50% { opacity: 0.4; } }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        /* ── FIX: Override driver-sidebar.jsp body overflow ── */
        html, body {
            height: 100vh !important;
            overflow: hidden !important;
            margin: 0 !important;
        }
        .workspace-container {
            height: calc(100vh - 56px); /* 56px = navbar height */
            overflow: hidden;
            padding: 16px !important;
        }
        .dynamic-view-height {
            height: calc(100vh - 104px) !important;
        }
        /* Sidebar cột trái cuộn độc lập */
        .col-xl-2, .col-lg-3, .col-md-4 {
            height: 100%;
            overflow-y: auto;
        }
        /* Đảm bảo map container chiếm đúng chiều cao */
        .map-container-box {
            height: 100% !important;
            background: #0f1117;
        }
        #map {
            width: 100% !important;
            height: 100% !important;
            min-height: 400px;
        }
        .col-xl-10 > .row { height: 100%; }
    </style>
</head>
<body>

    <jsp:include page="driver-header.jsp" />

    <div class="container-fluid workspace-container">
        <div class="row g-4">
            
            <div class="col-xl-2 col-lg-3 col-md-4">
                <jsp:include page="driver-sidebar.jsp" />
            </div>

            <div class="col-xl-10 col-lg-9 col-md-8">
                <div class="row g-4 dynamic-view-height">
                    
                    <div class="col-lg-7 col-md-12 h-100">
                        <div class="map-container-box">
                            <div id="map"></div>
                            
                            <div class="map-overlay-panel d-flex align-items-center gap-3">
                                <div class="small">
                                    <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">HỆ THỐNG</span>
                                    <span id="wsStatus" class="fw-bold text-success">
                                        <i class="fas fa-satellite me-1"></i> Định vị sẵn sàng
                                    </span>
                                </div>
                                <div class="border-start ps-3 small">
                                    <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">VẬN TỐC</span>
                                    <span class="fw-bold text-primary"><span id="speedDisplay">0</span> km/h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-5 col-md-12 h-100 sidebar-scroll">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-secondary fw-bold text-uppercase m-0" style="letter-spacing: 0.5px; font-size: 0.8rem;">Lịch trình hôm nay</h6>
                            <span class="badge bg-primary text-white rounded-pill px-2.5">Mapbox V3</span>
                        </div>

                        <div class="row g-1">
                            <c:forEach var="t" items="${trips}">
                                <div class="col-12">
                                    <div class="trip-item-card">
                                        <div class="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <span class="text-muted small d-block mb-0.5">Mã tuyến chạy</span>
                                                <h5 class="fw-bold m-0 text-dark">${t.tripId}</h5>
                                            </div>
                                            <div>
                                                <c:choose>
                                                    <c:when test="${t.status == 2 || t.status == '2'}">
                                                        <span id="badge-${t.tripId}" class="status-pill bg-danger-subtle text-danger border border-danger-subtle blink">
                                                            <i class="fas fa-broadcast-tower me-1"></i> Đang chạy
                                                        </span>
                                                    </c:when>
                                                    <c:when test="${t.status == 1 || t.status == '1'}">
                                                        <span class="status-pill bg-success-subtle text-success border border-success-subtle">
                                                            <i class="fas fa-check-circle me-1"></i> Hoàn thành
                                                        </span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span id="badge-${t.tripId}" class="status-pill bg-warning-subtle text-warning border border-warning-subtle">
                                                            <i class="fas fa-clock me-1"></i> Chờ chạy
                                                        </span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </div>
                                        </div>

                                        <div class="p-3 rounded-3 mb-3 bg-light border border-light-subtle">
                                            <div class="row g-2 small text-secondary">
                                                <div class="col-6"><i class="fas fa-bus me-2"></i>Xe: <b class="text-dark">${t.busNumber != null ? t.busNumber : 'Bus-29'}</b></div>
                                                <div class="col-6 text-end"><i class="fas fa-clock me-2"></i>Giờ: <b class="text-dark">${t.scheduledTime}</b></div>
                                            </div>
                                        </div>

                                        <div class="d-flex gap-2">
                                            <c:if test="${t.status != 1 && t.status != '1'}">
                                                <button id="btn-${t.tripId}" class="btn ${t.status == 2 || t.status == '2' ? 'btn-danger' : 'btn-primary'} w-100 rounded-pill fw-bold btn-sm py-2"
                                                        onclick="toggleDriverTracking('${t.tripId}', this)">
                                                    <i class="fas ${t.status == 2 || t.status == '2' ? 'fa-stop' : 'fa-play'} me-2"></i>
                                                    ${t.status == 2 || t.status == '2' ? 'Dừng chuyến đi' : 'Bắt đầu chạy'}
                                                </button>
                                            </c:if>
                                            <a href="${pageContext.request.contextPath}/driver/trip?tripId=${t.tripId}" class="btn btn-outline-dark rounded-pill px-3" title="Danh sách học sinh">
                                                <i class="fas fa-users"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </c:forEach>
                            
                            <c:if test="${empty trips}">
                                <div class="col-12 text-center py-5 bg-white rounded-4 border border-dashed">
                                    <i class="fas fa-calendar-check fa-3x text-muted mb-3 opacity-50"></i>
                                    <h6 class="text-muted fw-bold">Không có lịch trình ca chạy nào hôm nay!</h6>
                                </div>
                            </c:if>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <jsp:include page="driver-footer.jsp" />

    <script>
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFvaG9hbmdhbjI1IiwiYSI6ImNtcW9pNHJnZzIzdTgyeHB6YmdxbDVvdnQifQ.DpMXP3shm5pGV-WChVV9oA';

        let map, driverMarker, watchId, ws;
        let isBroadcasting = false;
        let activeTripId = null;

        let currentLng = 108.2022;
        let currentLat = 16.0544;

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12', 
            center: [currentLng, currentLat],
            zoom: 14,
            pitch: 30
        });

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        map.on('load', () => {
            map.resize();
        });

        // FIX: Resize lại sau khi tất cả CSS và sidebar đã load xong
        window.addEventListener('load', () => {
            setTimeout(() => { map.resize(); }, 150);
            setTimeout(() => { map.resize(); }, 500);
        });

        function createDriverMarker(lngLatArray) {
            const el = document.createElement('div');
            el.style.width = '36px';
            el.style.height = '36px';
            el.style.background = '#2563eb';
            el.style.color = '#ffffff';
            el.style.border = '3px solid #ffffff';
            el.style.borderRadius = '50%';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.5)';
            el.innerHTML = '<i class="fas fa-bus" style="font-size: 15px;"></i>';

            driverMarker = new mapboxgl.Marker(el)
                .setLngLat(lngLatArray)
                .addTo(map);
        }

        createDriverMarker([currentLng, currentLat]);

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    currentLat = position.coords.latitude;
                    currentLng = position.coords.longitude;
                    
                    const speed = position.coords.speed;
                    const kmh = speed ? Math.round(speed * 3.6) : 0;
                    document.getElementById('speedDisplay').textContent = kmh;

                    if (driverMarker) {
                        driverMarker.setLngLat([currentLng, currentLat]);
                        map.panTo([currentLng, currentLat], { duration: 600 });
                    }

                    if (isBroadcasting && ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            lat: currentLat,
                            lng: currentLng,
                            speed: Math.round((position.coords.speed || 0) * 3.6),
                            heading: position.coords.heading || 0,
                            timestamp: Date.now()
                        }));
                    }
                },
                (error) => { console.error("Lỗi GPS: ", error.message); },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        }

        function toggleDriverTracking(tripId, btn) {
            const hud = document.getElementById("wsStatus");

            if (isBroadcasting) {
                if (activeTripId !== tripId) {
                    alert("Hãy kết thúc ca di chuyển hiện hành trước khi mở ca mới!");
                    return;
                }
                isBroadcasting = false;
                activeTripId = null;
                if (ws) ws.close();

                btn.innerHTML = '<i class="fas fa-play me-1.5"></i> Bắt đầu chạy';
                btn.className = "btn btn-primary w-100 rounded-pill fw-bold btn-sm py-2";
                hud.innerHTML = '<i class="fas fa-satellite me-1"></i> Định vị sẵn sàng';
                hud.className = "fw-bold text-success";

                const badge = document.getElementById("badge-" + tripId);
                if (badge) {
                    badge.className = "status-pill bg-warning-subtle text-warning border border-warning-subtle";
                    badge.innerHTML = "<i class='fas fa-clock me-1'></i> Chờ chạy";
                }
            } else {
                activeTripId = tripId;
                const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
                const wsUrl = protocol + window.location.host + "${pageContext.request.contextPath}/ws/tracking/" + tripId + "/driver";

                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    isBroadcasting = true;
                    btn.innerHTML = '<i class="fas fa-stop me-1.5"></i> Dừng chuyến đi';
                    btn.className = "btn btn-danger w-100 rounded-pill fw-bold btn-sm py-2";
                    hud.innerHTML = `<i class="fas fa-satellite-dish blink me-1"></i> ĐANG PHÁT SÓNG (${tripId})`;
                    hud.className = "fw-bold text-danger";

                    const badge = document.getElementById("badge-" + tripId);
                    if (badge) {
                        badge.className = "status-pill bg-danger-subtle text-danger border border-danger-subtle blink";
                        badge.innerHTML = "<i class='fas fa-broadcast-tower me-1'></i> Đang chạy";
                    }

                    ws.send(JSON.stringify({
                            lat: currentLat, lng: currentLng,
                            speed: 0, heading: 0, timestamp: Date.now()
                        }));
                };

                ws.onerror = () => { alert("Kết nối máy chủ thất bại! Vui lòng thử lại."); };
            }
        }
    </script>
</body>
</html>