package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.VaccinationEventDTO;
import com.swp391_8.schoolhealth.dto.VaccinationEventRequestDTO;
import com.swp391_8.schoolhealth.service.VaccinationEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination-events")
public class VaccinationEventController {

    @Autowired
    private VaccinationEventService eventService;

    // Endpoint for nurse/admin to create a new vaccination event
    @PostMapping
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<VaccinationEventDTO> createVaccinationEvent(@RequestBody VaccinationEventRequestDTO requestDTO) {
        VaccinationEventDTO createdEvent = eventService.createVaccinationEvent(requestDTO);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    // Endpoint for anyone (parents, nurses, admins) to view all vaccination events
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VaccinationEventDTO>> getAllVaccinationEvents() {
        List<VaccinationEventDTO> events = eventService.getAllVaccinationEvents();
        return ResponseEntity.ok(events);
    }

    // Endpoint to get a specific vaccination event by ID
    @GetMapping("/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VaccinationEventDTO> getVaccinationEventById(@PathVariable Integer eventId) { // Changed String to Integer
        VaccinationEventDTO event = eventService.getVaccinationEventById(eventId);
        return ResponseEntity.ok(event);
    }

    // Endpoint for nurse/admin to update a vaccination event
    @PutMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<VaccinationEventDTO> updateVaccinationEvent(
            @PathVariable Integer eventId, // Changed String to Integer
            @RequestBody VaccinationEventRequestDTO requestDTO) {
        VaccinationEventDTO updatedEvent = eventService.updateVaccinationEvent(eventId, requestDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    // Endpoint for nurse/admin to update the status of an event (e.g., PLANNED -> ONGOING -> COMPLETED)
    @PatchMapping("/{eventId}/status")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<VaccinationEventDTO> updateEventStatus(
            @PathVariable Integer eventId, // Changed String to Integer
            @RequestParam String status) {
        VaccinationEventDTO updatedEvent = eventService.updateEventStatus(eventId, status);
        return ResponseEntity.ok(updatedEvent);
    }

    // Endpoint for nurse/admin to delete a vaccination event (use with caution)
    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')") // Or NURSE if they should also be able to delete
    public ResponseEntity<Void> deleteVaccinationEvent(@PathVariable Integer eventId) { // Changed String to Integer
        eventService.deleteVaccinationEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to find events by status
    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VaccinationEventDTO>> findEventsByStatus(@PathVariable String status) {
        List<VaccinationEventDTO> events = eventService.findEventsByStatus(status);
        return ResponseEntity.ok(events);
    }

    // Endpoint to find events by vaccine ID
    @GetMapping("/vaccine/{vaccineId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VaccinationEventDTO>> findEventsByVaccine(@PathVariable Integer vaccineId) { // Changed String to Integer
        List<VaccinationEventDTO> events = eventService.findEventsByVaccine(vaccineId);
        return ResponseEntity.ok(events);
    }

    /*
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            // Assuming your UserDetails implementation has a getUserId() method or similar
            // Or cast to your custom UserPrincipal class that holds the ID
            // For example: return ((YourUserPrincipal) authentication.getPrincipal()).getId();
            return authentication.getName(); // Often the username, might need to fetch User object for ID
        }
        throw new IllegalStateException("User not authenticated or UserDetails not available.");
    }
    */
}
