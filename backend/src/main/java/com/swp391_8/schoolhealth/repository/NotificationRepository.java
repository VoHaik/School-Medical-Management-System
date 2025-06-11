package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Custom query to find notifications by parent user ID
    // This assumes that Notification entity has a 'user' field which is a User entity,
    // and User entity has a 'userId' field.
    // Adjust the query based on your actual Notification entity structure and relationships.
    // For example, if Notification is directly linked to a Parent entity which then links to User:
    // List<Notification> findByParentUserId(Long userId);
    // Or if Notification has a direct userId field for the recipient:
    List<Notification> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId); // Example: find unread for a user
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId); // Example: find all for a user
}
