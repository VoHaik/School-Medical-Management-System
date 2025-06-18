package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.DeclaredVaccinationRecordDTO;
import com.swp391_8.schoolhealth.dto.EmergencyContactDTO;
import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.MedicationDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.DeclaredVaccinationRecord;
import com.swp391_8.schoolhealth.model.HealthDeclaration;
import com.swp391_8.schoolhealth.model.HealthDeclarationChronicIllness;
import com.swp391_8.schoolhealth.model.HealthDeclarationEmergencyContact;
import com.swp391_8.schoolhealth.model.HealthDeclarationMedication;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Vaccine;
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.MedicationRequest.MedicationRequestStatus;
import com.swp391_8.schoolhealth.repository.HealthDeclarationChronicIllnessRepository;
import com.swp391_8.schoolhealth.repository.HealthDeclarationEmergencyContactRepository;
import com.swp391_8.schoolhealth.repository.HealthDeclarationMedicationRepository;
import com.swp391_8.schoolhealth.repository.HealthDeclarationRepository;
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.VaccineRepository;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HealthDeclarationServiceImpl implements HealthDeclarationService {
    
    private static final Logger logger = LoggerFactory.getLogger(HealthDeclarationServiceImpl.class);

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

    @Autowired
    private HealthDeclarationMedicationRepository medicationRepository;

    @Autowired
    private HealthDeclarationEmergencyContactRepository emergencyContactRepository;

    @Autowired
    private HealthDeclarationChronicIllnessRepository chronicIllnessRepository;

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

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
        }        // Update fields from DTO
        // Không cập nhật trường emergency_contact_name/phone nữa, thay vào đó dùng bảng emergency_contacts
        declaration.setPhysicianName(dto.getPhysicianName());
        declaration.setPhysicianPhone(dto.getPhysicianPhone());
        declaration.setAllergies(dto.getAllergies());
        
        // Ưu tiên dùng chronicIllnesses thay vì medicalConditions
        if (dto.getChronicIllnesses() != null) {
            declaration.setMedicalConditions(dto.getChronicIllnesses());
        } else if (dto.getMedicalConditions() != null) {
            declaration.setMedicalConditions(dto.getMedicalConditions());
        }
        
        // Handle other standard fields
        declaration.setVisionScreeningResult(dto.getVisionScreeningResult());
        declaration.setVisionScreeningDate(dto.getVisionScreeningDate());
        declaration.setHearingScreeningResult(dto.getHearingScreeningResult());
        declaration.setHearingScreeningDate(dto.getHearingScreeningDate());
        declaration.setDentalScreeningResult(dto.getDentalScreeningResult());
        declaration.setDentalScreeningDate(dto.getDentalScreeningDate());
        declaration.setScoliosisScreeningResult(dto.getScoliosisScreeningResult());
        declaration.setScoliosisScreeningDate(dto.getScoliosisScreeningDate());
        
        // Handle notes and combine with additional fields if needed
        StringBuilder combinedNotes = new StringBuilder();
        if (dto.getNotes() != null && !dto.getNotes().isEmpty()) {
            combinedNotes.append(dto.getNotes());
        }
          // Cập nhật các trường mới thay vì gộp vào notes
        declaration.setMedicalHistory(dto.getMedicalHistory());
        declaration.setSpecialNeeds(dto.getSpecialNeeds());
        declaration.setPhysicalLimitations(dto.getPhysicalLimitations());
        declaration.setMentalHealthConcerns(dto.getMentalHealthConcerns());
        declaration.setDietaryRestrictions(dto.getDietaryRestrictions());
        declaration.setVisionStatus(dto.getVisionStatus());
        declaration.setHearingStatus(dto.getHearingStatus());
        
        // Notes vẫn giữ lại độc lập
        declaration.setNotes(dto.getNotes());
        
        // Continue with other fields
        declaration.setConsentSignature(dto.getConsentSignature());
        declaration.setSymptoms(dto.getSymptoms());
        declaration.setHasSymptoms(dto.isHasSymptoms());
        declaration.setCloseContact(dto.isCloseContact());
        declaration.setTravelHistory(dto.isTravelHistory());
        declaration.setDeclarationDate(dto.getDeclarationDate() != null ? dto.getDeclarationDate() : LocalDate.now());
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
        
        // Handle medications
        if (dto.getMedications() != null && !dto.getMedications().isEmpty()) {
            // Clear existing medications if any
            medicationRepository.findByHealthDeclarationDeclarationId(savedDeclaration.getDeclarationId())
                .forEach(medication -> medicationRepository.delete(medication));
            
            // Save new medications
            for (MedicationDTO medicationDTO : dto.getMedications()) {
                HealthDeclarationMedication medication = new HealthDeclarationMedication();
                medication.setHealthDeclaration(savedDeclaration);
                medication.setMedicationName(medicationDTO.getMedicationName() != null ? 
                    medicationDTO.getMedicationName() : medicationDTO.getName()); // Backward compatibility
                medication.setDosage(medicationDTO.getDosage());
                medication.setFrequency(medicationDTO.getFrequency());
                medication.setStartDate(medicationDTO.getStartDate());
                medication.setEndDate(medicationDTO.getEndDate());
                medication.setReason(medicationDTO.getReason());
                medication.setNotes(medicationDTO.getNotes());
                medicationRepository.save(medication);
            }
        }
        
        // Handle emergency contacts
        if (dto.getEmergencyContacts() != null && !dto.getEmergencyContacts().isEmpty()) {
            // Clear existing emergency contacts if any
            emergencyContactRepository.findByHealthDeclarationDeclarationId(savedDeclaration.getDeclarationId())
                .forEach(contact -> emergencyContactRepository.delete(contact));
            
            // Save new emergency contacts
            for (EmergencyContactDTO contactDTO : dto.getEmergencyContacts()) {
                HealthDeclarationEmergencyContact contact = new HealthDeclarationEmergencyContact();
                contact.setHealthDeclaration(savedDeclaration);
                contact.setContactName(contactDTO.getName());
                contact.setRelationship(contactDTO.getRelationship());
                contact.setPhoneNumber(contactDTO.getPhoneNumber() != null ? 
                    contactDTO.getPhoneNumber() : contactDTO.getPhone()); // Backward compatibility
                contact.setAlternativePhone(contactDTO.getAlternativePhone());
                contact.setEmail(contactDTO.getEmail());
                contact.setAddress(contactDTO.getAddress());
                contact.setIsPrimary(contactDTO.getIsPrimary());
                contact.setNotes(contactDTO.getNotes());
                emergencyContactRepository.save(contact);
            }
        }
          // Luôn cập nhật bảng chronic_illnesses từ field chronicIllnesses
        if (dto.getChronicIllnesses() != null) {
            // Clear existing chronic illnesses if any
            chronicIllnessRepository.findByHealthDeclarationDeclarationId(savedDeclaration.getDeclarationId())
                .forEach(illness -> chronicIllnessRepository.delete(illness));
            
            // Save new chronic illnesses
            for (String illnessName : dto.getChronicIllnesses()) {
                if (illnessName != null && !illnessName.trim().isEmpty()) {
                    HealthDeclarationChronicIllness illness = new HealthDeclarationChronicIllness();
                    illness.setHealthDeclaration(savedDeclaration);
                    illness.setChronicIllness(illnessName);
                    chronicIllnessRepository.save(illness);
                }
            }
        }

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

    @Override
    public HealthDeclarationDTO getHealthDeclarationById(Integer declarationId) {
        HealthDeclaration declaration = healthDeclarationRepository.findById(declarationId)
            .orElseThrow(() -> new ResourceNotFoundException("Health Declaration", "id", declarationId));
        return convertToDTO(declaration);
    }
    
    @Override
    public List<HealthDeclarationDTO> getPendingHealthDeclarations() {
        // Lấy danh sách khai báo sức khỏe có trạng thái PENDING
        List<HealthDeclaration> pendingDeclarations = healthDeclarationRepository.findByStatus(
            HealthDeclaration.HealthDeclarationStatus.PENDING);
            
        // Chuyển đổi sang DTO và trả về
        return pendingDeclarations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public HealthDeclarationDTO reviewHealthDeclaration(
            Integer declarationId, 
            String status,
            String reviewNotes,
            String reviewerUsername) {
        
        // Tìm khai báo sức khỏe cần phê duyệt
        HealthDeclaration declaration = healthDeclarationRepository.findById(declarationId)
            .orElseThrow(() -> new ResourceNotFoundException("Health Declaration", "id", declarationId));
        
        // Tìm thông tin người duyệt
        User reviewer = userRepository.findByUsername(reviewerUsername)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", reviewerUsername));
        
        // Kiểm tra xem người dùng có quyền phê duyệt không (thường là y tá)
        boolean isNurseOrAdmin = reviewer.getRole().getRoleName().equals("ROLE_SCHOOLNURSE") || 
                               reviewer.getRole().getRoleName().equals("ROLE_ADMIN");
        
        if (!isNurseOrAdmin) {
            throw new SecurityException("User is not authorized to review health declarations");
        }
        
        // Cập nhật trạng thái
        HealthDeclaration.HealthDeclarationStatus newStatus;
        try {
            newStatus = HealthDeclaration.HealthDeclarationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        declaration.setStatus(newStatus);
        declaration.setReviewedBy(reviewer);
        declaration.setReviewedAt(LocalDate.now());
        declaration.setReviewNotes(reviewNotes);
        
        // Lưu vào database
        HealthDeclaration updatedDeclaration = healthDeclarationRepository.save(declaration);
        
        // Chuyển đổi và trả về DTO
        return convertToDTO(updatedDeclaration);
    }
      @Override
    public List<MedicationDTO> getApprovedMedicationsForStudent(String studentCode) {
        // Chỉ lấy thuốc đã được y tá duyệt (APPROVED) hoặc đã được cấp phát (ADMINISTERED)
        // Thuốc ở các trạng thái khác như PENDING, REJECTED, CANCELLED_BY_PARENT sẽ không được hiển thị
        List<MedicationRequestStatus> validStatuses = Arrays.asList(
            MedicationRequestStatus.APPROVED, 
            MedicationRequestStatus.ADMINISTERED
        );
        
        if (studentCode == null || studentCode.trim().isEmpty()) {
            logger.warn("Attempted to get approved medications with null or empty studentCode");
            return new ArrayList<>();
        }
        
        try {
            // Lấy danh sách yêu cầu thuốc đã được phê duyệt hoặc đang được sử dụng
            List<MedicationRequest> approvedMedications = medicationRequestRepository
                .findByStudent_StudentCodeAndStatusInOrderByStartDateDesc(studentCode, validStatuses);
            
            logger.debug("Found {} approved medications for student {}", approvedMedications.size(), studentCode);
            
            // Chuyển đổi từ MedicationRequest sang MedicationDTO
            return approvedMedications.stream()
                .map(this::convertMedicationRequestToDTO)
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving approved medications for student {}: {}", studentCode, e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    // Phương thức chuyển đổi từ MedicationRequest sang MedicationDTO
    private MedicationDTO convertMedicationRequestToDTO(MedicationRequest request) {
        MedicationDTO dto = new MedicationDTO();
        dto.setMedicationId(request.getRequestId()); // Sử dụng request ID làm medication ID
        dto.setMedicationName(request.getMedicationName());
        dto.setDosage(request.getDosage());
        dto.setFrequency(request.getFrequency());
        dto.setStartDate(java.sql.Date.valueOf(request.getStartDate())); // Chuyển LocalDate sang Date
        dto.setEndDate(java.sql.Date.valueOf(request.getEndDate())); // Chuyển LocalDate sang Date
        dto.setReason(request.getReason());
        dto.setNotes(request.getNotes());
        return dto;
    }


    // Helper to convert Entity to DTO
    private HealthDeclarationDTO convertToDTO(HealthDeclaration entity) {
        HealthDeclarationDTO dto = new HealthDeclarationDTO();
        dto.setDeclarationId(entity.getDeclarationId());
        dto.setStudentCode(entity.getStudent().getStudentCode());
          // Ưu tiên dùng chronicIllnesses thay vì medicalConditions
        // Trường medicalConditions chỉ giữ lại để tương thích ngược với mã cũ
        if (entity.getMedicalConditions() != null) {
            dto.setChronicIllnesses(entity.getMedicalConditions());
            // Thiết lập medicalConditions chỉ để tương thích ngược
            dto.setMedicalConditions(entity.getMedicalConditions());
        } else {
            // Initialize as empty lists to prevent NPEs
            dto.setChronicIllnesses(new ArrayList<>());
            dto.setMedicalConditions(new ArrayList<>());
        }
        
        // Truy vấn trực tiếp từ bảng chronic_illnesses để đảm bảo dữ liệu chính xác
        List<HealthDeclarationChronicIllness> chronicIllnessEntities = chronicIllnessRepository
            .findByHealthDeclarationDeclarationId(entity.getDeclarationId());
        if (chronicIllnessEntities != null && !chronicIllnessEntities.isEmpty()) {
            List<String> chronicIllnesses = chronicIllnessEntities.stream()
                .map(HealthDeclarationChronicIllness::getChronicIllness)
                .collect(Collectors.toList());
            dto.setChronicIllnesses(chronicIllnesses);
        }
        
        // Create empty lists for new fields to avoid NPEs in frontend
        dto.setMedications(new ArrayList<>());
        dto.setEmergencyContacts(new ArrayList<>());
        
        // Get medications from the database
        List<HealthDeclarationMedication> medications = medicationRepository.findByHealthDeclarationDeclarationId(entity.getDeclarationId());
        if (medications != null && !medications.isEmpty()) {
            List<MedicationDTO> medicationDTOs = medications.stream()
                .map(this::convertToMedicationDTO)
                .collect(Collectors.toList());
            dto.setMedications(medicationDTOs);
        }
        
        // Get emergency contacts from the database
        List<HealthDeclarationEmergencyContact> emergencyContacts = emergencyContactRepository.findByHealthDeclarationDeclarationId(entity.getDeclarationId());
        if (emergencyContacts != null && !emergencyContacts.isEmpty()) {
            List<EmergencyContactDTO> contactDTOs = emergencyContacts.stream()
                .map(this::convertToEmergencyContactDTO)
                .collect(Collectors.toList());
            dto.setEmergencyContacts(contactDTOs);
        }

        if (entity.getStudent().getUser() != null) { // Student might not always have a direct User link, but if it does
            // This part is tricky as HealthDeclaration doesn't store parent directly.
            // The "submitted by" context would typically come from who called the service.
            // For now, we'll leave parent username out of the DTO from this conversion,
            // as it's not directly on the HealthDeclaration entity.
        }        // Không cần đặt các trường emergency_contact_name/phone nữa vì đã có trong emergencyContacts
        // Các getter này được giữ lại chỉ để tương thích ngược và trả về giá trị từ bảng mới
        dto.setPhysicianName(entity.getPhysicianName());
        dto.setPhysicianPhone(entity.getPhysicianPhone());
        // Set allergies with null check
        if (entity.getAllergies() != null) {
            dto.setAllergies(entity.getAllergies());
        } else {
            dto.setAllergies(new ArrayList<>());
        }
        
        // medicalConditions already set above
        
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
        dto.setCloseContact(entity.isCloseContact());        dto.setTravelHistory(entity.isTravelHistory());
        dto.setDeclarationDate(entity.getDeclarationDate());
        dto.setAdditionalInfo(entity.getAdditionalInfo());
        dto.setDraft(entity.getIsDraft());
        
        // Thêm các trường mới
        dto.setVisionStatus(entity.getVisionStatus());
        dto.setHearingStatus(entity.getHearingStatus());
        dto.setSpecialNeeds(entity.getSpecialNeeds());
        dto.setPhysicalLimitations(entity.getPhysicalLimitations());
        dto.setMentalHealthConcerns(entity.getMentalHealthConcerns());
        dto.setDietaryRestrictions(entity.getDietaryRestrictions());
        dto.setMedicalHistory(entity.getMedicalHistory());
        
        // Map thông tin phê duyệt
        if (entity.getStatus() != null) {
            dto.setStatus(entity.getStatus().name());
        }
        
        if (entity.getReviewedBy() != null) {
            dto.setReviewedByUserId(entity.getReviewedBy().getUserId());
            dto.setReviewedByUsername(entity.getReviewedBy().getUsername());
            dto.setReviewedByName(entity.getReviewedBy().getFullName());
        }
        
        dto.setReviewedAt(entity.getReviewedAt());
        dto.setReviewNotes(entity.getReviewNotes());

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

    // Helper method to convert HealthDeclarationMedication entity to MedicationDTO
    private MedicationDTO convertToMedicationDTO(HealthDeclarationMedication entity) {
        MedicationDTO dto = new MedicationDTO();
        dto.setMedicationId(entity.getMedicationId());
        dto.setMedicationName(entity.getMedicationName());
        dto.setDosage(entity.getDosage());
        dto.setFrequency(entity.getFrequency());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setReason(entity.getReason());
        dto.setNotes(entity.getNotes());
        return dto;
    }
    
    // Helper method to convert HealthDeclarationEmergencyContact entity to EmergencyContactDTO
    private EmergencyContactDTO convertToEmergencyContactDTO(HealthDeclarationEmergencyContact entity) {
        EmergencyContactDTO dto = new EmergencyContactDTO();
        dto.setContactId(entity.getContactId());
        dto.setName(entity.getContactName());
        dto.setRelationship(entity.getRelationship());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setAlternativePhone(entity.getAlternativePhone());
        dto.setEmail(entity.getEmail());
        dto.setAddress(entity.getAddress());
        dto.setIsPrimary(entity.getIsPrimary());
        dto.setNotes(entity.getNotes());
        dto.setEmergency(true); // Default to true for backward compatibility
        return dto;
    }
}
