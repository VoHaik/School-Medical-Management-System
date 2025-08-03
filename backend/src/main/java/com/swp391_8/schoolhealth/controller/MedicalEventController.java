package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import com.swp391_8.schoolhealth.service.MedicalEventService;
import com.swp391_8.schoolhealth.service.SecurityService; // Added for @securityService
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Medical Events", description = "Medical event management endpoints for recording, tracking and managing student medical incidents")
@SecurityRequirement(name = "Bearer Authentication")
public class MedicalEventController {

    @Autowired
    private MedicalEventService medicalEventService;

    @Autowired
    private SecurityService securityService; // Added for @securityService

    // Endpoint to get all medical events - accessible by SCHOOLNURSE or ADMIN
    @Operation(
        summary = "Get All Medical Events",
        description = "Retrieve all medical events with optional filtering by student, date range, severity, event type, and status. Accessible by School Nurses and Administrators."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Medical events retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = MedicalEventDTO.class))
            )
        ),
        @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions")
    })
    @GetMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<MedicalEventDTO>> getAllMedicalEvents(
            @Parameter(description = "Filter by student code", example = "ST001") 
            @RequestParam(required = false) String studentCode,
            @Parameter(description = "Filter by start date (YYYY-MM-DD)", example = "2024-01-01") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "Filter by end date (YYYY-MM-DD)", example = "2024-12-31") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @Parameter(description = "Filter by severity level", example = "High") 
            @RequestParam(required = false) String severity,
            @Parameter(description = "Filter by event type", example = "INJURY") 
            @RequestParam(required = false) String eventType,
            @Parameter(description = "Filter by status", example = "Open") 
            @RequestParam(required = false) String status
    ) {
        List<MedicalEventDTO> events = medicalEventService.getAllMedicalEvents(studentCode, startDate, endDate, severity, eventType, status);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("@securityService.isParentOfStudentByCode(authentication, #studentCode) or hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<MedicalEventDTO>> getMedicalEventsForStudent(@PathVariable String studentCode) {
        List<MedicalEventDTO> events = medicalEventService.getMedicalEventsByStudentStudentCode(studentCode);
        return ResponseEntity.ok(events);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<MedicalEventDTO> createMedicalEvent(@RequestBody MedicalEventDTO medicalEventDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String creatorUsername = userDetails.getUsername();
        MedicalEventDTO createdEvent = medicalEventService.createMedicalEvent(medicalEventDTO, creatorUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<MedicalEventDTO> updateMedicalEvent(@PathVariable Integer eventId, @RequestBody MedicalEventDTO medicalEventDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String updaterUsername = userDetails.getUsername();
        MedicalEventDTO updatedEvent = medicalEventService.updateMedicalEvent(eventId, medicalEventDTO, updaterUsername);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Void> deleteMedicalEvent(@PathVariable Integer eventId) {
        medicalEventService.deleteMedicalEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}

