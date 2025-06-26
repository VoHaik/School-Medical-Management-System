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
@Table(name = "health_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Nationalized
    @Column(name = "event_name", nullable = false, length = 255)
    private String eventName;

    @Nationalized
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", length = 50, nullable = false)
    private EventType eventType = EventType.HEALTH_CHECKUP;

    public enum EventType {
        HEALTH_CHECKUP, VACCINATION
    }

    @Nationalized
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Nationalized
    @Column(name = "location", length = 255)
    private String location;

    @Nationalized
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private Status status = Status.SCHEDULED;

    public enum Status {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED
    }

    @Nationalized
    @Column(name = "target_grade_levels", length = 255)
    private String targetGradeLevels;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "created_by_user_id")
    private Integer createdByUserId;

    @Column(name = "updated_by_user_id")
    private Integer updatedByUserId;

    // One-to-many relationship with StudentHealthCheckup
    @OneToMany(mappedBy = "healthEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentHealthCheckup> studentHealthCheckups;

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
