package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "vaccination_consents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"healthEvent", "student"})
public class VaccinationConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consent_id")
    private Integer consentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", referencedColumnName = "event_id", nullable = false)
    @JsonIgnore
    private HealthEvent healthEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    @JsonIgnore
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status", nullable = false)
    private ConsentStatus consentStatus = ConsentStatus.PENDING;

    public enum ConsentStatus {
        PENDING, APPROVED, REJECTED
    }

    @Nationalized
    @Column(name = "parent_notes", columnDefinition = "NVARCHAR(MAX)")
    private String parentNotes;

    @Column(name = "consent_date")
    private LocalDateTime consentDate;

    @Column(name = "sent_date", nullable = false)
    private LocalDateTime sentDate;

    @Column(name = "reminder_count")
    private Integer reminderCount = 0;

    @Column(name = "last_reminder_date")
    private LocalDateTime lastReminderDate;

    @PrePersist
    protected void onCreate() {
        sentDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        if (consentStatus != ConsentStatus.PENDING && consentDate == null) {
            consentDate = LocalDateTime.now();
        }
    }
}
