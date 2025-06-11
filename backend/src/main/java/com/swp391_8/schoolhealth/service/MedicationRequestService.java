package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.StatusType;
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.StatusTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    private StatusTypeRepository statusTypeRepository;

    @Autowired
    private SecurityService securityService;

    @Transactional
    public MedicationRequest createMedicationRequest(MedicationRequestDTO requestDTO, Authentication authentication) {
        if (!securityService.isParentOfStudent(authentication, requestDTO.getStudentId())) {
            throw new SecurityException("Authenticated user is not authorized to create a medication request for this student.");
        }

        User submittedByUser = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Submitting user not found"));
        Student student = studentRepository.findById(requestDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StatusType pendingStatus = statusTypeRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new RuntimeException("StatusType 'PENDING' not found. Please ensure it exists in the database."));

        MedicationRequest request = new MedicationRequest();
        request.setSubmittedBy(submittedByUser);
        request.setStudent(student);
        request.setMedicationName(requestDTO.getMedicationName());
        request.setDosage(requestDTO.getDosage());
        request.setInstructions(requestDTO.getReason());
        request.setNotes(requestDTO.getNotes());
        request.setStatus(pendingStatus);

        return medicationRequestRepository.save(request);
    }

    public List<MedicationRequest> getMedicationRequestsByParent(Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        return medicationRequestRepository.findBySubmittedByUserId(parentId);
    }

    public List<MedicationRequest> getMedicationRequestsForStudentByParent(Integer studentId, Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        if (!securityService.isParentOfStudent(authentication, studentId)) {
            throw new SecurityException("Authenticated user is not authorized to view medication requests for this student.");
        }
        return medicationRequestRepository.findByStudentStudentIdAndSubmittedByUserId(studentId, parentId);
    }

    @Transactional
    public MedicationRequest cancelMedicationRequest(Integer requestId, Authentication authentication) {
        Integer userId = getUserIdFromAuthentication(authentication);
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        if (!request.getSubmittedBy().getUserId().equals(userId)) {
            throw new SecurityException("User is not authorized to cancel this medication request.");
        }

        StatusType pendingStatus = statusTypeRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new RuntimeException("StatusType 'PENDING' not found."));
        StatusType cancelledStatus = statusTypeRepository.findByStatusName("CANCELLED")
                .orElseThrow(() -> new RuntimeException("StatusType 'CANCELLED' not found."));

        if (!request.getStatus().equals(pendingStatus)) {
            throw new IllegalStateException("Only PENDING medication requests can be cancelled. Current status: " + request.getStatus().getStatusName());
        }

        request.setStatus(cancelledStatus);
        return medicationRequestRepository.save(request);
    }

    // Methods for Nurse/Staff
    public List<MedicationRequest> getAllMedicationRequests() {
        return medicationRequestRepository.findAll();
    }

    public List<MedicationRequest> getPendingMedicationRequests() {
        StatusType pendingStatus = statusTypeRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new RuntimeException("StatusType 'PENDING' not found."));
        return medicationRequestRepository.findByStatus(pendingStatus);
    }

    @Transactional
    public MedicationRequest approveMedicationRequest(Integer requestId, Authentication authentication, String notes) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        User approver = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Approver (Nurse/Staff) not found"));

        StatusType approvedStatus = statusTypeRepository.findByStatusName("APPROVED")
                .orElseThrow(() -> new RuntimeException("StatusType 'APPROVED' not found."));
        StatusType pendingStatus = statusTypeRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new RuntimeException("StatusType 'PENDING' not found."));

        if (!request.getStatus().equals(pendingStatus)) {
            throw new IllegalStateException("Only PENDING medication requests can be approved. Current status: " + request.getStatus().getStatusName());
        }

        request.setStatus(approvedStatus);
        request.setAdministeredBy(approver);
        request.setAdministeredAt(LocalDateTime.now());
        request.setNotes(notes);
        return medicationRequestRepository.save(request);
    }

    @Transactional
    public MedicationRequest rejectMedicationRequest(Integer requestId, Authentication authentication, String rejectionReason) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

        User rejector = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Rejector (Nurse/Staff) not found"));

        StatusType rejectedStatus = statusTypeRepository.findByStatusName("REJECTED")
                .orElseThrow(() -> new RuntimeException("StatusType 'REJECTED' not found."));
        StatusType pendingStatus = statusTypeRepository.findByStatusName("PENDING")
                .orElseThrow(() -> new RuntimeException("StatusType 'PENDING' not found."));

        if (!request.getStatus().equals(pendingStatus)) {
            throw new IllegalStateException("Only PENDING medication requests can be rejected. Current status: " + request.getStatus().getStatusName());
        }

        request.setStatus(rejectedStatus);
        request.setAdministeredBy(rejector);
        request.setAdministeredAt(LocalDateTime.now());
        request.setNotes(rejectionReason);
        return medicationRequestRepository.save(request);
    }

    // Helper method to get user ID from Authentication object
    private Integer getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new SecurityException("User not authenticated.");
        }
        Object principal = authentication.getPrincipal();

        if (principal instanceof com.swp391_8.schoolhealth.security.services.UserDetailsImpl) {
            return ((com.swp391_8.schoolhealth.security.services.UserDetailsImpl) principal).getId();
        } else if (principal instanceof org.springframework.security.core.userdetails.User) {
            String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
            User appUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username + " from UserDetails."));
            return appUser.getUserId();
        } else if (principal instanceof String && principal.equals("anonymousUser")) {
             throw new SecurityException("User is anonymous.");
        }
        
        try {
            try {
                 return (Integer) principal.getClass().getMethod("getUserId").invoke(principal);
            } catch (NoSuchMethodException nsme) {
                 try {
                    return (Integer) principal.getClass().getMethod("getId").invoke(principal);
                 } catch (NoSuchMethodException nsme2) {
                    throw new RuntimeException("Principal class " + principal.getClass().getName() + " does not have getUserId() or getId() method.", nsme2);
                 }
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not extract user ID from authentication principal. Principal type: " + principal.getClass().getName(), e);
        }
    }
}
