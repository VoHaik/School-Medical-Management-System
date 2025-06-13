package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class HealthCheckupDTO {
    private Integer id;
    private String studentCode; // Changed from studentId
    private String studentName; // For display purposes
    private LocalDate checkupDate;
    private String checkupType;
    private String visionLeft;
    private String visionRight;
    private String hearingLeft;
    private String hearingRight;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double temperature;
    private Double height; // cm
    private Double weight; // kg
    private Double bmi;
    private String notes;
    private String status; // e.g., "Completed", "Pending Follow-up"
    private String consentStatus; // String representation of Enum
    private Integer consentByUserId;
    private String consentByUserName; // For display
    private LocalDate followUpDate;
    private Integer conductedByUserId;
    private String conductedByUserName; // For display
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy; // Added
    private String updatedBy; // Added
}
