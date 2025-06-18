package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.StudentHealthCheckupDTO;
import com.swp391_8.schoolhealth.dto.StudentHealthCheckupRequestDTO;
import com.swp391_8.schoolhealth.model.StudentHealthCheckup;
import com.swp391_8.schoolhealth.service.StudentHealthCheckupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-health-checkups")
@RequiredArgsConstructor
public class StudentHealthCheckupController {

    private final StudentHealthCheckupService checkupService;

    @PostMapping
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<StudentHealthCheckupDTO> createStudentHealthCheckup( // Renamed method
            @Valid @RequestBody StudentHealthCheckupRequestDTO requestDTO,
            Authentication authentication) {
        // Pass Authentication object directly
        StudentHealthCheckupDTO recordedCheckup = checkupService.createStudentHealthCheckup(requestDTO, authentication);
        return new ResponseEntity<>(recordedCheckup, HttpStatus.CREATED);
    }

    @GetMapping("/{checkupResultId}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN', 'PARENT', 'STUDENT')") // Parent/Student access might need further checks
    public ResponseEntity<StudentHealthCheckupDTO> getStudentHealthCheckupById(@PathVariable Integer checkupResultId) {
        // Add logic here to ensure parent/student can only access their own/their child's records
        StudentHealthCheckupDTO checkupDTO = checkupService.getStudentHealthCheckupById(checkupResultId);
        return ResponseEntity.ok(checkupDTO);
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN', 'PARENT', 'STUDENT')") // Parent/Student access might need further checks
    public ResponseEntity<List<StudentHealthCheckupDTO>> getCheckupsByStudentCode(@PathVariable String studentCode) {
        // Add logic here to ensure parent/student can only access their own/their child's records
        List<StudentHealthCheckupDTO> checkups = checkupService.getCheckupsByStudentCode(studentCode);
        return ResponseEntity.ok(checkups);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')") // Typically for nurse/admin to see all results for an event
    public ResponseEntity<List<StudentHealthCheckupDTO>> getCheckupsByEventId(@PathVariable Integer eventId) {
        List<StudentHealthCheckupDTO> checkups = checkupService.getCheckupsByEventId(eventId);
        return ResponseEntity.ok(checkups);
    }
    
    @PatchMapping("/{checkupResultId}/consent")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN', 'PARENT')")
    public ResponseEntity<StudentHealthCheckupDTO> recordParentConsent( // Renamed method and adjusted parameters
            @PathVariable Integer checkupResultId,
            @RequestBody Map<String, Object> consentUpdate, // Changed to Map<String, Object> for flexibility
            Authentication authentication) {
        
        Boolean consentGiven = (Boolean) consentUpdate.get("consent");
        String notes = (String) consentUpdate.get("notes");

        if (consentGiven == null) {
            return ResponseEntity.badRequest().body(null); 
        }
        
        // The service method recordParentConsent handles security and parent verification
        StudentHealthCheckupDTO updatedCheckup = checkupService.recordParentConsent(checkupResultId, consentGiven, notes, authentication);
        return ResponseEntity.ok(updatedCheckup);
    }
    
    // This endpoint seems redundant if /api/student-health-checkups/{checkupResultId}/consent is used by parents.
    // If it's specifically for a nurse/admin to link consent to an event and student directly,
    // the service method needs to support this distinct flow.
    // For now, commenting out to avoid conflict with recordParentConsent which is more aligned with current service implementation.
    /*
    @PostMapping("/event/{eventId}/student/{studentCode}/consent") 
    @PreAuthorize("hasAnyRole('PARENT', 'NURSE', 'ADMIN')")
    public ResponseEntity<StudentHealthCheckupDTO> recordEventStudentConsent( // Renamed to avoid conflict
            @PathVariable Integer eventId,
            @PathVariable String studentCode, 
            @RequestBody Map<String, Boolean> consentPayload,
            Authentication authentication) {        
        Boolean consent = consentPayload.get("consent");
        if (consent == null) {
            return ResponseEntity.badRequest().build();
        }
        // This would require a different service method like:
        // StudentHealthCheckupDTO updatedCheckup = checkupService.recordConsentForEventByStudent(eventId, studentCode, consent, authentication);
        // For now, let's assume the primary way to record consent is via the checkupResultId path.
        // StudentHealthCheckupDTO updatedCheckup = checkupService.recordConsent(studentCode, eventId, consent); // This call was problematic
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(null); // Placeholder
    }
    */

    // Add PUT for full update if needed, though POST can handle create/update based on existence.
    // Add DELETE if individual checkup results can be deleted (consider implications).
}
