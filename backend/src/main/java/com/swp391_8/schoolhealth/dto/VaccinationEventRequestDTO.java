package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate; // Changed from java.util.Date to java.time.LocalDate
import java.util.List;

@Data
public class VaccinationEventRequestDTO {
    private String eventName;
    private String description;
    private LocalDate scheduledDateStart; // Use consistent field names
    private LocalDate scheduledDateEnd;   // Use consistent field names
    private String location;
    private Integer vaccineId; // Changed from String to Integer
    
    // Target grade information - use grade IDs instead of strings
    private List<Integer> targetGradeIds; // IDs of target grade levels
    
    private String status; // Added status field
}
