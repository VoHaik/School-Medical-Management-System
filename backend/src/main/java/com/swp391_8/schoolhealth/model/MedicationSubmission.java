package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "medication_submission")
public class MedicationSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Integer submissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", nullable = false, referencedColumnName = "student_code")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_code", nullable = false, referencedColumnName = "parent_code") // Updated to use parent entity
    private Parent parent; // Parent who submitted the form

    @Column(name = "medication_name", nullable = false, length = 255)
    private String medicationName;

    @Column(name = "dosage", length = 100)
    private String dosage;

    @Column(name = "schedule", length = 255)
    private String schedule;

    @Lob
    @Column(name = "reason")
    private String reason;

    @Column(name = "doctor_note_path") // Store path to the file, or URL if stored externally
    private String doctorNotePath;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submission_date", nullable = false, updatable = false)
    private Date submissionDate;

    @Column(name = "status", length = 50) // e.g., PENDING_APPROVAL, APPROVED, REJECTED
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id") // User who approved/rejected (e.g., Nurse)
    private User approvedBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "action_date")
    private Date actionDate; // Date of approval/rejection

    @Lob
    @Column(name = "nurse_notes")
    private String nurseNotes; // Notes from the nurse regarding the submission

    @Column(name = "frequency")
    private String frequency;

    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date")
    private Date endDate;

    // Constructors, getters, and setters are handled by Lombok
}
