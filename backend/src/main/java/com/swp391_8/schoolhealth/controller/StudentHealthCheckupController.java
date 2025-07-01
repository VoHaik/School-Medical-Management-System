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
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<StudentHealthCheckupDTO> createStudentHealthCheckup( // Renamed method
            @Valid @RequestBody StudentHealthCheckupRequestDTO requestDTO,
            Authentication authentication) {
        // Pass Authentication object directly
        StudentHealthCheckupDTO recordedCheckup = checkupService.createStudentHealthCheckup(requestDTO, authentication);
        return new ResponseEntity<>(recordedCheckup, HttpStatus.CREATED);
    }

    @GetMapping("/{checkupResultId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('Parent') or hasAuthority('Student')") // Parent/Student access might need further checks
    public ResponseEntity<StudentHealthCheckupDTO> getStudentHealthCheckupById(@PathVariable Integer checkupResultId) {
        // Add logic here to ensure parent/student can only access their own/their child's records
        StudentHealthCheckupDTO checkupDTO = checkupService.getStudentHealthCheckupById(checkupResultId);
        return ResponseEntity.ok(checkupDTO);
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('Parent') or hasAuthority('Student')") // Parent/Student access might need further checks
    public ResponseEntity<List<StudentHealthCheckupDTO>> getCheckupsByStudentCode(@PathVariable String studentCode) {
        // Add logic here to ensure parent/student can only access their own/their child's records
        List<StudentHealthCheckupDTO> checkups = checkupService.getCheckupsByStudentCode(studentCode);
        return ResponseEntity.ok(checkups);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')") // Typically for nurse/admin to see all results for an event
    public ResponseEntity<List<StudentHealthCheckupDTO>> getCheckupsByEventId(@PathVariable Integer eventId) {
        List<StudentHealthCheckupDTO> checkups = checkupService.getCheckupsByEventId(eventId);
        return ResponseEntity.ok(checkups);
    }
    
    @PatchMapping("/{checkupResultId}/consent")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('Parent')")
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
    
    @PutMapping("/{checkupResultId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<StudentHealthCheckupDTO> updateStudentHealthCheckup(
            @PathVariable Integer checkupResultId,
            @Valid @RequestBody StudentHealthCheckupRequestDTO requestDTO,
            Authentication authentication) {
        StudentHealthCheckupDTO updatedCheckup = checkupService.updateStudentHealthCheckup(checkupResultId, requestDTO, authentication);
        return ResponseEntity.ok(updatedCheckup);
    }
    
    @DeleteMapping("/{checkupResultId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Void> deleteStudentHealthCheckup(
            @PathVariable Integer checkupResultId,
            Authentication authentication) {
        checkupService.deleteStudentHealthCheckup(checkupResultId, authentication);
        return ResponseEntity.noContent().build();
    }
}
