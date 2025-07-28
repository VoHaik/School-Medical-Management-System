package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.dto.VaccinationConsentDetailDTO;
import com.swp391_8.schoolhealth.model.VaccinationConsent;
import com.swp391_8.schoolhealth.repository.VaccinationConsentRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.service.VaccinationConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/parent/vaccination-consent")
@RequiredArgsConstructor
public class ParentConsentController {

    private final VaccinationConsentRepository consentRepository;
    private final VaccinationConsentService consentService;
    private final ParentStudentRelationshipRepository parentStudentRelationshipRepository;

    /**
     * Debug endpoint to check all vaccination consents
     */
    @GetMapping("/debug/all-consents")
    @PreAuthorize("hasAuthority('Parent') or hasAuthority('Admin') or hasAuthority('Nurse')")
    public ResponseEntity<List<VaccinationConsent>> getAllConsents() {
        List<VaccinationConsent> allConsents = consentRepository.findAll();
        return ResponseEntity.ok(allConsents);
    }

    /**
     * Get pending consent requests for a student (accessed by parent)
     */
    @GetMapping("/student/{studentCode}/pending")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<List<VaccinationConsentDetailDTO>> getPendingConsents(@PathVariable String studentCode) {
        List<VaccinationConsent> consents = consentRepository.findByStudentCodeWithDetails(studentCode)
            .stream()
            .filter(consent -> consent.getConsentStatus() == VaccinationConsent.ConsentStatus.PENDING)
            .toList();
        
        List<VaccinationConsentDetailDTO> detailDTOs = consents.stream()
            .map(VaccinationConsentDetailDTO::new)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(detailDTOs);
    }

    /**
     * Get all consent history for a student
     */
    @GetMapping("/student/{studentCode}/history")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<List<VaccinationConsent>> getConsentHistory(@PathVariable String studentCode) {
        List<VaccinationConsent> consents = consentRepository.findByStudentCode(studentCode);
        return ResponseEntity.ok(consents);
    }

    /**
     * Get submitted (non-pending) consent history for a student
     */
    @GetMapping("/student/{studentCode}/submitted")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<List<VaccinationConsentDetailDTO>> getSubmittedConsents(@PathVariable String studentCode) {
        List<VaccinationConsent> consents = consentRepository.findByStudentCodeWithDetails(studentCode)
            .stream()
            .filter(consent -> consent.getConsentStatus() != VaccinationConsent.ConsentStatus.PENDING)
            .toList();
        
        List<VaccinationConsentDetailDTO> detailDTOs = consents.stream()
            .map(VaccinationConsentDetailDTO::new)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(detailDTOs);
    }

    /**
     * Submit consent response (approve/reject)
     */
    @PostMapping("/{consentId}/respond")
    @PreAuthorize("hasAuthority('Parent')")
    @SuppressWarnings("deprecation")
    public ResponseEntity<MessageResponse> respondToConsent(
            @PathVariable Integer consentId,
            @RequestBody Map<String, Object> response) {
        
        // Get current user to validate parent access
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        
        VaccinationConsent consent = consentRepository.findById(consentId).orElse(null);
        if (consent == null) {
            return ResponseEntity.notFound().build();
        }

        // SECURITY: Validate that the parent can only respond to their own child's consent
        // Use the deprecated method for now, but we'll keep the validation
        // Assume parent code matches username in most cases
        boolean isParentOfStudent = parentStudentRelationshipRepository
            .existsByParent_User_UserCodeAndStudent_StudentCode(currentUsername, consent.getStudent().getStudentCode());
        
        // Alternative check using parent code directly if the above fails
        if (!isParentOfStudent) {
            isParentOfStudent = parentStudentRelationshipRepository
                .existsByParentCodeAndStudentStudentCode(currentUsername, consent.getStudent().getStudentCode());
        }
        
        if (!isParentOfStudent) {
            return ResponseEntity.status(403)
                .body(new MessageResponse("You can only respond to consent requests for your own children", false));
        }

        if (consent.getConsentStatus() != VaccinationConsent.ConsentStatus.PENDING) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Consent has already been responded to", false));
        }

        try {
            String statusStr = response.get("status").toString().toUpperCase();
            VaccinationConsent.ConsentStatus status = VaccinationConsent.ConsentStatus.valueOf(statusStr);
            
            if (status == VaccinationConsent.ConsentStatus.PENDING) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid consent status", false));
            }

            String parentNotes = response.getOrDefault("notes", "").toString();
            
            consentService.processConsentResponse(consentId, status, parentNotes);
            
            String message = status == VaccinationConsent.ConsentStatus.APPROVED 
                ? "Vaccination consent approved successfully. Your child has been scheduled for vaccination."
                : "Vaccination consent declined. Your child will not receive vaccination for this event.";
            
            return ResponseEntity.ok(new MessageResponse(message, true));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Invalid consent status", false));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Failed to process consent response", false));
        }
    }

    /**
     * Get consent details by ID
     */
    @GetMapping("/{consentId}")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<VaccinationConsent> getConsentDetails(@PathVariable Integer consentId) {
        VaccinationConsent consent = consentRepository.findById(consentId).orElse(null);
        if (consent == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(consent);
    }
}
