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
@Table(name = "medical_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalEvent {

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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer id;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "student_code")
    private Student student;

    @Nationalized
    @Column(name = "event_type", columnDefinition = "NVARCHAR(255)")
    private String eventType;

    @Nationalized
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "event_datetime")
    private LocalDateTime eventDatetime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_user_id", referencedColumnName = "user_id")
    private User recordedBy;    // New fields
    @ElementCollection
    @CollectionTable(name = "medical_event_symptoms", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "symptom")
    @Nationalized
    private List<String> symptoms;

    @Nationalized
    @Column(name = "severity", columnDefinition = "NVARCHAR(255)")
    private String severity; // Consider Enum: LOW, MEDIUM, HIGH, CRITICAL

    @Nationalized
    @Column(name = "action_taken", columnDefinition = "NVARCHAR(MAX)")
    private String actionTaken;

    @Nationalized
    @Column(name = "medication_given", columnDefinition = "NVARCHAR(255)")
    private String medicationGiven;
    
    @Column(name = "medication_quantity")
    private Integer medicationQuantity;

    @Nationalized
    @Column(name = "status", columnDefinition = "NVARCHAR(255)")
    private String status; // Consider Enum: ACTIVE, RESOLVED, FOLLOW_UP, REFERRED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private Set<MedicalSupply> medicalSupplies = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
