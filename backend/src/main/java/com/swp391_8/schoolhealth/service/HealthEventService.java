package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthEventDTO;
import com.swp391_8.schoolhealth.dto.HealthEventRequestDTO;
import com.swp391_8.schoolhealth.dto.VaccinationConsentDetailDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.HealthEventType;
import com.swp391_8.schoolhealth.model.HealthCheckupType;
import com.swp391_8.schoolhealth.model.GradeLevel;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.HealthEventRepository;
import com.swp391_8.schoolhealth.repository.HealthEventTypeRepository;
import com.swp391_8.schoolhealth.repository.HealthCheckupTypeRepository;
import com.swp391_8.schoolhealth.repository.GradeLevelRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.VaccinationConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthEventService {

    private final HealthEventRepository eventRepository;
    private final HealthEventTypeRepository healthEventTypeRepository;
    private final HealthCheckupTypeRepository healthCheckupTypeRepository;
    private final UserRepository userRepository;
    private final GradeLevelRepository gradeLevelRepository;
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
        
        // Validate typesOfCheckups only for HEALTH_CHECKUP events - remove strict validation for now
        // Note: We'll create checkup types associations if provided, but don't require them
        
        // Validate selectedVaccines for VACCINATION events
        if ("VACCINATION".equals(requestDTO.getEventType())) {
            if (requestDTO.getSelectedVaccines() == null || requestDTO.getSelectedVaccines().isEmpty()) {
                throw new IllegalArgumentException("At least one vaccine must be selected for vaccination events");
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
        
        // Create health_event_vaccines for VACCINATION events
        if ("VACCINATION".equals(requestDTO.getEventType()) && 
            requestDTO.getSelectedVaccines() != null && !requestDTO.getSelectedVaccines().isEmpty()) {
            createHealthEventVaccines(savedEvent, requestDTO.getSelectedVaccines());
            entityManager.refresh(savedEvent); // Refresh to include vaccines
            entityManager.flush();
        }
        
        // Create health_event_types entries for HEALTH_CHECKUP events
        if ("HEALTH_CHECKUP".equals(requestDTO.getEventType())) {
            if (requestDTO.getTypesOfCheckups() != null && !requestDTO.getTypesOfCheckups().isEmpty()) {
                createHealthEventCheckupTypes(savedEvent, requestDTO.getTypesOfCheckups());
                entityManager.refresh(savedEvent); // Refresh to include checkup types
                entityManager.flush();
            }
        }

        return convertToDTO(savedEvent);
    }

    public HealthEventDTO getHealthEventById(Integer eventId) {
        HealthEvent event = eventRepository.findByIdWithGradeLevelsAndVaccines(eventId)
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
        
        // Update status if provided
        if (requestDTO.getStatus() != null) {
            try {
                event.setStatus(HealthEvent.Status.valueOf(requestDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + requestDTO.getStatus() + ". Valid values are: " + 
                    java.util.Arrays.toString(HealthEvent.Status.values()));
            }
        }
        
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
        }

        // Update vaccines for VACCINATION events
        if (event.getEventType() == HealthEvent.EventType.VACCINATION) {
            // Validate selectedVaccines for VACCINATION events
            if (requestDTO.getSelectedVaccines() == null || requestDTO.getSelectedVaccines().isEmpty()) {
                throw new IllegalArgumentException("At least one vaccine must be selected for vaccination events");
            }
            updateHealthEventVaccines(event, requestDTO.getSelectedVaccines());
        }
        
        // Update checkup types for HEALTH_CHECKUP events
        if (event.getEventType() == HealthEvent.EventType.HEALTH_CHECKUP) {
            // Validate typesOfCheckups for HEALTH_CHECKUP events
            if (requestDTO.getTypesOfCheckups() == null || requestDTO.getTypesOfCheckups().isEmpty()) {
                throw new IllegalArgumentException("At least one checkup type must be specified for health checkup events");
            }
            updateHealthEventCheckupTypes(event, requestDTO.getTypesOfCheckups());
        }

        HealthEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteHealthEvent(Integer eventId) {
        HealthEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent", "eventId", eventId));

        try {
            // Delete associated vaccination consents first (using HealthEvent relationship)
            entityManager.createQuery("DELETE FROM VaccinationConsent vc WHERE vc.healthEvent.eventId = :eventId")
                    .setParameter("eventId", eventId)
                    .executeUpdate();

            // Delete associated health event vaccines (using HealthEvent relationship)
            entityManager.createQuery("DELETE FROM HealthEventVaccine hev WHERE hev.healthEvent.eventId = :eventId")
                    .setParameter("eventId", eventId)
                    .executeUpdate();

            // Delete associated health event checkup types using repository method
            healthEventTypeRepository.deleteByEventId(eventId);

            // Delete associated health event grade levels (using native query due to table structure)
            entityManager.createNativeQuery("DELETE FROM health_event_grade_levels WHERE event_id = ?")
                    .setParameter(1, eventId)
                    .executeUpdate();

            // Delete associated student health checkups (if using eventId field)
            entityManager.createNativeQuery("DELETE FROM health_events WHERE event_id = ?")
                    .setParameter(1, eventId)
                    .executeUpdate();

            // Delete associated student vaccination records
            entityManager.createNativeQuery("DELETE FROM student_vaccination_records WHERE event_id = ?")
                    .setParameter(1, eventId)
                    .executeUpdate();

            // Finally delete the event itself
            eventRepository.delete(event);
            
            System.out.println("Successfully deleted health event with ID: " + eventId + " and all associated records");
            
        } catch (Exception e) {
            System.err.println("Error deleting health event with ID: " + eventId + " - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete health event. Error: " + e.getMessage(), e);
        }
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
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
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

        List<Integer> targetGradeIds = gradeData.stream()
                .map(row -> (Integer) row[0])
                .collect(Collectors.toList());

        dto.setTargetGradeNames(targetGradeNames);
        dto.setTargetGradeIds(targetGradeIds);

        // Get checkup types for health checkup events
        if ("HEALTH_CHECKUP".equals(event.getEventType().name())) {
            try {
                @SuppressWarnings("unchecked")
                List<String> checkupTypes = entityManager.createNativeQuery(
                    "SELECT hct.type_name FROM health_event_types het " +
                    "JOIN health_checkup_types hct ON het.checkup_type_id = hct.checkup_type_id " +
                    "WHERE het.event_id = ? ORDER BY het.sequence_order, hct.type_name")
                    .setParameter(1, event.getEventId())
                    .getResultList();
                
                dto.setTypesOfCheckups(checkupTypes);
            } catch (Exception e) {
                // If junction table doesn't exist or query fails, set empty list
                dto.setTypesOfCheckups(new ArrayList<>());
            }
        }

        // Get vaccines for vaccination events
        if ("VACCINATION".equals(event.getEventType().name())) {
            @SuppressWarnings("unchecked")
            List<Object[]> vaccineData = entityManager.createNativeQuery(
                "SELECT v.vaccine_id, v.vaccine_name FROM vaccines v " +
                "JOIN health_event_vaccines hev ON v.vaccine_id = hev.vaccine_id " +
                "WHERE hev.event_id = ?")
                .setParameter(1, event.getEventId())
                .getResultList();
            
            List<String> vaccineNames = vaccineData.stream()
                .map(row -> (String) row[1])
                .collect(Collectors.toList());
            
            List<Integer> selectedVaccines = vaccineData.stream()
                .map(row -> (Integer) row[0])
                .collect(Collectors.toList());
            
            dto.setVaccineNames(vaccineNames);
            dto.setSelectedVaccines(selectedVaccines);
        }

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

    /**
     * Get vaccination events with vaccine details for parent view
     */
    public List<VaccinationConsentDetailDTO> getVaccinationEventsWithVaccines() {
        List<HealthEvent> vaccinationEvents = eventRepository.findByEventTypeWithVaccines("VACCINATION");
        
        return vaccinationEvents.stream()
                .map(event -> VaccinationConsentDetailDTO.fromHealthEvent(event))
                .collect(Collectors.toList());
    }
    
    /**
     * Create health_event_vaccines entries for a vaccination event
     */
    private void createHealthEventVaccines(HealthEvent event, List<Integer> vaccineIds) {
        for (Integer vaccineId : vaccineIds) {
            // Create HealthEventVaccine entity with simplified structure
            String insertSql = "INSERT INTO health_event_vaccines (event_id, vaccine_id, created_at) " +
                             "VALUES (?, ?, GETDATE())";
            
            entityManager.createNativeQuery(insertSql)
                .setParameter(1, event.getEventId())
                .setParameter(2, vaccineId)
                .executeUpdate();
        }
    }

    /**
     * Update health_event_vaccines entries for a vaccination event during editing
     */
    private void updateHealthEventVaccines(HealthEvent event, List<Integer> vaccineIds) {
        // First, delete existing vaccine associations
        String deleteSql = "DELETE FROM health_event_vaccines WHERE event_id = ?";
        entityManager.createNativeQuery(deleteSql)
            .setParameter(1, event.getEventId())
            .executeUpdate();
        
        // Flush to ensure the delete is committed before inserting new records
        entityManager.flush();
        
        // Then, create new vaccine associations
        createHealthEventVaccines(event, vaccineIds);
    }

    /**
     * Create health_event_types entries for a health checkup event
     */
    private void createHealthEventCheckupTypes(HealthEvent event, List<String> checkupTypeValues) {
        int sequenceOrder = 1;
        
        for (String checkupTypeValue : checkupTypeValues) {
            try {
                HealthCheckupType checkupType = null;
                
                // Check if the value is a number (ID) or a string (name)
                try {
                    // Try to parse as ID first
                    Long checkupTypeId = Long.parseLong(checkupTypeValue);
                    checkupType = healthCheckupTypeRepository.findById(checkupTypeId).orElse(null);
                    
                    if (checkupType == null) {
                        System.err.println("Checkup type ID not found: " + checkupTypeId);
                        continue;
                    }
                    
                } catch (NumberFormatException e) {
                    // If not a number, treat as type name
                    checkupType = healthCheckupTypeRepository.findByTypeName(checkupTypeValue);
                    
                    if (checkupType == null) {
                        System.err.println("Checkup type name not found: " + checkupTypeValue);
                        continue;
                    }
                }
                
                // Create health_event_types entry
                HealthEventType healthEventType = new HealthEventType();
                healthEventType.setEventId(event.getEventId());
                healthEventType.setCheckupTypeId(checkupType.getCheckupTypeId().intValue());
                healthEventType.setIsRequired(true);
                healthEventType.setSequenceOrder(sequenceOrder++);
                
                healthEventTypeRepository.save(healthEventType);
                    
            } catch (Exception e) {
                System.err.println("Error creating checkup type association for: " + checkupTypeValue + " - " + e.getMessage());
            }
        }
    }

    /**
     * Update health_event_types entries for a health checkup event during editing
     */
    private void updateHealthEventCheckupTypes(HealthEvent event, List<String> checkupTypeNames) {
        // First, delete existing checkup type associations
        healthEventTypeRepository.deleteByEventId(event.getEventId());
        
        // Then, create new checkup type associations
        createHealthEventCheckupTypes(event, checkupTypeNames);
    }

    /**
     * Get upcoming health checkup events for a specific student
     */
    public List<HealthEventDTO> getUpcomingHealthEventsForStudent(String studentCode) {
        // First get the student to find their grade level
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "studentCode", studentCode));
        
        // Get current date (LocalDate, not LocalDateTime)
        LocalDate now = LocalDate.now();
        
        // Find upcoming health checkup events for the student's grade level
        List<HealthEvent> upcomingEvents = eventRepository.findUpcomingHealthCheckupEventsByGradeId(
                student.getGradeLevel().getGradeId(), now);
        
        return upcomingEvents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Admin support methods
    public long getTotalCount() {
        return eventRepository.count();
    }
}
