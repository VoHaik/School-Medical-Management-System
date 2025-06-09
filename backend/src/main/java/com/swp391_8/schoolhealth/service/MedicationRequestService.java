package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO; // Corrected import
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.StatusType; // Added import
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StatusTypeRepository; // Added import
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional; // Added import

@Service
public class MedicationRequestService {

    private static final String MEDICATION_REQUEST_CATEGORY = "Medication Request";
    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatusTypeRepository statusTypeRepository; // Added repository

    @Autowired
    private SecurityService securityService; // For permission checks

    @Transactional
    public MedicationRequest createMedicationRequest(MedicationRequestDTO requestDTO, Authentication authentication) {
        // Ensure the authenticated user is the parent of the student
        if (!securityService.isParentOfStudent(authentication, requestDTO.getStudentId())) {
            throw new SecurityException("Authenticated user is not authorized to create a medication request for this student.");
        }

        User parent = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        Student student = studentRepository.findById(requestDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StatusType pendingStatus = statusTypeRepository.findByStatusNameAndCategory(STATUS_PENDING, MEDICATION_REQUEST_CATEGORY)
                .orElseThrow(() -> new RuntimeException("StatusType 'PENDING' for category 'Medication Request' not found. Please ensure it exists in the database."));

        MedicationRequest request = new MedicationRequest();
        request.setSubmittedByUser(parent);
        request.setStudent(student);
        request.setMedicationName(requestDTO.getMedicationName());
        request.setDosage(requestDTO.getDosage());
        request.setInstructions(requestDTO.getInstructions()); // Assuming DTO has instructions
        request.setStatusType(pendingStatus); // Set status using StatusType

        return medicationRequestRepository.save(request);
    }

    public List<MedicationRequest> getMedicationRequestsByParent(Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        return medicationRequestRepository.findBySubmittedByUserUserId(parentId); // Changed from findByParentId
    }

    public List<MedicationRequest> getMedicationRequestsForStudentByParent(Integer studentId, Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        if (!securityService.isParentOfStudent(authentication, studentId)) {
            throw new SecurityException("Authenticated user is not authorized to view medication requests for this student.");
        }
        return medicationRequestRepository.findByStudentStudentIdAndSubmittedByUserUserId(studentId, parentId); // Changed from findByStudentStudentIdAndParentId
    }

    public MedicationRequest cancelMedicationRequest(Integer requestId, Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        if (!request.getSubmittedByUser().getUserId().equals(parentId)) {
            throw new SecurityException("User is not authorized to cancel this medication request.");
        }

        StatusType currentStatus = request.getStatusType();
        if (currentStatus == null || !STATUS_PENDING.equals(currentStatus.getStatusName())) {
            throw new IllegalStateException("Only PENDING medication requests can be cancelled. Current status: " + (currentStatus != null ? currentStatus.getStatusName() : "null"));
        }

        StatusType cancelledStatus = statusTypeRepository.findByStatusNameAndCategory(STATUS_CANCELLED, MEDICATION_REQUEST_CATEGORY)
                .orElseThrow(() -> new RuntimeException("StatusType 'CANCELLED' for category 'Medication Request' not found. Please ensure it exists in the database."));

        request.setStatusType(cancelledStatus);
        // request.setActionDate(LocalDateTime.now()); // No actionDate field, updatedAt is auto-managed
        // administeredAt and administeredByUser are for approval/rejection actions by staff
        return medicationRequestRepository.save(request);
    }

    // Methods for Nurse/Staff
    public List<MedicationRequest> getAllMedicationRequests() {
        return medicationRequestRepository.findAll();
    }

    public List<MedicationRequest> getPendingMedicationRequests() {
        return medicationRequestRepository.findByStatusTypeStatusName(STATUS_PENDING);
    }

    public MedicationRequest approveMedicationRequest(Integer requestId, Authentication authentication, String notes) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        User approver = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Approver (Nurse/Staff) not found"));

        StatusType approvedStatus = statusTypeRepository.findByStatusNameAndCategory(STATUS_APPROVED, MEDICATION_REQUEST_CATEGORY)
                .orElseThrow(() -> new RuntimeException("StatusType 'APPROVED' for category 'Medication Request' not found. Please ensure it exists in the database."));

        request.setStatusType(approvedStatus);
        request.setAdministeredByUser(approver);
        request.setAdministeredAt(LocalDateTime.now());
        request.setNotes(notes);
        return medicationRequestRepository.save(request);
    }

    public MedicationRequest rejectMedicationRequest(Integer requestId, Authentication authentication, String rejectionReason) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        User rejector = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Rejector (Nurse/Staff) not found"));

        StatusType rejectedStatus = statusTypeRepository.findByStatusNameAndCategory(STATUS_REJECTED, MEDICATION_REQUEST_CATEGORY)
                .orElseThrow(() -> new RuntimeException("StatusType 'REJECTED' for category 'Medication Request' not found. Please ensure it exists in the database."));

        request.setStatusType(rejectedStatus);
        request.setAdministeredByUser(rejector);
        request.setAdministeredAt(LocalDateTime.now()); // Record time of rejection
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
