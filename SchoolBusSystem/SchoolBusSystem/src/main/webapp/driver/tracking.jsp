<!DOCTYPE html>
<html lang="vi">
<head>
    <title>Theo dõi xe tr?c tuy?n - School Bus</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <style>
        /* ??t kích th??c cho khung b?n ?? */
        #map { 
            height: 500px; 
            width: 100%; 
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px;">

    <h3 style="color: #0d6efd;">? Tr?m Theo Dõi Chuy?n Xe Bus</h3>
    
    <div id="map"></div>

    <script>
        // 3. Kh?i t?o b?n ?? ? t?a ?? m?c ??nh (Ví d?: 16.0544, 108.2022 là ?à N?ng)
        // S? 15 là m?c ?? zoom (phóng to)
        var map = L.map('map').setView([16.0544, 108.2022], 15);

        // 4. L?y d? li?u hình ?nh b?n ?? t? OpenStreetMap (KHÔNG C?N API KEY)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // 5. Thêm m?t bi?u t??ng (Marker) ??i di?n cho chi?c xe Bus
        var busMarker = L.marker([16.0544, 108.2022]).addTo(map);
        
        // 6. Thêm m?t popup chú thích nh? trên chi?c xe
        busMarker.bindPopup("<b>Xe Bus #123</b><br>?ang ?ón h?c sinh...").openPopup();
    </script>

</body>
</html>