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
    private String studentCode; // Changed from Integer studentId to String studentCode
    private String studentName; // Optional: For display purposes on the frontend if needed
    private String medicationName;
    private String dosage;
    private String schedule;
    private String reason;
    private String doctorNoteUrl; // URL or path to the stored doctor's note file
    private Date submissionDate;
    private String status; // e.g., PENDING_APPROVAL, APPROVED, REJECTED
    private String parentUsername; // To associate with the parent who submitted

    // Assuming fields: String frequency, Date startDate, Date endDate, String doctorNotePath
    // Add getters and setters if not already present via Lombok or if specific logic is needed.
    private String frequency;
    private Date startDate;
    private Date endDate;
    private String doctorNotePath;

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    // public String getDoctorNotePath() { // Getter might already exist if using Lombok @Data or @Getter
    //     return doctorNotePath;
    // }

    public void setDoctorNotePath(String doctorNotePath) {
        this.doctorNotePath = doctorNotePath;
    }

    // If you need to handle file uploads directly as part of this DTO (less common for REST APIs)
    // you might include a field for MultipartFile, but it's usually handled as a separate parameter in the controller.
}
