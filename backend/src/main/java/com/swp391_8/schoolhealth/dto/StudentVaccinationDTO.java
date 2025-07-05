package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.StudentVaccination;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class StudentVaccinationDTO {
    private Integer id;
    // private Integer studentId; // Keep if legacy systems need it, but prefer studentCode
    private String studentCode; // Primary identifier for student
    private String studentName; // For display
    private Integer vaccineId;
    private String vaccineName; // For display
    private LocalDate vaccinationDate;
    private Integer doseNumber;
    private String batchNumber;
    private String administeringLocation;
    private Integer administeredByNurseId;
    private String administeredByNurseName; // For display
    private String consentStatus;
    private Integer consentGivenByParentId;
    private String consentGivenByParentName; // For display
    private LocalDate consentDate;
    private String consentDocumentUrl;
    private String administrationNotes;
    private String parentNotes;
    private LocalDate nextDueDate;
    private Integer vaccinationEventId;
    private String vaccinationEventName; // For display
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Consider a constructor or builder if manual mapping becomes complex
}
