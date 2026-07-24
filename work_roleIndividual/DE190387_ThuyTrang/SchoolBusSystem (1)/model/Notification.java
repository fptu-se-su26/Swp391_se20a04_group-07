package model;

import java.sql.Timestamp;

public class Notification {

    private int notificationId;
    private int userId;
    private String title;
    private String message;
    private boolean isRead;
    private Timestamp createdAt;
    private String receiverType;
    private String notificationType; // Biến dùng để phân loại ADMIN hoặc LEAVE

    // Constructor rỗng
    public Notification() {
    }

    // Constructor cũ
    public Notification(int notificationId, int userId, String title, String message, boolean isRead, Timestamp createdAt) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // ==========================================
    // GETTER VÀ SETTER
    // ==========================================

    public int getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getReceiverType() {
        return receiverType;
    }

    public void setReceiverType(String receiverType) {
        this.receiverType = receiverType;
    }

    // ĐÂY LÀ HÀM QUAN TRỌNG NHẤT ĐỂ SỬA LỖI TRÊN JSP
    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType; 
    }
}