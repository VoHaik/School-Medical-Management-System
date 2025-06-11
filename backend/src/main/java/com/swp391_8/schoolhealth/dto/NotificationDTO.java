package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Integer notificationId;
    private Integer userId; // ID of the recipient user
    private Integer studentId; // Optional: ID of the related student
    private String studentName; // Optional: For display
    private String content; // Added to match entity if message was replaced
    private String type;
    private Boolean isRead; // Changed from boolean to Boolean
    private LocalDateTime createdAt; // Changed from Date to LocalDateTime
    private String linkTo;
    private String title;
    private String notificationType;
    private String createdBy; // Name of the user who created the notification
}
