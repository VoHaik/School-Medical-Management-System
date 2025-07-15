package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.ParentRegistrationRequestDTO;
import com.swp391_8.schoolhealth.service.ParentRegistrationRequestService;
import com.swp391_8.schoolhealth.service.UserService;
import com.swp391_8.schoolhealth.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parent-registration")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
@RequiredArgsConstructor
public class ParentRegistrationController {

    private final ParentRegistrationRequestService registrationService;
    private final UserService userService;

    /**
     * Endpoint công khai để parent submit registration request
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitRegistrationRequest(@RequestBody ParentRegistrationRequestDTO requestDTO) {
        try {
            ParentRegistrationRequestDTO createdRequest = registrationService.createRegistrationRequest(requestDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration request submitted successfully! Please wait for admin approval.");
            response.put("requestId", createdRequest.getRequestId());
            response.put("status", "PENDING");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            // Parse validation errors để tạo response structured
            String errorMessage = e.getMessage();
            String[] errors = errorMessage.split("\\. ");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed due to validation errors");
            response.put("errors", errors);
            response.put("errorType", "VALIDATION_ERROR");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "An unexpected error occurred. Please try again later.");
            response.put("errorType", "SYSTEM_ERROR");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Lấy tất cả registration requests (chỉ admin)
     */
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('Admin') or hasRole('ADMIN')")
    public ResponseEntity<List<ParentRegistrationRequestDTO>> getAllRequests() {
        List<ParentRegistrationRequestDTO> requests = registrationService.getAllRegistrationRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * Lấy requests theo status (chỉ admin)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('Admin') or hasRole('ADMIN')")
    public ResponseEntity<List<ParentRegistrationRequestDTO>> getRequestsByStatus(@PathVariable String status) {
        try {
            List<ParentRegistrationRequestDTO> requests = registrationService.getRequestsByStatus(status);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy số lượng pending requests (chỉ admin)
     */
    @GetMapping("/pending-count")
    @PreAuthorize("hasAuthority('Admin') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getPendingCount() {
        long count = registrationService.getPendingRequestsCount();
        Map<String, Long> response = new HashMap<>();
        response.put("pendingCount", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Approve registration request (chỉ admin)
     */
    @PostMapping("/{requestId}/approve")
    @PreAuthorize("hasAuthority('Admin') or hasRole('ADMIN')")
    public ResponseEntity<?> approveRequest(@PathVariable Integer requestId, Authentication authentication) {
        try {
            // Lấy admin ID từ authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User admin = userService.findByUsername(userDetails.getUsername());
            Integer adminId = admin.getUserId();

            ParentRegistrationRequestDTO approvedRequest = registrationService.approveRequest(requestId, adminId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration request approved successfully. User account created.");
            response.put("request", approvedRequest);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Decline registration request (chỉ admin)
     */
    @PostMapping("/{requestId}/decline")
    @PreAuthorize("hasAuthority('Admin') or hasRole('ADMIN')")
    public ResponseEntity<?> declineRequest(
            @PathVariable Integer requestId, 
            @RequestBody Map<String, String> requestBody,
            Authentication authentication) {
        try {
            String reason = requestBody.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Decline reason is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Lấy admin ID từ authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User admin = userService.findByUsername(userDetails.getUsername());
            Integer adminId = admin.getUserId();

            ParentRegistrationRequestDTO declinedRequest = registrationService.declineRequest(requestId, adminId, reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration request declined successfully.");
            response.put("request", declinedRequest);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Lấy chi tiết request theo ID (chỉ admin)
     */
    @GetMapping("/{requestId}")
    @PreAuthorize("hasAuthority('Admin') or hasRole('ADMIN')")
    public ResponseEntity<?> getRequestById(@PathVariable Integer requestId) {
        try {
            ParentRegistrationRequestDTO request = registrationService.getRequestById(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
