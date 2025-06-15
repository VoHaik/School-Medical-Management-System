package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.model.Notification; // Import Notification
import com.swp391_8.schoolhealth.model.User;
import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getNotificationsByUserId(Integer userId, boolean unreadOnly); // Changed Long to Integer, added unreadOnly
    List<NotificationDTO> getNotificationsByParentUsernameAndStudentCode(String parentUsername, String studentCode);
    void createNotification(User user, String message, String type, String linkTo);
    NotificationDTO markAsRead(Integer notificationId); // Added method
    List<NotificationDTO> markAllAsRead(Integer userId); // Added method
}
