package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthEventDTO;
import com.swp391_8.schoolhealth.dto.HealthEventRequestDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.HealthEventRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthEventService {

    private final HealthEventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final StudentRepository studentRepository; // Thêm repository để truy vấn học sinh theo lớp

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
        event.setTargetGradeLevels(requestDTO.getTargetGradeLevels());
        event.setCreatedByUserId(creator.getUserId());
        event.setCreatedAt(LocalDateTime.now());

        // Save event first
        HealthEvent savedEvent = eventRepository.save(event);

        // Convert types of checkups list to comma-separated string if not null
        if (requestDTO.getTypesOfCheckups() != null && !requestDTO.getTypesOfCheckups().isEmpty()) {
            String typesOfCheckupsString = String.join(",", requestDTO.getTypesOfCheckups());
            // Note: This field might need to be added to HealthEvent entity if needed
        }

        return convertToDTO(savedEvent);
    }

    public HealthEventDTO getHealthEventById(Integer eventId) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));
        return convertToDTO(event);
    }

    public List<HealthEventDTO> getAllHealthEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HealthEventDTO updateHealthEvent(Integer eventId, HealthEventRequestDTO requestDTO) {
        HealthEvent event = eventRepository.findById(eventId)
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
        event.setTargetGradeLevels(requestDTO.getTargetGradeLevels());
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
        dto.setTargetGradeLevels(event.getTargetGradeLevels());
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
}
