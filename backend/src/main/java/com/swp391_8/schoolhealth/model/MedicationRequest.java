package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_code", referencedColumnName = "parent_code", nullable = false)
    private Parent parent; // Parent who submitted the request

    @Column(name = "medication_name", nullable = false, length = 255)
    private String medicationName;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(nullable = false, length = 100)
    private String frequency; // e.g., "Twice a day", "Every 4 hours"

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Lob // For longer text
    @Column(name = "reason", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MedicationRequestStatus status;

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nurse_code", referencedColumnName = "nurse_code")
    private Nurse approvedBy; // Nurse who approved/rejected

    @Column(name = "action_date") // Date of approval/rejection/cancellation
    private LocalDateTime actionDate;

    @Lob
    @Column(name = "notes") // Notes from school nurse or admin
    private String notes;

    public enum MedicationRequestStatus {
        PENDING,    // Request submitted by parent, awaiting review
        APPROVED,   // Request approved by school nurse/admin
        REJECTED,   // Request rejected by school nurse/admin
        ADMINISTERED, // Medication has been administered (can be a final status or part of a log)
        CANCELLED   // Request cancelled by parent (only if PENDING)
    }

    @PrePersist
    protected void onCreate() {
        requestDate = LocalDateTime.now();
        if (status == null) {
            status = MedicationRequestStatus.PENDING;
        }
    }
}
