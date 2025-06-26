package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate; // Changed from java.util.Date
import java.time.LocalDateTime; // Changed from java.util.Date
import java.util.List;

@Data
public class VaccinationEventDTO {
    private Integer id; // Changed from String eventId to Integer id
    private String eventName;
    private String description;
    private LocalDate scheduledDateStart; // Changed from Date startDate to LocalDate scheduledDateStart
    private LocalDate scheduledDateEnd;   // Changed from Date endDate to LocalDate scheduledDateEnd
    private String location;
    private String status; // e.g., PLANNED, OPEN_FOR_REGISTRATION, COMPLETED, CANCELLED
    private Integer vaccineId; // Changed from String to Integer
    private String vaccineName; // Name of the associated Vaccine (for convenience)
    private Integer coordinatorId; // Changed from String createdByUserId to Integer coordinatorId
    private String coordinatorName; // Added for display
    
    // Target grade information
    private List<Integer> targetGradeIds; // IDs of target grade levels
    private List<String> targetGradeNames; // Names of target grade levels for display
    
    private LocalDateTime createdAt; // Changed from Date creationDate to LocalDateTime createdAt
    private LocalDateTime updatedAt; // Changed from Date lastUpdateDate to LocalDateTime updatedAt
}
