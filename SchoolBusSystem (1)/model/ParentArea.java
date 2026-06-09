package model;

public class ParentArea {
    private int areaId;
    private String areaName;
    private String description;

    public ParentArea() {}

    public ParentArea(int areaId, String areaName, String description) {
        this.areaId = areaId;
        this.areaName = areaName;
        this.description = description;
    }

    public int getAreaId() { return areaId; }
    public void setAreaId(int areaId) { this.areaId = areaId; }
    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}