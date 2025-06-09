package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultationDTO {
    private Integer consultationId; // Changed from id
    private Integer studentId;
    private String studentName; // For display purposes
    private Integer checkupId;
    private LocalDateTime consultationDate;
    private String location;
    private String reason; // Changed from description
    private String recommendations; // Changed from result
    // Add any other fields from the Consultation entity that you want to expose
}
