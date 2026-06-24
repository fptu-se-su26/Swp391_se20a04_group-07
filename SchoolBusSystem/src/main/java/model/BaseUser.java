package model;

import java.time.LocalDateTime;

/**
 * Lớp cơ sở cho tất cả User (tránh lặp code)
 */
public abstract class BaseUser {
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private String role;       // 'admin' | 'manager' | 'driver' | 'parent' | 'student'
    private boolean isActive;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    // Getters & Setters
    public String getUsername()  { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail()     { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName()  { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone()     { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatar()    { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getRole()      { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive()    { return isActive; }
    public void setActive(boolean active) { this.isActive = active; }

    public LocalDateTime getLastLogin()  { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public LocalDateTime getCreatedAt()  { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

// =============================================
// 5 MODEL USER RIÊNG BIỆT
// =============================================

class UserAdmin extends BaseUser {
    private int adminId;
    public int getAdminId()          { return adminId; }
    public void setAdminId(int id)   { this.adminId = id; }
}

class UserManager extends BaseUser {
    private int    managerId;
    private String department;
    public int getManagerId()              { return managerId; }
    public void setManagerId(int id)       { this.managerId = id; }
    public String getDepartment()          { return department; }
    public void setDepartment(String dep)  { this.department = dep; }
}

class UserDriver extends BaseUser {
    private int    driverId;
    private String licenseNumber;
    private int    experienceYears;
    private int    birthYear;
    private int    areaId;
    private int    vehicleId;

    public int    getDriverId()                    { return driverId; }
    public void   setDriverId(int id)              { this.driverId = id; }
    public String getLicenseNumber()               { return licenseNumber; }
    public void   setLicenseNumber(String ln)      { this.licenseNumber = ln; }
    public int    getExperienceYears()             { return experienceYears; }
    public void   setExperienceYears(int years)    { this.experienceYears = years; }
    public int    getBirthYear()                   { return birthYear; }
    public void   setBirthYear(int year)           { this.birthYear = year; }
    public int    getAreaId()                      { return areaId; }
    public void   setAreaId(int id)                { this.areaId = id; }
    public int    getVehicleId()                   { return vehicleId; }
    public void   setVehicleId(int id)             { this.vehicleId = id; }
}

class UserParent extends BaseUser {
    private int    parentId;
    private String emergencyPhone;
    private String address;
    private int    areaId;

    public int    getParentId()                      { return parentId; }
    public void   setParentId(int id)                { this.parentId = id; }
    public String getEmergencyPhone()                { return emergencyPhone; }
    public void   setEmergencyPhone(String phone)    { this.emergencyPhone = phone; }
    public String getAddress()                       { return address; }
    public void   setAddress(String address)         { this.address = address; }
    public int    getAreaId()                        { return areaId; }
    public void   setAreaId(int id)                  { this.areaId = id; }
}

class UserStudent extends BaseUser {
    private int    studentId;
    private String gender;
    private String studentCode;
    private String schoolName;
    private int    classId;
    private int    parentId;
    private String address;

    public int    getStudentId()                  { return studentId; }
    public void   setStudentId(int id)            { this.studentId = id; }
    public String getGender()                     { return gender; }
    public void   setGender(String gender)        { this.gender = gender; }
    public String getStudentCode()                { return studentCode; }
    public void   setStudentCode(String code)     { this.studentCode = code; }
    public String getSchoolName()                 { return schoolName; }
    public void   setSchoolName(String name)      { this.schoolName = name; }
    public int    getClassId()                    { return classId; }
    public void   setClassId(int id)              { this.classId = id; }
    public int    getParentId()                   { return parentId; }
    public void   setParentId(int id)             { this.parentId = id; }
    public String getAddress()                    { return address; }
    public void   setAddress(String addr)         { this.address = addr; }
}
