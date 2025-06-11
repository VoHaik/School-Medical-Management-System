package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "HomepageContents")
public class HomepageContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id", nullable = false)
    private Integer contentId;

    @Nationalized
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Nationalized
    @Lob
    @Column(name = "content_text", nullable = false)
    private String contentText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_type_id", nullable = false)
    private ContentType contentType;

    @Column(name = "publish_date")
    private LocalDateTime publishDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_user_id")
    private User updatedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (publishDate == null) {
            publishDate = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}