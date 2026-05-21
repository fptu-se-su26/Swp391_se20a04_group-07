package model;
import java.sql.Time;

public class RouteStop {
    private int stopId;
    private int routeId;
    private String stopName;
    private int stopOrder;
    private Time estimatedTime;

    public RouteStop() {}

    public RouteStop(int stopId, int routeId, String stopName, int stopOrder, Time estimatedTime) {
        this.stopId = stopId;
        this.routeId = routeId;
        this.stopName = stopName;
        this.stopOrder = stopOrder;
        this.estimatedTime = estimatedTime;
    }

    public int getStopId() { return stopId; }
    public void setStopId(int stopId) { this.stopId = stopId; }
    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }
    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }
    public int getStopOrder() { return stopOrder; }
    public void setStopOrder(int stopOrder) { this.stopOrder = stopOrder; }
    public Time getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(Time estimatedTime) { this.estimatedTime = estimatedTime; }
}