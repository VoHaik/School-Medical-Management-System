package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "pending_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Nationalized
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;


    @Nationalized
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Nationalized
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Nationalized
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Nationalized
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Nationalized
    @Column(name = "gender", length = 10)
    private String gender;

    @Nationalized
    @Column(name = "address", length = 255)
    private String address;

    @Nationalized
    @Column(name = "emergency_contact", length = 50)
    private String emergencyContact;

    @Nationalized
    @Column(name = "relationship_with_student", length = 50)
    private String relationshipWithStudent;

    @Nationalized
    @Column(name = "parent_code", nullable = false, length = 50)
    private String parentCode;

    // Thông tin học sinh để xác thực
    @Nationalized
    @Column(name = "student_code", nullable = false, length = 50)
    private String studentCode;

    @Nationalized
    @Column(name = "student_full_name", nullable = false, length = 100)
    private String studentFullName;

    @Column(name = "student_date_of_birth")
    private LocalDateTime studentDateOfBirth;

    @Nationalized
    @Column(name = "student_class", length = 50)
    private String studentClass;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_user_id")
    private User processedBy;

    @Nationalized
    @Column(name = "admin_notes", length = 500)
    private String adminNotes;

    // Thông tin từ chối
    @Nationalized
    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public enum RegistrationStatus {
        PENDING,    // Chờ phê duyệt
        APPROVED,   // Đã phê duyệt
        REJECTED    // Bị từ chối
    }

    @PrePersist
    protected void onCreate() {
        requestedAt = LocalDateTime.now();
        if (status == null) {
            status = RegistrationStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (status == RegistrationStatus.APPROVED || status == RegistrationStatus.REJECTED) {
            processedAt = LocalDateTime.now();
        }
    }
}
