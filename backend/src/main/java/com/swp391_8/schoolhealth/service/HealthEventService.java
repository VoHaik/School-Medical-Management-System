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
import com.swp391_8.schoolhealth.service.VaccinationConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        }

        // Auto-send vaccination consent requests for vaccination events
        if (savedEvent.getEventType() == HealthEvent.EventType.VACCINATION) {
            vaccinationConsentService.sendVaccinationConsentRequests(savedEvent);
        }

        // Convert types of checkups list to comma-separated string if not null
        if (requestDTO.getTypesOfCheckups() != null && !requestDTO.getTypesOfCheckups().isEmpty()) {
            String typesOfCheckupsString = String.join(",", requestDTO.getTypesOfCheckups());
            // Note: This field might need to be added to HealthEvent entity if needed
        }

        return convertToDTO(savedEvent);
    }

    public HealthEventDTO getHealthEventById(Integer eventId) {
        HealthEvent event = eventRepository.findByIdWithGradeLevels(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));
        return convertToDTO(event);
    }

    public List<HealthEventDTO> getAllHealthEvents() {
        // Use simple findAll to avoid circular reference issues
        List<HealthEvent> events = eventRepository.findAll();
        
        List<HealthEventDTO> dtos = events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return dtos;
    }

    @Transactional
    public HealthEventDTO updateHealthEvent(Integer eventId, HealthEventRequestDTO requestDTO) {
        HealthEvent event = eventRepository.findByIdWithGradeLevels(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));

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
            event.setEventType(HealthEvent.EventType.HEALTH_CHECKUP); // Default value
        }
        
        // Validate typesOfCheckups only for HEALTH_CHECKUP events
        if ("HEALTH_CHECKUP".equals(requestDTO.getEventType())) {
            if (requestDTO.getTypesOfCheckups() == null || requestDTO.getTypesOfCheckups().isEmpty()) {
                throw new IllegalArgumentException("At least one checkup type must be specified for health checkup events");
            }
        }
        
        // Update target grade levels using safe method
        if (requestDTO.getTargetGradeNames() != null && !requestDTO.getTargetGradeNames().isEmpty()) {
            updateTargetGradeLevels(event, requestDTO.getTargetGradeNames());
        }
        
        event.setUpdatedAt(LocalDateTime.now());

        HealthEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteHealthEvent(Integer eventId) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));
        eventRepository.delete(event);
    }

    @Transactional
    public HealthEventDTO updateHealthEventStatus(Integer eventId, String status) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));
        
        try {
            event.setStatus(HealthEvent.Status.valueOf(status));
        } catch (IllegalArgumentException e) {
            event.setStatus(HealthEvent.Status.SCHEDULED); // Default value
        }
        event.setUpdatedAt(LocalDateTime.now());
        
        HealthEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    private HealthEventDTO convertToDTO(HealthEvent event) {
        HealthEventDTO dto = new HealthEventDTO();
        dto.setEventId(event.getEventId());
        dto.setEventName(event.getEventName());
        dto.setEventType(event.getEventType().name()); // Convert enum to string
        dto.setDescription(event.getDescription());
        dto.setScheduledDate(event.getScheduledDate());
        dto.setLocation(event.getLocation());
        dto.setStatus(event.getStatus().name()); // Convert enum to string
        
        // Fetch target grade level IDs and names separately to avoid entity associations
        List<Object[]> gradeData = entityManager.createNativeQuery(
            "SELECT gl.grade_id, gl.grade_name FROM grade_levels gl " +
            "JOIN health_event_grade_levels hegl ON gl.grade_id = hegl.grade_id " +
            "WHERE hegl.event_id = ?")
            .setParameter(1, event.getEventId())
            .getResultList();
        
        if (!gradeData.isEmpty()) {
            List<Integer> targetGradeIds = gradeData.stream()
                    .map(row -> (Integer) row[0])
                    .collect(Collectors.toList());
            dto.setTargetGradeIds(targetGradeIds);
            
            List<String> targetGradeNames = gradeData.stream()
                    .map(row -> (String) row[1])
                    .collect(Collectors.toList());
            dto.setTargetGradeNames(targetGradeNames);
        }
        
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setCreatedByUserId(event.getCreatedByUserId());
        
        // Set creator username if available
        if (event.getCreatedByUserId() != null) {
            userRepository.findById(event.getCreatedByUserId())
                    .ifPresent(user -> dto.setCreatedByUserName(user.getUsername()));
        }
        
        return dto;
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
        
        // Clear and re-populate the collection to keep entity in sync
        event.getTargetGradeLevels().clear();
        List<GradeLevel> gradeLevels = gradeLevelRepository.findByGradeNameIn(gradeNames);
        event.getTargetGradeLevels().addAll(gradeLevels);
    }
}
