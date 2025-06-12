package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checkups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkup_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    private Student student;

    @Column(name = "checkup_date", nullable = false)
    private LocalDate checkupDate;

    @Nationalized
    @Column(name = "checkup_type", length = 100)
    private String checkupType;

    @Nationalized
    @Column(name = "vision_left", length = 20)
    private String visionLeft;

    @Nationalized
    @Column(name = "vision_right", length = 20)
    private String visionRight;

    @Nationalized
    @Column(name = "hearing_left", length = 50)
    private String hearingLeft;

    @Nationalized
    @Column(name = "hearing_right", length = 50)
    private String hearingRight;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "height_cm") // Clarified unit
    private Double height;

    @Column(name = "weight_kg") // Clarified unit
    private Double weight;

    @Column(name = "bmi")
    private Double bmi;

    @Nationalized
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Nationalized
    @Column(name = "status", length = 50)
    private String status;

    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status")
    private ConsentStatus consentStatus = ConsentStatus.Pending;

    public enum ConsentStatus {
        Pending, Approved, Rejected, NotRequired
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_by_user_id", referencedColumnName = "user_id")
    private User consentBy;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conducted_by_user_id", referencedColumnName = "user_id")
    private User conductedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateBmi(); // Calculate BMI on creation if height and weight are set
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateBmi(); // Recalculate BMI on update if height or weight might have changed
    }

    // Method to calculate BMI - called by lifecycle callbacks
    public void calculateBmi() {
        if (this.height != null && this.height > 0 && this.weight != null && this.weight > 0) {
            double heightInMeters = this.height / 100.0;
            this.bmi = Math.round((this.weight / (heightInMeters * heightInMeters)) * 10.0) / 10.0;
        } else {
            this.bmi = null;
        }
    }

    // Lombok's @Data should generate all necessary getters and setters.
    // Explicitly defining them can sometimes conflict or be redundant.
    // If specific logic is needed in a getter/setter, then define it explicitly.
}
