package model;

public class DashboardStatistic {
    private int totalStudents;
    private int totalDrivers;
    private int totalVehicles;
    private int totalRoutes;
    private int activeTrips;
    private double monthlyRevenue; 

    public DashboardStatistic() {}

    public DashboardStatistic(int totalStudents, int totalDrivers, int totalVehicles, int totalRoutes, int activeTrips, double monthlyRevenue) {
        this.totalStudents = totalStudents;
        this.totalDrivers = totalDrivers;
        this.totalVehicles = totalVehicles;
        this.totalRoutes = totalRoutes;
        this.activeTrips = activeTrips;
        this.monthlyRevenue = monthlyRevenue;
    }

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public int getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(int totalDrivers) { this.totalDrivers = totalDrivers; }
    public int getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(int totalVehicles) { this.totalVehicles = totalVehicles; }
    public int getTotalRoutes() { return totalRoutes; }
    public void setTotalRoutes(int totalRoutes) { this.totalRoutes = totalRoutes; }
    public int getActiveTrips() { return activeTrips; }
    public void setActiveTrips(int activeTrips) { this.activeTrips = activeTrips; }
    public double getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(double monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }
}