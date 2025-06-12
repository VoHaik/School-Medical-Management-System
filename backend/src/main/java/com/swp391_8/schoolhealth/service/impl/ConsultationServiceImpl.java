package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.ConsultationDTO;
import com.swp391_8.schoolhealth.model.Consultation;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User; // Added import for User
import com.swp391_8.schoolhealth.model.HealthCheckup;
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
<<<<<<< Updated upstream
    public List<ConsultationDTO> findByStudentId(Integer studentId) {
        return consultationRepository.findByStudentStudentIdOrderByConsultationDatetimeDesc(studentId).stream()
=======
    public List<ConsultationDTO> findByStudentCode(String studentCode) {
        return consultationRepository.findByStudentStudentCodeOrderByConsultationDateDesc(studentCode).stream()
>>>>>>> Stashed changes
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
        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with code: " + dto.getStudentCode()));
        existingConsultation.setStudent(student);

        if (dto.getCheckupId() != null) {
            HealthCheckup checkup = healthCheckupRepository.findById(dto.getCheckupId())
                    .orElseThrow(() -> new EntityNotFoundException("HealthCheckup not found with id: " + dto.getCheckupId()));
            existingConsultation.setHealthCheckup(checkup);
        } else {
            existingConsultation.setHealthCheckup(null);
        }

        existingConsultation.setConsultationDatetime(dto.getConsultationDate()); // DTO.consultationDate -> Entity.consultationDatetime
        existingConsultation.setLocation(dto.getLocation());
        existingConsultation.setReason(dto.getDescription()); // DTO.description -> Entity.reason
        existingConsultation.setDiagnosis(dto.getResult());      // DTO.result -> Entity.diagnosis
        // existingConsultation.setRecommendations(dto.getRecommendations()); // If DTO had recommendations

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
        dto.setId(consultation.getConsultationId());
        if (consultation.getStudent() != null) {
<<<<<<< Updated upstream
            dto.setStudentId(consultation.getStudent().getStudentId());
            User studentUser = consultation.getStudent().getUser();
            if (studentUser != null) {
                dto.setStudentName(studentUser.getFullName());
            } else {
                dto.setStudentName("N/A");
            }
        }
        if (consultation.getHealthCheckup() != null) {
            dto.setCheckupId(consultation.getHealthCheckup().getCheckupId());
=======
            dto.setStudentCode(consultation.getStudent().getStudentCode());
            dto.setStudentName(consultation.getStudent().getFirstName() + " " + consultation.getStudent().getLastName()); // Example: full name
        }
        if (consultation.getCheckup() != null) {
            dto.setCheckupId(consultation.getCheckup().getId()); // Changed getCheckupId() to getId()
>>>>>>> Stashed changes
        }
        dto.setConsultationDate(consultation.getConsultationDatetime()); // Entity.consultationDatetime -> DTO.consultationDate
        dto.setLocation(consultation.getLocation());
        dto.setDescription(consultation.getReason()); // Entity.reason -> DTO.description
        dto.setResult(consultation.getDiagnosis());      // Entity.diagnosis -> DTO.result
        // dto.setRecommendations(consultation.getRecommendations()); // If DTO had recommendations
        return dto;
    }

    private Consultation convertToEntity(ConsultationDTO dto) {
        Consultation consultation = new Consultation();

        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with code: " + dto.getStudentCode()));
        consultation.setStudent(student);

        if (dto.getCheckupId() != null) {
            HealthCheckup checkup = healthCheckupRepository.findById(dto.getCheckupId())
                    .orElseThrow(() -> new EntityNotFoundException("HealthCheckup not found with id: " + dto.getCheckupId()));
            consultation.setHealthCheckup(checkup);
        } else {
            consultation.setHealthCheckup(null);
        }
        
        consultation.setConsultationDatetime(dto.getConsultationDate()); // DTO.consultationDate -> Entity.consultationDatetime
        consultation.setLocation(dto.getLocation());
        consultation.setReason(dto.getDescription()); // DTO.description -> Entity.reason
        consultation.setDiagnosis(dto.getResult());      // DTO.result -> Entity.diagnosis
        // consultation.setRecommendations(dto.getRecommendations()); // If DTO had recommendations
        return consultation;
    }
}
