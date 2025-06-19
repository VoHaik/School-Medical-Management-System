package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
public class HealthCheckupEventRequestDTO {
    @NotBlank(message = "Event name is mandatory")
    private String eventName;

    private String description;

    @NotNull(message = "Scheduled date is mandatory")
    private LocalDate scheduledDate;

    private String location;

    // Status will likely be managed by the system, not directly set on creation by user in this DTO
    // private String status; 

    @NotEmpty(message = "At least one checkup type must be specified")
    private List<String> typesOfCheckups;

    private String targetGradeLevels;
}
