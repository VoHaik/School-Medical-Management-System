package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.User; // Assuming UserDetailsImpl or similar holds the ID
import com.swp391_8.schoolhealth.service.MedicationRequestService;
import com.swp391_8.schoolhealth.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails; // For casting principal
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medication-requests")
public class MedicationRequestController {

    @Autowired
    private MedicationRequestService medicationRequestService;

    @Autowired
    private SecurityService securityService;

    // Helper to get current user ID from Authentication principal
    // This assumes your UserDetails implementation (e.g., UserDetailsImpl) has a getId() method.
    private Integer getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            // Attempt to cast to a known UserDetails implementation that holds the ID
            // Replace 'com.swp391_8.schoolhealth.security.services.UserDetailsImpl' 
            // with your actual UserDetails implementation class if different,
            // or adapt to how user ID is stored.
            try {
                // This is a common pattern, adjust if your UserDetailsImpl is different
                // or if SecurityService provides a direct method like securityService.getUserId(authentication)
                Class<?> userDetailsImplClass = Class.forName("com.swp391_8.schoolhealth.security.services.UserDetailsImpl");
                if (userDetailsImplClass.isInstance(principal)) {
                    return (Integer) userDetailsImplClass.getMethod("getId").invoke(principal);
                }
            } catch (Exception e) {
                // Fallback or rethrow if ID cannot be obtained
                // For now, relying on a hypothetical SecurityService method or direct User model
                 if (principal instanceof com.swp391_8.schoolhealth.model.User) {
                    return ((com.swp391_8.schoolhealth.model.User) principal).getUserId();
                 }
                 // If SecurityService has a method like getCurrentAuthenticatedUser() that returns your User model
                 // User currentUser = securityService.getCurrentAuthenticatedUser();
                 // if (currentUser != null) return currentUser.getUserId();

                System.err.println("Error retrieving user ID from principal: " + e.getMessage());
                // As a last resort, if securityService has a direct method not requiring Authentication object
                // return securityService.getCurrentUserId(); // if such a method exists and is appropriate
                throw new RuntimeException("Could not determine user ID from Authentication principal. Please check UserDetails implementation.", e);
            }
        }
        // Fallback if principal is not UserDetails or ID extraction failed
        // This part needs to be robust based on your actual security setup.
        // Consider adding a method to SecurityService: Integer getUserId(Authentication auth);
        throw new SecurityException("Cannot determine user ID from principal of type: " + (principal != null ? principal.getClass().getName() : "null"));
    }

    // Parent endpoints
    @PostMapping("/")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> createMedicationRequest(@RequestBody MedicationRequestDTO requestDTO, Authentication authentication) {
        // The service method createMedicationRequest now takes Authentication directly
        try {
            MedicationRequest newRequest = medicationRequestService.createMedicationRequest(requestDTO, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("hasRole('PARENT') and @securityService.isParentOfStudentByCode(authentication, #studentCode)")
    public ResponseEntity<List<MedicationRequest>> getMedicationRequestsForStudent(
            @PathVariable String studentCode, Authentication authentication) {
        // Service method signature is getMedicationRequestsForStudentByParent(String studentCode, Authentication authentication)
        List<MedicationRequest> requests = medicationRequestService.getMedicationRequestsForStudentByParent(studentCode, authentication);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<MedicationRequest>> getMyMedicationRequests(Authentication authentication) {
        // Service method signature is getMedicationRequestsByParent(Authentication authentication)
        List<MedicationRequest> requests = medicationRequestService.getMedicationRequestsByParent(authentication);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> cancelMedicationRequest(@PathVariable Integer requestId, Authentication authentication) {
        // Service method signature is cancelMedicationRequest(Integer requestId, Authentication authentication)
        try {
            MedicationRequest cancelledRequest = medicationRequestService.cancelMedicationRequest(requestId, authentication);
            return ResponseEntity.ok(cancelledRequest);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // Or BadRequest
        }
    }

    // Nurse/Staff endpoints
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<MedicationRequest>> getAllMedicationRequests() {
        List<MedicationRequest> requests = medicationRequestService.getAllMedicationRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<MedicationRequest>> getPendingMedicationRequests() {
        List<MedicationRequest> requests = medicationRequestService.getPendingMedicationRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/approve")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<MedicationRequest> approveMedicationRequest(@PathVariable Integer requestId, @RequestBody(required = false) String notes, Authentication authentication) {
        // Service method signature is approveMedicationRequest(Integer requestId, Authentication authentication, String notes)
        MedicationRequest updatedRequest = medicationRequestService.approveMedicationRequest(requestId, authentication, notes);
        return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{requestId}/reject")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> rejectMedicationRequest(@PathVariable Integer requestId, @RequestBody String rejectionReason, Authentication authentication) {
        // Service method signature is rejectMedicationRequest(Integer requestId, Authentication authentication, String rejectionReason)
        try {
            MedicationRequest rejectedRequest = medicationRequestService.rejectMedicationRequest(requestId, authentication, rejectionReason);
            return ResponseEntity.ok(rejectedRequest);
        } catch (IllegalArgumentException e) {
            // Return the message from the exception, which might be "Medication request not found..." or similar
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
