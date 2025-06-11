package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized; // Added for @Nationalized

import java.time.LocalDateTime;

@Entity
@Table(name = "MedicationRequests") // Corrected table name
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Nationalized // Added
    @Column(name = "medication_name", nullable = false, length = 100) // Corrected length
    private String medicationName;

    @Nationalized // Added
    @Lob // Changed to Lob for NVARCHAR(MAX)
    @Column(name = "dosage") // Removed nullable = false as SQL allows NULL
    private String dosage;

    @Nationalized // Added
    @Lob // Added for NVARCHAR(MAX)
    @Column(name = "instructions") // Added field
    private String instructions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_user_id", nullable = false) // Corrected mapping
    private User submittedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false) // Corrected mapping to StatusType
    private StatusType status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_user_id") // Added field
    private User administeredBy;

    @Column(name = "administered_at") // Added field
    private LocalDateTime administeredAt;

    @Nationalized // Added
    @Lob
    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false) // Corrected mapping and added updatable = false
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false) // Added field
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now(); // Initialize updatedAt on creation
    }

    @PreUpdate
    protected void onUpdate() { // Added @PreUpdate
        updatedAt = LocalDateTime.now();
    }
}
