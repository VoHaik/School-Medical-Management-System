package com.swp391_8.schoolhealth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Nationalized
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Nationalized
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Nationalized
    @Column(name = "user_code", nullable = false, unique = true, length = 50)
    private String userCode;

    @Nationalized
    @Column(name = "full_name", length = 100) // Added fullName field
    private String fullName;

    @Nationalized
    @Column(name = "email", length = 100)
    private String email;

    @Nationalized
    @Column(name = "phone_number", length = 20) // Added phoneNumber field
    private String phoneNumber;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Nationalized
    @Column(name = "google_id", length = 100)
    private String googleId;

    @Nationalized
    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }    // Additional getters/setters for compatibility
    public Integer getId() { return userId; }
    public void setId(Integer id) { this.userId = id; }
    
    // Explicit getters/setters to fix compilation issues
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; } // Added getter
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; } // Added setter
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getUserCode() { return userCode; }
    public void setUserCode(String userCode) { this.userCode = userCode; }

    public String getFullName() { return fullName; } // Added getter
    public void setFullName(String fullName) { this.fullName = fullName; } // Added setter
}
