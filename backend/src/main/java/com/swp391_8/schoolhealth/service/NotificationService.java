package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getNotificationsByUserId(Long userId);
    // Potentially add methods like markAsRead, createNotification, etc.
}
