package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthCheckupDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthCheckup;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.HealthCheckupRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate; // Import LocalDate
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthCheckupService {

    @Autowired
    private HealthCheckupRepository healthCheckupRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    // Mapper DTO to Entity
    private HealthCheckup mapToEntity(HealthCheckupDTO dto, HealthCheckup entity, String conductedByUsername) {
        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "studentCode", dto.getStudentCode()));
        entity.setStudent(student);

        User conductedBy = userRepository.findByUsername(conductedByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", conductedByUsername));
        entity.setConductedBy(conductedBy);
        
        entity.setCheckupDate(dto.getCheckupDate());
        entity.setCheckupType(dto.getCheckupType());
        entity.setVisionLeft(dto.getVisionLeft());
        entity.setVisionRight(dto.getVisionRight());
        entity.setHearingLeft(dto.getHearingLeft());
        entity.setHearingRight(dto.getHearingRight());
        entity.setBloodPressureSystolic(dto.getBloodPressureSystolic());
        entity.setBloodPressureDiastolic(dto.getBloodPressureDiastolic());
        entity.setHeartRate(dto.getHeartRate());
        entity.setTemperature(dto.getTemperature());
        entity.setHeight(dto.getHeight()); 
        entity.setWeight(dto.getWeight()); 
        entity.setNotes(dto.getNotes());
        entity.setStatus(dto.getStatus());
        
        if (dto.getConsentStatus() != null) {
            try {
                entity.setConsentStatus(HealthCheckup.ConsentStatus.valueOf(dto.getConsentStatus()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid consent status: " + dto.getConsentStatus() + ". Valid values are: Pending, Approved, Rejected, NotRequired");
            }
        }

        if (dto.getConsentByUserId() != null) {
            User consentByUser = userRepository.findById(dto.getConsentByUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "ID", dto.getConsentByUserId()));
            entity.setConsentBy(consentByUser);
        } else {
            entity.setConsentBy(null); // Explicitly set to null if not provided
        }

        entity.setFollowUpDate(dto.getFollowUpDate());
        return entity;
    }

    // Mapper Entity to DTO
    private HealthCheckupDTO mapToDTO(HealthCheckup entity) {
        HealthCheckupDTO dto = new HealthCheckupDTO();
        dto.setId(entity.getId());
        if (entity.getStudent() != null) {
            dto.setStudentCode(entity.getStudent().getStudentCode());
            dto.setStudentName(entity.getStudent().getFullName()); // Assuming Student has getFullName()
        }
        dto.setCheckupDate(entity.getCheckupDate());
        dto.setCheckupType(entity.getCheckupType());
        dto.setVisionLeft(entity.getVisionLeft());
        dto.setVisionRight(entity.getVisionRight());
        dto.setHearingLeft(entity.getHearingLeft());
        dto.setHearingRight(entity.getHearingRight());
        dto.setBloodPressureSystolic(entity.getBloodPressureSystolic());
        dto.setBloodPressureDiastolic(entity.getBloodPressureDiastolic());
        dto.setHeartRate(entity.getHeartRate());
        dto.setTemperature(entity.getTemperature());
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        dto.setBmi(entity.getBmi());
        dto.setNotes(entity.getNotes());
        dto.setStatus(entity.getStatus());
        if (entity.getConductedBy() != null) {
            dto.setConductedByUserName(entity.getConductedBy().getUsername());
            dto.setConductedByUserId(entity.getConductedBy().getUserId());
        }
        if (entity.getConsentStatus() != null) {
            dto.setConsentStatus(entity.getConsentStatus().name());
        }
        if (entity.getConsentBy() != null) {
            dto.setConsentByUserId(entity.getConsentBy().getUserId());
            dto.setConsentByUserName(entity.getConsentBy().getFullName());
        }
        dto.setFollowUpDate(entity.getFollowUpDate());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // The HealthCheckup entity does not have createdBy/updatedBy fields directly.
        // These are typically part of an audit log or a base auditable entity.
        // For now, we will not set them in the DTO from the entity if not present.
        // If they were added to HealthCheckup.java as String fields, then:
        // dto.setCreatedBy(entity.getCreatedBy());
        // dto.setUpdatedBy(entity.getUpdatedBy());
        return dto;
    }

    @Transactional
    public HealthCheckupDTO createHealthCheckup(HealthCheckupDTO healthCheckupDTO, String creatorUsername) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", creatorUsername));

        HealthCheckup healthCheckup = new HealthCheckup();
        // The creator is also the one conducting the checkup by default for new entries
        healthCheckup = mapToEntity(healthCheckupDTO, healthCheckup, creatorUsername);
        
        // @PrePersist in HealthCheckup entity handles createdAt, updatedAt, and calculateBmi()
        // No need to set healthCheckup.setCreatedBy(creator.getUsername()); as entity doesn't have this field
        // No need to set healthCheckup.setCreatedAt(LocalDateTime.now());

        HealthCheckup savedCheckup = healthCheckupRepository.save(healthCheckup);
        return mapToDTO(savedCheckup);
    }

    @Transactional(readOnly = true)
    public List<HealthCheckupDTO> getAllHealthCheckups(String studentCode, LocalDate startDate, LocalDate endDate, String checkupType, String status) {
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (startDate != null) {
            startDateTime = startDate.atStartOfDay();
        }
        if (endDate != null) {
            endDateTime = endDate.atTime(23, 59, 59); // End of the day
        }
        return healthCheckupRepository.findAllFiltered(studentCode, startDateTime, endDateTime, checkupType, status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HealthCheckupDTO getHealthCheckupById(Long id) {
        HealthCheckup healthCheckup = healthCheckupRepository.findById(id.intValue()) 
                .orElseThrow(() -> new ResourceNotFoundException("HealthCheckup", "id", id));
        return mapToDTO(healthCheckup);
    }

    @Transactional
    public HealthCheckupDTO updateHealthCheckup(Long id, HealthCheckupDTO healthCheckupDTO, String updaterUsername) {
        User updater = userRepository.findByUsername(updaterUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", updaterUsername));

        HealthCheckup existingCheckup = healthCheckupRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("HealthCheckup", "id", id));

        // Determine who conducted the checkup for the update.
        // If DTO specifies a conductor, use that. Otherwise, assume the updater is the conductor.
        String conductedByUsernameForUpdate = healthCheckupDTO.getConductedByUserName() != null 
                                              ? healthCheckupDTO.getConductedByUserName() 
                                              : updaterUsername;
        
        existingCheckup = mapToEntity(healthCheckupDTO, existingCheckup, conductedByUsernameForUpdate);
        
        // @PreUpdate in HealthCheckup entity handles updatedAt and re-calculateBmi()
        // No need to set existingCheckup.setUpdatedBy(updater.getUsername()); as entity doesn't have this field
        // No need to set existingCheckup.setUpdatedAt(LocalDateTime.now());

        HealthCheckup updatedCheckup = healthCheckupRepository.save(existingCheckup);
        return mapToDTO(updatedCheckup);
    }

    @Transactional
    public void deleteHealthCheckup(Long id) {
        if (!healthCheckupRepository.existsById(id.intValue())) { 
            throw new ResourceNotFoundException("HealthCheckup", "id", id);
        }
        healthCheckupRepository.deleteById(id.intValue()); 
    }
}
