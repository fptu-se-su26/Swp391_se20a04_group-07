package controllerMap;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket Endpoint xử lý định vị Real-time cho hệ thống School Bus.
 * Đường dẫn chuẩn: ws://localhost:8080/ProjectName/ws/tracking/{tripId}/{role}
 */
@ServerEndpoint("/ws/tracking/{tripId}/{role}")
public class TrackingWebSocket {

    // Map chứa danh sách các phụ huynh đang kết nối nghe ngóng theo từng chuyến xe
    private static final ConcurrentHashMap<String, Set<Session>> parentSessions = new ConcurrentHashMap<>();
    
    // Map chứa kết nối duy nhất của tài xế theo từng chuyến xe
    private static final ConcurrentHashMap<String, Session> driverSessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("tripId") String tripId, @PathParam("role") String role) {
        if ("driver".equalsIgnoreCase(role)) {
            // Lưu session của tài xế vào map
            driverSessions.put(tripId, session);
            System.out.println("[WS] TÀI XẾ KẾT NỐI - Chuyến: " + tripId + " | ID: " + session.getId());
        } else {
            // Lưu session của phụ huynh vào set phòng tương ứng
            parentSessions.computeIfAbsent(tripId, k -> Collections.newSetFromMap(new ConcurrentHashMap<>())).add(session);
            System.out.println("[WS] PHỤ HUYNH KẾT NỐI - Chuyến: " + tripId + " | ID: " + session.getId());
        }
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("tripId") String tripId, @PathParam("role") String role) {
        // Chỉ nhận tọa độ phát đi từ tài xế để truyền cho phụ huynh
        if ("driver".equalsIgnoreCase(role)) {
            broadcastToParents(tripId, message);
        }
    }

    @OnClose
    public void onClose(Session session, @PathParam("tripId") String tripId, @PathParam("role") String role) {
        if ("driver".equalsIgnoreCase(role)) {
            driverSessions.remove(tripId);
            // Báo cho phụ huynh biết xe mất tín hiệu hoặc tài xế tắt app
            broadcastToParents(tripId, "{\"status\":\"driver_offline\"}");
            System.out.println("[WS] Tài xế ngắt kết nối - Chuyến: " + tripId);
        } else {
            Set<Session> watchers = parentSessions.get(tripId);
            if (watchers != null) {
                watchers.remove(session);
                if (watchers.isEmpty()) {
                    parentSessions.remove(tripId);
                }
            }
            System.out.println("[WS] Phụ huynh ngắt kết nối - Chuyến: " + tripId);
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("[WS] Phát sinh lỗi tại Session " + session.getId() + ": " + throwable.getMessage());
    }

    // Hàm phát sóng tọa độ từ tài xế tới toàn bộ phụ huynh trong phòng
    private void broadcastToParents(String tripId, String message) {
        Set<Session> watchers = parentSessions.get(tripId);
        if (watchers == null) return;
        
        for (Session s : watchers) {
            if (s.isOpen()) {
                try {
                    s.getBasicRemote().sendText(message);
                } catch (IOException e) {
                    // ĐÃ SỬA: Thay parent.getId() bằng s.getId() để tránh lỗi crash hệ thống
                    System.err.println("[WS] Lỗi gửi đến phụ huynh " + s.getId() + ": " + e.getMessage());
                }
            }
        }
    }
}