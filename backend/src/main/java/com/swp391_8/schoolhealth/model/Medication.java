package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "student_code", nullable = false)
    private Student student;

    @Nationalized
    @Column(name = "medication_name", nullable = false, length = 100)
    private String medicationName;

    @Nationalized
    @Column(name = "dosage", columnDefinition = "NVARCHAR(MAX)")
    private String dosage;

    @Nationalized
    @Column(name = "instructions", columnDefinition = "NVARCHAR(MAX)")
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "submitted_by_user_id", nullable = false)
    private User submittedBy;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private StatusType status;

    @ManyToOne
    @JoinColumn(name = "administered_by_user_id")
    private User administeredBy;

    @Column(name = "administered_at")
    private LocalDateTime administeredAt;

    @Nationalized
    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
