package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
// import java.util.Set; // If using for target audience mapping

@Getter
@Setter
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "type", length = 100) // E.g., 'SCHOOL_HOLIDAY', 'SPORTS_EVENT', 'PTM'
    private String type;

    // For simplicity, target audience can be a string or managed via a separate mapping table
    // For example, a comma-separated list of roles, grades, or 'ALL'
    @Column(name = "target_audience", length = 255) // E.g., "PARENTS", "STUDENTS_GRADE_5", "ALL"
    private String targetAudience;

    // If an event is specifically for a student (less common for general events, but possible)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "student_id")
    // private Student student;

    @Column(name = "created_by", length = 100) // Username or ID of creator
    private String createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private Date createdAt;

    // Add getters if not already present.
    // Assuming fields: Date eventDate, String category
    public Date getEventDate() {
        return startDate;
    }

    public String getCategory() {
        return type;
    }
}
