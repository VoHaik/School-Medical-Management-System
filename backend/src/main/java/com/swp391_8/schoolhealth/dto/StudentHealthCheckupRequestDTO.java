package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class StudentHealthCheckupRequestDTO {
    @NotNull(message = "Event ID is mandatory")
    private Integer eventId;

    @NotBlank(message = "Student code is mandatory")
    private String studentCode;

    @NotNull(message = "Checkup date is mandatory")
    private LocalDate checkupDate;

    // Vision - Optional, depends on what's being recorded for this specific checkup type
    private String visionLeft;
    private String visionRight;
    private String visionNotes;

    // Hearing - Optional
    private String hearingLeft;
    private String hearingRight;
    private String hearingNotes;

    // Dental - Optional
    private String dentalOralHealthStatus;
    private String dentalNotes;

    // Scoliosis - Optional
    private String scoliosisScreeningResult;
    private String scoliosisNotes;

    // Vitals - Some might be mandatory depending on checkup type
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double temperatureCelsius;

    @NotNull(message = "Height is mandatory")
    private Double heightCm;

    @NotNull(message = "Weight is mandatory")
    private Double weightKg;
    // BMI and BMI Category will be calculated

    // General
    private String generalObservations;
    private String recommendations;

    // Optional: To specify who conducted the checkup if not the logged-in user, or for record keeping
    private String conductedByUserName; 
}
