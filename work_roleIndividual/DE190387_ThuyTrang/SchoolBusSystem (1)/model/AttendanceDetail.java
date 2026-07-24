package model;

import java.sql.Date;
import java.sql.Time;

public class AttendanceDetail {
    private Date tripDate;
    private Time checkInTime;
    private String status;
    private String notes;

    public AttendanceDetail() {}

    public Date getTripDate() { return tripDate; }
    public void setTripDate(Date tripDate) { this.tripDate = tripDate; }

    public Time getCheckInTime() { return checkInTime; }
    public void setCheckInTime(Time checkInTime) { this.checkInTime = checkInTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}