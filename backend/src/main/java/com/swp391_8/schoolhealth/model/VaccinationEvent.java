package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "event_name", nullable = false, length = 255) // e.g., "Annual Flu Shot Drive 2025"
    private String eventName;

    @Column(name = "scheduled_date_start", nullable = false)
    private LocalDate scheduledDateStart;

    @Column(name = "scheduled_date_end")
    private LocalDate scheduledDateEnd; // For multi-day events

    @Column(columnDefinition = "TEXT")
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

    @Column(name = "location", length = 255) // e.g., "School Gymnasium"
    private String location;

    // Students participating in this event - could be through StudentVaccination records linking here
    // Or a direct list if needed before individual records are created.
    // For simplicity, StudentVaccination linking to this event is preferred.
    // @ManyToMany
    // @JoinTable(
    // name = "vaccination_event_participants", // Renamed table
    // joinColumns = @JoinColumn(name = "vaccination_event_id"),
    // inverseJoinColumns = @JoinColumn(name = "student_id")
    // )
    // private Set<Student> participants = new HashSet<>();
    @OneToMany(mappedBy = "vaccinationEvent")
    private Set<StudentVaccination> studentVaccinations;


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