package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.dto.MedicationRequestResponseDTO;
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException; // Added import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays; // For creating list of statuses

@Service
@Deprecated
public class MedicationRequestService {

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityService securityService;

    private MedicationRequestResponseDTO convertToResponseDTO(MedicationRequest request) {
        if (request == null) {
            return null;
        }

        String studentName = "N/A";
        String studentCode = null;
        String studentFullName = null;
        if (request.getStudent() != null) {
            Student student = request.getStudent();
            studentCode = student.getStudentCode();
            
            // Prioritize student's own fullName field first
            if (student.getFullName() != null && !student.getFullName().isEmpty()) {
                studentName = student.getFullName();
                studentFullName = student.getFullName(); // Store for the new field
            } else if (student.getUser() != null && student.getUser().getFullName() != null) {
                // If student fullName not available, try user's fullName
                studentName = student.getUser().getFullName();
                studentFullName = student.getUser().getFullName();
            } else if (student.getFirstName() != null && student.getLastName() != null) {
                // If both methods above fail, try to construct from first and last name
                studentName = student.getFirstName() + " " + student.getLastName();
                studentFullName = studentName;
            } else {
                // Last resort fallback - just show the code but NOT with the "Student Code:" prefix
                studentName = "Student " + studentCode;
                studentFullName = "Student " + studentCode;
            }
        }
        
        String requestedByName = (request.getRequestedBy() != null) ?
                            request.getRequestedBy().getFullName() : "N/A";
        String parentFullName = requestedByName; // Store for the new field                    
                            
        String approvedByName = (request.getApprovedBy() != null) ?
                                request.getApprovedBy().getFullName() : null;
        String administeredByName = (request.getAdministeredBy() != null) ?
                                    request.getAdministeredBy().getFullName() : null;

        MedicationRequestResponseDTO responseDTO = new MedicationRequestResponseDTO(
                request.getRequestId(),
                studentCode,
                studentName,
                requestedByName,
                request.getMedicationName(),
                request.getDosage(),
                request.getFrequency(),
                request.getStartDate(),
                request.getEndDate(),
                request.getReason(),
                request.getNotes(), // This is the nurse's notes field from the entity
                request.getStatus() != null ? request.getStatus().name() : null,
                request.getRequestDate(),
                approvedByName,
                request.getApprovalDate(), // This is the specific approval date by nurse
                administeredByName,
                request.getAdministeredAt(),
                request.getAdministrationNotes() // This is the administration notes by nurse
        );
        
        // Set additional fields for parent and student full names
        responseDTO.setStudentFullName(studentFullName);
        responseDTO.setParentFullName(parentFullName);
        
        return responseDTO;
    }

    @Transactional
    public MedicationRequestResponseDTO createMedicationRequest(MedicationRequestDTO requestDTO, Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String requesterUsername = userDetails.getUsername(); // Username is user_code

        if (!securityService.isParentOfStudent(authentication, requestDTO.getStudentCode())) { // Use isParentOfStudent with studentCode
            throw new AccessDeniedException("Authenticated user is not authorized to create a medication request for this student.");
        }

        User requestingUser = userRepository.findByUsername(requesterUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Requesting user not found: " + requesterUsername));

        Student student = studentRepository.findByStudentCode(requestDTO.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + requestDTO.getStudentCode()));

        MedicationRequest request = new MedicationRequest();
        request.setRequestedBy(requestingUser);
        request.setStudent(student);
        request.setMedicationName(requestDTO.getMedicationName());
        request.setDosage(requestDTO.getDosage());
        request.setFrequency(requestDTO.getFrequency());
        request.setStartDate(requestDTO.getStartDate());
        request.setEndDate(requestDTO.getEndDate());
        request.setReason(requestDTO.getReason());
        // Parent's notes from DTO should go to a field like 'parentNotes' or be appended to 'reason' if no separate field exists.
        // The current 'notes' field in MedicationRequest entity is for nurse/admin.
        // For now, let's assume DTO's notes are for the general 'notes' field, or a new field 'parentNotes' should be added to the entity.
        // If 'notes' in DTO is meant for parent's initial notes, it should be mapped to an appropriate field.
        // Let's map it to the existing 'notes' field for now, assuming it can be used by parents initially.
        request.setNotes(requestDTO.getNotes()); 
        // Status and requestDate are set by @PrePersist in MedicationRequest entity

        MedicationRequest savedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(savedRequest);
    }

    public List<MedicationRequestResponseDTO> getMedicationRequestsByAuthenticatedParent(Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String parentUsername = userDetails.getUsername(); // Username is user_code
        return medicationRequestRepository.findByRequestedBy_UsernameOrderByRequestDateDesc(parentUsername)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<MedicationRequestResponseDTO> getMedicationRequestsForStudentByParent(String studentCode, Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        if (!securityService.isParentOfStudent(authentication, studentCode)) {
            throw new AccessDeniedException("Authenticated user is not authorized to view medication requests for this student.");
        }
        return medicationRequestRepository.findByStudent_StudentCodeAndRequestedBy_UsernameOrderByRequestDateDesc(studentCode, userDetails.getUsername()).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public MedicationRequestResponseDTO getMedicationRequestById(Integer requestId, Authentication authentication) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));

        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);

        // Check if user is parent of student for this request, or if user is nurse/admin
        if (securityService.isParent(authentication)) {
            if (!request.getRequestedBy().getUsername().equals(userDetails.getUsername())) {
                throw new AccessDeniedException("You are not authorized to view this medication request.");
            }
        } else if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("You are not authorized to view this medication request.");
        }
        return convertToResponseDTO(request);
    }

    @Transactional
    public MedicationRequestResponseDTO cancelMedicationRequest(Integer requestId, Authentication authentication) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);

        if (!request.getRequestedBy().getUsername().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("You are not authorized to cancel this medication request.");
        }
        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.PENDING && request.getStatus() != MedicationRequest.MedicationRequestStatus.APPROVED) {
            throw new IllegalStateException("Only PENDING or APPROVED requests can be cancelled by parent.");
        }
        request.setStatus(MedicationRequest.MedicationRequestStatus.CANCELLED_BY_PARENT);
        // request.setRejectionReason("Cancelled by parent."); // Optional: add a note or use a dedicated field
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    // Nurse/Admin methods
    public List<MedicationRequestResponseDTO> getAllMedicationRequestsForNurseDashboard(Authentication authentication) {
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized for nurse dashboard.");
        }
        // Example: Show PENDING, APPROVED, and NEEDS_REFILL requests on dashboard
        List<MedicationRequest.MedicationRequestStatus> statuses = Arrays.asList(
            MedicationRequest.MedicationRequestStatus.PENDING,
            MedicationRequest.MedicationRequestStatus.APPROVED,
            MedicationRequest.MedicationRequestStatus.NEEDS_REFILL
        );
        return medicationRequestRepository.findByStatusInOrderByRequestDateDesc(statuses).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<MedicationRequestResponseDTO> getAllPendingMedicationRequests(Authentication authentication) {
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to view pending requests.");
        }
        return medicationRequestRepository.findByStatusOrderByRequestDateDesc(MedicationRequest.MedicationRequestStatus.PENDING).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicationRequestResponseDTO approveMedicationRequest(Integer requestId, Authentication authentication) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        User approver = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Approving user not found"));

        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to approve requests.");
        }
        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be approved.");
        }
        request.setStatus(MedicationRequest.MedicationRequestStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setApprovalDate(LocalDateTime.now());
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Transactional
    public MedicationRequestResponseDTO rejectMedicationRequest(Integer requestId, String rejectionReason, Authentication authentication) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
         User rejector = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Rejecting user not found"));

        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to reject requests.");
        }
        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be rejected.");
        }
        request.setStatus(MedicationRequest.MedicationRequestStatus.REJECTED);
        request.setNotes(rejectionReason); // Using general notes field for rejection reason
        request.setApprovedBy(rejector); // The user who took action (rejected)
        request.setApprovalDate(LocalDateTime.now()); // Date of action
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    // ... other methods like administerMedication, updateMedicationRequestDetails etc. ...

    private UserDetailsImpl getUserDetailsFromAuthentication(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            throw new AccessDeniedException("User details not found in authentication object or of incorrect type.");
        }
        return (UserDetailsImpl) authentication.getPrincipal();
    }
    
    // Method for nurse to get all requests for a specific student
    public List<MedicationRequestResponseDTO> getMedicationRequestsByStudentCodeForNurse(String studentCode, Authentication authentication) {
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to view these requests.");
        }
        // Ensure student exists, though repository method handles empty list if not found
        studentRepository.findByStudentCode(studentCode)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));
            
        return medicationRequestRepository.findByStudent_StudentCodeOrderByRequestDateDesc(studentCode).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Method for nurse to update details of a request (e.g., add notes, change schedule if allowed)
    @Transactional
    public MedicationRequestResponseDTO updateMedicationRequestDetailsByNurse(Integer requestId, MedicationRequestDTO requestDTO, Authentication authentication) {
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to update medication requests.");
        }

        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));

        // Nurses typically cannot change student or core medication details once submitted by parent
        // They can add notes, or manage status (approve, reject, administer)
        // For this example, we allow updating notes by nurse.
        if (requestDTO.getNotes() != null) { // Assuming DTO has a field for nurse notes
            request.setNotes(requestDTO.getNotes()); // This is the general notes field
        }
        // Add other updatable fields as necessary, e.g., if nurse can adjust frequency/dosage after consultation

        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Transactional
    public MedicationRequestResponseDTO administerMedication(Integer requestId, String administrationNotes, Authentication authentication) {
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to administer medication.");
        }

        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        User administeringUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Administering user not found: " + userDetails.getUsername()));

        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));

        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.APPROVED) {
            throw new IllegalStateException("Medication can only be administered for APPROVED requests.");
        }
        if (request.getEndDate() != null && LocalDate.now().isAfter(request.getEndDate())) {
            throw new IllegalStateException("This medication request has expired.");
        }

        request.setAdministeredBy(administeringUser);
        request.setAdministeredAt(LocalDateTime.now());
        request.setAdministrationNotes(administrationNotes);
        // Optionally, change status to ADMINISTERED_TODAY or similar if needed for tracking daily doses
        // For simplicity, keeping it APPROVED but logging administration.
        // If it's a one-time dose or last dose, status could change to COMPLETED.

        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        // TODO: Create a MedicalEvent for this administration?
        // TODO: Send notification?
        return convertToResponseDTO(updatedRequest);
    }

     public List<MedicationRequestResponseDTO> getMedicationRequestsByStudentCodeForParent(String studentCode, Authentication authentication) {
        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        String parentUsername = userDetails.getUsername();

        if (!securityService.isParentOfStudent(authentication, studentCode)) {
            throw new AccessDeniedException("Authenticated user is not the parent of this student or student not found.");
        }

        return medicationRequestRepository.findByStudent_StudentCodeAndRequestedBy_UsernameOrderByRequestDateDesc(studentCode, parentUsername)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public MedicationRequestResponseDTO updateMedicationRequestStatus(Integer requestId, MedicationRequest.MedicationRequestStatus status, String notes, Authentication authentication) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));

        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Authorization: Only nurses or admins can update status generally
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("You are not authorized to update this medication request.");
        }

        request.setStatus(status);
        if (notes != null && !notes.isEmpty()) {
            request.setNotes(notes); // This is the general notes field, typically for nurse/admin
        }

        if (status == MedicationRequest.MedicationRequestStatus.APPROVED) {
            request.setApprovedBy(currentUser);
            request.setApprovalDate(LocalDateTime.now()); // Changed to LocalDateTime
        } else if (status == MedicationRequest.MedicationRequestStatus.REJECTED) {
            // Optionally, set a rejectedBy field if it exists, or use notes for rejection reason
            request.setApprovedBy(null); // Clear approval if rejected
            request.setApprovalDate(null);
        }
        // Other statuses like CANCELLED_BY_SCHOOL, COMPLETED, etc. can be handled here

        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Transactional
    public MedicationRequestResponseDTO recordMedicationAdministrationAndUpdateStatus(Integer requestId, String administrationNotes, Authentication authentication) {
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("Only nurses or admins can record medication administration.");
        }

        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));

        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.APPROVED) {
            throw new IllegalStateException("Medication can only be administered for APPROVED requests.");
        }

        UserDetailsImpl userDetails = getUserDetailsFromAuthentication(authentication);
        User administeringUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Administering user not found: " + userDetails.getUsername()));

        request.setAdministeredBy(administeringUser);
        request.setAdministeredAt(LocalDateTime.now());
        request.setAdministrationNotes(administrationNotes);
        request.setStatus(MedicationRequest.MedicationRequestStatus.ADMINISTERED); // Update status to ADMINISTERED

        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    /**
     * Updates a medication request by a parent
     * Only allows updates if the request is in PENDING status
     */
    @Transactional
    public MedicationRequestResponseDTO updateMedicationRequestByParent(Integer requestId, MedicationRequestDTO requestDTO, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userDetails.getId();

        // Check if the request exists
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication request not found with ID: " + requestId));

        // Check if the authenticated user is the owner of this request
        if (!request.getRequestedBy().getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to update this medication request");
        }

        // Only allow updates if the request is still PENDING
        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Cannot update a medication request that has already been processed");
        }        // Update fields that are allowed to be changed
        if (requestDTO.getMedicationName() != null) {
            request.setMedicationName(requestDTO.getMedicationName());
        }
        if (requestDTO.getDosage() != null) {
            request.setDosage(requestDTO.getDosage());
        }
        if (requestDTO.getFrequency() != null) {
            request.setFrequency(requestDTO.getFrequency());
        }
        if (requestDTO.getStartDate() != null) {
            request.setStartDate(requestDTO.getStartDate());
        }
        if (requestDTO.getEndDate() != null) {
            request.setEndDate(requestDTO.getEndDate());
        }
        if (requestDTO.getReason() != null) {
            request.setReason(requestDTO.getReason());
        }

        // Save the updated request
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        
        // Return the response DTO
        return convertToResponseDTO(updatedRequest);
    }

    /**
     * Deletes a medication request by a parent
     * Only allows deletion if the request is in PENDING status
     */
    @Transactional
    public void deleteMedicationRequest(Integer requestId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Integer userId = userDetails.getId();

        // Check if the request exists
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication request not found with ID: " + requestId));

        // Check if the authenticated user is the owner of this request
        if (!request.getRequestedBy().getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to delete this medication request");
        }

        // Only allow deletion if the request is still PENDING
        if (request.getStatus() != MedicationRequest.MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Cannot delete a medication request that has already been processed");
        }

        // Delete the request
        medicationRequestRepository.delete(request);
    }
}
