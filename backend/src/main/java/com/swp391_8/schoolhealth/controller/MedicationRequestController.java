package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.dto.MedicationRequestResponseDTO; // Added
// import com.swp391_8.schoolhealth.model.MedicationRequest; // No longer returning entity directly
// import com.swp391_8.schoolhealth.model.User; // Not directly used here
import com.swp391_8.schoolhealth.service.MedicationRequestService;
import com.swp391_8.schoolhealth.service.SecurityService; // Keep for @PreAuthorize if complex checks remain
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException; // Added
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
// import org.springframework.security.core.userdetails.UserDetails; // Not directly used here
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // For simple request bodies like rejection reason

@RestController
@RequestMapping("/api/medication-requests")
public class MedicationRequestController {

    @Autowired
    private MedicationRequestService medicationRequestService;

    // @Autowired
    // private SecurityService securityService; // Can be removed if all auth handled by @PreAuthorize and service layer

    // The helper getCurrentUserId is no longer needed as Authentication object is passed to service

    // Parent endpoints
    @PostMapping("/")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> createMedicationRequest(@RequestBody MedicationRequestDTO requestDTO, Authentication authentication) {
        try {
            MedicationRequestResponseDTO newRequest = medicationRequestService.createMedicationRequest(requestDTO, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) { // Catch more general runtime exceptions from service
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("hasRole('PARENT')") // Service layer will do fine-grained check
    public ResponseEntity<?> getMedicationRequestsForStudent(
            @PathVariable String studentCode, Authentication authentication) {
        try {
            List<MedicationRequestResponseDTO> requests = medicationRequestService.getMedicationRequestsForStudentByParent(studentCode, authentication);
            return ResponseEntity.ok(requests);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getMyMedicationRequests(Authentication authentication) {
        try {
            List<MedicationRequestResponseDTO> requests = medicationRequestService.getMedicationRequestsByAuthenticatedParent(authentication);
            return ResponseEntity.ok(requests);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{requestId}")
    @PreAuthorize("hasAnyRole('PARENT', 'SCHOOLNURSE', 'ADMIN')") // Broader check, service layer refines
    public ResponseEntity<?> getMedicationRequestById(@PathVariable Integer requestId, Authentication authentication) {
        try {
            MedicationRequestResponseDTO request = medicationRequestService.getMedicationRequestById(requestId, authentication);
            return ResponseEntity.ok(request);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('PARENT')") // Service layer will verify ownership
    public ResponseEntity<?> cancelMedicationRequest(@PathVariable Integer requestId, Authentication authentication) {
        try {
            MedicationRequestResponseDTO cancelledRequest = medicationRequestService.cancelMedicationRequest(requestId, authentication);
            return ResponseEntity.ok(cancelledRequest);
        } catch (SecurityException | AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // Nurse/Staff endpoints
    @GetMapping("/nurse/dashboard")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> getNurseDashboardRequests(Authentication authentication) {
        try {
            List<MedicationRequestResponseDTO> requests = medicationRequestService.getAllMedicationRequestsForNurseDashboard(authentication);
            return ResponseEntity.ok(requests);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> getPendingMedicationRequests(Authentication authentication) {
        try {
            List<MedicationRequestResponseDTO> requests = medicationRequestService.getAllPendingMedicationRequests(authentication);
            return ResponseEntity.ok(requests);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{requestId}/approve")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> approveMedicationRequest(@PathVariable Integer requestId, Authentication authentication) {
        try {
            MedicationRequestResponseDTO updatedRequest = medicationRequestService.approveMedicationRequest(requestId, authentication);
            return ResponseEntity.ok(updatedRequest);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{requestId}/reject")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> rejectMedicationRequest(@PathVariable Integer requestId, 
                                                   @RequestBody Map<String, String> payload, 
                                                   Authentication authentication) {
        try {
            String rejectionReason = payload.get("rejectionReason");
            MedicationRequestResponseDTO rejectedRequest = medicationRequestService.rejectMedicationRequest(requestId, rejectionReason, authentication);
            return ResponseEntity.ok(rejectedRequest);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) { // Covers NotFoundException from service
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{requestId}/administer")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> recordMedicationAdministration(@PathVariable Integer requestId, 
                                                            @RequestBody Map<String, String> payload,
                                                            Authentication authentication) {
        try {
            String administrationNotes = payload.get("administrationNotes");
            // Corrected service method name
            MedicationRequestResponseDTO administeredRequest = medicationRequestService.recordMedicationAdministrationAndUpdateStatus(requestId, administrationNotes, authentication);
            return ResponseEntity.ok(administeredRequest);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) { // Covers NotFoundException from service
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
