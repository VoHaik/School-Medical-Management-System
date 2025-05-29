package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "medication_name", nullable = false, length = 100)
    private String medicationName;

    @Column(length = 50)
    private String dosage;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "submitted_by")
    private User submittedBy;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('Pending', 'Approved', 'Administered', 'Rejected') DEFAULT 'Pending'")
    private MedicationStatus status = MedicationStatus.Pending;

    public enum MedicationStatus {
        Pending, Approved, Administered, Rejected
    }

    @ManyToOne
    @JoinColumn(name = "administered_by")
    private User administeredBy;

    @Column(name = "administered_at")
    private LocalDateTime administeredAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
