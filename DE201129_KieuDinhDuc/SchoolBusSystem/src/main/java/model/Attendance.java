package model;
import java.sql.Timestamp;

public class Attendance {
    private int attendanceId;
    private int tripId;
    private int studentId;
    private Timestamp checkinTime;
    private Timestamp checkoutTime;
    private String attendanceStatus;
    private String note;

    public Attendance() {}

    public Attendance(int attendanceId, int tripId, int studentId, Timestamp checkinTime, Timestamp checkoutTime, String attendanceStatus, String note) {
        this.attendanceId = attendanceId;
        this.tripId = tripId;
        this.studentId = studentId;
        this.checkinTime = checkinTime;
        this.checkoutTime = checkoutTime;
        this.attendanceStatus = attendanceStatus;
        this.note = note;
    }

    public int getAttendanceId() { return attendanceId; }
    public void setAttendanceId(int attendanceId) { this.attendanceId = attendanceId; }
    public int getTripId() { return tripId; }
    public void setTripId(int tripId) { this.tripId = tripId; }
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }
    public Timestamp getCheckinTime() { return checkinTime; }
    public void setCheckinTime(Timestamp checkinTime) { this.checkinTime = checkinTime; }
    public Timestamp getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(Timestamp checkoutTime) { this.checkoutTime = checkoutTime; }
    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}