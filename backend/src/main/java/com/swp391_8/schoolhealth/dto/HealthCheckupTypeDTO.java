package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckupTypeDTO {
    private Long checkupTypeId;
    private String typeName;
    private String description;
    private Boolean isRequiredMeasurement;
    private Boolean isRequiredVitalSigns;
    private Boolean isRequiredVisionTest;
    private Boolean isRequiredHearingTest;
    private Integer estimatedDurationMinutes;
    private Boolean isActive;
}
