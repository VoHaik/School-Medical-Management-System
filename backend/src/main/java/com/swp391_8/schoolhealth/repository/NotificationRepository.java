package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Find notifications for a specific user, ordered by creation date descending
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    // Find unread notifications for a specific user, ordered by creation date descending
    List<Notification> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Integer userId);

    // If you need to find notifications by student, you can add:
    // List<Notification> findByStudent_StudentIdOrderByCreatedAtDesc(Integer studentId);
    // List<Notification> findByStudent_StudentCodeOrderByCreatedAtDesc(String studentCode);
}
