package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO; // Corrected import
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Parent; // Added import
import com.swp391_8.schoolhealth.model.Nurse; // Added import
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository; // Added import
import com.swp391_8.schoolhealth.repository.NurseRepository; // Added import
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MedicationRequestService {

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParentRepository parentRepository; // Added injection

    @Autowired
    private NurseRepository nurseRepository; // Added injection

    @Autowired
    private SecurityService securityService; // For permission checks

    @Transactional
    public MedicationRequest createMedicationRequest(MedicationRequestDTO requestDTO, Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String parentUserCode = userDetails.getUsername();

        // Ensure the authenticated user is the parent of the student
        if (!securityService.isParentOfStudentByCode(authentication, requestDTO.getStudentCode())) {
            throw new SecurityException("Authenticated user is not authorized to create a medication request for this student.");
        }

        Parent parent = parentRepository.findByParentCode(parentUserCode)
                .orElseThrow(() -> new RuntimeException("Parent record not found for user code: " + parentUserCode));
        Student student = studentRepository.findByStudentCode(requestDTO.getStudentCode())
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + requestDTO.getStudentCode()));

        MedicationRequest request = new MedicationRequest();
        request.setParent(parent);
        request.setStudent(student);
        request.setMedicationName(requestDTO.getMedicationName());
        request.setDosage(requestDTO.getDosage());
        request.setFrequency(requestDTO.getFrequency());
        request.setStartDate(requestDTO.getStartDate());
        request.setEndDate(requestDTO.getEndDate());
        request.setReason(requestDTO.getReason());
        // Status and requestDate are set by @PrePersist in MedicationRequest entity

        return medicationRequestRepository.save(request);
    }

    public List<MedicationRequest> getMedicationRequestsByParent(Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String parentUserCode = userDetails.getUsername();
        // Assuming MedicationRequestRepository will have a method findByParentParentCode
        return medicationRequestRepository.findByParentParentCode(parentUserCode);
    }

    public List<MedicationRequest> getMedicationRequestsForStudentByParent(String studentCode, Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String parentUserCode = userDetails.getUsername();

        if (!securityService.isParentOfStudentByCode(authentication, studentCode)) {
            throw new SecurityException("Authenticated user is not authorized to view medication requests for this student.");
        }
        // Assuming MedicationRequestRepository will have a method findByStudentStudentCodeAndParentParentCode
        return medicationRequestRepository.findByStudentStudentCodeAndParentParentCode(studentCode, parentUserCode);
    }

    public MedicationRequest cancelMedicationRequest(Integer requestId, Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String authenticatedUserCode = userDetails.getUsername();

        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        // Parent entity now has parentCode, which is the user_code.
        if (request.getParent() == null || !authenticatedUserCode.equals(request.getParent().getParentCode())) {
            throw new SecurityException("User is not authorized to cancel this medication request.");
        }

        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING medication requests can be cancelled.");
        }

        request.setStatus(MedicationRequest.MedicationRequestStatus.CANCELLED);
        request.setActionDate(LocalDateTime.now());
        return medicationRequestRepository.save(request);
    }

    // Methods for Nurse/Staff
    public List<MedicationRequest> getAllMedicationRequests() {
        return medicationRequestRepository.findAll();
    }

    public List<MedicationRequest> getPendingMedicationRequests() {
        return medicationRequestRepository.findByStatus(MedicationRequest.MedicationRequestStatus.PENDING);
    }

    public MedicationRequest approveMedicationRequest(Integer requestId, Authentication authentication, String notes) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String approverUserCode = userDetails.getUsername();

        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        Nurse approver = nurseRepository.findByNurseCode(approverUserCode)
                .orElseThrow(() -> new RuntimeException("Nurse record not found for user code: " + approverUserCode));

        request.setStatus(MedicationRequest.MedicationRequestStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setActionDate(LocalDateTime.now());
        request.setNotes(notes);
        return medicationRequestRepository.save(request);
    }

    public MedicationRequest rejectMedicationRequest(Integer requestId, Authentication authentication, String rejectionReason) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String rejectorUserCode = userDetails.getUsername();

        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        Nurse rejector = nurseRepository.findByNurseCode(rejectorUserCode)
                .orElseThrow(() -> new RuntimeException("Nurse record not found for user code: " + rejectorUserCode));

        request.setStatus(MedicationRequest.MedicationRequestStatus.REJECTED);
        request.setApprovedBy(rejector); // Even for rejection, this field indicates who actioned it
        request.setActionDate(LocalDateTime.now());
        request.setNotes(rejectionReason); // Use notes field for rejection reason
        return medicationRequestRepository.save(request);
    }

    // Helper method to get UserDetailsImpl from Authentication object
    private UserDetailsImpl getUserDetailsFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new SecurityException("User not authenticated.");
        }
        if (!(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            // Log the actual type for debugging if necessary
            // logger.warn("Principal is not of type UserDetailsImpl, actual type: " + authentication.getPrincipal().getClass().getName());
            throw new SecurityException("Authentication principal is not an instance of UserDetailsImpl.");
        }
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    // ... any other existing methods ...

}
