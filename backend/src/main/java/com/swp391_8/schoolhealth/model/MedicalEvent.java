package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "MedicalEvents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalEvent {
<<<<<<< Updated upstream
=======

    public enum EventType {
        INJURY,
        ILLNESS,
        ACCIDENT,
        EMERGENCY,
        MEDICATION, // Medication Related
        OUTBREAK,   // Disease Outbreak
        FALL,
        FEVER,
        ALLERGIC_REACTION,
        OTHER
    }

>>>>>>> Stashed changes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
<<<<<<< Updated upstream
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_type_id", nullable = false)
    private EventType eventType;

    @Nationalized
    @Lob
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
=======
    @JoinColumn(name = "student_id", referencedColumnName = "student_code")
    private Student student;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "description", columnDefinition = "TEXT")
>>>>>>> Stashed changes
    private String description;

    @Column(name = "event_datetime")
    private LocalDateTime eventDatetime;

    @ManyToOne(fetch = FetchType.LAZY)
<<<<<<< Updated upstream
    @JoinColumn(name = "handled_by_user_id")
    private User handledBy;
=======
    @JoinColumn(name = "recorded_by_user_id", referencedColumnName = "user_id")
    private User recordedBy;

    // New fields
    @ElementCollection
    @CollectionTable(name = "medical_event_symptoms", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "symptom")
    private List<String> symptoms;

    @Column(name = "severity")
    private String severity; // Consider Enum: LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;

    @Column(name = "medication_given")
    private String medicationGiven;

    @Column(name = "parent_notified")
    private Boolean parentNotified;

    @Column(name = "referred_to")
    private String referredTo; // e.g., Doctor's name, Hospital name

    @Column(name = "follow_up_required")
    private Boolean followUpRequired;

    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;

    @Column(name = "status")
    private String status; // Consider Enum: ACTIVE, RESOLVED, FOLLOW_UP, REFERRED
>>>>>>> Stashed changes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approval_status_id")
    private StatusType approvalStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<EventMedicalSupply> eventMedicalSupplies = new HashSet<>();

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
