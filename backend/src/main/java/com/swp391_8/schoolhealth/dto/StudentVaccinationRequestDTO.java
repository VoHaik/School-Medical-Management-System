package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.StudentVaccination;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class StudentVaccinationRequestDTO {
    @NotNull(message = "Student Code is required") // Updated message
    private String studentCode; // Changed from Integer studentId to String studentCode

    @NotNull(message = "Vaccine ID is required")
    private Integer vaccineId;

    @NotNull(message = "Vaccination date is required")
    private LocalDate vaccinationDate;

    private Integer doseNumber;
    private String batchNumber;
    private String administeringLocation;

    // administeredByNurseId will typically be set by the system based on the logged-in user (nurse)

    @NotNull(message = "Consent status is required")
    private String consentStatus; // Expecting Enum string value e.g., "CONSENT_GIVEN"

    private Integer consentGivenByParentId; // Required if consentStatus indicates consent given
    private LocalDate consentDate;
    private String consentDocumentUrl;

    private String administrationNotes;
    private String parentNotes; // Notes from parent, possibly during consent submission
    private LocalDate nextDueDate;
    private Integer vaccinationEventId; // Optional: if part of a school event
}
