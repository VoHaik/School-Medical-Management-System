package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.DeclaredVaccinationRecordDTO;
import com.swp391_8.schoolhealth.dto.DeclaredVaccinationRecordRequestDTO;
import com.swp391_8.schoolhealth.model.DeclaredVaccinationRecord;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Vaccine; // Import Vaccine
import com.swp391_8.schoolhealth.model.ERole; // Added import
import com.swp391_8.schoolhealth.repository.DeclaredVaccinationRecordRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.VaccineRepository; // Import VaccineRepository
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate; // For LocalDate
import java.time.LocalDateTime; // For LocalDateTime
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeclaredVaccinationRecordService {

    private final StudentRepository studentRepository;
    private final DeclaredVaccinationRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final VaccineRepository vaccineRepository; // Autowire VaccineRepository
    private final SecurityService securityService;
    private final NotificationService notificationService; // Added

    @Autowired
    public DeclaredVaccinationRecordService(StudentRepository studentRepository,
                                           DeclaredVaccinationRecordRepository declaredVaccinationRecordRepository,
                                           UserRepository userRepository,
                                           VaccineRepository vaccineRepository,
                                           SecurityService securityService,
                                           NotificationService notificationService) { // Added
        this.studentRepository = studentRepository;
        this.recordRepository = declaredVaccinationRecordRepository;
        this.userRepository = userRepository;
        this.vaccineRepository = vaccineRepository;
        this.securityService = securityService;
        this.notificationService = notificationService; // Added
    }

    public DeclaredVaccinationRecordDTO convertToDTO(DeclaredVaccinationRecord record) {
        DeclaredVaccinationRecordDTO dto = new DeclaredVaccinationRecordDTO();
        dto.setRecordId(record.getId()); // Use getId()
        if (record.getStudent() != null) {
            dto.setStudentCode(record.getStudent().getStudentCode());
            dto.setStudentName(record.getStudent().getFullName());
        }
        if (record.getVaccine() != null) { // Use Vaccine entity
            dto.setVaccineId(record.getVaccine().getVaccineId());
            dto.setVaccineName(record.getVaccine().getName());
        }
        dto.setVaccinationDate(record.getVaccinationDate()); // Already LocalDate
        dto.setDoseNumber(record.getDoseNumber());
        dto.setProviderName(record.getProviderName());
        dto.setDocumentUrl(record.getDocumentUrl());
        dto.setVerificationStatus(record.getVerificationStatus().name()); // Convert Enum to String
        if (record.getVerifiedByNurse() != null) {
            dto.setVerifiedByNurseUsername(record.getVerifiedByNurse().getUsername());
            dto.setVerifiedByNurseName(record.getVerifiedByNurse().getFullName());
        }
        dto.setVerificationDate(record.getVerificationDate()); // Already LocalDate
        dto.setVerificationNotes(record.getVerificationNotes());
        dto.setParentNotes(record.getParentNotes());
        dto.setCreatedAt(record.getCreatedAt()); // Already LocalDateTime
        dto.setUpdatedAt(record.getUpdatedAt()); // Already LocalDateTime
        if (record.getSubmittedBy() != null) {
            dto.setSubmittedByUsername(record.getSubmittedBy().getUsername());
            dto.setSubmittedByName(record.getSubmittedBy().getFullName());
        }
        dto.setSubmissionDate(record.getSubmissionDate());
        return dto;
    }

    // Method signature updated to include studentCode and MultipartFile
    public DeclaredVaccinationRecordDTO submitDeclaredVaccination(DeclaredVaccinationRecordRequestDTO requestDTO, String studentCode, MultipartFile document) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Security check: Ensure the authenticated user is a parent of the student
        if (!securityService.isParentOfStudentByCode(authentication, studentCode)) {
            throw new AccessDeniedException("User is not authorized to submit declared vaccinations for this student.");
        }

        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        Vaccine vaccine = vaccineRepository.findById(requestDTO.getVaccineId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + requestDTO.getVaccineId()));

        User submittedBy = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Submitting user not found"));

        DeclaredVaccinationRecord record = new DeclaredVaccinationRecord();
        record.setStudent(student);
        record.setVaccine(vaccine);
        record.setVaccinationDate(requestDTO.getVaccinationDate());
        record.setDoseNumber(requestDTO.getDoseNumber());
        // Fields from RequestDTO that should map to the entity
        record.setProviderName(requestDTO.getProviderName()); // Added from RequestDTO
        record.setParentNotes(requestDTO.getParentNotes()); // Added from RequestDTO
        // record.setLotNumber(requestDTO.getLotNumber()); // Already present in entity but not in DTO, consider adding to DTO if needed by frontend
        // record.setLocationAdministered(requestDTO.getLocationAdministered()); // Already present in entity but not in DTO

        record.setSubmittedBy(submittedBy);
        record.setSubmissionDate(LocalDateTime.now());
        record.setVerificationStatus(DeclaredVaccinationRecord.VerificationStatus.PENDING_VERIFICATION);

        if (document != null && !document.isEmpty()) {
            // For now, just use the original filename as a placeholder if a document is provided.
            // This part needs a proper file storage solution if file uploads are to be fully supported.
            record.setDocumentUrl("uploads/declared_vaccinations/" + studentCode + "/" + document.getOriginalFilename()); 
        } else {
            record.setDocumentUrl(requestDTO.getDocumentUrl());
        }

        DeclaredVaccinationRecord savedRecord = recordRepository.save(record);
        // Add notification logic here
        sendSubmissionNotification(savedRecord);
        return convertToDTO(savedRecord);
    }
    private void sendSubmissionNotification(DeclaredVaccinationRecord record) {
        if (record.getStudent() == null || record.getSubmittedBy() == null) {
            return; // Cannot send notification without student or submitter
        }
        Student student = record.getStudent();
        User parent = record.getSubmittedBy();

        String studentName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String vaccineName = record.getVaccine() != null ? record.getVaccine().getName() : "Unknown Vaccine";

        // Notify nurses about the new submission
        List<User> nurses = userRepository.findByRole_RoleName(ERole.ROLE_SCHOOLNURSE.name());
        if (!nurses.isEmpty()) {
            String messageToNurse = String.format(
                "A new declared vaccination record for %s (Vaccine: %s) has been submitted by %s and is pending verification.",
                studentName, vaccineName, parent.getFullName() != null ? parent.getFullName() : parent.getUsername()
            );
            String linkToNurse = "/nurse/declared-vaccinations/pending"; // Adjust link as needed
            for (User nurse : nurses) {
                this.notificationService.createNotification(nurse, "DECLARED_VACCINATION_SUBMITTED", messageToNurse, linkToNurse);
            }
        }
    }

    public List<DeclaredVaccinationRecordDTO> getDeclaredRecordsByStudentCode(String studentCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Validate student exists first
        Student student = studentRepository.findByStudentCode(studentCode)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        if (securityService.isParent(authentication)) {
            if (!securityService.isParentOfStudentByCode(authentication, student.getStudentCode())) { // Use studentCode from fetched student
                throw new AccessDeniedException("Parent is not authorized to view these declared records.");
            }
        } else if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            // Allow student to see their own records if they are the user associated with the student entity
            User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            if (student.getUser() == null || !student.getUser().getUserId().equals(currentUser.getUserId())) {
                 throw new AccessDeniedException("User is not authorized to view these declared records.");
            }
        }

        return recordRepository.findByStudent_StudentCode(studentCode).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DeclaredVaccinationRecordDTO> getPendingVerificationRecords() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User is not authorized to view pending verification records.");
        }
        return recordRepository.findByVerificationStatus(DeclaredVaccinationRecord.VerificationStatus.PENDING_VERIFICATION).stream() // Use Enum
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeclaredVaccinationRecordDTO getDeclaredRecordById(Integer recordId) {
        DeclaredVaccinationRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Declared vaccination record not found with ID: " + recordId));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentCode = record.getStudent().getStudentCode();
        Student student = record.getStudent(); // Get student object for user check

        if (securityService.isParent(authentication)) {
            if (!securityService.isParentOfStudentByCode(authentication, studentCode)){
                throw new AccessDeniedException("Parent is not authorized to view this declared record.");
            }
        } else if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)){
            // Allow student to see their own records
            User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            if (student.getUser() == null || !student.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new AccessDeniedException("User is not authorized to view this declared record.");
            }
        }

        return convertToDTO(record);
    }

    public DeclaredVaccinationRecordDTO verifyOrRejectDeclaredRecord(Integer recordId, String verifiedByUsername, boolean isVerified, String verificationNotes) {
        DeclaredVaccinationRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Declared vaccination record not found with ID: " + recordId));
        User verifier = userRepository.findByUsername(verifiedByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Verifier user not found with username: " + verifiedByUsername));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User is not authorized to verify/reject declared records.");
        }
        // Ensure the authenticated user is the one performing the verification
        if (!verifier.getUsername().equals(authentication.getName())) {
             throw new AccessDeniedException("Authenticated user does not match the provided verifier username.");
        }

        record.setVerifiedByNurse(verifier);
        record.setVerificationDate(LocalDate.now());
        record.setVerificationNotes(verificationNotes);
        if (isVerified) {
            record.setVerificationStatus(DeclaredVaccinationRecord.VerificationStatus.VERIFIED);
        } else {
            record.setVerificationStatus(DeclaredVaccinationRecord.VerificationStatus.REJECTED);
        }

        DeclaredVaccinationRecord updatedRecord = recordRepository.save(record);
        // Add notification logic here to inform the parent about the verification status update
        sendVerificationStatusNotification(updatedRecord);
        return convertToDTO(updatedRecord);
    }

    private void sendVerificationStatusNotification(DeclaredVaccinationRecord record) {
        if (record.getStudent() == null || record.getSubmittedBy() == null) {
            return; // Cannot send notification without student or submitter
        }
        Student student = record.getStudent();
        User parent = record.getSubmittedBy(); // Assuming submittedBy is the parent
        User nurse = record.getVerifiedByNurse();

        String studentName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String vaccineName = record.getVaccine() != null ? record.getVaccine().getName() : "Unknown Vaccine";
        String status = record.getVerificationStatus().toString();
        String nurseName = nurse != null && nurse.getFullName() != null ? nurse.getFullName() : (nurse != null ? nurse.getUsername() : "School Nurse");

        String messageToParent = String.format(
            "The declared vaccination record for %s (Vaccine: %s) has been %s by %s. Notes: %s",
            studentName, vaccineName, status, nurseName, record.getVerificationNotes()
        );
        String linkToParent = String.format("/parent/declared-vaccinations/record/%d", record.getId());

        this.notificationService.createNotification(parent, "DECLARED_VACCINATION_VERIFIED", messageToParent, linkToParent); // Corrected: use this.notificationService
    }

    public void deleteDeclaredRecord(Integer recordId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        DeclaredVaccinationRecord record = recordRepository.findById(recordId)
            .orElseThrow(() -> new ResourceNotFoundException("Declared vaccination record not found with ID: " + recordId));

        // Allow Admin to delete any record.
        // Allow Parent to delete their own PENDING_VERIFICATION submission.
        boolean canDelete = false;
        if (securityService.isAdmin(authentication)) {
            canDelete = true;
        } else if (securityService.isParentOfStudentByCode(authentication, record.getStudent().getStudentCode())) {
            User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (currentUser != null && record.getSubmittedBy() != null && record.getSubmittedBy().getUserId().equals(currentUser.getUserId()) &&
                record.getVerificationStatus() == DeclaredVaccinationRecord.VerificationStatus.PENDING_VERIFICATION) {
                canDelete = true;
            }
        }

        if (!canDelete) {
            throw new AccessDeniedException("User not authorized to delete this declared vaccination record or record is not in a deletable state.");
        }

        recordRepository.deleteById(recordId);
    }
}
