package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthCheckupEventDTO;
import com.swp391_8.schoolhealth.dto.HealthCheckupEventRequestDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthCheckupEvent;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.HealthCheckupEventRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthCheckupEventService {

    private final HealthCheckupEventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public HealthCheckupEventDTO createHealthCheckupEvent(HealthCheckupEventRequestDTO requestDTO, String creatorUsername) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", creatorUsername));

        HealthCheckupEvent event = new HealthCheckupEvent();
        event.setEventName(requestDTO.getEventName());
        event.setDescription(requestDTO.getDescription());
        event.setScheduledDate(requestDTO.getScheduledDate());
        event.setLocation(requestDTO.getLocation());
        event.setTypesOfCheckups(requestDTO.getTypesOfCheckups());
        event.setTargetGradeLevels(requestDTO.getTargetGradeLevels());
        event.setCreatedBy(creator);
        // Default status is PLANNED, set in entity

        HealthCheckupEvent savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    @Transactional(readOnly = true)
    public HealthCheckupEventDTO getHealthCheckupEventById(Integer eventId) {
        HealthCheckupEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthCheckupEvent", "id", eventId));
        return convertToDTO(event);
    }

    @Transactional(readOnly = true)
    public List<HealthCheckupEventDTO> getAllHealthCheckupEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HealthCheckupEventDTO updateHealthCheckupEvent(Integer eventId, HealthCheckupEventRequestDTO requestDTO) {
        HealthCheckupEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthCheckupEvent", "id", eventId));

        event.setEventName(requestDTO.getEventName());
        event.setDescription(requestDTO.getDescription());
        event.setScheduledDate(requestDTO.getScheduledDate());
        event.setLocation(requestDTO.getLocation());
        event.setTypesOfCheckups(requestDTO.getTypesOfCheckups());
        event.setTargetGradeLevels(requestDTO.getTargetGradeLevels());
        // Note: Creator and creation date are not updated. Status updates might need a separate method.

        HealthCheckupEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }
    
    @Transactional
    public HealthCheckupEventDTO updateHealthCheckupEventStatus(Integer eventId, String status) {
        HealthCheckupEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthCheckupEvent", "id", eventId));
        try {
            event.setStatus(HealthCheckupEvent.EventStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid event status: " + status);
        }
        HealthCheckupEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteHealthCheckupEvent(Integer eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("HealthCheckupEvent", "id", eventId);
        }
        // Consider implications: what if there are already student checkups linked to this event?
        // Add logic here to prevent deletion or handle linked entities if necessary.
        eventRepository.deleteById(eventId);
    }

    private HealthCheckupEventDTO convertToDTO(HealthCheckupEvent event) {
        HealthCheckupEventDTO dto = new HealthCheckupEventDTO();
        dto.setEventId(event.getEventId());
        dto.setEventName(event.getEventName());
        dto.setDescription(event.getDescription());
        dto.setScheduledDate(event.getScheduledDate());
        dto.setLocation(event.getLocation());
        dto.setStatus(event.getStatus() != null ? event.getStatus().name() : null);
        dto.setTypesOfCheckups(event.getTypesOfCheckups());
        dto.setTargetGradeLevels(event.getTargetGradeLevels());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        if (event.getCreatedBy() != null) {
            dto.setCreatedByUserId(event.getCreatedBy().getUserId());
            dto.setCreatedByUserName(event.getCreatedBy().getUsername()); // Or FullName if available
        }
        return dto;
    }
}
