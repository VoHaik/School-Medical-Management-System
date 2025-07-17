package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "declared_vaccination_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeclaredVaccinationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "declared_record_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", referencedColumnName = "student_code", nullable = false) // Ensure referencedColumnName is correct
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declaration_id") // This will be the foreign key in declared_vaccination_records table
    private HealthDeclaration healthDeclaration;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vaccine_id", nullable = false)
    private Vaccine vaccine;

    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @Column(name = "dose_number")
    private Integer doseNumber;

    @Nationalized
    @Column(name = "provider_name", length = 255)
    private String providerName;

    @Nationalized
    @Column(name = "document_url", length = 512)
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING_VERIFICATION;

    public enum VerificationStatus {
        PENDING_VERIFICATION,
        VERIFIED,
        REJECTED,
        NEEDS_CLARIFICATION
    }

    @ManyToOne
    @JoinColumn(name = "verified_by_nurse_id")
    private User verifiedByNurse;

    @Column(name = "verification_date")
    private LocalDate verificationDate;

    @Nationalized
    @Column(name = "verification_notes", columnDefinition = "NVARCHAR(MAX)")
    private String verificationNotes;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)", name = "parent_notes")
    private String parentNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_user_id")
    private User submittedBy;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Removed user-related logic since students no longer have user accounts
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
