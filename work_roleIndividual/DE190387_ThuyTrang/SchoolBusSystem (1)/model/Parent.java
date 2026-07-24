package model;

public class Parent {
    private int parentId;
    private int userId;
    private String address;
    private String emergencyPhone;
    
    private int areaId;
    private String areaNameDisplay; 
    
    // [BỔ SUNG] Biến chứa danh sách tên học sinh (con của phụ huynh)
    private String childrenNames;

    public Parent() {}

    public Parent(int parentId, int userId, String address, String emergencyPhone) {
        this.parentId = parentId;
        this.userId = userId;
        this.address = address;
        this.emergencyPhone = emergencyPhone;
    }

    public int getParentId() { return parentId; }
    public void setParentId(int parentId) { this.parentId = parentId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }

    public int getAreaId() { return areaId; }
    public void setAreaId(int areaId) { this.areaId = areaId; }
    public String getAreaNameDisplay() { return areaNameDisplay; }
    public void setAreaNameDisplay(String areaNameDisplay) { this.areaNameDisplay = areaNameDisplay; }

    // [BỔ SUNG] Getter và Setter
    public String getChildrenNames() { return childrenNames; }
    public void setChildrenNames(String childrenNames) { this.childrenNames = childrenNames; }
}