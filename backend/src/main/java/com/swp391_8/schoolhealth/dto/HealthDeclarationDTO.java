package com.swp391_8.schoolhealth.dto;

import java.time.LocalDate;
import java.util.List;

// Added Lombok annotations for getters and setters
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthDeclarationDTO {
<<<<<<< Updated upstream
    private Integer declarationId;
    private Boolean isDraft; // Changed from boolean to Boolean
    private Integer studentId;
=======
    private Integer declarationId; // Added
    private boolean isDraft; // Added
    private String studentCode; // Changed from Integer studentId to String studentCode
>>>>>>> Stashed changes
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String physicianName;
    private String physicianPhone;
    private List<String> allergies;
    private List<String> medicalConditions;
    private List<VaccinationRecordDTO> vaccinations;
    private String visionScreeningResult;
    private LocalDate visionScreeningDate;
    private String hearingScreeningResult;
    private LocalDate hearingScreeningDate;
    private String dentalScreeningResult;
    private LocalDate dentalScreeningDate;
    private String scoliosisScreeningResult;
    private LocalDate scoliosisScreeningDate;
    private String notes;
    private Boolean consentSignature;
    private LocalDate declarationDate;
    private String symptoms;
    private Boolean hasSymptoms;     // Changed from boolean to Boolean
    private Boolean closeContact;    // Changed from boolean to Boolean
    private Boolean travelHistory;   // Changed from boolean to Boolean
    private String additionalInfo;

    private Integer submittedByUserId; // Added
    private String submittedByUsername; // Added

    // Lombok's @Getter and @Setter will generate the necessary methods.
    // Explicit getters and setters below are no longer needed if Lombok is active.
    // ...existing code...
    // public Integer getDeclarationId() { // Added
    //     return declarationId;
    // }

    // public void setDeclarationId(Integer declarationId) { // Added
    //     this.declarationId = declarationId;
    // }

    // public boolean isDraft() { // Old getter for primitive
    //     return isDraft;
    // }
    // public Boolean getIsDraft() { // New getter for Boolean
    //     return isDraft;
    // }

    // public void setDraft(boolean isDraft) { // Old setter for primitive
    //     this.isDraft = isDraft;
    // }
    // public void setIsDraft(Boolean isDraft) { // New setter for Boolean
    //    this.isDraft = isDraft;
    // }
    // ... (similar changes for hasSymptoms, closeContact, travelHistory)

<<<<<<< Updated upstream
    // public Integer getStudentId() {
    //     return studentId;
    // }

    // public void setStudentId(Integer studentId) {
    //     this.studentId = studentId;
    // }
    // ... (other existing getters and setters can be removed if @Getter/@Setter are used)
=======
    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }
>>>>>>> Stashed changes

    // public void setSubmittedByUserId(Integer submittedByUserId) {
    //     this.submittedByUserId = submittedByUserId;
    // }

    // public Integer getSubmittedByUserId() {
    //     return submittedByUserId;
    // }

    // public void setSubmittedByUsername(String submittedByUsername) {
    //     this.submittedByUsername = submittedByUsername;
    // }

    // public String getSubmittedByUsername() {
    //     return submittedByUsername;
    // }
}
