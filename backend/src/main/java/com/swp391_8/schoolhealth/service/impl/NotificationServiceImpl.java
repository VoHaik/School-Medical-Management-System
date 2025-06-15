package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.Notification;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.NotificationRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date; // Added import for Date
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<NotificationDTO> getNotificationsByUserId(Integer userId, boolean unreadOnly) { // Matched interface
        List<Notification> notifications;
        if (unreadOnly) {
            notifications = notificationRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        } else {
            notifications = notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        }
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getNotificationsByParentUsernameAndStudentCode(String parentUsername, String studentCode) {
        // This method needs to be implemented based on how you link parents to students and their notifications.
        // For example, find the parent, then find their students, then find notifications for those students or the parent directly.
        // This is a placeholder and needs a proper implementation.
        User parent = userRepository.findByUsername(parentUsername).orElse(null);
        if (parent == null) {
            return List.of(); // Or throw an exception
        }
        // Example: If notifications are directly for the parent related to a student:
        // return notificationRepository.findByUserAndStudent_StudentCodeOrderByCreatedAtDesc(parent, studentCode).stream().map(this::convertToDTO).collect(Collectors.toList());
        // Or if notifications are for the student, but fetched by parent:
        // Student student = studentRepository.findByStudentCode(studentCode).orElse(null);
        // if (student == null) return List.of();
        // return notificationRepository.findByUser_UserIdAndStudent_StudentIdOrderByCreatedAtDesc(student.getUser().getUserId(), student.getStudentId())...;
        return List.of(); // Placeholder - requires more specific logic
    }

    @Override
    public void createNotification(User user, String type, String message, String linkTo) { // Corrected parameter order
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setLinkTo(linkTo);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    @Override
    public NotificationDTO markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
        return convertToDTO(notification);
    }

    @Override
    public List<NotificationDTO> markAllAsRead(Integer userId) {
        List<Notification> notifications = notificationRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : notifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
        return notifications.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        if (notification.getUser() != null) {
            dto.setUsername(notification.getUser().getUsername()); // Changed from userId to username
        }
        dto.setMessage(notification.getMessage());
        // dto.setType(notification.getType()); // Type is not in DTO as per previous definition, can be added if needed
        dto.setLink(notification.getLinkTo());
        dto.setRead(notification.isRead());
        dto.setNotificationDate(notification.getCreatedAt()); // Map createdAt to notificationDate
        // dto.setSenderUsername(notification.getSender() != null ? notification.getSender().getUsername() : null); // If sender is added to Notification entity
        return dto;
    }
}
