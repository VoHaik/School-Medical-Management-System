package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checkup")
public class HealthCheckup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkup_id")
    private Long checkupId;

    @Column(name = "student_id", nullable = false, length = 50)
    private String studentId;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "checkup_date", nullable = false)
    private LocalDate checkupDate;

    @Column(name = "conducted_by", length = 100)
    private String conductedBy;

    @Column(name = "height", precision = 5, scale = 2)
    private BigDecimal height;
    @Column(name = "weight", precision = 5, scale = 2)
    private BigDecimal weight;
    @Column(name = "bmi", precision = 4, scale = 2)
    private BigDecimal bmi;
    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;
    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;
    @Column(name = "heart_rate")
    private Integer heartRate;
    @Column(name = "temperature", precision = 4, scale = 2)
    private BigDecimal temperature;

    @Column(name = "vision_left", length = 20)
    private String visionLeft;
    @Column(name = "vision_right", length = 20)
    private String visionRight;
    @Column(name = "hearing_left", length = 20)
    private String hearingLeft;
    @Column(name = "hearing_right", length = 20)
    private String hearingRight;

    @Column(name = "general_health_status", length = 50)
    private String generalHealthStatus = "Normal";
    @Column(name = "health_notes", columnDefinition = "TEXT")
    private String healthNotes;
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "requires_follow_up")
    private Boolean requiresFollowUp = false;
    @Column(name = "follow_up_date")
    private LocalDate followUpDate;
    @Column(name = "follow_up_notes", columnDefinition = "TEXT")
    private String followUpNotes;

    @Column(name = "status", length = 20)
    private String status = "Completed";
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "created_by", length = 50)
    private String createdBy;
    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getCheckupId() { return checkupId; }
    public void setCheckupId(Long checkupId) { this.checkupId = checkupId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public LocalDate getCheckupDate() { return checkupDate; }
    public void setCheckupDate(LocalDate checkupDate) { this.checkupDate = checkupDate; }

    public String getConductedBy() { return conductedBy; }
    public void setConductedBy(String conductedBy) { this.conductedBy = conductedBy; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public BigDecimal getBmi() { return bmi; }
    public void setBmi(BigDecimal bmi) { this.bmi = bmi; }

    public Integer getBloodPressureSystolic() { return bloodPressureSystolic; }
    public void setBloodPressureSystolic(Integer bloodPressureSystolic) { this.bloodPressureSystolic = bloodPressureSystolic; }

    public Integer getBloodPressureDiastolic() { return bloodPressureDiastolic; }
    public void setBloodPressureDiastolic(Integer bloodPressureDiastolic) { this.bloodPressureDiastolic = bloodPressureDiastolic; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public BigDecimal getTemperature() { return temperature; }
    public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }

    public String getVisionLeft() { return visionLeft; }
    public void setVisionLeft(String visionLeft) { this.visionLeft = visionLeft; }

    public String getVisionRight() { return visionRight; }
    public void setVisionRight(String visionRight) { this.visionRight = visionRight; }

    public String getHearingLeft() { return hearingLeft; }
    public void setHearingLeft(String hearingLeft) { this.hearingLeft = hearingLeft; }

    public String getHearingRight() { return hearingRight; }
    public void setHearingRight(String hearingRight) { this.hearingRight = hearingRight; }

    public String getGeneralHealthStatus() { return generalHealthStatus; }
    public void setGeneralHealthStatus(String generalHealthStatus) { this.generalHealthStatus = generalHealthStatus; }

    public String getHealthNotes() { return healthNotes; }
    public void setHealthNotes(String healthNotes) { this.healthNotes = healthNotes; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public Boolean getRequiresFollowUp() { return requiresFollowUp; }
    public void setRequiresFollowUp(Boolean requiresFollowUp) { this.requiresFollowUp = requiresFollowUp; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }

    public String getFollowUpNotes() { return followUpNotes; }
    public void setFollowUpNotes(String followUpNotes) { this.followUpNotes = followUpNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
