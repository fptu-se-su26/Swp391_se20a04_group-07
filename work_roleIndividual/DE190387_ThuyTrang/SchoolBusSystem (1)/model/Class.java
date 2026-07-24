package model;

public class Class {
    private int classId;
    private String className;
    private int gradeLevel;
    private String academicYear;
    private String teacherName;
    private boolean status;

    public Class() {}

    public Class(int classId, String className, int gradeLevel, String academicYear, String teacherName, boolean status) {
        this.classId = classId;
        this.className = className;
        this.gradeLevel = gradeLevel;
        this.academicYear = academicYear;
        this.teacherName = teacherName;
        this.status = status;
    }

    // Getter và Setter cho tất cả các trường
    public int getClassId() { return classId; }
    public void setClassId(int classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public int getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(int gradeLevel) { this.gradeLevel = gradeLevel; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
}