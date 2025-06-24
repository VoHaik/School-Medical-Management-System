package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate; // Changed from java.util.Date

@Data
public class DeclaredVaccinationRecordRequestDTO {
    private String studentCode; // Changed from studentId to studentCode (String)
    private Integer vaccineId;    // Changed from vaccineName (String) to vaccineId (Integer)
    private LocalDate vaccinationDate; // Changed from java.util.Date to java.time.LocalDate
    private Integer doseNumber;      // Added field
    private String providerName;     // Changed from clinicName to providerName
    private String parentNotes;        // Changed from notes to parentNotes
    private String documentUrl;      // Added field for document URL (optional, can be set later)
    // verificationStatus, verifiedByNurseId, verificationDate, verificationNotes are typically handled by the backend service, not directly in request DTO
}
