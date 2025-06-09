package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.model.Notification;
import com.swp391_8.schoolhealth.repository.NotificationRepository;
import com.swp391_8.schoolhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.time.ZoneId;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<NotificationDTO> getNotificationsByUserId(Integer userId) { // Ensure userId is Integer
        // Corrected to use the actual method name from NotificationRepository
        // and ensure the parameter type matches.
        return notificationRepository.findByRecipientUserUserIdOrderBySentAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setUserId(notification.getRecipientUser().getUserId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getContent());
        dto.setRead(notification.getIsRead());
        dto.setCreatedAt(Date.from(notification.getSentAt().atZone(ZoneId.systemDefault()).toInstant()));
        dto.setNotificationType(notification.getNotificationType().getTypeName());
        return dto;
    }

    // private Notification convertToEntity(NotificationDTO dto) { // If needed for create/update
    //     Notification notification = new Notification();
    //     // ... map fields from DTO to entity, handle user loading if necessary
    //     return notification;
    // }
}
