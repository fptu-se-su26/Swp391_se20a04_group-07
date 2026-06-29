package model;

import java.sql.Timestamp;

public class Feedback {
    private int feedbackId;
    private int userId;
    private String subject;
    private String content;
    private Timestamp createdAt;

    // --- CÁC TRƯỜNG BỔ SUNG ĐỂ HIỂN THỊ CHI TIẾT ---
    private int parentId;      // ID của Phụ huynh trong bảng parents
    private String parentName; // Tên hiển thị của Phụ huynh (lấy từ bảng users)
    private String studentNames; // Danh sách tên các con của phụ huynh đó

    public Feedback() {}

    // Constructor đầy đủ cho các luồng xử lý dữ liệu JOIN
    public Feedback(int feedbackId, int userId, String subject, String content, Timestamp createdAt) {
        this.feedbackId = feedbackId;
        this.userId = userId;
        this.subject = subject;
        this.content = content;
        this.createdAt = createdAt;
    }

    // --- GETTERS & SETTERS CHO CÁC TRƯỜNG CƠ BẢN ---
    public int getFeedbackId() { return feedbackId; }
    public void setFeedbackId(int feedbackId) { this.feedbackId = feedbackId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    // --- GETTERS & SETTERS CHO CÁC TRƯỜNG BỔ SUNG ---
    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getStudentNames() {
        return studentNames;
    }

    public void setStudentNames(String studentNames) {
        this.studentNames = studentNames;
    }
}