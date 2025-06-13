package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO; // Corrected import
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Parent; // Added import
import com.swp391_8.schoolhealth.model.Nurse; // Added import
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository; // Added import
import com.swp391_8.schoolhealth.repository.NurseRepository; // Added import
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
    private UserRepository userRepository;

    @Autowired
    private ParentRepository parentRepository; // Added injection

    @Autowired
    private NurseRepository nurseRepository; // Added injection

    @Autowired
    private SecurityService securityService; // For permission checks

    @Transactional
    public MedicationRequest createMedicationRequest(MedicationRequestDTO requestDTO, Authentication authentication) {
        // Ensure the authenticated user is the parent of the student
        if (!securityService.isParentOfStudentByCode(authentication, requestDTO.getStudentCode())) {
            throw new SecurityException("Authenticated user is not authorized to create a medication request for this student.");
        }

        User parentUser = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Parent User not found"));
        Parent parent = parentRepository.findByUserUserId(parentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Parent record not found for user"));
        Student student = studentRepository.findByStudentCode(requestDTO.getStudentCode())
                .orElseThrow(() -> new RuntimeException("Student not found"));

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
        Integer parentId = getUserIdFromAuthentication(authentication);
        return medicationRequestRepository.findByParentUserId(parentId);
    }

    public List<MedicationRequest> getMedicationRequestsForStudentByParent(String studentCode, Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        if (!securityService.isParentOfStudentByCode(authentication, studentCode)) {
            throw new SecurityException("Authenticated user is not authorized to view medication requests for this student.");
        }
        return medicationRequestRepository.findByStudentStudentCodeAndParentUserId(studentCode, parentId);
    }

    public MedicationRequest cancelMedicationRequest(Integer requestId, Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        if (!request.getParent().getUser().getUserId().equals(parentId)) { // Corrected to check against User's ID within Parent
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
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        User approverUser = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Approver User not found"));
        Nurse approver = nurseRepository.findByUserUserId(approverUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Nurse record not found for user"));


        request.setStatus(MedicationRequest.MedicationRequestStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setActionDate(LocalDateTime.now());
        request.setNotes(notes);
        return medicationRequestRepository.save(request);
    }

    public MedicationRequest rejectMedicationRequest(Integer requestId, Authentication authentication, String rejectionReason) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        User rejectorUser = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Rejector User not found"));
        Nurse rejector = nurseRepository.findByUserUserId(rejectorUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Nurse record not found for user"));

        request.setStatus(MedicationRequest.MedicationRequestStatus.REJECTED);
        request.setApprovedBy(rejector); // Even for rejection, this field indicates who actioned it
        request.setActionDate(LocalDateTime.now());
        request.setNotes(rejectionReason); // Use notes field for rejection reason
        return medicationRequestRepository.save(request);
    }

    // Helper method to get user ID from Authentication object
    private Integer getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new SecurityException("User not authenticated.");
        }
        try {
            // Assuming the principal's class has a getId() method that returns Integer
            return (Integer) authentication.getPrincipal().getClass().getMethod("getId").invoke(authentication.getPrincipal());
        } catch (Exception e) {
            // Log the exception for debugging
            // logger.error("Error retrieving user ID from authentication principal", e);
            throw new RuntimeException("Could not extract user ID from authentication principal. Ensure principal has getId().", e);
        }
    }

    // ... any other existing methods ...

}
