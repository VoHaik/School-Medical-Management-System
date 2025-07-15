package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultationDTO {
    private Long id;
    private String studentCode; // Changed from Integer studentId
    private String studentName; // For display purposes
    private Long checkupId;
    private LocalDateTime consultationDate;
    private String location;
    private String description;
    private String result;
    // Add any other fields from the Consultation entity that you want to expose
}
