package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long id;

    @Column(nullable = false, name = "full_name", length = 100)
    private String fullName;

    @Column(nullable = false, name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "health_record_id")
    private HealthRecord healthRecord;

    @Column(length = 20)
    private String className;    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }    // Additional manual getters/setters for missing fields if Lombok fails
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    
    public User getParent() { return parent; }
    public void setParent(User parent) { this.parent = parent; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
