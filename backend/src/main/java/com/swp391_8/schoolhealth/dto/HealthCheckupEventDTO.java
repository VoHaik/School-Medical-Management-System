package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class HealthCheckupEventDTO {
    private Integer eventId;
    private String eventName;
    private String description;
    private LocalDate scheduledDate;
    private String location;
    private String status; // String representation of EventStatus enum
    private List<String> typesOfCheckups;
    private String targetGradeLevels;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer createdByUserId;
    private String createdByUserName; // For display
}
