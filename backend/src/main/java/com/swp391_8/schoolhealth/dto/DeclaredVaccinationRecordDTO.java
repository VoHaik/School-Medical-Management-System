package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DeclaredVaccinationRecordDTO {
    private Integer recordId; // Changed to Integer
    private String studentCode;
    private String studentName; // For display
    private Integer vaccineId;
    private String vaccineName;
    private LocalDate vaccinationDate; // Changed to LocalDate
    private Integer doseNumber;
    private String providerName;
    private String documentUrl;
    private String verificationStatus;
    private String verifiedByNurseUsername; // Changed from verifiedByUserId to username
    private String verifiedByNurseName; // For display
    private LocalDate verificationDate; // Changed to LocalDate
    private String verificationNotes;
    private String parentNotes;
    private LocalDateTime createdAt; // Changed from submissionDate to createdAt for consistency
    private LocalDateTime updatedAt;
    private String submittedByUsername;
    private String submittedByName;
    private LocalDateTime submissionDate; // Changed from LocalDate to LocalDateTime

    public void setSubmittedByUsername(String submittedByUsername) {
        this.submittedByUsername = submittedByUsername;
    }

    public void setSubmittedByName(String submittedByName) {
        this.submittedByName = submittedByName;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) { // Changed from LocalDate to LocalDateTime
        this.submissionDate = submissionDate;
    }
}
