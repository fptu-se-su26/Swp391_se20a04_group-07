package model;

public class Driver {
    private int driverId;
    private int userId;
    private String licenseNumber;
    private int experienceYears;
    
    private String fullName;
    private int birthYear;
    private int areaId;             
    private String areaNameDisplay; 
    
    // --- ĐÃ SỬA THÀNH ID XE THAY VÌ BIỂN SỐ ---
    private int vehicleId;              
    private String vehiclePlateDisplay; 

    public Driver() {}

    public Driver(int driverId, int userId, String licenseNumber, int experienceYears, 
                  String fullName, int birthYear, int areaId, int vehicleId) {
        this.driverId = driverId;
        this.userId = userId;
        this.licenseNumber = licenseNumber;
        this.experienceYears = experienceYears;
        this.fullName = fullName;
        this.birthYear = birthYear;
        this.areaId = areaId;
        this.vehicleId = vehicleId; // Gắn ID xe
    }

    // --- GETTER & SETTER ---
    public int getDriverId() { return driverId; }
    public void setDriverId(int driverId) { this.driverId = driverId; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public int getBirthYear() { return birthYear; }
    public void setBirthYear(int birthYear) { this.birthYear = birthYear; }
    
    public int getAreaId() { return areaId; }
    public void setAreaId(int areaId) { this.areaId = areaId; }
    
    public String getAreaNameDisplay() { return areaNameDisplay; }
    public void setAreaNameDisplay(String areaNameDisplay) { this.areaNameDisplay = areaNameDisplay; }
    
    // Getter & Setter mới cho Vehicle
    public int getVehicleId() { return vehicleId; }
    public void setVehicleId(int vehicleId) { this.vehicleId = vehicleId; }
    
    public String getVehiclePlateDisplay() { return vehiclePlateDisplay; }
    public void setVehiclePlateDisplay(String vehiclePlateDisplay) { this.vehiclePlateDisplay = vehiclePlateDisplay; }
}