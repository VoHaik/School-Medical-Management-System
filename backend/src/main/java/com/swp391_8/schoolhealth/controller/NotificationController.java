package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl; // Added

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Endpoint to get notifications for the logged-in user
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(
            @RequestParam(value = "unreadOnly", defaultValue = "false") boolean unreadOnly,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userDetails.getId();
        // Corrected call to match service method signature
        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(userId, unreadOnly);
        return ResponseEntity.ok(notifications);
    }

    // Endpoint to mark a specific notification as read
    @PatchMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(
            @PathVariable Integer notificationId,
            Authentication authentication) {
        // UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // Integer userId = userDetails.getId();
        // Add logic here to ensure notificationId belongs to userId if necessary, or handle in service
        NotificationDTO notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }

    // Endpoint to mark all notifications for the logged-in user as read
    @PatchMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationDTO>> markAllNotificationsAsRead(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userDetails.getId();
        List<NotificationDTO> notifications = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(notifications);
    }
    
    // Note: Notification creation is typically handled by services (e.g., when consent is updated or results are posted)
    // So, a POST endpoint here might not be directly exposed to clients for arbitrary notification creation.
    // If needed for admin purposes, it could be added with appropriate authorization.
}
