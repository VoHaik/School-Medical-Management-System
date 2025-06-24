package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import com.swp391_8.schoolhealth.model.MedicalEvent;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.MedicalEventRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.MedicalEventServiceInterface;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalEventServiceImpl implements MedicalEventServiceInterface {

    @Autowired
    private MedicalEventRepository medicalEventRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<MedicalEventDTO> getAllMedicalEvents(String studentCode, LocalDate startDate, LocalDate endDate, String severity, String eventTypeName, String status) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (startDate != null) {
            startDateTime = startDate.atStartOfDay();
        }
        if (endDate != null) {
            endDateTime = endDate.atTime(23, 59, 59); // End of the day
        }
        // Corrected repository method name and passed status
        return medicalEventRepository.findMedicalEventsByCriteria(studentCode, startDateTime, endDateTime, severity, eventTypeName, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalEventDTO> getMedicalEventsByStudentStudentCode(String studentCode) {
        return medicalEventRepository.findByStudent_StudentCode(studentCode).stream() // Corrected repository method name
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MedicalEventDTO createMedicalEvent(MedicalEventDTO medicalEventDTO, String creatorUsername) {
        Student student = studentRepository.findByStudentCode(medicalEventDTO.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + medicalEventDTO.getStudentCode()));
        User recordedByUser = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + creatorUsername));

        MedicalEvent medicalEvent = new MedicalEvent();
        medicalEvent.setStudent(student);
        medicalEvent.setEventType(medicalEventDTO.getEventType());
        medicalEvent.setDescription(medicalEventDTO.getDescription());
        medicalEvent.setEventDatetime(medicalEventDTO.getEventDatetime() != null ? medicalEventDTO.getEventDatetime() : LocalDateTime.now());
        medicalEvent.setRecordedBy(recordedByUser);        medicalEvent.setSymptoms(medicalEventDTO.getSymptoms());
        medicalEvent.setSeverity(medicalEventDTO.getSeverity());
        medicalEvent.setActionTaken(medicalEventDTO.getActionTaken());
        medicalEvent.setMedicationGiven(medicalEventDTO.getMedicationGiven());
        medicalEvent.setMedicationQuantity(medicalEventDTO.getMedicationQuantity());
        medicalEvent.setStatus(medicalEventDTO.getStatus());
        // createdAt is handled by @PrePersist

        MedicalEvent savedEvent = medicalEventRepository.save(medicalEvent);
        return convertToDTO(savedEvent);
    }

    @Override
    @Transactional
    public MedicalEventDTO updateMedicalEvent(Integer eventId, MedicalEventDTO medicalEventDTO, String updaterUsername) {
        MedicalEvent existingEvent = medicalEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalEvent not found with id: " + eventId));
        User recordedByUser = userRepository.findByUsername(updaterUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + updaterUsername));

        if (medicalEventDTO.getStudentCode() != null) {
            Student student = studentRepository.findByStudentCode(medicalEventDTO.getStudentCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + medicalEventDTO.getStudentCode()));
            existingEvent.setStudent(student);
        }

        if (medicalEventDTO.getEventType() != null) {
            existingEvent.setEventType(medicalEventDTO.getEventType());
        }
        existingEvent.setDescription(medicalEventDTO.getDescription());
        existingEvent.setEventDatetime(medicalEventDTO.getEventDatetime() != null ? medicalEventDTO.getEventDatetime() : existingEvent.getEventDatetime());
        existingEvent.setRecordedBy(recordedByUser);        existingEvent.setSymptoms(medicalEventDTO.getSymptoms());
        existingEvent.setSeverity(medicalEventDTO.getSeverity());
        existingEvent.setActionTaken(medicalEventDTO.getActionTaken());
        existingEvent.setMedicationGiven(medicalEventDTO.getMedicationGiven());
        existingEvent.setMedicationQuantity(medicalEventDTO.getMedicationQuantity());
        existingEvent.setStatus(medicalEventDTO.getStatus());

        MedicalEvent updatedEvent = medicalEventRepository.save(existingEvent);
        return convertToDTO(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteMedicalEvent(Integer eventId) {
        if (!medicalEventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("MedicalEvent not found with id: " + eventId);
        }
        medicalEventRepository.deleteById(eventId);
    }

    private MedicalEventDTO convertToDTO(MedicalEvent event) {
        if (event == null) return null;
        MedicalEventDTO dto = new MedicalEventDTO();
        dto.setId(event.getId());
        if (event.getStudent() != null) {
            dto.setStudentCode(event.getStudent().getStudentCode());
            // Assuming StudentDTO or direct student name access is handled elsewhere or not needed here
            // dto.setStudentName(event.getStudent().getFullName()); // If Student has getFullName()
        }
        // Just set the event type directly as a string
        dto.setEventType(event.getEventType());
        dto.setDescription(event.getDescription());
        dto.setEventDatetime(event.getEventDatetime());
        if (event.getRecordedBy() != null) {
            dto.setHandledByUsername(event.getRecordedBy().getUsername());
        }        dto.setSymptoms(event.getSymptoms());
        dto.setSeverity(event.getSeverity());
        dto.setActionTaken(event.getActionTaken());
        dto.setMedicationGiven(event.getMedicationGiven());
        dto.setMedicationQuantity(event.getMedicationQuantity());
        dto.setStatus(event.getStatus());
        return dto;
    }
}
