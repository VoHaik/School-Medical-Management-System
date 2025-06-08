package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationSubmissionDTO {
    private Integer submissionId;
    private Integer studentId;
    private String studentName; // Optional: For display purposes on the frontend if needed
    private String medicationName;
    private String dosage;
    private String schedule;
    private String reason;
    private String doctorNoteUrl; // URL or path to the stored doctor's note file
    private Date submissionDate;
    private String status; // e.g., PENDING_APPROVAL, APPROVED, REJECTED
    private String parentUsername; // To associate with the parent who submitted

    // If you need to handle file uploads directly as part of this DTO (less common for REST APIs)
    // you might include a field for MultipartFile, but it's usually handled as a separate parameter in the controller.
}
