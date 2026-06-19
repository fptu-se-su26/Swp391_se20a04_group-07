package controllerMap;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

// Endpoint để Client kết nối tới. Ví dụ: ws://localhost:8080/SchoolBusSystem/ws/tracking/TRIP001
@ServerEndpoint("/ws/tracking/{tripId}")
public class TrackingWebSocket {

    // Danh sách lưu trữ các kết nối, phân loại theo từng chuyến xe (tripId)
    private static final ConcurrentHashMap<String, Set<Session>> tripSessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("tripId") String tripId) {
        // Tạo phòng cho chuyến xe nếu chưa có, và thêm người dùng vào phòng
        tripSessions.computeIfAbsent(tripId, k -> Collections.newSetFromMap(new ConcurrentHashMap<>())).add(session);
        System.out.println("Đã kết nối: " + session.getId() + " vào chuyến: " + tripId);
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("tripId") String tripId) {
        // Nhận tọa độ từ Tài xế và phát sóng (Broadcast) cho các Phụ huynh
        Set<Session> sessions = tripSessions.get(tripId);
        if (sessions != null) {
            for (Session s : sessions) {
                // Không gửi ngược lại cho chính tài xế (người phát)
                if (s.isOpen() && !s.getId().equals(session.getId())) {
                    try {
                        s.getBasicRemote().sendText(message);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    @OnClose
    public void onClose(Session session, @PathParam("tripId") String tripId) {
        // Xóa kết nối khi người dùng đóng trình duyệt
        Set<Session> sessions = tripSessions.get(tripId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                tripSessions.remove(tripId); // Giải phóng RAM nếu phòng trống
            }
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("Lỗi WebSocket: " + throwable.getMessage());
    }
}