package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Vaccinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_record_id") // Added join column for HealthRecord
    private HealthRecord healthRecord; // Added HealthRecord field

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Nationalized
    @Column(name = "vaccine_name", nullable = false, length = 100)
    private String vaccineName;

    @Column(name = "vaccination_date")
    private LocalDate vaccinationDate;

<<<<<<< Updated upstream
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_status_id", nullable = false)
    private StatusType consentStatus;
=======
    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status")
    private ConsentStatus consentStatus = ConsentStatus.Pending;
>>>>>>> Stashed changes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_by_user_id")
    private User consentBy;

    @Column(name = "consent_date")
    private LocalDate consentDate;

    @Nationalized
    @Lob
    @Column(name = "result", columnDefinition = "NVARCHAR(MAX)")
    private String result;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_user_id")
    private User administeredBy;

    @Column(name = "notification_sent_to_parent")
    private Boolean notificationSentToParent = false;

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
}
