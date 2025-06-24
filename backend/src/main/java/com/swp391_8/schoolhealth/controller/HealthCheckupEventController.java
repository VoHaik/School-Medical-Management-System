package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthCheckupEventDTO;
import com.swp391_8.schoolhealth.dto.HealthCheckupEventRequestDTO;
import com.swp391_8.schoolhealth.service.HealthCheckupEventService;
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
@RequestMapping("/api/health-checkup-events")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('NURSE', 'ADMIN')") // Only nurses and admins can manage events
public class HealthCheckupEventController {

    private final HealthCheckupEventService eventService;

    @PostMapping
    public ResponseEntity<HealthCheckupEventDTO> createHealthCheckupEvent(
            @Valid @RequestBody HealthCheckupEventRequestDTO requestDTO,
            Authentication authentication) {
        String username = authentication.getName();
        HealthCheckupEventDTO createdEvent = eventService.createHealthCheckupEvent(requestDTO, username);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN', 'PARENT', 'STUDENT')") // Allow broader access for viewing specific event
    public ResponseEntity<HealthCheckupEventDTO> getHealthCheckupEventById(@PathVariable Integer eventId) {
        HealthCheckupEventDTO eventDTO = eventService.getHealthCheckupEventById(eventId);
        return ResponseEntity.ok(eventDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN', 'PARENT', 'STUDENT')") // Allow broader access for viewing all events
    public ResponseEntity<List<HealthCheckupEventDTO>> getAllHealthCheckupEvents() {
        List<HealthCheckupEventDTO> events = eventService.getAllHealthCheckupEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<HealthCheckupEventDTO> updateHealthCheckupEvent(
            @PathVariable Integer eventId,
            @Valid @RequestBody HealthCheckupEventRequestDTO requestDTO) {
        HealthCheckupEventDTO updatedEvent = eventService.updateHealthCheckupEvent(eventId, requestDTO);
        return ResponseEntity.ok(updatedEvent);
    }
    
    @PatchMapping("/{eventId}/status")
    public ResponseEntity<HealthCheckupEventDTO> updateHealthCheckupEventStatus(
            @PathVariable Integer eventId,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Or a custom error DTO
        }
        HealthCheckupEventDTO updatedEvent = eventService.updateHealthCheckupEventStatus(eventId, status);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasAuthority('Admin')") // Only admins can delete events
    public ResponseEntity<Void> deleteHealthCheckupEvent(@PathVariable Integer eventId) {
        eventService.deleteHealthCheckupEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}

