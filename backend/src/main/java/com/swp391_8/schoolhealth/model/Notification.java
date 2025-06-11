package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Integer notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // The user this notification is for
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id") // Optional: if the notification is related to a specific student
    private Student student;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "type", length = 50) // E.g., 'MEDICATION_UPDATE', 'EVENT_REMINDER', 'FORM_APPROVAL'
    private String type;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @Column(name = "link_to", length = 255) // Optional: A URL or path to navigate to
    private String linkTo;

    // Add getters if not already present due to Lombok or other reasons.
    // Assuming fields: Integer userId, String title, String notificationType
    public Integer getUserId() {
        return user.getUserId();
    }

    public String getTitle() {
        return message; // Assuming title is the same as message, adjust if necessary
    }

    public String getNotificationType() {
        return type;
    }
}
