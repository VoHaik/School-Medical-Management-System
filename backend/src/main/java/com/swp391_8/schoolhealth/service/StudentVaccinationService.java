package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.StudentVaccinationDTO;
import com.swp391_8.schoolhealth.dto.StudentVaccinationRequestDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.*;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.StudentVaccinationRepository;
import com.swp391_8.schoolhealth.repository.StudentVaccinationRecordRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.VaccineRepository;
import com.swp391_8.schoolhealth.repository.HealthEventRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentVaccinationService {

    @Autowired
    private StudentVaccinationRepository studentVaccinationRepository;
    @Autowired
    private StudentVaccinationRecordRepository studentVaccinationRecordRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private VaccineRepository vaccineRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HealthEventRepository healthEventRepository;
    @Autowired
    private SecurityService securityService;
    @Autowired
    private NotificationService notificationService; 


    // Mapper to DTO
    private StudentVaccinationDTO convertToDTO(StudentVaccination sv) {
        StudentVaccinationDTO dto = new StudentVaccinationDTO();
        dto.setId(sv.getId());
        dto.setStudentCode(sv.getStudent().getStudentCode());
        dto.setStudentName(sv.getStudent().getFullName()); 
        dto.setVaccineId(sv.getVaccine().getVaccineId());
        dto.setVaccineName(sv.getVaccine().getName());
        dto.setVaccinationDate(sv.getVaccinationDate());
        dto.setDoseNumber(sv.getDoseNumber());
        dto.setBatchNumber(sv.getBatchNumber());
        dto.setAdministeringLocation(sv.getAdministeringLocation());
        if (sv.getAdministeredByNurse() != null) {
            dto.setAdministeredByNurseId(sv.getAdministeredByNurse().getUserId());
            dto.setAdministeredByNurseName(sv.getAdministeredByNurse().getFullName());
        }
        dto.setConsentStatus(sv.getConsentStatus().name());
        if (sv.getConsentGivenByParent() != null) {
            dto.setConsentGivenByParentId(sv.getConsentGivenByParent().getUserId());
            dto.setConsentGivenByParentName(sv.getConsentGivenByParent().getFullName());
        }
        dto.setConsentDate(sv.getConsentDate());
        dto.setConsentDocumentUrl(sv.getConsentDocumentUrl());
        dto.setAdministrationNotes(sv.getAdministrationNotes());
        dto.setParentNotes(sv.getParentNotes());
        dto.setNextDueDate(sv.getNextDueDate());
        if (sv.getHealthEvent() != null) {
            dto.setVaccinationEventId(sv.getHealthEvent().getEventId());
            dto.setVaccinationEventName(sv.getHealthEvent().getEventName());
        }
        dto.setCreatedAt(sv.getCreatedAt());
        dto.setUpdatedAt(sv.getUpdatedAt());
        return dto;
    }

    // Overloaded method for StudentVaccinationRecord
    private StudentVaccinationDTO convertToDTO(StudentVaccinationRecord svr) {
        StudentVaccinationDTO dto = new StudentVaccinationDTO();
        dto.setId(svr.getVaccinationRecordId());
        dto.setStudentCode(svr.getStudent().getStudentCode());
        dto.setStudentName(svr.getStudent().getFullName()); 
        dto.setVaccineName(svr.getVaccineName());
        dto.setVaccinationDate(svr.getVaccinationDate());
        dto.setAdministeredByNurseName(svr.getAdministeredBy());
        dto.setConsentStatus(svr.getVaccinationStatus().name());
        if (svr.getHealthEvent() != null) {
            dto.setVaccinationEventId(svr.getHealthEvent().getEventId());
            dto.setVaccinationEventName(svr.getHealthEvent().getEventName());
        }
        dto.setAdministrationNotes(svr.getNotes());
        dto.setNextDueDate(svr.getNextDueDate());
        dto.setCreatedAt(svr.getCreatedAt());
        dto.setUpdatedAt(svr.getUpdatedAt());
        return dto;
    }

    // Mapper from RequestDTO to Entity (for creation/update)
    private StudentVaccination convertToEntity(StudentVaccinationRequestDTO dto, StudentVaccination sv, User currentUser) {
        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + dto.getStudentCode()));
        Vaccine vaccine = vaccineRepository.findById(dto.getVaccineId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + dto.getVaccineId()));

        sv.setStudent(student);
        sv.setVaccine(vaccine);
        sv.setVaccinationDate(dto.getVaccinationDate());
        sv.setDoseNumber(dto.getDoseNumber());
        sv.setBatchNumber(dto.getBatchNumber());
        sv.setAdministeringLocation(dto.getAdministeringLocation());
        sv.setParentNotes(dto.getParentNotes()); 

        try {
            sv.setConsentStatus(StudentVaccination.ConsentStatus.valueOf(dto.getConsentStatus()));
        } catch (IllegalArgumentException e) {
            sv.setConsentStatus(StudentVaccination.ConsentStatus.PENDING_VERIFICATION); 
        }
        
        if (dto.getVaccinationEventId() != null) {
            HealthEvent event = healthEventRepository.findById(dto.getVaccinationEventId())
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent not found with ID: " + dto.getVaccinationEventId()));
            sv.setHealthEvent(event);
        } else {
            sv.setHealthEvent(null);
        }

        return sv;
    }

    @Transactional
    public StudentVaccinationDTO createStudentVaccination(StudentVaccinationRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Security Check: Ensure current user is parent of the student or a nurse/admin
        if (!securityService.isParentOfStudentByCode(authentication, requestDTO.getStudentCode()) &&
            !securityService.hasAnyRole(authentication, ERole.ROLE_SCHOOLNURSE, ERole.ROLE_ADMIN)) { // Pass ERole enum directly
            throw new AccessDeniedException("User not authorized to create this vaccination record.");
        }

        StudentVaccination sv = new StudentVaccination();
        sv = convertToEntity(requestDTO, sv, currentUser); 
        
        if (requestDTO.getConsentStatus() == null || requestDTO.getConsentStatus().trim().isEmpty()) {
            sv.setConsentStatus(StudentVaccination.ConsentStatus.PENDING_SUBMISSION);
        } else {
            try {
                sv.setConsentStatus(StudentVaccination.ConsentStatus.valueOf(requestDTO.getConsentStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                sv.setConsentStatus(StudentVaccination.ConsentStatus.PENDING_SUBMISSION); 
            }
        }
        
        if (requestDTO.getVaccinationEventId() != null) {
            HealthEvent event = healthEventRepository.findById(requestDTO.getVaccinationEventId())
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent not found with ID: " + requestDTO.getVaccinationEventId()));
            sv.setHealthEvent(event);
        }

        StudentVaccination savedSv = studentVaccinationRepository.save(sv);
        return convertToDTO(savedSv);
    }

    @Transactional(readOnly = true)
    public List<StudentVaccinationDTO> getStudentVaccinationsByStudentCode(String studentCode) { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        if (securityService.isParent(authentication)) {
            if (!securityService.isParentOfStudentByCode(authentication, student.getStudentCode())) { 
                throw new AccessDeniedException("Parent is not authorized to view vaccinations for this student.");
            }
        } else if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            // TODO: Student authorization needs to be implemented without user relationship
            // For now, allowing access - this should be secured properly
        }

        // Corrected repository method name
        return studentVaccinationRepository.findByStudent_StudentCode(studentCode).stream() 
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentVaccinationDTO> getCompletedVaccinationsByStudentCode(String studentCode) {
        // Verify student exists
        studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        // Get completed vaccination records for the student
        List<StudentVaccinationRecord> completedRecords = studentVaccinationRecordRepository.findCompletedVaccinationsByStudentCode(studentCode);
        
        // Convert to DTO
        return completedRecords.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentVaccinationDTO getStudentVaccinationById(Integer recordId) { 
        StudentVaccination sv = studentVaccinationRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentVaccination record not found with ID: " + recordId));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (securityService.isParent(authentication)) {
            if (!securityService.isParentOfStudentByCode(authentication, sv.getStudent().getStudentCode())) {
                throw new AccessDeniedException("Parent is not authorized to view this vaccination record.");
            }
        } else if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            // Allow student to see their own record
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            // Use userCode for comparison since user relationship was removed
            // For students, their userCode should match their studentCode
            if (!sv.getStudent().getStudentCode().equals(userDetails.getUserCode())){
                throw new AccessDeniedException("User is not authorized to view this vaccination record.");
            }
        }
        return convertToDTO(sv);
    }

    @Transactional
    public StudentVaccinationDTO updateStudentVaccination(Integer recordId, StudentVaccinationRequestDTO requestDTO) { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        StudentVaccination sv = studentVaccinationRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentVaccination record not found with ID: " + recordId));

        // Security Check: Ensure current user is parent of the student or a nurse/admin
        // The studentCode from DTO should be used if the student associated with the record might change.
        // However, typically, the student for a vaccination record does not change.
        // We use the student code from the existing record for security checks.
        String studentCodeFromRecord = sv.getStudent().getStudentCode();
        if (!securityService.isParentOfStudentByCode(authentication, studentCodeFromRecord) &&
            !securityService.hasAnyRole(authentication, ERole.ROLE_SCHOOLNURSE, ERole.ROLE_ADMIN)) {
            throw new AccessDeniedException("User not authorized to update this vaccination record.");
        }

        // If the student code in DTO is different, it implies changing the student for the record.
        // This might require specific permissions (e.g., admin only) or might be disallowed.
        // For now, let's assume the student associated with the record cannot be changed via update.
        // This could be a security concern if not handled carefully.
        if (!sv.getStudent().getStudentCode().equals(requestDTO.getStudentCode())) {
            // Potentially throw an error or handle as a special case if student reassignment is not allowed/needs higher privileges
            Student newStudent = studentRepository.findByStudentCode(requestDTO.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("New student not found with code: " + requestDTO.getStudentCode()));
            sv.setStudent(newStudent);
            // Re-check authorization if the student changes and the updater is a parent
            if (securityService.isParent(authentication) && !securityService.isParentOfStudentByCode(authentication, newStudent.getStudentCode())) {
                 throw new AccessDeniedException("User is not authorized to associate this record with the new student.");
            }
        }

        Vaccine vaccine = vaccineRepository.findById(requestDTO.getVaccineId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + requestDTO.getVaccineId()));
        sv.setVaccine(vaccine);

        sv.setVaccinationDate(requestDTO.getVaccinationDate());
        sv.setDoseNumber(requestDTO.getDoseNumber());
        sv.setBatchNumber(requestDTO.getBatchNumber());
        sv.setAdministeringLocation(requestDTO.getAdministeringLocation());
        sv.setAdministrationNotes(requestDTO.getAdministrationNotes());
        sv.setParentNotes(requestDTO.getParentNotes());
        sv.setNextDueDate(requestDTO.getNextDueDate());

        if (requestDTO.getVaccinationEventId() != null) {
            HealthEvent event = healthEventRepository.findById(requestDTO.getVaccinationEventId())
                .orElseThrow(() -> new ResourceNotFoundException("HealthEvent not found with ID: " + requestDTO.getVaccinationEventId()));
            sv.setHealthEvent(event);
        } else {
            sv.setHealthEvent(null); // Allow unsetting the event
        }

        // Handle consent status update - only if provided in DTO
        if (requestDTO.getConsentStatus() != null && !requestDTO.getConsentStatus().trim().isEmpty()) {
            StudentVaccination.ConsentStatus oldConsentStatus = sv.getConsentStatus();
            StudentVaccination.ConsentStatus newConsentStatus = StudentVaccination.ConsentStatus.valueOf(requestDTO.getConsentStatus().toUpperCase());
            
            if (securityService.hasAnyRole(authentication, ERole.ROLE_SCHOOLNURSE, ERole.ROLE_ADMIN)) {
                // Nurse/Admin can update consent status, potentially record who administered
                sv.setConsentStatus(newConsentStatus);
                if (newConsentStatus == StudentVaccination.ConsentStatus.ADMINISTERED) {
                    sv.setAdministeredByNurse(currentUser); // Record nurse who administered
                    if (sv.getVaccinationDate() == null) sv.setVaccinationDate(LocalDate.now()); // Default to now if not set
                }
            } else if (securityService.isParentOfStudentByCode(authentication, sv.getStudent().getStudentCode())) {
                // Parent can only update certain statuses like GIVEN, REFUSED
                if (newConsentStatus == StudentVaccination.ConsentStatus.CONSENT_GIVEN || 
                    newConsentStatus == StudentVaccination.ConsentStatus.CONSENT_REFUSED) {
                    sv.setConsentStatus(newConsentStatus);
                    sv.setConsentGivenByParent(currentUser);
                    sv.setConsentDate(LocalDate.now());
                    sv.setConsentDocumentUrl(requestDTO.getConsentDocumentUrl()); // Allow parent to update document URL with consent
                } else {
                    throw new AccessDeniedException("Parent can only give or refuse consent.");
                }
            }
            // Send notifications if consent status changed
            if (oldConsentStatus != newConsentStatus) {
                sendVaccinationConsentUpdateNotification(sv, oldConsentStatus, newConsentStatus, currentUser);
            }
        }

        StudentVaccination updatedSv = studentVaccinationRepository.save(sv);
        return convertToDTO(updatedSv);
    }

    @Transactional
    public void deleteStudentVaccination(Integer recordId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        StudentVaccination sv = studentVaccinationRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentVaccination record not found with ID: " + recordId));

        // Security Check: Only admin or nurse can delete.
        // Or parent if they submitted it and it's in a deletable state (e.g., PENDING_VERIFICATION)
        if (!securityService.hasAnyRole(authentication, ERole.ROLE_ADMIN, ERole.ROLE_SCHOOLNURSE)) {
            // Add more granular checks if parents can delete their own submissions under certain conditions
            throw new AccessDeniedException("User not authorized to delete this vaccination record.");
        }

        studentVaccinationRepository.delete(sv);
        // Optionally, send notifications about deletion if required.
    }

    @Transactional
    public StudentVaccinationDTO recordConsent(Integer recordId, String consentStatusStr, String notes, String documentUrl, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User parentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent user not found"));

        StudentVaccination sv = studentVaccinationRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentVaccination record not found with ID: " + recordId));

        if (!securityService.isParentOfStudentByCode(authentication, sv.getStudent().getStudentCode())) {
            throw new AccessDeniedException("User is not an authorized parent for this student.");
        }

        StudentVaccination.ConsentStatus oldConsentStatus = sv.getConsentStatus();
        StudentVaccination.ConsentStatus newConsentStatus;
        try {
            newConsentStatus = StudentVaccination.ConsentStatus.valueOf(consentStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid consent status: " + consentStatusStr);
        }

        if (newConsentStatus != StudentVaccination.ConsentStatus.CONSENT_GIVEN && newConsentStatus != StudentVaccination.ConsentStatus.CONSENT_REFUSED) {
            throw new AccessDeniedException("Parent can only provide 'CONSENT_GIVEN' or 'CONSENT_REFUSED'.");
        }

        sv.setConsentStatus(newConsentStatus);
        sv.setConsentGivenByParent(parentUser);
        sv.setConsentDate(LocalDate.now());
        sv.setParentNotes(notes);
        if (documentUrl != null && !documentUrl.isEmpty()) {
            sv.setConsentDocumentUrl(documentUrl);
        }

        StudentVaccination updatedSv = studentVaccinationRepository.save(sv);
        sendVaccinationConsentUpdateNotification(updatedSv, oldConsentStatus, newConsentStatus, parentUser);
        return convertToDTO(updatedSv);
    }

    @Transactional
    public StudentVaccinationDTO verifyOrAdministerVaccination(Integer recordId, String action, LocalDate vaccinationDate, String batchNumber, String administeringLocation, String adminNotes, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User nurseUser = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Nurse user not found"));

        if (!securityService.hasAnyRole(authentication, ERole.ROLE_SCHOOLNURSE, ERole.ROLE_ADMIN)) {
            throw new AccessDeniedException("User not authorized to verify or administer vaccinations.");
        }

        StudentVaccination sv = studentVaccinationRepository.findById(recordId)
            .orElseThrow(() -> new ResourceNotFoundException("StudentVaccination record not found with ID: " + recordId));
        
        StudentVaccination.ConsentStatus oldStatus = sv.getConsentStatus();

        if ("verify".equalsIgnoreCase(action)) {
            if (sv.getConsentStatus() != StudentVaccination.ConsentStatus.PENDING_VERIFICATION && sv.getConsentStatus() != StudentVaccination.ConsentStatus.CONSENT_GIVEN) {
                throw new IllegalStateException("Vaccination can only be verified if consent is PENDING_VERIFICATION or CONSENT_GIVEN.");
            }
            sv.setConsentStatus(StudentVaccination.ConsentStatus.VERIFIED_BY_NURSE);
            sv.setAdministeredByNurse(nurseUser); // Nurse who verified
            // vaccinationDate, batchNumber etc. might already be set if parent provided them, or nurse can update here
            if (vaccinationDate != null) sv.setVaccinationDate(vaccinationDate);
            if (batchNumber != null) sv.setBatchNumber(batchNumber);
            if (administeringLocation != null) sv.setAdministeringLocation(administeringLocation);
            if (adminNotes != null) sv.setAdministrationNotes(adminNotes);

        } else if ("administer".equalsIgnoreCase(action)) {
            if (sv.getConsentStatus() != StudentVaccination.ConsentStatus.CONSENT_GIVEN && sv.getConsentStatus() != StudentVaccination.ConsentStatus.VERIFIED_BY_NURSE) {
                throw new IllegalStateException("Vaccination can only be administered if consent is GIVEN or VERIFIED_BY_NURSE.");
            }
            sv.setConsentStatus(StudentVaccination.ConsentStatus.ADMINISTERED);
            sv.setAdministeredByNurse(nurseUser);
            sv.setVaccinationDate(vaccinationDate != null ? vaccinationDate : LocalDate.now());
            sv.setBatchNumber(batchNumber);
            sv.setAdministeringLocation(administeringLocation);
            sv.setAdministrationNotes(adminNotes);
        } else {
            throw new IllegalArgumentException("Invalid action: " + action + ". Must be 'verify' or 'administer'.");
        }
        StudentVaccination updatedSv = studentVaccinationRepository.save(sv);
        sendVaccinationStatusUpdateNotification(updatedSv, oldStatus, sv.getConsentStatus(), nurseUser);
        return convertToDTO(updatedSv);
    }

    private void sendVaccinationConsentUpdateNotification(StudentVaccination sv, StudentVaccination.ConsentStatus oldStatus, StudentVaccination.ConsentStatus newStatus, User actor) {
        Student student = sv.getStudent();
        String studentName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String vaccineName = sv.getVaccine().getName();
        String actorName = actor.getFullName() != null ? actor.getFullName() : actor.getUsername();
        String actorRole = actor.getRole().getRoleName().equals(ERole.ROLE_PARENT.name()) ? "Parent" : "School Staff";

        // Notify other parent(s)
        List<User> parents = userRepository.findParentsByStudentCode(student.getStudentCode());
        for (User parent : parents) {
            if (!parent.getUserId().equals(actor.getUserId())) { // Don't notify the actor if they are a parent
                String messageToOtherParent = String.format("%s %s has updated the consent for %s's vaccination (%s) from %s to %s. Notes: %s",
                        actorRole, actorName, studentName, vaccineName, oldStatus, newStatus, sv.getParentNotes());
                String linkToParent = String.format("/parent/vaccinations/student/%s/record/%d", student.getStudentCode(), sv.getId());
                notificationService.createNotification(parent, "VACCINATION_CONSENT_UPDATED", messageToOtherParent, linkToParent);
            }
        }

        // Notify nurse(s)
        if (!actor.getRole().getRoleName().equals(ERole.ROLE_SCHOOLNURSE.name()) && !actor.getRole().getRoleName().equals(ERole.ROLE_ADMIN.name())) { // Check if actor is NOT a nurse/admin
            List<User> nurses = userRepository.findByRole_RoleName(ERole.ROLE_SCHOOLNURSE.name());
            nurses.addAll(userRepository.findByRole_RoleName(ERole.ROLE_ADMIN.name())); // Also notify admins
            for (User nurse : nurses) {
                String messageToNurse = String.format("%s %s has updated consent for %s's vaccination (%s) to %s. Student Code: %s. Parent Notes: %s",
                        actorRole, actorName, studentName, vaccineName, newStatus, student.getStudentCode(), sv.getParentNotes());
                String linkToNurse = String.format("/nurse/vaccinations/record/%d", sv.getId());
                notificationService.createNotification(nurse, "VACCINATION_CONSENT_UPDATED_BY_PARENT", messageToNurse, linkToNurse);
            }
        }
    }

    private void sendVaccinationStatusUpdateNotification(StudentVaccination sv, StudentVaccination.ConsentStatus oldStatus, StudentVaccination.ConsentStatus newStatus, User nurseUser) {
        Student student = sv.getStudent();
        String studentName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String vaccineName = sv.getVaccine().getName();
        String nurseName = nurseUser.getFullName() != null ? nurseUser.getFullName() : nurseUser.getUsername();

        // Notify parent(s)
        List<User> parents = userRepository.findParentsByStudentCode(student.getStudentCode());
        for (User parent : parents) {
            String messageToParent = String.format("The status of %s's vaccination (%s) has been updated from %s to %s by Nurse %s. Date: %s. Notes: %s",
                    studentName, vaccineName, oldStatus, newStatus, nurseName, sv.getVaccinationDate(), sv.getAdministrationNotes());
            String linkToParent = String.format("/parent/vaccinations/student/%s/record/%d", student.getStudentCode(), sv.getId());
            notificationService.createNotification(parent, "VACCINATION_STATUS_UPDATED", messageToParent, linkToParent);
        }
        // Note: Student notifications removed since students no longer have user accounts
    }

    public List<StudentVaccinationDTO> getVaccinationsByEventId(Integer eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!securityService.hasAnyRole(authentication, ERole.ROLE_SCHOOLNURSE, ERole.ROLE_ADMIN)) {
            throw new AccessDeniedException("User not authorized to view vaccinations for this event.");
        }
        return studentVaccinationRepository.findByHealthEvent_EventId(eventId).stream() // Updated method name
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
