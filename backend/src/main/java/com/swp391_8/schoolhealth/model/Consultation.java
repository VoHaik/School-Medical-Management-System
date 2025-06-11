package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "Consultation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_id", nullable = false)
    private Integer consultationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_user_id", nullable = false)
    private User consultant; // This is the user who performs the consultation

    @ManyToOne(fetch = FetchType.LAZY) // Added field
    @JoinColumn(name = "checkup_id")      // Added field - maps to the foreign key in DB
    private HealthCheckup healthCheckup;  // Added field

    @Column(name = "consultation_datetime", nullable = false)
    private LocalDateTime consultationDatetime;

    @Nationalized
    @Column(name = "location")
    private String location;

    @Nationalized
    @Lob
    @Column(name = "reason")
    private String reason;

    @Nationalized
    @Lob
    @Column(name = "diagnosis")
    private String diagnosis;

    @Nationalized
    @Lob
    @Column(name = "recommendations")
    private String recommendations;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private StatusType status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Explicit Getters and Setters (Lombok @Data should provide these, but adding explicitly for safety)
    public Integer getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Integer consultationId) {
        this.consultationId = consultationId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public User getConsultant() {
        return consultant;
    }

    public void setConsultant(User consultant) {
        this.consultant = consultant;
    }

    public HealthCheckup getHealthCheckup() {
        return healthCheckup;
    }

    public void setHealthCheckup(HealthCheckup healthCheckup) {
        this.healthCheckup = healthCheckup;
    }

    public LocalDateTime getConsultationDatetime() {
        return consultationDatetime;
    }

    public void setConsultationDatetime(LocalDateTime consultationDatetime) {
        this.consultationDatetime = consultationDatetime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public StatusType getStatus() {
        return status;
    }

    public void setStatus(StatusType status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}