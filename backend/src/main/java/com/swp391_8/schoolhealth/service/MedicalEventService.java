package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import com.swp391_8.schoolhealth.model.MedicalEvent;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.MedicalEventRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalEventService {

    @Autowired
    private MedicalEventRepository medicalEventRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<MedicalEventDTO> getAllMedicalEvents(String studentCode, LocalDate startDate, LocalDate endDate, String severity, String eventType, String status) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (startDate != null) {
            startDateTime = startDate.atStartOfDay();
        }
        if (endDate != null) {
            endDateTime = endDate.atTime(23, 59, 59); // End of the day
        }
        return medicalEventRepository.findAllFiltered(studentCode, startDateTime, endDateTime, severity, eventType, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicalEventDTO> getMedicalEventsByStudentStudentCode(String studentCode) {
        return medicalEventRepository.findByStudentStudentCode(studentCode).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicalEventDTO createMedicalEvent(MedicalEventDTO medicalEventDTO, String creatorUsername) {
        Student student = studentRepository.findByStudentCode(medicalEventDTO.getStudentCode())
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + medicalEventDTO.getStudentCode()));
        User handledBy = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + creatorUsername));

        MedicalEvent medicalEvent = new MedicalEvent();
        medicalEvent.setStudent(student);
        medicalEvent.setEventType(medicalEventDTO.getEventType().name()); // Use .name() for enum to string
        medicalEvent.setDescription(medicalEventDTO.getDescription());
        medicalEvent.setEventDatetime(medicalEventDTO.getEventDate() != null ? medicalEventDTO.getEventDate() : LocalDateTime.now());
        medicalEvent.setRecordedBy(handledBy); // Corrected from setHandledBy

        // Map new fields from DTO to entity
        medicalEvent.setSymptoms(medicalEventDTO.getSymptoms());
        medicalEvent.setSeverity(medicalEventDTO.getSeverity());
        medicalEvent.setActionTaken(medicalEventDTO.getActionTaken());
        medicalEvent.setMedicationGiven(medicalEventDTO.getMedicationGiven());
        medicalEvent.setParentNotified(medicalEventDTO.getParentNotified());
        medicalEvent.setReferredTo(medicalEventDTO.getReferredTo());
        medicalEvent.setFollowUpRequired(medicalEventDTO.getFollowUpRequired());
        medicalEvent.setFollowUpDate(medicalEventDTO.getFollowUpDate());
        medicalEvent.setStatus(medicalEventDTO.getStatus());


        MedicalEvent savedEvent = medicalEventRepository.save(medicalEvent);
        return convertToDTO(savedEvent);
    }

    @Transactional
    public MedicalEventDTO updateMedicalEvent(Integer eventId, MedicalEventDTO medicalEventDTO, String updaterUsername) {
        MedicalEvent existingEvent = medicalEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("MedicalEvent not found with id: " + eventId));
        User handledBy = userRepository.findByUsername(updaterUsername)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + updaterUsername));

        // Update student if changed
        if (medicalEventDTO.getStudentCode() != null && !medicalEventDTO.getStudentCode().equals(existingEvent.getStudent().getStudentCode())) {
            Student student = studentRepository.findByStudentCode(medicalEventDTO.getStudentCode())
                    .orElseThrow(() -> new RuntimeException("Student not found with code: " + medicalEventDTO.getStudentCode()));
            existingEvent.setStudent(student);
        }

        existingEvent.setEventType(medicalEventDTO.getEventType().name()); // Use .name() for enum to string
        existingEvent.setDescription(medicalEventDTO.getDescription());
        existingEvent.setEventDatetime(medicalEventDTO.getEventDate() != null ? medicalEventDTO.getEventDate() : existingEvent.getEventDatetime());
        existingEvent.setRecordedBy(handledBy); // Corrected from setHandledBy, and update who last handled it

        // Map new fields from DTO to entity
        existingEvent.setSymptoms(medicalEventDTO.getSymptoms());
        existingEvent.setSeverity(medicalEventDTO.getSeverity());
        existingEvent.setActionTaken(medicalEventDTO.getActionTaken());
        existingEvent.setMedicationGiven(medicalEventDTO.getMedicationGiven());
        existingEvent.setParentNotified(medicalEventDTO.getParentNotified());
        existingEvent.setReferredTo(medicalEventDTO.getReferredTo());
        existingEvent.setFollowUpRequired(medicalEventDTO.getFollowUpRequired());
        existingEvent.setFollowUpDate(medicalEventDTO.getFollowUpDate());
        existingEvent.setStatus(medicalEventDTO.getStatus());

        MedicalEvent updatedEvent = medicalEventRepository.save(existingEvent);
        return convertToDTO(updatedEvent);
    }

    @Transactional
    public void deleteMedicalEvent(Integer eventId) {
        if (!medicalEventRepository.existsById(eventId)) {
            throw new RuntimeException("MedicalEvent not found with id: " + eventId);
        }
        medicalEventRepository.deleteById(eventId);
    }

    private MedicalEventDTO convertToDTO(MedicalEvent medicalEvent) {
        MedicalEventDTO dto = new MedicalEventDTO();
        dto.setId(medicalEvent.getId());
        if (medicalEvent.getStudent() != null) {
            dto.setStudentCode(medicalEvent.getStudent().getStudentCode());
        }
        try {
            // Use MedicalEvent.EventType directly as it's defined in the MedicalEvent entity
            dto.setEventType(MedicalEvent.EventType.valueOf(medicalEvent.getEventType()));
        } catch (IllegalArgumentException e) {
            // Handle the case where the string from the entity doesn't match any enum constant
            // For example, log a warning or set a default value
            // For now, we'll leave it null or re-throw if strict mapping is required.
        }
        dto.setDescription(medicalEvent.getDescription());
        dto.setEventDate(medicalEvent.getEventDatetime()); // Corrected from getEventDate
        if (medicalEvent.getRecordedBy() != null) { // Corrected from getHandledBy
            dto.setHandledByUsername(medicalEvent.getRecordedBy().getUsername()); // Corrected from getHandledBy
        }
        // dto.setCreatedAt(medicalEvent.getCreatedAt()); // This line was noted to be removed.

        // Map new fields from entity to DTO
        dto.setSymptoms(medicalEvent.getSymptoms());
        dto.setSeverity(medicalEvent.getSeverity());
        dto.setActionTaken(medicalEvent.getActionTaken());
        dto.setMedicationGiven(medicalEvent.getMedicationGiven());
        dto.setParentNotified(medicalEvent.getParentNotified());
        dto.setReferredTo(medicalEvent.getReferredTo());
        dto.setFollowUpRequired(medicalEvent.getFollowUpRequired());
        dto.setFollowUpDate(medicalEvent.getFollowUpDate());
        dto.setStatus(medicalEvent.getStatus());

        return dto;
    }
}
