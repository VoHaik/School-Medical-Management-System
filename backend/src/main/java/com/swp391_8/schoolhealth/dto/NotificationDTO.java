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
    private String username; // User who receives the notification
    private String message;
    private String link; // Link to the relevant page
    private boolean read;
    private Date notificationDate; // Changed from createdAt to notificationDate
    private String senderUsername; // User who triggered the notification (optional)
}
