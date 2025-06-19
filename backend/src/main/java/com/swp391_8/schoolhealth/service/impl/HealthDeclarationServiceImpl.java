package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.DeclaredVaccinationRecordDTO;
import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.DeclaredVaccinationRecord;
import com.swp391_8.schoolhealth.model.HealthDeclaration;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Vaccine;
import com.swp391_8.schoolhealth.repository.HealthDeclarationRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.VaccineRepository;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
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
    private VaccineRepository vaccineRepository;

    @Override
    @Transactional
    public HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto, String username) {
        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "code", dto.getStudentCode()));

        User parentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User (Parent)", "username", username));

        // Verify parentUser has a relationship with this student
        if (!parentStudentRelationshipRepository.existsByParentUserUserIdAndStudentStudentCode(
                parentUser.getUserId(), student.getStudentCode())) { // Use Integer directly
            throw new SecurityException("User " + username + " is not authorized to submit health declarations for student " + dto.getStudentCode());
        }

        HealthDeclaration declaration;
        if (dto.getDeclarationId() != null) {
            declaration = healthDeclarationRepository.findById(dto.getDeclarationId())
                    .orElseThrow(() -> new ResourceNotFoundException("HealthDeclaration", "id", dto.getDeclarationId()));

            // Ensure the existing declaration belongs to the student
            if (!declaration.getStudent().getStudentCode().equals(student.getStudentCode())) {
                // This check implicitly verifies parent authorization as well,
                // because the parentUser's relationship to *this* student was already checked.
                // If the declaration is for a different student, it's an issue.
                throw new SecurityException("User " + username + " is not authorized to update this health declaration as it belongs to a different student.");
            }
        } else {
            declaration = new HealthDeclaration();
            declaration.setStudent(student);
            declaration.setVaccinations(new ArrayList<>());
        }

        // Update fields from DTO
        declaration.setEmergencyContactName(dto.getEmergencyContactName());
        declaration.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        declaration.setPhysicianName(dto.getPhysicianName());
        declaration.setPhysicianPhone(dto.getPhysicianPhone());
        declaration.setAllergies(dto.getAllergies());
        declaration.setMedicalConditions(dto.getMedicalConditions());
        declaration.setVisionScreeningResult(dto.getVisionScreeningResult());
        declaration.setVisionScreeningDate(dto.getVisionScreeningDate());
        declaration.setHearingScreeningResult(dto.getHearingScreeningResult());
        declaration.setHearingScreeningDate(dto.getHearingScreeningDate());
        declaration.setDentalScreeningResult(dto.getDentalScreeningResult());
        declaration.setDentalScreeningDate(dto.getDentalScreeningDate());
        declaration.setScoliosisScreeningResult(dto.getScoliosisScreeningResult());
        declaration.setScoliosisScreeningDate(dto.getScoliosisScreeningDate());
        declaration.setNotes(dto.getNotes());
        declaration.setConsentSignature(dto.getConsentSignature());
        declaration.setSymptoms(dto.getSymptoms());
        declaration.setHasSymptoms(dto.isHasSymptoms());
        declaration.setCloseContact(dto.isCloseContact());
        declaration.setTravelHistory(dto.isTravelHistory());
        declaration.setDeclarationDate(dto.getDeclarationDate());
        declaration.setAdditionalInfo(dto.getAdditionalInfo());
        declaration.setIsDraft(dto.isDraft());

        if (dto.getVaccinations() != null) {
            List<DeclaredVaccinationRecord> vaccinationEntities = dto.getVaccinations().stream()
                    .map(vaccDto -> convertToVaccinationEntity(vaccDto, declaration))
                    .collect(Collectors.toList());
            declaration.getVaccinations().clear();
            declaration.getVaccinations().addAll(vaccinationEntities);
            // Ensure bidirectional relationship is set if DeclaredVaccinationRecord owns it
            vaccinationEntities.forEach(vacc -> vacc.setHealthDeclaration(declaration));
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
        Optional<HealthDeclaration> declaration = healthDeclarationRepository.findFirstByStudent_StudentCodeAndIsDraftOrderByDeclarationDateDesc(studentCode, false);
        if (declaration.isPresent()) {
            return declaration.map(this::convertToDTO);
        } else {
            // If no submitted version, check for a draft
            return healthDeclarationRepository.findFirstByStudent_StudentCodeAndIsDraftOrderByDeclarationDateDesc(studentCode, true)
                .map(this::convertToDTO);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationDTO> getAllHealthDeclarationsByStudentCode(String studentCode) {
        List<HealthDeclaration> declarations = healthDeclarationRepository.findAllByStudent_StudentCodeOrderByDeclarationDateDesc(studentCode);
        return declarations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    // Helper to convert Entity to DTO
    private HealthDeclarationDTO convertToDTO(HealthDeclaration entity) {
        HealthDeclarationDTO dto = new HealthDeclarationDTO();
        dto.setDeclarationId(entity.getDeclarationId());
        dto.setStudentCode(entity.getStudent().getStudentCode());
        if (entity.getStudent().getUser() != null) { // Student might not always have a direct User link, but if it does
            // This part is tricky as HealthDeclaration doesn't store parent directly.
            // The "submitted by" context would typically come from who called the service.
            // For now, we'll leave parent username out of the DTO from this conversion,
            // as it's not directly on the HealthDeclaration entity.
        }
        dto.setEmergencyContactName(entity.getEmergencyContactName());
        dto.setEmergencyContactPhone(entity.getEmergencyContactPhone());
        dto.setPhysicianName(entity.getPhysicianName());
        dto.setPhysicianPhone(entity.getPhysicianPhone());
        dto.setAllergies(entity.getAllergies());
        dto.setMedicalConditions(entity.getMedicalConditions());
        dto.setVisionScreeningResult(entity.getVisionScreeningResult());
        dto.setVisionScreeningDate(entity.getVisionScreeningDate());
        dto.setHearingScreeningResult(entity.getHearingScreeningResult());
        dto.setHearingScreeningDate(entity.getHearingScreeningDate());
        dto.setDentalScreeningResult(entity.getDentalScreeningResult());
        dto.setDentalScreeningDate(entity.getDentalScreeningDate());
        dto.setScoliosisScreeningResult(entity.getScoliosisScreeningResult());
        dto.setScoliosisScreeningDate(entity.getScoliosisScreeningDate());
        dto.setNotes(entity.getNotes());
        dto.setConsentSignature(entity.getConsentSignature());
        dto.setSymptoms(entity.getSymptoms());
        dto.setHasSymptoms(entity.isHasSymptoms());
        dto.setCloseContact(entity.isCloseContact());
        dto.setTravelHistory(entity.isTravelHistory());
        dto.setDeclarationDate(entity.getDeclarationDate());
        dto.setAdditionalInfo(entity.getAdditionalInfo());
        dto.setDraft(entity.getIsDraft());

        if (entity.getVaccinations() != null) {
            List<DeclaredVaccinationRecordDTO> vaccinationDTOs = entity.getVaccinations().stream()
                    .map(this::convertToVaccinationDTO)
                    .collect(Collectors.toList());
            dto.setVaccinations(vaccinationDTOs);
        }
        return dto;
    }

    // Method to convert DeclaredVaccinationRecordDTO to DeclaredVaccinationRecord entity
    private DeclaredVaccinationRecord convertToVaccinationEntity(DeclaredVaccinationRecordDTO dto, HealthDeclaration declaration) {
        DeclaredVaccinationRecord entity = new DeclaredVaccinationRecord();
        entity.setStudent(declaration.getStudent()); // Student is set via HealthDeclaration's student

        if (dto.getVaccineId() != null) {
            Vaccine vaccine = vaccineRepository.findById(dto.getVaccineId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + dto.getVaccineId()));
            entity.setVaccine(vaccine);
        } else if (dto.getVaccineName() != null && !dto.getVaccineName().isBlank()) {
             // Optional: Try to find vaccine by name if ID is not provided
            Vaccine vaccine = vaccineRepository.findByNameIgnoreCase(dto.getVaccineName())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with name: " + dto.getVaccineName()));
            entity.setVaccine(vaccine);
        } else {
            throw new IllegalArgumentException("Either Vaccine ID or Vaccine Name is required for declared vaccinations.");
        }


        entity.setVaccinationDate(dto.getVaccinationDate());
        entity.setDoseNumber(dto.getDoseNumber());
        entity.setProviderName(dto.getProviderName());
        entity.setDocumentUrl(dto.getDocumentUrl());
        entity.setParentNotes(dto.getParentNotes());
        entity.setVerificationStatus(DeclaredVaccinationRecord.VerificationStatus.PENDING_VERIFICATION);
        entity.setHealthDeclaration(declaration); // Set the owning side

        // Set submittedBy and submissionDate if the DTO contains them (e.g., if a nurse is entering on behalf of a parent)
        // For now, assuming the logged-in user (parent) is the submitter implicitly.
        // If explicit submitter tracking is needed, DTO and logic should be expanded.
        // entity.setSubmittedBy(...);
        // entity.setSubmissionDate(LocalDateTime.now()); // Or from DTO if applicable

        return entity;
    }

    // Method to convert DeclaredVaccinationRecord entity to DeclaredVaccinationRecordDTO
    private DeclaredVaccinationRecordDTO convertToVaccinationDTO(DeclaredVaccinationRecord entity) {
        DeclaredVaccinationRecordDTO dto = new DeclaredVaccinationRecordDTO();
        dto.setRecordId(entity.getId());
        if (entity.getStudent() != null) {
            dto.setStudentCode(entity.getStudent().getStudentCode());
            dto.setStudentName(entity.getStudent().getFullName());
        }
        if (entity.getVaccine() != null) {
            dto.setVaccineId(entity.getVaccine().getVaccineId());
            dto.setVaccineName(entity.getVaccine().getName());
        }
        dto.setVaccinationDate(entity.getVaccinationDate());
        dto.setDoseNumber(entity.getDoseNumber());
        dto.setProviderName(entity.getProviderName());
        dto.setDocumentUrl(entity.getDocumentUrl());
        if (entity.getVerificationStatus() != null) {
            dto.setVerificationStatus(entity.getVerificationStatus().name());
        }
        if (entity.getVerifiedByNurse() != null) {
            dto.setVerifiedByNurseUsername(entity.getVerifiedByNurse().getUsername());
        }
        dto.setVerificationDate(entity.getVerificationDate());
        dto.setVerificationNotes(entity.getVerificationNotes());
        dto.setParentNotes(entity.getParentNotes());
        dto.setSubmissionDate(entity.getSubmissionDate()); // Ensure this is mapped
        if (entity.getSubmittedBy() != null) {
            dto.setSubmittedByUsername(entity.getSubmittedBy().getUsername());
        }
        return dto;
    }
}
