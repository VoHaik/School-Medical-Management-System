package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate; // Changed from java.util.Date to java.time.LocalDate
import java.util.List;

@Data
public class VaccinationEventRequestDTO {
    private String eventName;
    private String description;
    private LocalDate startDate; // Changed from Date to LocalDate
    private LocalDate endDate;   // Changed from Date to LocalDate
    private String location;
    private Integer vaccineId; // Changed from String to Integer
    private List<String> targetGradeLevels;
    private String targetAgeRange;
    private Integer expectedParticipants;
    private String status; // Added status field
    private LocalDate scheduledDateStart; // Added scheduledDateStart field
    private LocalDate scheduledDateEnd; // Added scheduledDateEnd field
}
