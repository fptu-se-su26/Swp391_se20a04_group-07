package model;

public class Vehicle {
    private int vehicleId;
    private String plateNumber;
    private int seatCapacity;
    private String vehicleType;
    private String status;

    public Vehicle() {}

    public Vehicle(int vehicleId, String plateNumber, int seatCapacity, String vehicleType, String status) {
        this.vehicleId = vehicleId;
        this.plateNumber = plateNumber;
        this.seatCapacity = seatCapacity;
        this.vehicleType = vehicleType;
        this.status = status;
    }

    // --- GETTER & SETTER ---
    public int getVehicleId() { return vehicleId; }
    public void setVehicleId(int vehicleId) { this.vehicleId = vehicleId; }
    
    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }
    
    public int getSeatCapacity() { return seatCapacity; }
    public void setSeatCapacity(int seatCapacity) { this.seatCapacity = seatCapacity; }
    
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}