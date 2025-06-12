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
    public List<ConsultationDTO> findByStudentCode(String studentCode) {
        return consultationRepository.findByStudentStudentCodeOrderByConsultationDateDesc(studentCode).stream()
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
            existingConsultation.setCheckup(checkup);
        } else {
            existingConsultation.setCheckup(null);
        }

        existingConsultation.setConsultationDate(dto.getConsultationDate());
        existingConsultation.setLocation(dto.getLocation());
        existingConsultation.setDescription(dto.getDescription());
        existingConsultation.setResult(dto.getResult());

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
        dto.setId(consultation.getId());
        if (consultation.getStudent() != null) {
            dto.setStudentCode(consultation.getStudent().getStudentCode());
            dto.setStudentName(consultation.getStudent().getFirstName() + " " + consultation.getStudent().getLastName()); // Example: full name
        }
        if (consultation.getCheckup() != null) {
            dto.setCheckupId(consultation.getCheckup().getId()); // Changed getCheckupId() to getId()
        }
        dto.setConsultationDate(consultation.getConsultationDate());
        dto.setLocation(consultation.getLocation());
        dto.setDescription(consultation.getDescription());
        dto.setResult(consultation.getResult());
        return dto;
    }

    private Consultation convertToEntity(ConsultationDTO dto) {
        Consultation consultation = new Consultation();
        // ID is not set for new entities, or it's set for updates via existingConsultation

        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with code: " + dto.getStudentCode()));
        consultation.setStudent(student);

        if (dto.getCheckupId() != null) {
            HealthCheckup checkup = healthCheckupRepository.findById(dto.getCheckupId())
                    .orElseThrow(() -> new EntityNotFoundException("HealthCheckup not found with id: " + dto.getCheckupId()));
            consultation.setCheckup(checkup);
        }
        // For creation, other fields are set directly
        consultation.setConsultationDate(dto.getConsultationDate());
        consultation.setLocation(dto.getLocation());
        consultation.setDescription(dto.getDescription());
        consultation.setResult(dto.getResult());
        return consultation;
    }
}
