package model;
import java.sql.Time;

public class Route {
    private int routeId;
    private String routeName;
    private String startLocation;
    private String endLocation;
    private Time pickupTime;
    private Time dropoffTime;
    private boolean status;
    
    // --- BỔ SUNG THÊM TÀI XẾ ---
    private int driverId;
    private String driverName;

    public Route() {}

    public Route(int routeId, String routeName, String startLocation, String endLocation, Time pickupTime, Time dropoffTime, boolean status) {
        this.routeId = routeId;
        this.routeName = routeName;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.pickupTime = pickupTime;
        this.dropoffTime = dropoffTime;
        this.status = status;
    }

    // Getters & Setters cũ
    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
    public String getEndLocation() { return endLocation; }
    public void setEndLocation(String endLocation) { this.endLocation = endLocation; }
    public Time getPickupTime() { return pickupTime; }
    public void setPickupTime(Time pickupTime) { this.pickupTime = pickupTime; }
    public Time getDropoffTime() { return dropoffTime; }
    public void setDropoffTime(Time dropoffTime) { this.dropoffTime = dropoffTime; }
    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }

    // Getters & Setters mới bổ sung
    public int getDriverId() { return driverId; }
    public void setDriverId(int driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}