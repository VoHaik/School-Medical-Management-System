package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.ConsultationDTO;
import com.swp391_8.schoolhealth.model.Consultation;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.HealthCheckup; // Assuming HealthCheckup model exists
import com.swp391_8.schoolhealth.repository.ConsultationRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository; // Assuming StudentRepository exists
import com.swp391_8.schoolhealth.repository.HealthCheckupRepository; // Assuming HealthCheckupRepository exists
import com.swp391_8.schoolhealth.service.ConsultationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultationServiceImpl implements ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private HealthCheckupRepository healthCheckupRepository; // Optional: if linking to checkups

    @Override
    public ConsultationDTO findById(Integer id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found with id: " + id));
        return convertToDTO(consultation);
    }

    @Override
    public List<ConsultationDTO> findByStudentId(Integer studentId) {
        return consultationRepository.findByStudentStudentIdOrderByConsultationDateDesc(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConsultationDTO createConsultation(ConsultationDTO dto) {
        Consultation consultation = convertToEntity(dto);
        Consultation savedConsultation = consultationRepository.save(consultation);
        return convertToDTO(savedConsultation);
    }

    @Override
    public ConsultationDTO updateConsultation(Integer id, ConsultationDTO dto) {
        Consultation existingConsultation = consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found with id: " + id));

        // Update fields from DTO
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + dto.getStudentId()));
        existingConsultation.setStudent(student);

        if (dto.getCheckupId() != null) {
            HealthCheckup checkup = healthCheckupRepository.findById(dto.getCheckupId())
                    .orElseThrow(() -> new EntityNotFoundException("HealthCheckup not found with id: " + dto.getCheckupId()));
            existingConsultation.setRelatedHealthCheckup(checkup); // Changed from setCheckup
        } else {
            existingConsultation.setRelatedHealthCheckup(null); // Changed from setCheckup
        }

        existingConsultation.setConsultationDate(dto.getConsultationDate());
        existingConsultation.setLocation(dto.getLocation());
        existingConsultation.setReason(dto.getReason()); // Changed from setDescription
        existingConsultation.setRecommendations(dto.getRecommendations()); // Changed from setResult

        Consultation updatedConsultation = consultationRepository.save(existingConsultation);
        return convertToDTO(updatedConsultation);
    }

    @Override
    public void deleteConsultation(Integer id) {
        if (!consultationRepository.existsById(id)) {
            throw new EntityNotFoundException("Consultation not found with id: " + id);
        }
        consultationRepository.deleteById(id);
    }

    private ConsultationDTO convertToDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setConsultationId(consultation.getConsultationId());
        if (consultation.getStudent() != null) {
            dto.setStudentId(consultation.getStudent().getStudentId());
            dto.setStudentName(consultation.getStudent().getFullName()); // Use getFullName()
        }
        if (consultation.getRelatedHealthCheckup() != null) { // Changed from getCheckup
            dto.setCheckupId(consultation.getRelatedHealthCheckup().getCheckupId()); // Changed from getCheckup
        }
        dto.setConsultationDate(consultation.getConsultationDate());
        dto.setLocation(consultation.getLocation());
        dto.setReason(consultation.getReason()); // Changed from getDescription
        dto.setRecommendations(consultation.getRecommendations()); // Changed from getResult
        return dto;
    }

    private Consultation convertToEntity(ConsultationDTO dto) {
        Consultation consultation = new Consultation();
        // ID is not set for new entities, or it's set for updates via existingConsultation

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + dto.getStudentId()));
        consultation.setStudent(student);

        if (dto.getCheckupId() != null) {
            HealthCheckup checkup = healthCheckupRepository.findById(dto.getCheckupId())
                    .orElseThrow(() -> new EntityNotFoundException("HealthCheckup not found with id: " + dto.getCheckupId()));
            consultation.setRelatedHealthCheckup(checkup); // Changed from setCheckup
        }
        // For creation, other fields are set directly
        consultation.setConsultationDate(dto.getConsultationDate());
        consultation.setLocation(dto.getLocation());
        consultation.setReason(dto.getReason()); // Ensure this was changed
        consultation.setRecommendations(dto.getRecommendations()); // Ensure this was changed
        return consultation;
    }
}
