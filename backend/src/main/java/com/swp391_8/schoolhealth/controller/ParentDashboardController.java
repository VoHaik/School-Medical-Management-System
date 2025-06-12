package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.EventDTO;
import com.swp391_8.schoolhealth.dto.MedicationSubmissionDTO;
import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.service.EventService;
import com.swp391_8.schoolhealth.service.MedicationSubmissionService;
import com.swp391_8.schoolhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ParentDashboardController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EventService eventService;

    @Autowired
    private MedicationSubmissionService medicationSubmissionService; // For medication summaries

    // Endpoint to get notifications for a parent (linked by userId)
    // The frontend will pass the parent's user ID.
    // studentId can be used for student-specific notifications if your Notification model supports it.
    @GetMapping("/notifications/parent/{parentId}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<NotificationDTO>> getNotificationsForParent(@PathVariable Long parentId, @RequestParam(required = false) Long studentId) {
        // If studentId is provided and relevant, the service should handle filtering.
        // For now, assuming notifications are primarily parent-userId based.
        System.out.println("Fetching notifications for parentId: " + parentId + (studentId != null ? ", studentId: " + studentId : ""));
        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(parentId);
        if (notifications.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(notifications);
    }

    // Endpoint to get events. These might be general or filtered if EventService supports it.
    // The parentId is in the path but might not be directly used if events are school-wide.
    // studentId can be used for filtering if events are targeted (e.g., by grade).
    @GetMapping("/events/parent/{parentId}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<EventDTO>> getEventsForParent(@PathVariable Long parentId, @RequestParam(required = false) Long studentId) {
        // The EventService currently gets all upcoming events.
        // Filtering by parentId or studentId would require more complex logic in EventService/Repository.
        System.out.println("Fetching events for parentId: " + parentId + (studentId != null ? ", studentId: " + studentId : ""));
        List<EventDTO> events = eventService.getUpcomingEvents();
        if (events.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(events);
    }

    // Endpoint to get medication submission summaries for a specific student of the parent.
    // studentId is crucial here.
    @GetMapping("/medication-submissions/summary/student/{studentCode}") // Changed from studentId to studentCode
    @PreAuthorize("hasRole('PARENT')")
    // Ensure that the security context or service layer checks if the authenticated parent can view this studentCode
    public ResponseEntity<List<MedicationSubmissionDTO>> getMedicationSummaryForStudent(@PathVariable String studentCode) { // Changed from Long studentId to String studentCode
        System.out.println("Fetching medication summary for studentCode: " + studentCode);
        List<MedicationSubmissionDTO> medicationSummaries = medicationSubmissionService.getMedicationSubmissionsByStudentCode(studentCode); // Changed from getMedicationSubmissionsByStudentId to getMedicationSubmissionsByStudentCode
        if (medicationSummaries.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(medicationSummaries);
    }
}
