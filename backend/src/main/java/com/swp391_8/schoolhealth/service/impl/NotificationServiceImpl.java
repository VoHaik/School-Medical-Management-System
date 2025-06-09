package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.model.Notification;
import com.swp391_8.schoolhealth.repository.NotificationRepository;
import com.swp391_8.schoolhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
        // Assuming User entity is linked and has a getUsername() or similar for createdBy
        // And Notification entity has a direct userId field for the recipient
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId).stream() //MODIFIED HERE
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setUserId(notification.getUserId()); // Assuming direct userId field
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setNotificationType(notification.getNotificationType());
        // dto.setCreatedBy(notification.getUser() != null ? notification.getUser().getUsername() : "System"); // Example if linked to a User entity who created it
        return dto;
    }

    // private Notification convertToEntity(NotificationDTO dto) { // If needed for create/update
    //     Notification notification = new Notification();
    //     // ... map fields from DTO to entity, handle user loading if necessary
    //     return notification;
    // }
}
