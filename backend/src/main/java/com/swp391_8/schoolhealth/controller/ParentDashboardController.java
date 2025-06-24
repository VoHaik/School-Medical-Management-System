package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.EventDTO;
import com.swp391_8.schoolhealth.dto.MedicationRequestResponseDTO; // Use new DTO
import com.swp391_8.schoolhealth.dto.NotificationDTO;
import com.swp391_8.schoolhealth.dto.StudentDTO;
import com.swp391_8.schoolhealth.service.EventService;
import com.swp391_8.schoolhealth.service.MedicationRequestService; // Use new service
import com.swp391_8.schoolhealth.service.NotificationService;
import com.swp391_8.schoolhealth.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ParentDashboardController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EventService eventService;

    @Autowired
    private MedicationRequestService medicationRequestService; // Use new service

    @Autowired // Added StudentService
    private StudentService studentService; // Added StudentService

    // Endpoint to get notifications for a parent (linked by username/user_code)
    @GetMapping("/notifications/parent/{parentUsername}")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<List<NotificationDTO>> getNotificationsForParent(
            @PathVariable String parentUsername, 
            @RequestParam(required = false) String studentCode) { // studentCode is already String
        
        System.out.println("Fetching notifications for parentUsername: " + parentUsername + (studentCode != null ? ", studentCode: " + studentCode : ""));
        // Assuming NotificationService will be updated to fetch by username or user_code
        List<NotificationDTO> notifications = notificationService.getNotificationsByParentUsernameAndStudentCode(parentUsername, studentCode);
        if (notifications.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(notifications);
    }

    // Endpoint to get events. These might be general or filtered if EventService supports it.
    // The parentId is in the path but might not be directly used if events are school-wide.
    // studentId can be used for filtering if events are targeted (e.g., by grade).
    @GetMapping("/events/parent/{parentCode}")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<List<EventDTO>> getEventsForParent(@PathVariable String parentCode, @RequestParam(required = false) String studentCode) { // Changed parentId to parentCode, studentId to studentCode
        // The EventService currently gets all upcoming events.
        // Filtering by parentCode or studentCode would require more complex logic in EventService/Repository.
        System.out.println("Fetching events for parentCode: " + parentCode + (studentCode != null ? ", studentCode: " + studentCode : ""));
        List<EventDTO> events = eventService.getUpcomingEventsForParent(parentCode, studentCode); // MODIFIED HERE to call the new service method
        if (events.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(events);
    }

    // Endpoint to get medication submission summaries for a specific student of the parent.
    // studentId is crucial here.
    @GetMapping("/medication-requests/summary/student/{studentCode}") // Changed path and from studentId to studentCode
    @PreAuthorize("hasAuthority('Parent')")
    // Ensure that the security context or service layer checks if the authenticated parent can view this studentCode
    public ResponseEntity<List<MedicationRequestResponseDTO>> getMedicationSummaryForStudent(@PathVariable String studentCode, Authentication authentication) { // Changed from Long studentId to String studentCode, added Authentication
        System.out.println("Fetching medication summary for studentCode: " + studentCode);
        List<MedicationRequestResponseDTO> medicationSummaries = medicationRequestService.getMedicationRequestsByStudentCodeForParent(studentCode, authentication);

        if (medicationSummaries.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(medicationSummaries);
    }

    // New endpoint to get students for the authenticated parent
    @GetMapping("/parent/students")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<List<StudentDTO>> getStudentsForAuthenticatedParent(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String parentCode = userDetails.getUserCode(); // Changed from getUsername() to getUserCode()

        if (parentCode == null || parentCode.isEmpty()) {
            // This case should ideally not happen if user is authenticated with a valid user_code
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        }

        List<StudentDTO> students = studentService.getStudentsByParentCode(parentCode);
        if (students.isEmpty()) {
            System.out.println("No students found for parentCode: " + parentCode); // Added logging
            return ResponseEntity.noContent().build();
        }
        System.out.println("Found " + students.size() + " students for parentCode: " + parentCode); // Added logging
        return ResponseEntity.ok(students);
    }
}

