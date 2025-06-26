package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vaccination_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationEvent { 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_event_id") // Added explicit column name
    private Integer id;

    @ManyToOne(optional = false) // Link to Vaccine entity
    @JoinColumn(name = "vaccine_id", nullable = false)
    private Vaccine vaccine;

    // Removed: vaccineName - now comes from Vaccine entity
    // @Column(nullable = false)
    // private String vaccineName;

    @Nationalized
    @Column(name = "event_name", nullable = false, length = 255) // e.g., "Annual Flu Shot Drive 2025"
    private String eventName;

    @Column(name = "scheduled_date_start", nullable = false)
    private LocalDate scheduledDateStart;

    @Column(name = "scheduled_date_end")
    private LocalDate scheduledDateEnd; // For multi-day events

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.PLANNED; // PLANNED, OPEN_FOR_REGISTRATION, IN_PROGRESS, COMPLETED, CANCELLED

    public enum EventStatus {
        PLANNED,
        OPEN_FOR_REGISTRATION,
        REGISTRATION_CLOSED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    @Nationalized
    @Column(name = "location", length = 255) // e.g., "School Gymnasium"
    private String location;

    // Many-to-Many relationship with GradeLevel - which grades this event targets
    @ManyToMany
    @JoinTable(
        name = "vaccination_event_grade_levels",
        joinColumns = @JoinColumn(name = "vaccination_event_id"),
        inverseJoinColumns = @JoinColumn(name = "grade_id")
    )
    private Set<GradeLevel> targetGrades = new HashSet<>();

    @OneToMany(mappedBy = "vaccinationEvent")
    private Set<StudentVaccination> studentVaccinations = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "coordinator_id") // Nurse or staff coordinating the event
    private User coordinator;

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