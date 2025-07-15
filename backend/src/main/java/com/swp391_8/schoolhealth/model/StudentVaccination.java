package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_vaccinations") // Renamed from "vaccinations"
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentVaccination { // Renamed from Vaccination
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_vaccination_id") // Renamed from "vaccination_id"
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vaccine_id", nullable = false) // New: Link to Vaccine entity
    private Vaccine vaccine;

    // Removed: healthRecord - can be linked via Student if necessary, or keep if direct link is vital
    // @ManyToOne
    // @JoinColumn(name = "health_record_id")
    // private HealthRecord healthRecord;

    // Removed: vaccineName - now comes from Vaccine entity
    // @Column(name = "vaccine_name", nullable = false, length = 100)
    // private String vaccineName;

    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @Column(name = "dose_number")
    private Integer doseNumber; // e.g., 1, 2, or null if not applicable. Could be part of Vaccine info too.

    @Nationalized
    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Nationalized
    @Column(name = "administering_location", length = 255) // e.g., "School Clinic", "City Hospital"
    private String administeringLocation;

    @ManyToOne
    @JoinColumn(name = "administered_by_nurse_id") // Nurse who administered or recorded it
    private User administeredByNurse;

    @Enumerated(EnumType.STRING)
    @Column(name = "consent_status", nullable = false)
    private ConsentStatus consentStatus = ConsentStatus.PENDING_VERIFICATION; // Changed default and added more statuses

    public enum ConsentStatus {
        PENDING_SUBMISSION,     // Parent needs to submit consent form
        PENDING_VERIFICATION,   // Nurse needs to verify submitted consent
        PENDING,                // Database compatibility - general pending status
        APPROVED,               // Database compatibility - consent approved
        REJECTED,               // Database compatibility - consent rejected
        CONSENT_GIVEN,
        CONSENT_DENIED,         // Explicitly denied by parent
        CONSENT_REFUSED,        // Renamed from DENIED for clarity or specific workflow step
        CONSENT_WITHDRAWN,      // Parent withdrew a previously given consent
        NOT_REQUIRED,           // e.g. for historical records or certain types of vaccines
        EXPIRED,                 // Consent was given but the validity period expired
        ADMINISTERED, // Added: Vaccination has been administered (can be a status)
        VERIFIED_BY_NURSE    // Added: Consent/record verified by nurse, pending administration or just for records
    }

    @ManyToOne
    @JoinColumn(name = "consent_given_by_parent_id") // Parent who gave consent
    private User consentGivenByParent;

    @Column(name = "consent_date")
    private LocalDate consentDate;

    @Nationalized
    @Column(name = "consent_document_url", length = 512) // Link to scanned consent form
    private String consentDocumentUrl;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)", name = "administration_notes")
    private String administrationNotes; // Notes by nurse during administration

    @Nationalized
    @Column(name = "parent_notes", columnDefinition = "NVARCHAR(MAX)")
    private String parentNotes; // Notes from parent when submitting consent/request

    // Removed: result - typically not a "result" for vaccination, more like completion.
    // Adverse reactions could be a separate linked entity if detailed tracking is needed.

    @Column(name = "next_due_date") // For next dose in a series
    private LocalDate nextDueDate;

    @ManyToOne
    @JoinColumn(name = "health_event_id") // If this vaccination was part of a school health event
    private HealthEvent healthEvent;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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
