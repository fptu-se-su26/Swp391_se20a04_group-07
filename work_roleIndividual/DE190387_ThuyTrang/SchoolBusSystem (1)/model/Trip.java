package model;
import java.sql.Date;
import java.sql.Timestamp;

public class Trip {
    private int tripId;
    private int routeId;
    private int vehicleId;
    private int driverId;
    private Date tripDate;
    private String tripType;
    private Timestamp startTime;
    private Timestamp endTime;
    private String status;
    private String routeName;
    private String driverName;

    public Trip() {}

    public Trip(int tripId, int routeId, int vehicleId, int driverId, Date tripDate, String tripType, Timestamp startTime, Timestamp endTime, String status) {
        this.tripId = tripId;
        this.routeId = routeId;
        this.vehicleId = vehicleId;
        this.driverId = driverId;
        this.tripDate = tripDate;
        this.tripType = tripType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public int getTripId() { return tripId; }
    public void setTripId(int tripId) { this.tripId = tripId; }
    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }
    public int getVehicleId() { return vehicleId; }
    public void setVehicleId(int vehicleId) { this.vehicleId = vehicleId; }
    public int getDriverId() { return driverId; }
    public void setDriverId(int driverId) { this.driverId = driverId; }
    public Date getTripDate() { return tripDate; }
    public void setTripDate(Date tripDate) { this.tripDate = tripDate; }
    public String getTripType() { return tripType; }
    public void setTripType(String tripType) { this.tripType = tripType; }
    public Timestamp getStartTime() { return startTime; }
    public void setStartTime(Timestamp startTime) { this.startTime = startTime; }
    public Timestamp getEndTime() { return endTime; }
    public void setEndTime(Timestamp endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}