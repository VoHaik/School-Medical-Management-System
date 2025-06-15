package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized; // Added import

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    private Student student;

    // Changed from Parent to User for User-centric model
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_user_id", referencedColumnName = "user_id", nullable = false)
    private User requestedBy; // User (Parent) who submitted the request

    @Nationalized // Added annotation
    @Column(name = "medication_name", nullable = false, length = 255)
    private String medicationName;

    @Nationalized // Added annotation
    @Column(nullable = false, length = 100)
    private String dosage;

    @Nationalized // Added annotation
    @Column(nullable = false, length = 100)
    private String frequency; // e.g., "Twice a day", "Every 4 hours"

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Lob // For longer text
    @Nationalized // Added annotation
    @Column(name = "reason", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MedicationRequestStatus status;

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_nurse_id", referencedColumnName = "user_id") // Assuming Nurse has a User mapping
    private User approvedBy; // User (Nurse) who approved/rejected

    @Column(name = "action_date") // Date of approval/rejection/cancellation by nurse
    private LocalDateTime actionDate;

    @Column(name = "approval_date") // Specific date of approval by nurse
    private LocalDateTime approvalDate;

    @Lob
    @Nationalized // Added annotation
    @Column(name = "notes") // General notes from school nurse or admin
    private String notes;

    // New fields for administration logging
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_nurse_id", referencedColumnName = "user_id") // Assuming Nurse has a User mapping
    private User administeredBy; // User (Nurse) who administered the medication

    @Column(name = "administered_at")
    private LocalDateTime administeredAt;

    @Lob
    @Nationalized // Added annotation
    @Column(name = "administration_notes") // Specific notes related to medication administration
    private String administrationNotes;


    public enum MedicationRequestStatus {
        PENDING,    // Request submitted by parent, awaiting review
        APPROVED,   // Request approved by school nurse/admin
        REJECTED,   // Request rejected by school nurse/admin
        ADMINISTERED, // Medication has been administered
        CANCELLED_BY_PARENT,   // Request cancelled by parent (only if PENDING or APPROVED)
        NEEDS_REFILL // Added: Medication needs refill
        // Consider adding CANCELLED_BY_SCHOOL if needed
    }

    @PrePersist
    protected void onCreate() {
        requestDate = LocalDateTime.now();
        if (status == null) {
            status = MedicationRequestStatus.PENDING;
        }
    }
}
