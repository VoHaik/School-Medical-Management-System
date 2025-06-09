package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.VaccinationRecordDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthDeclaration;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.VaccinationRecord;
import com.swp391_8.schoolhealth.repository.HealthDeclarationRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HealthDeclarationServiceImpl implements HealthDeclarationService {

    @Autowired
    private HealthDeclarationRepository healthDeclarationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository; // To link with the parent user

    @Override
    @Transactional
    public HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto, String username) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId())); // Corrected
        User parentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username)); // Corrected

        // Ensure student's parent matches the logged-in user
        if (student.getParentUser() == null || !student.getParentUser().getUserId().equals(parentUser.getUserId())) {
            throw new SecurityException("User " + username + " is not authorized to submit health declarations for student " + dto.getStudentId());
        }

        HealthDeclaration declaration;
        if (dto.getDeclarationId() != null) {
            declaration = healthDeclarationRepository.findById(dto.getDeclarationId())
                    .orElseThrow(() -> new ResourceNotFoundException("HealthDeclaration", "id", dto.getDeclarationId())); // Corrected
            // Ensure the existing declaration belongs to the student and parent
            if (!declaration.getStudent().getStudentId().equals(dto.getStudentId()) || 
                !declaration.getParent().getUserId().equals(parentUser.getUserId())) {
                throw new SecurityException("User " + username + " is not authorized to update this health declaration.");
            }
        } else {
            declaration = new HealthDeclaration();
            declaration.setStudent(student);
            declaration.setParent(parentUser); // Set parent from authenticated user
        }
        
        // Update fields from DTO
        declaration.setSymptoms(dto.getSymptoms());
        declaration.setHasSymptoms(dto.isHasSymptoms());
        declaration.setCloseContact(dto.isCloseContact());
        declaration.setTravelHistory(dto.isTravelHistory());
        declaration.setDeclarationDate(dto.getDeclarationDate());
        declaration.setAdditionalInfo(dto.getAdditionalInfo());
        declaration.setIsDraft(dto.isDraft()); // Corrected: use dto.isDraft()

        if (dto.getVaccinations() != null) {
            List<VaccinationRecord> vaccinationEntities = dto.getVaccinations().stream()
                    .map(this::convertToVaccinationEntity)
                    .collect(Collectors.toList());
            // Clear existing vaccinations and add new ones to handle updates correctly
            declaration.getVaccinations().clear();
            for (VaccinationRecord vr : vaccinationEntities) {
                vr.setHealthDeclaration(declaration); // Set bidirectional relationship
                declaration.getVaccinations().add(vr);
            }
        } else {
            declaration.getVaccinations().clear();
        }
        
        HealthDeclaration savedDeclaration = healthDeclarationRepository.save(declaration);
        return convertToDTO(savedDeclaration);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HealthDeclarationDTO> getHealthDeclarationByStudentId(Integer studentId) {
        // This should fetch the most relevant declaration (e.g., latest submitted, or current draft)
        // For now, let's try to find a non-draft first, then a draft if no non-draft exists.
        // This logic might need to be more specific based on requirements.
        Optional<HealthDeclaration> declaration = healthDeclarationRepository.findByStudent_StudentIdAndIsDraft(studentId, false);
        if (declaration.isPresent()) {
            return declaration.map(this::convertToDTO);
        } else {
            // If no submitted version, check for a draft
            return healthDeclarationRepository.findByStudent_StudentIdAndIsDraft(studentId, true)
                .map(this::convertToDTO);
        }
    }

    // Helper to convert Entity to DTO
    private HealthDeclarationDTO convertToDTO(HealthDeclaration entity) {
        HealthDeclarationDTO dto = new HealthDeclarationDTO();
        dto.setDeclarationId(entity.getDeclarationId());
        dto.setStudentId(entity.getStudent().getStudentId());
        // dto.setParentUsername(entity.getParent() != null ? entity.getParent().getUsername() : null); // Example if you add parentUsername to DTO
        dto.setSymptoms(entity.getSymptoms());
        dto.setHasSymptoms(entity.isHasSymptoms());
        dto.setCloseContact(entity.isCloseContact());
        dto.setTravelHistory(entity.isTravelHistory());
        dto.setDeclarationDate(entity.getDeclarationDate());
        dto.setAdditionalInfo(entity.getAdditionalInfo());
        dto.setDraft(entity.getIsDraft()); // Corrected: use entity.getIsDraft()

        if (entity.getVaccinations() != null) {
            List<VaccinationRecordDTO> vaccinationDTOs = entity.getVaccinations().stream()
                    .map(this::convertToVaccinationDTO)
                    .collect(Collectors.toList());
            dto.setVaccinations(vaccinationDTOs);
        }
        return dto;
    }

    // Method to convert VaccinationRecordDTO to VaccinationRecord entity
    private VaccinationRecord convertToVaccinationEntity(VaccinationRecordDTO vaccinationDto) {
        VaccinationRecord vaccinationEntity = new VaccinationRecord();
        vaccinationEntity.setVaccineName(vaccinationDto.getVaccineName());
        vaccinationEntity.setVaccinationDate(vaccinationDto.getVaccinationDate());
        vaccinationEntity.setDosage(vaccinationDto.getDosage());
        // The HealthDeclaration reference will be set when adding to the HealthDeclaration's list
        return vaccinationEntity;
    }

    // Method to convert VaccinationRecord entity to VaccinationRecordDTO
    private VaccinationRecordDTO convertToVaccinationDTO(VaccinationRecord vaccinationEntity) {
        VaccinationRecordDTO vaccinationDto = new VaccinationRecordDTO(); // Use top-level DTO
        vaccinationDto.setRecordId(vaccinationEntity.getRecordId());
        vaccinationDto.setVaccineName(vaccinationEntity.getVaccineName());
        vaccinationDto.setVaccinationDate(vaccinationEntity.getVaccinationDate());
        vaccinationDto.setDosage(vaccinationEntity.getDosage());
        return vaccinationDto;
    }
}
