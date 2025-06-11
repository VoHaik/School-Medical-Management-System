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
        // Fetch notifications where the recipient user's ID matches the given userId
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        // Assuming NotificationDTO has a field for the recipient's user ID
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getUserId());
        }
        dto.setTitle(notification.getTitle());
        // Use message from Notification entity, assuming it exists as per previous file read.
        // If it was changed to 'content', this needs to be notification.getContent() and dto.setContent()
        dto.setContent(notification.getMessage()); // Corrected: NotificationDTO uses 'content', Notification entity uses 'message' via getMessage()


        // dto.setRead(notification.isRead()); // Old line, isRead() might not exist if 'isRead' is Boolean
        dto.setIsRead(notification.getIsRead()); // Corrected to use getIsRead() for Boolean type
        dto.setCreatedAt(notification.getCreatedAt());
        if (notification.getNotificationType() != null) {
            dto.setNotificationType(notification.getNotificationType().getTypeName()); // Assuming NotificationType has getTypeName()
        }

        // Set the creator's name
        if (notification.getCreatedBy() != null) {
            // String createdByName = notification.getCreatedBy().getFirstName() + " " + notification.getCreatedBy().getLastName(); // Old way
            dto.setCreatedBy(notification.getCreatedBy().getFullName()); // Corrected to use getFullName()
        } else {
            dto.setCreatedBy("System"); // Default if no creator is set
        }
        // dto.setLinkTo(notification.getLinkUrl()); // If DTO has linkTo and Notification has linkUrl
        return dto;
    }

    // private Notification convertToEntity(NotificationDTO dto) { // If needed for create/update
    //     Notification notification = new Notification();
    //     // ... map fields from DTO to entity, handle user loading if necessary
    //     return notification;
    // }
}
