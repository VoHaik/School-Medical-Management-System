package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.VaccinationEventDTO;
import com.swp391_8.schoolhealth.dto.VaccinationEventRequestDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Vaccine;
import com.swp391_8.schoolhealth.model.VaccinationEvent;
import com.swp391_8.schoolhealth.model.VaccinationEvent.EventStatus;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.VaccineRepository;
import com.swp391_8.schoolhealth.repository.VaccinationEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VaccinationEventService {

    @Autowired
    private VaccinationEventRepository eventRepository;

    @Autowired
    private VaccineRepository vaccineRepository;

    @Autowired
    private UserRepository userRepository;

    private VaccinationEventDTO convertToDTO(VaccinationEvent event) {
        if (event == null) return null;
        VaccinationEventDTO dto = new VaccinationEventDTO();
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setDescription(event.getDescription());
        dto.setScheduledDateStart(event.getScheduledDateStart());
        dto.setScheduledDateEnd(event.getScheduledDateEnd());
        dto.setLocation(event.getLocation());
        if (event.getStatus() != null) {
            dto.setStatus(event.getStatus().name());
        }
        if (event.getVaccine() != null) {
            dto.setVaccineId(event.getVaccine().getVaccineId());
            dto.setVaccineName(event.getVaccine().getName());
        }
        if (event.getCoordinator() != null) {
            dto.setCoordinatorId(event.getCoordinator().getUserId());
            dto.setCoordinatorName(event.getCoordinator().getFullName());
        }
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        return dto;
    }

    @Transactional
    public VaccinationEventDTO createVaccinationEvent(VaccinationEventRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User coordinator = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Vaccine vaccine = vaccineRepository.findById(requestDTO.getVaccineId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + requestDTO.getVaccineId()));

        VaccinationEvent event = new VaccinationEvent();
        event.setEventName(requestDTO.getEventName());
        event.setDescription(requestDTO.getDescription());
        event.setScheduledDateStart(requestDTO.getScheduledDateStart());
        event.setScheduledDateEnd(requestDTO.getScheduledDateEnd());
        event.setLocation(requestDTO.getLocation());
        event.setVaccine(vaccine);
        event.setCoordinator(coordinator);
        if (requestDTO.getStatus() != null) {
            try {
                event.setStatus(EventStatus.valueOf(requestDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid event status: " + requestDTO.getStatus());
            }
        } else {
            event.setStatus(EventStatus.PLANNED);
        }

        VaccinationEvent savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    @Transactional(readOnly = true)
    public List<VaccinationEventDTO> getAllVaccinationEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VaccinationEventDTO getVaccinationEventById(Integer eventId) {
        VaccinationEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination Event not found with ID: " + eventId));
        return convertToDTO(event);
    }

    @Transactional
    public VaccinationEventDTO updateVaccinationEvent(Integer eventId, VaccinationEventRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // String currentUsername = authentication.getName(); // Not strictly needed if not checking coordinator
        // User updater = userRepository.findByUsername(currentUsername)
        //         .orElseThrow(() -> new ResourceNotFoundException(\"User not found: \" + currentUsername));

        VaccinationEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination Event not found with ID: " + eventId));
        
        Vaccine vaccine = vaccineRepository.findById(requestDTO.getVaccineId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + requestDTO.getVaccineId()));

        event.setEventName(requestDTO.getEventName());
        event.setDescription(requestDTO.getDescription());
        event.setScheduledDateStart(requestDTO.getScheduledDateStart());
        event.setScheduledDateEnd(requestDTO.getScheduledDateEnd());
        event.setLocation(requestDTO.getLocation());
        event.setVaccine(vaccine);
        // Coordinator is not updated here, assuming it's set at creation or managed separately

        if (requestDTO.getStatus() != null) {
            try {
                event.setStatus(EventStatus.valueOf(requestDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid event status: " + requestDTO.getStatus());
            }
        }

        VaccinationEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public VaccinationEventDTO updateEventStatus(Integer eventId, String status) {
        VaccinationEvent event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Vaccination Event not found with ID: " + eventId));
        
        try {
            event.setStatus(EventStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid event status: " + status);
        }
        
        VaccinationEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteVaccinationEvent(Integer eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Vaccination Event not found with ID: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    @Transactional(readOnly = true)
    public List<VaccinationEventDTO> findEventsByStatus(String status) {
        try {
            EventStatus eventStatus = EventStatus.valueOf(status.toUpperCase());
            return eventRepository.findByStatus(eventStatus).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid event status provided: " + status);
        }
    }

    @Transactional(readOnly = true)
    public List<VaccinationEventDTO> findEventsByVaccine(Integer vaccineId) {
        Vaccine vaccine = vaccineRepository.findById(vaccineId)
            .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + vaccineId));
        return eventRepository.findByVaccine(vaccine).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}
