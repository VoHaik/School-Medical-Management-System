package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "health_checkup_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckupEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Nationalized
    @Column(name = "event_name", nullable = false, length = 255)
    private String eventName;

    @Nationalized
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Nationalized
    @Column(name = "location", length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private EventStatus status = EventStatus.PLANNED;

    public enum EventStatus {
        PLANNED, CONSENT_COLLECTION, IN_PROGRESS, COMPLETED, CANCELLED
    }

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "health_checkup_event_types", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "checkup_type", length = 100)
    private List<String> typesOfCheckups; // e.g., "VISION", "HEARING", "DENTAL"

    @Nationalized
    @Column(name = "target_grade_levels", length = 255) // Could be a list or a more structured way to define target
    private String targetGradeLevels; // Example: "Grade 1, Grade 2", or "ALL"

    // Consider adding targetClasses if more granularity is needed

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", referencedColumnName = "user_id")
    private User createdBy;

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
