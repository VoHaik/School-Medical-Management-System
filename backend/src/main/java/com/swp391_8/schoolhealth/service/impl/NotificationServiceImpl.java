package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.model.Notification;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.NotificationRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getNotificationsByParentUsernameAndStudentCode(String parentUsername, String studentCode) {
        Optional<User> parentUserOptional = userRepository.findByUsername(parentUsername);
        if (!parentUserOptional.isPresent()) {
            System.out.println("Parent user not found: " + parentUsername);
            return Collections.emptyList();
        }
        User parentUser = parentUserOptional.get();
        Long parentUserId = Long.valueOf(parentUser.getUserId());

        List<Notification> notifications;
        if (studentCode != null && !studentCode.isEmpty()) {
            notifications = notificationRepository.findByUser_UserIdAndStudent_StudentCodeOrderByCreatedAtDesc(parentUserId, studentCode);
        } else {
            notifications = notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(parentUserId);
        }

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getUserId()); // Corrected: Pass Integer directly
        } else if (notification.getUserId() != null) {
            dto.setUserId(notification.getUserId());
        }
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setNotificationType(notification.getNotificationType());
        if (notification.getStudent() != null) {
            dto.setStudentCode(notification.getStudent().getStudentCode());
        }
        return dto;
    }

    // private Notification convertToEntity(NotificationDTO dto) { // If needed for create/update
    //     Notification notification = new Notification();
    //     // ... map fields from DTO to entity, handle user loading if necessary
    //     return notification;
    // }
}
