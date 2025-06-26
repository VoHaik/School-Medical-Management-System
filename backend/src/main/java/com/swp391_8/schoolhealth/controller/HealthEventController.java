package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthEventDTO;
import com.swp391_8.schoolhealth.dto.HealthEventRequestDTO;
import com.swp391_8.schoolhealth.service.HealthEventService;
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
@RequestMapping("/api/health-events")
@RequiredArgsConstructor
// Fix class-level annotation to match actual roles: ROLE_SCHOOLNURSE and ROLE_ADMIN
@PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN') or hasAnyAuthority('ROLE_SCHOOLNURSE', 'ROLE_ADMIN', 'SchoolNurse', 'Admin')")
public class HealthEventController {

    private final HealthEventService eventService;

    @PostMapping
    public ResponseEntity<HealthEventDTO> createHealthEvent(
            @Valid @RequestBody HealthEventRequestDTO requestDTO,
            Authentication authentication) {
        String username = authentication.getName();
        HealthEventDTO createdEvent = eventService.createHealthEvent(requestDTO, username);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN', 'PARENT', 'STUDENT') or hasAnyAuthority('ROLE_SCHOOLNURSE', 'ROLE_ADMIN', 'ROLE_PARENT', 'ROLE_STUDENT', 'SchoolNurse', 'Admin', 'Parent', 'Student')") // Allow broader access for viewing specific event
    public ResponseEntity<HealthEventDTO> getHealthEventById(@PathVariable Integer eventId) {
        HealthEventDTO eventDTO = eventService.getHealthEventById(eventId);
        return ResponseEntity.ok(eventDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN', 'PARENT', 'STUDENT') or hasAnyAuthority('ROLE_SCHOOLNURSE', 'ROLE_ADMIN', 'ROLE_PARENT', 'ROLE_STUDENT', 'SchoolNurse', 'Admin', 'Parent', 'Student')") // Allow broader access for viewing all events
    public ResponseEntity<List<HealthEventDTO>> getAllHealthEvents() {
        List<HealthEventDTO> events = eventService.getAllHealthEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<HealthEventDTO> updateHealthEvent(
            @PathVariable Integer eventId,
            @Valid @RequestBody HealthEventRequestDTO requestDTO) {
        HealthEventDTO updatedEvent = eventService.updateHealthEvent(eventId, requestDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteHealthEvent(@PathVariable Integer eventId) {
        eventService.deleteHealthEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{eventId}/status")
    public ResponseEntity<HealthEventDTO> updateHealthEventStatus(
            @PathVariable Integer eventId,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        HealthEventDTO updatedEvent = eventService.updateHealthEventStatus(eventId, status);
        return ResponseEntity.ok(updatedEvent);
    }
}
