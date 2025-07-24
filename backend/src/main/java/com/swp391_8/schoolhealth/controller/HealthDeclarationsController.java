package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/health-declarations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, maxAge = 3600)
public class HealthDeclarationsController {
    
    private static final Logger logger = LoggerFactory.getLogger(HealthDeclarationsController.class);
    
    @Autowired
    private HealthDeclarationService healthDeclarationService;
    
    // Get all health declarations
    @GetMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('ROLE_SCHOOLNURSE') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllHealthDeclarations(Authentication authentication) {
        logger.info("=== GET ALL HEALTH DECLARATIONS ENDPOINT CALLED ===");
        logger.info("GET request received for all health declarations by user: {}", authentication.getName());
        
        try {
            var declarations = healthDeclarationService.getAllHealthDeclarations();
            logger.info("Found {} health declarations", declarations.size());
            return ResponseEntity.ok(declarations);
        } catch (Exception e) {
            logger.error("Error fetching all health declarations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error fetching health declarations: " + e.getMessage(), false));
        }
    }
    
    // Get health declaration by student code
    @GetMapping("/student/{studentCode}")
    @PreAuthorize("hasAuthority('Parent') or hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> getHealthDeclarationByStudentCode(
            @PathVariable String studentCode,
            Authentication authentication) {
        
        logger.info("GET request received for health declaration with studentCode: {}", studentCode);
        
        try {
            Optional<HealthDeclarationDTO> declaration = healthDeclarationService.getHealthDeclarationByStudentCode(studentCode);
            
            if (declaration.isPresent()) {
                return ResponseEntity.ok(declaration.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No health declaration found for this student", false));
            }
        } catch (Exception e) {
            logger.error("Error fetching health declaration for student: {}", studentCode, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error fetching health declaration: " + e.getMessage(), false));
        }
    }
    
    // Update health declaration by student code (for nurses)
    @PostMapping("/student/{studentCode}/update")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<?> updateHealthDeclarationByStudent(
            @PathVariable String studentCode,
            @RequestBody HealthDeclarationDTO healthDeclarationData,
            Authentication authentication) {
        
        logger.info("POST request received to update health declaration for student: {}", studentCode);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
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
            logger.error("Error updating health declaration for student: {}", studentCode, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error updating health declaration: " + e.getMessage(), false));
        }
    }
}
