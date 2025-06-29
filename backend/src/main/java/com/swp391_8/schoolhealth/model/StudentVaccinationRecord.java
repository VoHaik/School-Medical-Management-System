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
@Table(name = "student_vaccination_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"healthEvent", "student"})
public class StudentVaccinationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_record_id")
    private Integer vaccinationRecordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", referencedColumnName = "event_id", nullable = false)
    @JsonIgnore
    private HealthEvent healthEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    @JsonIgnore
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(name = "vaccination_status", nullable = false)
    private VaccinationStatus vaccinationStatus = VaccinationStatus.SCHEDULED;

    public enum VaccinationStatus {
        SCHEDULED, COMPLETED, MISSED, CONTRAINDICATED, POSTPONED, CONSENT_DECLINED
    }

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "vaccination_date")
    private LocalDate vaccinationDate;

    @Nationalized
    @Column(name = "vaccine_name", length = 100)
    private String vaccineName;

    @Nationalized
    @Column(name = "vaccine_batch", length = 50)
    private String vaccineBatch;

    @Nationalized
    @Column(name = "vaccine_manufacturer", length = 100)
    private String vaccineManufacturer;

    @Nationalized
    @Column(name = "administered_by", length = 100)
    private String administeredBy; // Nurse or doctor name

    @Nationalized
    @Column(name = "administration_site", length = 50)
    private String administrationSite; // Left arm, right arm, etc.

    @Nationalized
    @Column(name = "adverse_reactions", columnDefinition = "NVARCHAR(MAX)")
    private String adverseReactions;

    @Nationalized
    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(name = "consent_received_date")
    private LocalDateTime consentReceivedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (scheduledDate == null && healthEvent != null) {
            scheduledDate = healthEvent.getScheduledDate();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (vaccinationStatus == VaccinationStatus.COMPLETED && vaccinationDate == null) {
            vaccinationDate = LocalDate.now();
        }
    }
}
