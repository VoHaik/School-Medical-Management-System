package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.VaccinationRecordDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthDeclaration;
<<<<<<< Updated upstream
import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
=======
import com.swp391_8.schoolhealth.model.Parent;
>>>>>>> Stashed changes
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.VaccinationRecord;
import com.swp391_8.schoolhealth.repository.HealthDeclarationRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
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
    private UserRepository userRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;

    @Autowired
    private ParentRepository parentRepository; // To find parent by user
    
    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository; // To verify parent-student relationships

    @Override
    @Transactional
    public HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto, String username) {
<<<<<<< Updated upstream
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId()));
        User submitterUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Verify that the submitterUser is a parent of the student
        Optional<ParentStudentRelationship> relationship = parentStudentRelationshipRepository.findByStudentAndParent(student, submitterUser);
        if (!relationship.isPresent()) {
            throw new SecurityException("User " + username + " is not authorized to submit health declarations for student " + dto.getStudentId());
=======
        // Changed from findById to findByStudentCode
        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "code", dto.getStudentCode())); 
                
        User parentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
                
        // Find the parent record associated with this user
        Parent parent = parentRepository.findByUserUserId(parentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent", "userId", parentUser.getUserId()));

        // Verify parent has relationship with this student using ParentStudentRelationshipRepository
        if (!parentStudentRelationshipRepository.existsByParentParentCodeAndStudentStudentCode(
                parent.getParentCode(), student.getStudentCode())) {
            throw new SecurityException("User " + username + " is not authorized to submit health declarations for student " + dto.getStudentCode());
>>>>>>> Stashed changes
        }

        HealthDeclaration declaration;
        if (dto.getDeclarationId() != null) {
            declaration = healthDeclarationRepository.findById(dto.getDeclarationId())
                    .orElseThrow(() -> new ResourceNotFoundException("HealthDeclaration", "id", dto.getDeclarationId()));
<<<<<<< Updated upstream
            // Ensure the existing declaration belongs to the student and was submitted by the same user
            if (!declaration.getStudent().getStudentId().equals(dto.getStudentId()) ||
                declaration.getSubmittedBy() == null || // Check if submittedBy is null
                !declaration.getSubmittedBy().getUserId().equals(submitterUser.getUserId())) {
=======
            
            // Ensure the existing declaration belongs to the student and parent
            if (!declaration.getStudent().getStudentCode().equals(dto.getStudentCode()) || 
                !declaration.getParent().getParentCode().equals(parent.getParentCode())) {
>>>>>>> Stashed changes
                throw new SecurityException("User " + username + " is not authorized to update this health declaration.");
            }
        } else {
            declaration = new HealthDeclaration();
            declaration.setStudent(student);
<<<<<<< Updated upstream
            declaration.setSubmittedBy(submitterUser); // Set submitter from authenticated user
=======
            declaration.setParent(parent); // Set parent entity instead of user
>>>>>>> Stashed changes
        }
        
        // Update fields from DTO
        declaration.setSymptoms(dto.getSymptoms());
        declaration.setHasSymptoms(dto.getHasSymptoms()); // Assuming DTO uses getHasSymptoms for Boolean
        declaration.setCloseContact(dto.getCloseContact()); // Assuming DTO uses getCloseContact for Boolean
        declaration.setTravelHistory(dto.getTravelHistory()); // Assuming DTO uses getTravelHistory for Boolean
        declaration.setDeclarationDate(dto.getDeclarationDate());
        declaration.setAdditionalInfo(dto.getAdditionalInfo());
        declaration.setIsDraft(dto.getIsDraft()); // Assuming DTO uses getIsDraft for Boolean

        if (dto.getVaccinations() != null) {
            List<VaccinationRecord> vaccinationEntities = dto.getVaccinations().stream()
                    .map(this::convertToVaccinationEntity)
                    .collect(Collectors.toList());
            // Clear existing vaccinations and add new ones to handle updates correctly
            if (declaration.getVaccinations() != null) {
                declaration.getVaccinations().clear();
            }
            for (VaccinationRecord vr : vaccinationEntities) {
                vr.setHealthDeclaration(declaration); // Set bidirectional relationship
                declaration.getVaccinations().add(vr);
            }
        } else {
            if (declaration.getVaccinations() != null) {
                declaration.getVaccinations().clear();
            }
        }
        
        HealthDeclaration savedDeclaration = healthDeclarationRepository.save(declaration);
        return convertToDTO(savedDeclaration);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HealthDeclarationDTO> getHealthDeclarationByStudentCode(String studentCode) {
        // This should fetch the most relevant declaration (e.g., latest submitted, or current draft)
        // For now, let's try to find a non-draft first, then a draft if no non-draft exists.
        // This logic might need to be more specific based on requirements.
<<<<<<< Updated upstream
        // Assuming HealthDeclaration has studentId field directly or via Student object
        // And repository method is findByStudent_StudentIdAndIsDraft
        Optional<HealthDeclaration> declaration = healthDeclarationRepository.findByStudent_StudentIdAndIsDraft(studentId, false);
=======
        Optional<HealthDeclaration> declaration = healthDeclarationRepository.findByStudent_StudentCodeAndIsDraft(studentCode, false);
>>>>>>> Stashed changes
        if (declaration.isPresent()) {
            return declaration.map(this::convertToDTO);
        } else {
            // If no submitted version, check for a draft
            return healthDeclarationRepository.findByStudent_StudentCodeAndIsDraft(studentCode, true)
                .map(this::convertToDTO);
        }
    }

    // Helper to convert Entity to DTO
    private HealthDeclarationDTO convertToDTO(HealthDeclaration entity) {
        HealthDeclarationDTO dto = new HealthDeclarationDTO();
        dto.setDeclarationId(entity.getDeclarationId());
<<<<<<< Updated upstream
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
        }
        if (entity.getSubmittedBy() != null) { // Added to populate submitter info in DTO
            dto.setSubmittedByUserId(entity.getSubmittedBy().getUserId());
            dto.setSubmittedByUsername(entity.getSubmittedBy().getUsername());
        }
=======
        dto.setStudentCode(entity.getStudent().getStudentCode());
        // If you need parent information in the DTO, add it here
        // dto.setParentCode(entity.getParent() != null ? entity.getParent().getParentCode() : null);
>>>>>>> Stashed changes
        dto.setSymptoms(entity.getSymptoms());
        dto.setHasSymptoms(entity.getHasSymptoms()); // Assuming entity uses getHasSymptoms for Boolean
        dto.setCloseContact(entity.getCloseContact()); // Assuming entity uses getCloseContact for Boolean
        dto.setTravelHistory(entity.getTravelHistory()); // Assuming entity uses getTravelHistory for Boolean
        dto.setDeclarationDate(entity.getDeclarationDate());
        dto.setAdditionalInfo(entity.getAdditionalInfo());
        dto.setIsDraft(entity.getIsDraft()); // Assuming entity uses getIsDraft for Boolean

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
        // Assuming VaccinationRecordDTO has getRecordId(), but it's usually generated by DB for new records.
        // If recordId is present in DTO and meant for update, additional logic would be needed here.
        vaccinationEntity.setVaccineName(vaccinationDto.getVaccineName());
        vaccinationEntity.setVaccinationDate(vaccinationDto.getVaccinationDate());
        vaccinationEntity.setDosage(vaccinationDto.getDosage());
        // The HealthDeclaration reference will be set when adding to the HealthDeclaration's list
        return vaccinationEntity;
    }

    // Method to convert VaccinationRecord entity to VaccinationRecordDTO
    private VaccinationRecordDTO convertToVaccinationDTO(VaccinationRecord vaccinationEntity) {
        VaccinationRecordDTO vaccinationDto = new VaccinationRecordDTO(); 
        vaccinationDto.setRecordId(vaccinationEntity.getRecordId());
        vaccinationDto.setVaccineName(vaccinationEntity.getVaccineName());
        vaccinationDto.setVaccinationDate(vaccinationEntity.getVaccinationDate());
        vaccinationDto.setDosage(vaccinationEntity.getDosage());
        return vaccinationDto;
    }
}
