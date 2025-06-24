package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.MedicationDTO;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.HealthDeclaration;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import com.swp391_8.schoolhealth.service.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/health-declaration")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthDeclarationController {
    
    private static final Logger logger = LoggerFactory.getLogger(HealthDeclarationController.class);
      @Autowired
    private HealthDeclarationService healthDeclarationService;
    
    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private com.swp391_8.schoolhealth.repository.HealthDeclarationRepository healthDeclarationRepository;
    
    @GetMapping
    @PreAuthorize("hasAuthority('Parent') or hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> getHealthDeclaration(
            @RequestParam(required = false) String studentCode,
            Authentication authentication) {
        
        logger.info("GET request received for health declaration with studentCode: {}", studentCode);
        
        // If no studentCode provided, return 400 BadRequest
        if (studentCode == null || studentCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student code is required", false));
        }

        // Check if the user has access to this student's data
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isParent = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_PARENT"));

        // If parent, check if they're related to the student
        if (isParent && !securityService.isParentOfStudentByCode(authentication, studentCode)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("You don't have permission to view this student's health declaration", false));
        }

        // Get health declaration for the student
        Optional<HealthDeclarationDTO> declaration = healthDeclarationService.getHealthDeclarationByStudentCode(studentCode);
        
        if (declaration.isPresent()) {
            return ResponseEntity.ok(declaration.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("No health declaration found for this student", false));        }
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<?> saveHealthDeclaration(
            @RequestBody HealthDeclarationDTO declarationDTO,
            Authentication authentication) {
        
        logger.info("POST request received for health declaration for studentCode: {}", declarationDTO.getStudentCode());
        
        // Get current username
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String username = userDetails.getUsername();
        String userCode = userDetails.getUserCode();
        
        logger.info("Parent username: {}, userCode: {}, studentCode: {}", 
                username, userCode, declarationDTO.getStudentCode());
        
        // Check if parent has access to the student 
        boolean hasAccess = securityService.isParentOfStudentByCode(authentication, declarationDTO.getStudentCode());
          // Log the results of the relationship check
        if (!hasAccess) {
            logger.warn("Parent {} does not have permission for student {}", 
                    username, declarationDTO.getStudentCode());
            
            // Also check with alternative methods for debugging
            boolean hasAccessDirect = securityService.parentHasAccessToStudent(username, declarationDTO.getStudentCode());
            boolean hasAccessUser = securityService.isParentOfStudent(authentication, declarationDTO.getStudentCode());
            
            // Try with userCode instead of username
            boolean hasAccessWithUserCode = securityService.parentHasAccessToStudent(userCode, declarationDTO.getStudentCode());
            
            logger.warn("Alternative checks: parentHasAccessToStudent with username: {}, with userCode: {}, isParentOfStudent: {}", 
                    hasAccessDirect, hasAccessWithUserCode, hasAccessUser);
            
            // If any method says yes, override the access denied
            if (hasAccessDirect || hasAccessUser || hasAccessWithUserCode) {
                logger.info("Permission override granted based on alternative checks");
                // Continue with submission
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to submit health declaration for this student", false));
            }
        }
        
        try {
            HealthDeclarationDTO savedDeclaration = healthDeclarationService.saveHealthDeclaration(declarationDTO, username);
            logger.info("Successfully saved health declaration for student: {}", declarationDTO.getStudentCode());
            return ResponseEntity.ok(savedDeclaration);
        } catch (Exception e) {
            logger.error("Error saving health declaration", e);            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error saving health declaration: " + e.getMessage(), false));
        }
    }
    
    @GetMapping("/history")
    @PreAuthorize("hasAuthority('Parent') or hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> getHealthDeclarationHistory(
            @RequestParam String studentCode,
            Authentication authentication) {
        
        logger.info("GET request received for health declaration history with studentCode: {}", studentCode);
        
        // Check permissions
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isParent = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_PARENT"));

        if (isParent && !securityService.isParentOfStudentByCode(authentication, studentCode)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("You don't have permission to view this student's health declaration history", false));
        }        List<HealthDeclarationDTO> declarationHistory = healthDeclarationService.getAllHealthDeclarationsByStudentCode(studentCode);
        return ResponseEntity.ok(declarationHistory);
    }
    
    @GetMapping("/approved-medications")
    @PreAuthorize("hasAuthority('Parent') or hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> getApprovedMedications(
            @RequestParam String studentCode,
            Authentication authentication) {
        
        logger.info("GET request received for approved medications for studentCode: {}", studentCode);
        
        // Nếu không có studentCode, trả về 400 BadRequest
        if (studentCode == null || studentCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student code is required", false));
        }

        // Kiểm tra người dùng có quyền truy cập dữ liệu của học sinh này không
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isParent = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_PARENT"));
        
        if (isParent) {
            if (!securityService.parentHasAccessToStudent(userDetails.getUsername(), studentCode)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You do not have access to this student's data", false));
            }
        }
        
        // Lấy danh sách thuốc đã được y tá duyệt (APPROVED/ADMINISTERED)
        List<MedicationDTO> medications = healthDeclarationService.getApprovedMedicationsForStudent(studentCode);
        
        // Nếu không có thuốc nào được duyệt, trả về thông báo gợi ý
        if (medications.isEmpty()) {
            logger.info("No approved medications found for student {}", studentCode);
            // Vẫn trả về danh sách rỗng nhưng thêm log để dễ debug
        }
        
        return ResponseEntity.ok(medications);
    }
      // Endpoint mới để lấy danh sách khai báo sức khỏe cần duyệt (chỉ dành cho y tá và admin)
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> getPendingHealthDeclarations(Authentication authentication) {
        logger.info("GET request received for pending health declarations");
        
        // Log authentication details for debugging
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        logger.info("User requesting pending declarations: {}, Roles: {}", 
                   userDetails.getUsername(),
                   userDetails.getAuthorities().stream()
                             .map(auth -> auth.getAuthority())
                             .collect(Collectors.toList()));
        
        List<HealthDeclarationDTO> pendingDeclarations = healthDeclarationService.getPendingHealthDeclarations();
        
        // Log the result for debugging
        logger.info("Found {} pending health declarations", pendingDeclarations.size());
        if (pendingDeclarations.isEmpty()) {
            logger.warn("No pending health declarations found in the database");
        } else {
            // Log some details of the first few declarations
            int count = Math.min(pendingDeclarations.size(), 3);
            for (int i = 0; i < count; i++) {
                HealthDeclarationDTO dto = pendingDeclarations.get(i);
                logger.info("Declaration #{}: ID={}, StudentCode={}, StudentName={}, Status={}", 
                           i+1, dto.getDeclarationId(), dto.getStudentCode(), 
                           dto.getStudentName() != null ? dto.getStudentName() : "NULL", 
                           dto.getStatus());
            }
        }
        
        return ResponseEntity.ok(pendingDeclarations);    }
    
    // Endpoint để lấy thông tin chi tiết của một khai báo sức khỏe theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('Parent') or hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> getHealthDeclarationById(
            @PathVariable Integer id,
            Authentication authentication) {
        
        logger.info("GET request received for health declaration with ID: {}", id);
        
        // Kiểm tra quyền truy cập
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isParent = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_PARENT"));
        
        try {
            HealthDeclarationDTO declaration = healthDeclarationService.getHealthDeclarationById(id);
            
            // Nếu là phụ huynh, kiểm tra xem họ có quyền truy cập khai báo này không
            if (isParent && !securityService.parentHasAccessToStudent(userDetails.getUsername(), declaration.getStudentCode())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("You do not have access to this health declaration", false));
            }
            
            return ResponseEntity.ok(declaration);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }    }
    
    // Endpoint để phê duyệt hoặc từ chối khai báo sức khỏe
    @PutMapping("/{id}/review")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> reviewHealthDeclaration(
            @PathVariable Integer id,
            @RequestBody Map<String, String> reviewData,
            Authentication authentication) {
        
        logger.info("PUT request received to review health declaration with ID: {}", id);
        
        String status = reviewData.get("status");
        String reviewNotes = reviewData.get("reviewNotes");
        
        if (status == null || (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED"))) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Status must be either 'APPROVED' or 'REJECTED'", false));
        }
        
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            HealthDeclarationDTO updatedDeclaration = healthDeclarationService.reviewHealthDeclaration(
                id, status, reviewNotes, userDetails.getUsername());
            
            return ResponseEntity.ok(updatedDeclaration);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage(), false));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Error reviewing health declaration", e);            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error reviewing health declaration: " + e.getMessage(), false));
        }
    }
    
    // Endpoint để y tá chỉnh sửa hồ sơ sức khỏe của học sinh
    @PutMapping("/nurse-edit/{studentCode}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> nurseEditHealthDeclaration(
            @PathVariable String studentCode,
            @RequestBody HealthDeclarationDTO healthDeclarationData,
            Authentication authentication) {
        
        logger.info("PUT request received to edit health declaration for student: {}", studentCode);
        
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            healthDeclarationData.setStudentCode(studentCode);
            
            HealthDeclarationDTO updatedDeclaration = healthDeclarationService.nurseEditHealthDeclaration(
                studentCode, healthDeclarationData, userDetails.getUsername());
            
            return ResponseEntity.ok(updatedDeclaration);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage(), false));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Error editing health declaration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error editing health declaration: " + e.getMessage(), false));
        }
    }
    
    // Endpoint để đếm số lượng khai báo sức khỏe đang chờ xử lý (cho nurse dashboard)
    @GetMapping("/pending/count")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Long> getPendingDeclarationsCount() {
        logger.info("Getting count of PENDING health declarations");
        long count = healthDeclarationRepository.countByStatus(HealthDeclaration.HealthDeclarationStatus.PENDING);
        logger.info("Found {} pending health declarations", count);
        return ResponseEntity.ok(count);
    }
}
