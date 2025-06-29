package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_health_checkups") // Renamed table
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"healthEvent", "student"})
public class StudentHealthCheckup { // Renamed class
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkup_result_id") // Renamed ID column for clarity
    private Integer checkupResultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", referencedColumnName = "event_id") // Link to HealthEvent
    @JsonIgnore
    private HealthEvent healthEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    private Student student;

    @Column(name = "checkup_date", nullable = false) // Date this specific checkup was performed
    private LocalDate checkupDate;

    // Specific checkup types and their results
    // These can be expanded or moved to a separate related entity if they become too numerous or complex

    @Nationalized
    @Column(name = "vision_left", length = 50) // Increased length
    private String visionLeft;

    @Nationalized
    @Column(name = "vision_right", length = 50) // Increased length
    private String visionRight;
    
    @Nationalized
    @Column(name = "vision_notes", columnDefinition = "NVARCHAR(MAX)")
    private String visionNotes;

    @Nationalized
    @Column(name = "hearing_left", length = 100) // Increased length
    private String hearingLeft;

    @Nationalized
    @Column(name = "hearing_right", length = 100) // Increased length
    private String hearingRight;

    @Nationalized
    @Column(name = "hearing_notes", columnDefinition = "NVARCHAR(MAX)")
    private String hearingNotes;

    @Nationalized
    @Column(name = "dental_oral_health_status", length = 255)
    private String dentalOralHealthStatus; // e.g., Good, Fair, Needs Attention

    @Nationalized
    @Column(name = "dental_notes", columnDefinition = "NVARCHAR(MAX)")
    private String dentalNotes;
    
    @Nationalized
    @Column(name = "scoliosis_screening_result", length = 100)
    private String scoliosisScreeningResult; // e.g., Negative, Positive, Further Evaluation Needed

    @Nationalized
    @Column(name = "scoliosis_notes", columnDefinition = "NVARCHAR(MAX)")
    private String scoliosisNotes;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "temperature_celsius") // Clarified unit
    private Double temperatureCelsius;

    @Column(name = "height_cm", nullable = false)
    private Double heightCm;

    @Column(name = "weight_kg", nullable = false)
    private Double weightKg;

    @Column(name = "bmi")
    private Double bmi;
    
    @Nationalized
    @Column(name = "bmi_category", length = 50) // e.g., Underweight, Normal, Overweight
    private String bmiCategory;

    @Nationalized
    @Column(name = "general_observations", columnDefinition = "NVARCHAR(MAX)")
    private String generalObservations; // Overall notes from the nurse

    @Nationalized
    @Column(name = "recommendations", columnDefinition = "NVARCHAR(MAX)")
    private String recommendations;

    @Enumerated(EnumType.STRING)
    @Column(name = "parent_consent_status", length = 50) // Moved from HealthCheckupEvent, specific to this student for this event
    private ConsentStatus parentConsentStatus = ConsentStatus.PENDING;

    public enum ConsentStatus {
        PENDING, // Waiting for parent response
        CONSENTED, // Parent agreed
        REJECTED, // Parent declined
        NOT_REQUIRED // For checkups not needing explicit consent or if blanket consent exists
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_by_parent_id", referencedColumnName = "user_id") // Link to User entity, changed from parent_code
    private User consentByParent; // Changed from Parent to User
    
    @Column(name = "consent_date")
    private LocalDate consentDate;

    @Nationalized
    @Column(name = "parent_communication_notes", columnDefinition = "NVARCHAR(MAX)")
    private String parentCommunicationNotes; // Notes about communication with parent regarding results

    @Column(name = "follow_up_needed")
    private Boolean followUpNeeded = false;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;
    
    @Nationalized
    @Column(name = "follow_up_notes", columnDefinition = "NVARCHAR(MAX)")
    private String followUpNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conducted_by_user_id", referencedColumnName = "user_id", nullable = false)
    private User conductedByUser; // Renamed from conductedBy

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateAndCategorizeBmi();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateAndCategorizeBmi();
    }

    public void calculateAndCategorizeBmi() {
        if (this.heightCm != null && this.heightCm > 0 && this.weightKg != null && this.weightKg > 0) {
            double heightInMeters = this.heightCm / 100.0;
            this.bmi = Math.round((this.weightKg / (heightInMeters * heightInMeters)) * 10.0) / 10.0;
            // Basic BMI categorization (example, can be more detailed based on age/gender specific charts)
            if (this.bmi < 18.5) {
                this.bmiCategory = "Underweight";
            } else if (this.bmi < 24.9) {
                this.bmiCategory = "Normal weight";
            } else if (this.bmi < 29.9) {
                this.bmiCategory = "Overweight";
            } else {
                this.bmiCategory = "Obesity";
            }
        } else {
            this.bmi = null;
            this.bmiCategory = null;
        }
    }
}
