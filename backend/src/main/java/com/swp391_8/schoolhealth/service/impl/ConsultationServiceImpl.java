package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.ConsultationDTO;
import com.swp391_8.schoolhealth.model.Consultation;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.HealthCheckup;
import com.swp391_8.schoolhealth.repository.ConsultationRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.HealthCheckupRepository;
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
    private HealthCheckupRepository healthCheckupRepository;

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
            dto.setStudentName(consultation.getStudent().getFullName()); // Use getFullName from Student
        }
        if (consultation.getHealthCheckup() != null) {
            dto.setCheckupId(consultation.getHealthCheckup().getCheckupId());
        }
        dto.setConsultationDate(consultation.getConsultationDate());
        dto.setLocation(consultation.getLocation());
        dto.setDescription(consultation.getDescription());
        dto.setResult(consultation.getResult());
        return dto;
    }

    private Consultation convertToEntity(ConsultationDTO dto) {
        Consultation consultation = new Consultation();
        // Note: ID is not set here as it's typically generated on save for new entities
        // or should be present if updating (handled in updateConsultation)

        if (dto.getStudentCode() != null) {
            Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found with code: " + dto.getStudentCode()));
            consultation.setStudent(student);
        }

        if (dto.getCheckupId() != null) {
            HealthCheckup checkup = healthCheckupRepository.findById(dto.getCheckupId())
                    .orElseThrow(() -> new EntityNotFoundException("HealthCheckup not found with id: " + dto.getCheckupId()));
            consultation.setHealthCheckup(checkup);
        }

        consultation.setConsultationDate(dto.getConsultationDate());
        consultation.setLocation(dto.getLocation());
        consultation.setDescription(dto.getDescription());
        consultation.setResult(dto.getResult());
        return consultation;
    }
}
