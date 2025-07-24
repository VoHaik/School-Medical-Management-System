package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "parent_registration_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentRegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @Column(name = "parent_code", nullable = false, length = 50)
    @Nationalized
    private String parentCode;

    @Column(name = "username", nullable = false, length = 50)
    @Nationalized
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    @Nationalized
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    @Nationalized
    private String fullName;

    @Column(name = "email", nullable = false, length = 100)
    @Nationalized
    private String email;

    @Column(name = "phone_number", nullable = false, length = 20)
    @Nationalized
    private String phoneNumber;

    @Column(name = "student_code", nullable = false, length = 50)
    @Nationalized
    private String studentCode;

    @Column(name = "student_name", nullable = false, length = 100)
    @Nationalized
    private String studentName;

    @Column(name = "relationship", length = 50)
    @Nationalized
    private String relationship; // Mối quan hệ với học sinh (Cha, Mẹ, Người giám hộ)

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "decline_reason", length = 500)
    @Nationalized
    private String declineReason;

    @Column(name = "reviewed_by")
    private Integer reviewedBy; // Admin user ID who reviewed

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum RequestStatus {
        PENDING,
        APPROVED,
        DECLINED
    }
}
