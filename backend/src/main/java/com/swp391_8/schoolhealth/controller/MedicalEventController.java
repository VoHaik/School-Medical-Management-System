package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import com.swp391_8.schoolhealth.service.MedicalEventService;
import com.swp391_8.schoolhealth.service.SecurityService; // Added for @securityService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate; // Import LocalDate
import org.springframework.format.annotation.DateTimeFormat; // Import DateTimeFormat

@RestController
@RequestMapping("/api/medical-events")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MedicalEventController {

    @Autowired
    private MedicalEventService medicalEventService;

    @Autowired
    private SecurityService securityService; // Added for @securityService

    // Endpoint to get all medical events - accessible by SCHOOLNURSE or ADMIN
    @GetMapping
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalEventDTO>> getAllMedicalEvents(
            @RequestParam(required = false) String studentCode, // Filter by student code
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, // Filter by start date
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, // Filter by end date
            @RequestParam(required = false) String severity, // Filter by severity
            @RequestParam(required = false) String eventType, // Filter by event type
            @RequestParam(required = false) String status // Filter by status
    ) {
        List<MedicalEventDTO> events = medicalEventService.getAllMedicalEvents(studentCode, startDate, endDate, severity, eventType, status);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("@securityService.isParentOfStudentByCode(authentication, #studentCode) or hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalEventDTO>> getMedicalEventsForStudent(@PathVariable String studentCode) {
        List<MedicalEventDTO> events = medicalEventService.getMedicalEventsByStudentStudentCode(studentCode);
        return ResponseEntity.ok(events);
    }

    @PostMapping
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<MedicalEventDTO> createMedicalEvent(@RequestBody MedicalEventDTO medicalEventDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String creatorUsername = userDetails.getUsername();
        MedicalEventDTO createdEvent = medicalEventService.createMedicalEvent(medicalEventDTO, creatorUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<MedicalEventDTO> updateMedicalEvent(@PathVariable Integer eventId, @RequestBody MedicalEventDTO medicalEventDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String updaterUsername = userDetails.getUsername();
        MedicalEventDTO updatedEvent = medicalEventService.updateMedicalEvent(eventId, medicalEventDTO, updaterUsername);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedicalEvent(@PathVariable Integer eventId) {
        medicalEventService.deleteMedicalEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
