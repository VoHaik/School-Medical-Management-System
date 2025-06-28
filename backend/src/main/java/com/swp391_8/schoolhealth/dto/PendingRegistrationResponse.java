package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.PendingRegistration;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistrationResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String gender;
    private String address;
    private String emergencyContact;
    private String relationshipWithStudent;
    private String parentCode;
    private String studentCode;
    private String studentFullName;
    private LocalDateTime studentDateOfBirth;
    private String studentClass;
    private PendingRegistration.RegistrationStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private String processedByName;
    private String adminNotes;
    private String rejectionReason;
    
    // Constructor từ PendingRegistration entity
    public PendingRegistrationResponse(PendingRegistration registration) {
        this.id = registration.getId();
        this.username = registration.getUsername();
        this.fullName = registration.getFullName();
        this.email = registration.getEmail();
        this.phoneNumber = registration.getPhoneNumber();
        this.gender = registration.getGender();
        this.address = registration.getAddress();
        this.emergencyContact = registration.getEmergencyContact();
        this.relationshipWithStudent = registration.getRelationshipWithStudent();
        this.parentCode = registration.getParentCode();
        this.studentCode = registration.getStudentCode();
        this.studentFullName = registration.getStudentFullName();
        this.studentDateOfBirth = registration.getStudentDateOfBirth();
        this.studentClass = registration.getStudentClass();
        this.status = registration.getStatus();
        this.requestedAt = registration.getRequestedAt();
        this.processedAt = registration.getProcessedAt();
        this.processedByName = registration.getProcessedBy() != null ? registration.getProcessedBy().getFullName() : null;
        this.adminNotes = registration.getAdminNotes();
        this.rejectionReason = registration.getRejectionReason();
    }
}
