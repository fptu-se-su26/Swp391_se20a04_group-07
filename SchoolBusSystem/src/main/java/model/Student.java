package model;

import java.sql.Date;

public class Student {

    private int studentId;
    private int parentId;
    private int classId; // Khóa ngoại liên kết với bảng classes
    private String fullName;
    private String gender;
    private Date dateOfBirth;
    private String schoolName;
    private String address;
    private String avatar;
    private boolean status;
    private String parentName;
    private String studentCode;
    private int userId;
    private String areaName;

    // Trường bổ trợ để hiển thị tên lớp trên giao diện Admin (Giữ nguyên không xóa)
    private String classNameDisplay;

    // --- TRƯỜNG BỔ SUNG ĐỂ SỬA LỖI CHO DASHBOARD PHỤ HUYNH ---
    private String className;

    // [ĐỒNG BỘ MỚI]: Hai thuộc tính lưu số điện thoại phụ huynh
    private String parentPhone;
    private String emergencyPhone;

    // 1. Constructor rỗng
    public Student() {
    }

    // 2. Constructor đầy đủ (Giữ nguyên cấu trúc ban đầu của hệ thống)
    public Student(int studentId, int parentId, int classId, String fullName, String gender,
            Date dateOfBirth, String schoolName, String address, String avatar, boolean status) {
        this.studentId = studentId;
        this.parentId = parentId;
        this.classId = classId;
        this.fullName = fullName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.schoolName = schoolName;
        this.address = address;
        this.avatar = avatar;
        this.status = status;
    }

    // --- HỆ THỐNG GETTER & SETTER CHUẨN ĐÃ ĐƯỢC ĐỒNG BỘ ---
    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public int getClassId() {
        return classId;
    }

    public void setClassId(int classId) {
        this.classId = classId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getClassNameDisplay() {
        return classNameDisplay;
    }

    public void setClassNameDisplay(String classNameDisplay) {
        this.classNameDisplay = classNameDisplay;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    // [FIX LỖI]: Getter & Setter chuẩn hóa cho thuộc tính parentPhone
    public String getParentPhone() {
        return parentPhone;
    }

    public void setParentPhone(String parentPhone) {
        this.parentPhone = parentPhone;
    }

    // [FIX LỖI]: Getter & Setter chuẩn hóa cho thuộc tính emergencyPhone
    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }
}
