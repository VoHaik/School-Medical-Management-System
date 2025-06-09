package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "Vaccinations")
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_id")
    private Integer vaccinationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "vaccine_name", nullable = false, length = 100)
    private String vaccineName;

    @Column(name = "vaccination_date")
    private LocalDate vaccinationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_status_id", nullable = false)
    private StatusType consentStatus; // Links to StatusTypes table

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_by_user_id")
    private User consentByUser;

    @Column(name = "consent_date")
    private LocalDate consentDate;

    @Column(name = "result", columnDefinition = "NVARCHAR(MAX)")
    private String result;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_user_id")
    private User administeredByUser;

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
        if (notificationSentToParent == null) {
            notificationSentToParent = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
