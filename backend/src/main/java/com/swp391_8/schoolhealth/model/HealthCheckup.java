package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "HealthCheckups")
public class HealthCheckup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkup_id")
    private Integer checkupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "checkup_date")
    private LocalDate checkupDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkup_type_id", nullable = false)
    private CheckupType checkupType; // Links to CheckupTypes table

    @Column(name = "result", columnDefinition = "NVARCHAR(MAX)")
    private String result;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_status_id", nullable = false)
    private StatusType consentStatus; // Links to StatusTypes table

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_by_user_id")
    private User consentByUser;

    @Column(name = "consent_date")
    private LocalDate consentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_user_id")
    private User performedByUser;

    @Column(name = "follow_up_consultation_id") // Added this column as per SQL
    private Integer followUpConsultationId;

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
