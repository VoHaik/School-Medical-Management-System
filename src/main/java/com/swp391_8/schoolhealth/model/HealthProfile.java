package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "HealthProfiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Nationalized
    @Column(name = "allergies", columnDefinition = "NVARCHAR(MAX)")
    private String allergies;

    @Nationalized
    @Column(name = "chronic_conditions", columnDefinition = "NVARCHAR(MAX)")
    private String chronicConditions;

    @Nationalized
    @Column(name = "treatment_history", columnDefinition = "NVARCHAR(MAX)")
    private String treatmentHistory;

    @Nationalized
    @Column(name = "vision", length = 50)
    private String vision;

    @Nationalized
    @Column(name = "hearing", length = 50)
    private String hearing;

    @Nationalized
    @Column(name = "vaccination_history_notes", columnDefinition = "NVARCHAR(MAX)")
    private String vaccinationHistoryNotes;

    @ManyToOne
    @JoinColumn(name = "updated_by_user_id")
    private User updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}