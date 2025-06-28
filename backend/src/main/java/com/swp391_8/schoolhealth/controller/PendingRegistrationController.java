package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.dto.ParentRegistrationRequest;
import com.swp391_8.schoolhealth.dto.PendingRegistrationResponse;
import com.swp391_8.schoolhealth.model.PendingRegistration;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.PendingRegistrationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/registration")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PendingRegistrationController {
    
    private static final Logger logger = LoggerFactory.getLogger(PendingRegistrationController.class);
    
    @Autowired
    private PendingRegistrationService pendingRegistrationService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Đăng ký tài khoản parent (public endpoint)
    @PostMapping("/parent")
    public ResponseEntity<?> registerParent(@Valid @RequestBody ParentRegistrationRequest request) {
        logger.info("Received parent registration request for username: {}", request.getUsername());
        
        try {
            pendingRegistrationService.submitRegistrationRequest(request);
            
            return ResponseEntity.ok(new MessageResponse(
                "Registration request submitted successfully! Your request will be reviewed by an administrator. " +
                "You will be contacted once your account is approved.", true));
                
        } catch (IllegalArgumentException e) {
            logger.warn("Parent registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Parent registration error", e);
            return ResponseEntity.status(500).body(new MessageResponse(
                "Error: An unexpected error occurred. Please try again later or contact support.", false));
        }
    }
    
    // Lấy tất cả yêu cầu chờ phê duyệt (Admin only)
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<List<PendingRegistrationResponse>> getPendingRegistrations() {
        logger.info("Fetching all pending registration requests");
        
        try {
            List<PendingRegistrationResponse> pendingRegistrations = pendingRegistrationService.getAllPendingRegistrations();
            return ResponseEntity.ok(pendingRegistrations);
        } catch (Exception e) {
            logger.error("Error fetching pending registrations", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    // Lấy yêu cầu theo trạng thái (Admin only)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<List<PendingRegistrationResponse>> getRegistrationsByStatus(@PathVariable String status) {
        logger.info("Fetching registrations with status: {}", status);
        
        try {
            PendingRegistration.RegistrationStatus registrationStatus = PendingRegistration.RegistrationStatus.valueOf(status.toUpperCase());
            List<PendingRegistrationResponse> registrations = pendingRegistrationService.getRegistrationsByStatus(registrationStatus);
            return ResponseEntity.ok(registrations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching registrations by status", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    // Phê duyệt yêu cầu đăng ký (Admin only)
    @PutMapping("/{registrationId}/approve")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> approveRegistration(
            @PathVariable Integer registrationId,
            @RequestBody(required = false) Map<String, String> requestBody,
            Authentication authentication) {
        
        logger.info("Processing approval for registration ID: {}", registrationId);
        
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(401).body(new MessageResponse("Error: User not found", false));
            }
            
            String adminNotes = requestBody != null ? requestBody.get("adminNotes") : null;
            pendingRegistrationService.approveRegistration(
                registrationId, adminNotes, userOpt.get());
            
            return ResponseEntity.ok(new MessageResponse(
                "Registration approved successfully! User account has been created.", true));
                
        } catch (IllegalArgumentException e) {
            logger.warn("Registration approval failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Registration approval error", e);
            return ResponseEntity.status(500).body(new MessageResponse(
                "Error: An unexpected error occurred while approving the registration.", false));
        }
    }
    
    // Từ chối yêu cầu đăng ký (Admin only)
    @PutMapping("/{registrationId}/reject")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> rejectRegistration(
            @PathVariable Integer registrationId,
            @RequestBody Map<String, String> requestBody,
            Authentication authentication) {
        
        logger.info("Processing rejection for registration ID: {}", registrationId);
        
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(401).body(new MessageResponse("Error: User not found", false));
            }
            
            String rejectionReason = requestBody.get("rejectionReason");
            String adminNotes = requestBody.get("adminNotes");
            
            if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Rejection reason is required", false));
            }
            
            pendingRegistrationService.rejectRegistration(
                registrationId, rejectionReason, adminNotes, userOpt.get());
            
            return ResponseEntity.ok(new MessageResponse(
                "Registration rejected successfully.", true));
                
        } catch (IllegalArgumentException e) {
            logger.warn("Registration rejection failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Registration rejection error", e);
            return ResponseEntity.status(500).body(new MessageResponse(
                "Error: An unexpected error occurred while rejecting the registration.", false));
        }
    }
    
    // Đếm số lượng yêu cầu chờ phê duyệt (Admin only)
    @GetMapping("/pending/count")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<Long> getPendingRegistrationsCount() {
        try {
            long count = pendingRegistrationService.countPendingRegistrations();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            logger.error("Error counting pending registrations", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    // Lấy chi tiết một yêu cầu (Admin only)
    @GetMapping("/{registrationId}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> getRegistrationDetails(@PathVariable Integer registrationId) {
        try {
            Optional<PendingRegistrationResponse> registration = pendingRegistrationService.getRegistrationById(registrationId);
            
            if (registration.isPresent()) {
                return ResponseEntity.ok(registration.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching registration details", e);
            return ResponseEntity.status(500).build();
        }
    }
}
