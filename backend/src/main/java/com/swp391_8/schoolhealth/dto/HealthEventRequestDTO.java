package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
public class HealthEventRequestDTO {
    @NotBlank(message = "Event name is mandatory")
    private String eventName;

    @NotBlank(message = "Event type is mandatory")
    private String eventType; // "HEALTH_CHECKUP" hoặc "VACCINATION"

    private String description;

    @NotNull(message = "Scheduled date is mandatory")
    private LocalDate scheduledDate;
    
    // Add support for startDate and endDate from frontend
    private LocalDate startDate;
    private LocalDate endDate;

    private String location;

    // Status will likely be managed by the system, not directly set on creation by user in this DTO
    // private String status; 

    @NotEmpty(message = "At least one checkup type must be specified")
    private List<String> typesOfCheckups;

    private String targetGradeLevels;
    
    // Thêm trường để chỉ định danh sách các lớp cần thông báo
    private List<String> classesToNotify;
}
