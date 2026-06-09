package model;
import java.sql.Timestamp;

public class User {
    private int userId;
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String avatar;
    private int roleId;
    private boolean status;
    private Timestamp createdAt;

    public User() {}

    public User(int userId, String fullName, String email, String password, String phone, String avatar, int roleId, boolean status, Timestamp createdAt) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.avatar = avatar;
        this.roleId = roleId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }
    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}