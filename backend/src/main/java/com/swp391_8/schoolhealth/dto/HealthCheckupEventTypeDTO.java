package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckupEventTypeDTO {
    private Long eventId;
    private Long checkupTypeId;
    private String checkupTypeName;
    private String checkupTypeDescription;
    private Boolean isRequired;
    private Integer sequenceOrder;
    private String notes;
    private Boolean isRequiredMeasurement;
    private Boolean isRequiredVitalSigns;
    private Boolean isRequiredVisionTest;
    private Boolean isRequiredHearingTest;
    private Integer estimatedDurationMinutes;
}
