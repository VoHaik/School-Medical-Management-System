package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
<<<<<<< Updated upstream
import com.swp391_8.schoolhealth.model.StatusType;
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.StatusTypeRepository;
=======
import com.swp391_8.schoolhealth.model.Parent; // Added import
import com.swp391_8.schoolhealth.model.Nurse; // Added import
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository; // Added import
import com.swp391_8.schoolhealth.repository.NurseRepository; // Added import
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        return medicationRequestRepository.findBySubmittedByUserId(parentId);
=======
        return medicationRequestRepository.findByParentUserId(parentId);
>>>>>>> Stashed changes
    }

    public List<MedicationRequest> getMedicationRequestsForStudentByParent(String studentCode, Authentication authentication) {
        Integer parentId = getUserIdFromAuthentication(authentication);
        if (!securityService.isParentOfStudentByCode(authentication, studentCode)) {
            throw new SecurityException("Authenticated user is not authorized to view medication requests for this student.");
        }
<<<<<<< Updated upstream
        return medicationRequestRepository.findByStudentStudentIdAndSubmittedByUserId(studentId, parentId);
=======
        return medicationRequestRepository.findByStudentStudentCodeAndParentUserId(studentCode, parentId);
>>>>>>> Stashed changes
    }

    @Transactional
    public MedicationRequest cancelMedicationRequest(Integer requestId, Authentication authentication) {
        Integer userId = getUserIdFromAuthentication(authentication);
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Medication request not found with ID: " + requestId));

<<<<<<< Updated upstream
        if (!request.getSubmittedBy().getUserId().equals(userId)) {
=======
        if (!request.getParent().getUser().getUserId().equals(parentId)) { // Corrected to check against User's ID within Parent
>>>>>>> Stashed changes
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

        User approverUser = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Approver User not found"));
        Nurse approver = nurseRepository.findByUserUserId(approverUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Nurse record not found for user"));


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

        User rejectorUser = userRepository.findById(getUserIdFromAuthentication(authentication))
                .orElseThrow(() -> new RuntimeException("Rejector User not found"));
        Nurse rejector = nurseRepository.findByUserUserId(rejectorUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Nurse record not found for user"));

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
