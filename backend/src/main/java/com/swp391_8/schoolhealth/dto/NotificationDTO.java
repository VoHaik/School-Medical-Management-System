package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Integer notificationId;
    private Integer userId; // ID of the recipient user
    private Integer studentId; // Optional: ID of the related student
    private String studentName; // Optional: For display
    private String message;
    private String type;
    private boolean isRead;
    private Date createdAt;
    private String linkTo;
}
