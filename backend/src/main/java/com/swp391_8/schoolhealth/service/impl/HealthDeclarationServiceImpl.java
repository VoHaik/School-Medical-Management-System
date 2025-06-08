package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.VaccinationRecordDTO;
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

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List; // Required for List

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
        User parent = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Parent user not found: " + username));

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + dto.getStudentId()));

        // Check if this student belongs to the parent (important for authorization)
        if (!student.getParentUser().equals(parent)) {
            throw new RuntimeException("Student does not belong to the authenticated parent.");
        }

        // If it's a draft, check if one already exists for this student by this parent.
        // If it's a final submission, it might overwrite a draft or create a new record.
        // This logic might need refinement based on how drafts vs. final submissions are handled (e.g., one draft per student).
        Optional<HealthDeclaration> existingDeclarationOpt;
        if (dto.isDraft()) {
            existingDeclarationOpt = healthDeclarationRepository.findByStudent_StudentIdAndIsDraft(dto.getStudentId(), true);
        } else {
            // If submitting a final version, it might supersede an existing draft.
            // Or, if multiple final versions are allowed, this logic changes.
            // For now, let's assume a new final submission, or it updates an existing one if ID is present.
            // If an ID is provided in DTO, it means we are updating an existing one.
            if (dto.getDeclarationId() != null) {
                 existingDeclarationOpt = healthDeclarationRepository.findById(dto.getDeclarationId());
            } else {
                // If it is a new final submission, check if there is an existing non-draft one to update or if it's a new one.
                // This part of logic depends on business rules: can a student have multiple final declarations?
                // For simplicity, let's assume we are creating a new one if no ID, or updating if ID exists.
                // If a draft is being finalized, the frontend should ideally pass the draft's ID.
                existingDeclarationOpt = Optional.empty(); 
            }
        }

        HealthDeclaration declaration = existingDeclarationOpt.orElseGet(HealthDeclaration::new);

        // Map DTO to Entity
        declaration.setStudent(student);
        declaration.setParent(parent); // Set the parent user
        declaration.setDraft(dto.isDraft());
        declaration.setAllergies(dto.getAllergies());
        declaration.setChronicIllnesses(dto.getChronicIllnesses());
        // ... map other simple fields ...
        declaration.setVisionStatus(dto.getVisionStatus());
        declaration.setHearingStatus(dto.getHearingStatus());
        declaration.setSpecialNeeds(dto.getSpecialNeeds());
        declaration.setPhysicalLimitations(dto.getPhysicalLimitations());
        declaration.setMentalHealthConcerns(dto.getMentalHealthConcerns());
        declaration.setDietaryRestrictions(dto.getDietaryRestrictions());
        declaration.setMedicalHistory(dto.getMedicalHistory());
        declaration.setHasFever(dto.isHasFever());
        declaration.setHasCough(dto.isHasCough());
        declaration.setHasSoreThroat(dto.isHasSoreThroat());
        declaration.setHasRunnyNose(dto.isHasRunnyNose());
        declaration.setHasShortnessOfBreath(dto.isHasShortnessOfBreath());
        declaration.setHasLossOfTasteOrSmell(dto.isHasLossOfTasteOrSmell());
        declaration.setHasNauseaOrVomiting(dto.isHasNauseaOrVomiting());
        declaration.setHasDiarrhea(dto.isHasDiarrhea());
        declaration.setHasFatigue(dto.isHasFatigue());
        declaration.setHasHeadache(dto.isHasHeadache());
        declaration.setHasMuscleOrBodyAches(dto.isHasMuscleOrBodyAches());
        declaration.setCloseContactWithCovidPositive(dto.isCloseContactWithCovidPositive());
        declaration.setTravelledToHighRiskArea(dto.isTravelledToHighRiskArea());
        declaration.setAdditionalNotes(dto.getAdditionalNotes());

        // Map medications (assuming MedicationRecord is an entity and DTO exists)
        // This part needs MedicationRecord entity and DTO to be defined and mapped.
        // For now, skipping if not fully defined in DTO/Entity.

        // Map emergency contacts (assuming EmergencyContact is an entity and DTO exists)
        // Skipping for now if not fully defined.

        // Map vaccinations
        if (dto.getVaccinations() != null) {
            List<VaccinationRecord> vaccinationRecords = dto.getVaccinations().stream()
                .map(this::convertToVaccinationEntity)
                .collect(Collectors.toList());
            declaration.setVaccinations(vaccinationRecords);
            vaccinationRecords.forEach(vr -> vr.setHealthDeclaration(declaration)); // Set bidirectional relationship
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
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
            // dto.setStudentName(entity.getStudent().getFullName()); // If needed
        }
        // if (entity.getParent() != null) {
        //     dto.setParentUsername(entity.getParent().getUsername()); // If needed
        // }
        dto.setDraft(entity.isDraft());
        dto.setAllergies(entity.getAllergies());
        dto.setChronicIllnesses(entity.getChronicIllnesses());
        // ... map other simple fields ...
        dto.setVisionStatus(entity.getVisionStatus());
        dto.setHearingStatus(entity.getHearingStatus());
        dto.setSpecialNeeds(entity.getSpecialNeeds());
        dto.setPhysicalLimitations(entity.getPhysicalLimitations());
        dto.setMentalHealthConcerns(entity.getMentalHealthConcerns());
        dto.setDietaryRestrictions(entity.getDietaryRestrictions());
        dto.setMedicalHistory(entity.getMedicalHistory());
        dto.setHasFever(entity.isHasFever());
        dto.setHasCough(entity.isHasCough());
        dto.setHasSoreThroat(entity.isHasSoreThroat());
        dto.setHasRunnyNose(entity.isHasRunnyNose());
        dto.setHasShortnessOfBreath(entity.isHasShortnessOfBreath());
        dto.setHasLossOfTasteOrSmell(entity.isHasLossOfTasteOrSmell());
        dto.setHasNauseaOrVomiting(entity.isHasNauseaOrVomiting());
        dto.setHasDiarrhea(entity.isHasDiarrhea());
        dto.setHasFatigue(entity.isHasFatigue());
        dto.setHasHeadache(entity.isHasHeadache());
        dto.setHasMuscleOrBodyAches(entity.isHasMuscleOrBodyAches());
        dto.setCloseContactWithCovidPositive(entity.isCloseContactWithCovidPositive());
        dto.setTravelledToHighRiskArea(entity.isTravelledToHighRiskArea());
        dto.setAdditionalNotes(entity.getAdditionalNotes());
        dto.setSubmissionDate(entity.getSubmissionDate());

        if (entity.getVaccinations() != null) {
            dto.setVaccinations(entity.getVaccinations().stream()
                .map(this::convertToVaccinationDTO)
                .collect(Collectors.toList()));
        }
        // Map medications and emergency contacts DTOs if they exist
        return dto;
    }

    // Helper to convert DTO to VaccinationRecord Entity
    private VaccinationRecord convertToVaccinationEntity(VaccinationRecordDTO dto) {
        VaccinationRecord entity = new VaccinationRecord();
        // Assuming VaccinationRecord has an ID that might be set if updating
        // entity.setId(dto.getId()); 
        entity.setVaccineName(dto.getVaccine());
        entity.setDateAdministered(dto.getDateAdministered());
        entity.setNextDueDate(dto.getNextDue());
        // entity.setAdministeredBy(dto.getAdministeredBy()); // If this field exists
        // entity.setLotNumber(dto.getLotNumber()); // If this field exists
        return entity;
    }

    // Helper to convert VaccinationRecord Entity to DTO
    private VaccinationRecordDTO convertToVaccinationDTO(VaccinationRecord entity) {
        VaccinationRecordDTO dto = new VaccinationRecordDTO();
        // dto.setId(entity.getId()); // If ID is part of DTO
        dto.setVaccine(entity.getVaccineName());
        dto.setDateAdministered(entity.getDateAdministered());
        dto.setNextDue(entity.getNextDueDate());
        // dto.setAdministeredBy(entity.getAdministeredBy());
        // dto.setLotNumber(entity.getLotNumber());
        return dto;
    }
}
