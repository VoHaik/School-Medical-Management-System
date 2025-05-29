package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "checkup_date", nullable = false)
    private LocalDate checkupDate;

    @Column(name = "checkup_type", length = 100)
    private String checkupType;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status", columnDefinition = "ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'")
    private ConsentStatus consentStatus = ConsentStatus.Pending;

    public enum ConsentStatus {
        Pending, Approved, Rejected
    }

    @ManyToOne
    @JoinColumn(name = "consent_by")
    private User consentBy;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @ManyToOne
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
