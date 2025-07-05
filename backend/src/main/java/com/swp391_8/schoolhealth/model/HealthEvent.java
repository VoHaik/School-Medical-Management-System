package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "health_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"targetGradeLevels"})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "health_event_grade_levels",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "grade_id")
    )
    @JsonIgnore
    private Set<GradeLevel> targetGradeLevels = new HashSet<>();

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

    // Many-to-Many relationship with vaccines through junction table
    @OneToMany(mappedBy = "healthEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HealthEventVaccine> healthEventVaccines;

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
