package com.swp391_8.schoolhealth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NurseDTO {
    private Long nurseId;
    private String nurseCode;
    private String fullName;
    private String qualification;
    private String specialization;
    private String email;
    private String phoneNumber;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
