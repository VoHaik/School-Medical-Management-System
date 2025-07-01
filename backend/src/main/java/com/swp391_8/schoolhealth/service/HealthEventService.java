package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthEventDTO;
import com.swp391_8.schoolhealth.dto.HealthEventRequestDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.GradeLevel;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.HealthEventRepository;
import com.swp391_8.schoolhealth.repository.GradeLevelRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.NotificationService;
import com.swp391_8.schoolhealth.service.VaccinationConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthEventService {

    private final HealthEventRepository eventRepository;
    private final UserRepository userRepository;
    private final GradeLevelRepository gradeLevelRepository;
    private final NotificationService notificationService;
    private final StudentRepository studentRepository;
    private final EntityManager entityManager;
    private final VaccinationConsentService vaccinationConsentService;

    @Transactional
    public HealthEventDTO createHealthEvent(HealthEventRequestDTO requestDTO, String creatorUsername) {
        // Create the event first
        HealthEventDTO createdEvent = createHealthEventInternal(requestDTO, creatorUsername);
        
        // Send vaccination consents in a separate transaction if it's a vaccination event
        if ("VACCINATION".equals(requestDTO.getEventType())) {
            // Use a separate transaction to ensure grade levels are committed
            sendVaccinationConsentsForEvent(createdEvent.getEventId());
        }
        
        return createdEvent;
    }

    /**
     * Send vaccination consent requests in a separate transaction
     * This method should be called after createHealthEvent completes
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void sendVaccinationConsentsForEvent(Integer eventId) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));
                
        if (event.getEventType() == HealthEvent.EventType.VACCINATION) {
            vaccinationConsentService.sendVaccinationConsentRequests(event);
        }
    }

    private HealthEventDTO createHealthEventInternal(HealthEventRequestDTO requestDTO, String creatorUsername) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", creatorUsername));

        HealthEvent event = new HealthEvent();
        event.setEventName(requestDTO.getEventName());
        event.setDescription(requestDTO.getDescription());
        
        // Use scheduled date if provided, otherwise use startDate
        if (requestDTO.getScheduledDate() != null) {
            event.setScheduledDate(requestDTO.getScheduledDate());
        } else if (requestDTO.getStartDate() != null) {
            event.setScheduledDate(requestDTO.getStartDate());
        } else {
            throw new IllegalArgumentException("Either scheduledDate or startDate must be provided");
        }
        
        event.setLocation(requestDTO.getLocation());
        try {
            event.setEventType(HealthEvent.EventType.valueOf(requestDTO.getEventType()));
        } catch (IllegalArgumentException e) {
            event.setEventType(HealthEvent.EventType.HEALTH_CHECKUP); // Default value
        }
        event.setStatus(HealthEvent.Status.SCHEDULED); // Use enum instead of string
        
        // Validate typesOfCheckups only for HEALTH_CHECKUP events
        if ("HEALTH_CHECKUP".equals(requestDTO.getEventType())) {
            if (requestDTO.getTypesOfCheckups() == null || requestDTO.getTypesOfCheckups().isEmpty()) {
                throw new IllegalArgumentException("At least one checkup type must be specified for health checkup events");
            }
        }
        
        event.setCreatedByUserId(creator.getUserId());
        event.setCreatedAt(LocalDateTime.now());

        // Save event first to get the ID
        HealthEvent savedEvent = eventRepository.save(event);
        
        // Set target grade levels after saving (so we have an event ID)
        if (requestDTO.getTargetGradeNames() != null && !requestDTO.getTargetGradeNames().isEmpty()) {
            updateTargetGradeLevels(savedEvent, requestDTO.getTargetGradeNames());
            entityManager.refresh(savedEvent); // Ensure entity is in sync with DB after updating grade levels
            entityManager.flush(); // Force flush changes to database
        }

        return convertToDTO(savedEvent);
    }

    public HealthEventDTO getHealthEventById(Integer eventId) {
        HealthEvent event = eventRepository.findByIdWithGradeLevels(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));
        return convertToDTO(event);
    }

    public List<HealthEventDTO> getAllHealthEvents() {
        List<HealthEvent> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HealthEventDTO updateHealthEvent(Integer eventId, HealthEventRequestDTO requestDTO, String updaterUsername) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));

        User updater = userRepository.findByUsername(updaterUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", updaterUsername));

        // Update basic fields
        event.setEventName(requestDTO.getEventName());
        event.setDescription(requestDTO.getDescription());
        
        // Use scheduled date if provided, otherwise use startDate
        if (requestDTO.getScheduledDate() != null) {
            event.setScheduledDate(requestDTO.getScheduledDate());
        } else if (requestDTO.getStartDate() != null) {
            event.setScheduledDate(requestDTO.getStartDate());
        }
        
        event.setLocation(requestDTO.getLocation());
        
        try {
            event.setEventType(HealthEvent.EventType.valueOf(requestDTO.getEventType()));
        } catch (IllegalArgumentException e) {
            // Keep existing event type if invalid value provided
        }

        event.setUpdatedByUserId(updater.getUserId());
        event.setUpdatedAt(LocalDateTime.now());

        // Update target grade levels
        if (requestDTO.getTargetGradeNames() != null) {
            updateTargetGradeLevels(event, requestDTO.getTargetGradeNames());
            entityManager.refresh(event); // Refresh entity after updating relationships
        }

        HealthEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteHealthEvent(Integer eventId) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));

        // TODO: Add validation to prevent deletion of events with associated records
        eventRepository.delete(event);
    }

    @Transactional
    public HealthEventDTO updateHealthEventStatus(Integer eventId, String status) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));

        // Convert string to Status enum
        try {
            event.setStatus(HealthEvent.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid values are: " + 
                java.util.Arrays.toString(HealthEvent.Status.values()));
        }
        event.setUpdatedAt(LocalDateTime.now());
        
        HealthEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public List<HealthEventDTO> getHealthEventsByType(HealthEvent.EventType eventType) {
        List<HealthEvent> events = eventRepository.findByEventType(eventType);
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HealthEventDTO> getUpcomingHealthEvents() {
        List<HealthEvent> events = eventRepository.findAll();
        return events.stream()
                .filter(event -> event.getScheduledDate().isAfter(LocalDateTime.now().toLocalDate()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HealthEventDTO> getHealthEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<HealthEvent> events = eventRepository.findAll();
        return events.stream()
                .filter(event -> {
                    LocalDateTime eventDateTime = event.getScheduledDate().atStartOfDay();
                    return !eventDateTime.isBefore(startDate) && !eventDateTime.isAfter(endDate);
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Utility method to safely update target grade levels
    private void updateTargetGradeLevels(HealthEvent event, List<String> gradeNames) {
        // Ensure event has been saved and has an ID
        if (event.getEventId() == null) {
            throw new IllegalStateException("Event must be saved before updating target grade levels");
        }
        
        // Delete existing relationships using native query
        entityManager.createNativeQuery("DELETE FROM health_event_grade_levels WHERE event_id = ?")
                .setParameter(1, event.getEventId())
                .executeUpdate();
        
        // Insert new relationships using native query
        for (String gradeName : gradeNames) {
            GradeLevel gradeLevel = gradeLevelRepository.findByGradeName(gradeName)
                    .orElseThrow(() -> new ResourceNotFoundException("GradeLevel", "gradeName", gradeName));
            
            entityManager.createNativeQuery("INSERT INTO health_event_grade_levels (event_id, grade_id) VALUES (?, ?)")
                    .setParameter(1, event.getEventId())
                    .setParameter(2, gradeLevel.getGradeId())
                    .executeUpdate();
        }
        
        // Note: We don't need to update the entity collection here since we're using native queries
        // The relationship will be correctly reflected when the entity is next loaded from database
    }

    private HealthEventDTO convertToDTO(HealthEvent event) {
        HealthEventDTO dto = new HealthEventDTO();
        dto.setEventId(event.getEventId());
        dto.setEventName(event.getEventName());
        dto.setEventType(event.getEventType().name());
        dto.setDescription(event.getDescription());
        dto.setScheduledDate(event.getScheduledDate());
        dto.setLocation(event.getLocation());
        dto.setStatus(event.getStatus().name());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());

        // Get target grade levels using custom query to avoid lazy loading issues
        @SuppressWarnings("unchecked")
        List<Object[]> gradeData = entityManager.createNativeQuery(
            "SELECT gl.grade_id, gl.grade_name FROM grade_levels gl " +
            "JOIN health_event_grade_levels hegl ON gl.grade_id = hegl.grade_id " +
            "WHERE hegl.event_id = ?")
            .setParameter(1, event.getEventId())
            .getResultList();

        List<String> targetGradeNames = gradeData.stream()
                .map(row -> (String) row[1])
                .collect(Collectors.toList());

        dto.setTargetGradeNames(targetGradeNames);

        // Get creator name
        if (event.getCreatedByUserId() != null) {
            userRepository.findById(event.getCreatedByUserId())
                    .ifPresent(user -> {
                        // Set creator info if DTO has this field
                        // dto.setCreatedByUsername(user.getUsername());
                    });
        }
        
        return dto;
    }
}
