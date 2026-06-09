package model;
import java.sql.Date;
import java.sql.Timestamp;

public class LeaveRequest {
    private int leaveRequestId;
    private int studentId;
    private int parentId;
    private Date leaveDate;
    private String reason;
    private String status;
    private Timestamp createdAt;

    public LeaveRequest() {}

    public LeaveRequest(int leaveRequestId, int studentId, int parentId, Date leaveDate, String reason, String status, Timestamp createdAt) {
        this.leaveRequestId = leaveRequestId;
        this.studentId = studentId;
        this.parentId = parentId;
        this.leaveDate = leaveDate;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getLeaveRequestId() { return leaveRequestId; }
    public void setLeaveRequestId(int leaveRequestId) { this.leaveRequestId = leaveRequestId; }
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }
    public int getParentId() { return parentId; }
    public void setParentId(int parentId) { this.parentId = parentId; }
    public Date getLeaveDate() { return leaveDate; }
    public void setLeaveDate(Date leaveDate) { this.leaveDate = leaveDate; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}