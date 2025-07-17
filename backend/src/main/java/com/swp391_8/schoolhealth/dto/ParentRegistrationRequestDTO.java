package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentRegistrationRequestDTO {
    private Integer requestId;
    private String parentCode;
    private String username;
    private String password; // Chỉ dùng khi tạo request, không trả về
    private String fullName;
    private String email;
    private String phoneNumber;
    private String studentCode;
    private String studentName;
    private String relationship;
    private String status;
    private String declineReason;
    private Integer reviewedBy;
    private String reviewedByName; // Tên admin đã review
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
}
