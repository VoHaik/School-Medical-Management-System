package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
// import com.swp391_8.schoolhealth.service.HealthDeclarationService; // Assume this service will be created
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // Placeholder for service return type

// Placeholder for HealthDeclarationService - this should be in its own file: com.swp391_8.schoolhealth.service.HealthDeclarationService
interface HealthDeclarationService {
    HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto);
    Optional<HealthDeclarationDTO> getHealthDeclarationByStudentCode(String studentCode); // Changed from studentId to studentCode
    // Or List<HealthDeclarationDTO> getHealthDeclarationsByStudentCode(String studentCode); // If multiple are expected
}

// Placeholder for a simple service implementation - this should be in its own file: com.swp391_8.schoolhealth.service.impl.HealthDeclarationServiceImpl
// @org.springframework.stereotype.Service
// class HealthDeclarationServiceImpl implements HealthDeclarationService {
//     // @Autowired
//     // private HealthDeclarationRepository healthDeclarationRepository; // Assume this repository will be created
//     // @Autowired
//     // private StudentRepository studentRepository; // To link with student

//     @Override
//     public HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto) {
//         // Basic placeholder logic:
//         // Convert DTO to Entity
//         // Save entity
//         // Convert Entity back to DTO
//         System.out.println("Mock Service: Saving health declaration for student ID: " + dto.getStudentId() + ", Draft: " + dto.isDraft());
//         // In a real scenario, you would save to DB and return the saved DTO (possibly with generated ID)
//         dto.setDeclarationId(1); // Mock ID
//         return dto;
//     }

//     @Override
//     public Optional<HealthDeclarationDTO> getHealthDeclarationByStudentId(Integer studentId) {
//         // Basic placeholder logic:
//         System.out.println("Mock Service: Fetching health declaration for student ID: " + studentId);
//         // In a real scenario, you would fetch from DB
//         // For now, returning an empty Optional or a mock DTO
//         // if (studentId == 1) { // Example
//         //     HealthDeclarationDTO mockDto = new HealthDeclarationDTO();
//         //     mockDto.setStudentId(studentId);
//         //     mockDto.setDeclarationId(1);
//         //     mockDto.setHasFever(false);
//         //     // ... set other fields
//         //     return Optional.of(mockDto);
//         // }
//         return Optional.empty();
//     }
// }


@RestController
@RequestMapping("/api/health-declaration")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class HealthDeclarationController {

    // @Autowired
    // private HealthDeclarationService healthDeclarationService; // Uncomment when service is implemented

    // For now, using a simple mock service directly in the controller for brevity
    // In a real application, HealthDeclarationService would be properly injected.
    private final HealthDeclarationService healthDeclarationService = new HealthDeclarationService() {
        @Override
        public HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto) {
            System.out.println("Mock Service (inline): Saving health declaration for student Code: " + dto.getStudentCode() + ", Draft: " + dto.isDraft()); // Changed from getStudentId to getStudentCode
            // Simulate saving and returning DTO
            if (dto.getDeclarationId() == null) {
                 // Assign a mock ID if it's a new declaration
                dto.setDeclarationId( (int) (Math.random() * 1000));
            }
            // Potentially map to entity, save, map back to DTO
            return dto;
        }

        @Override
        public Optional<HealthDeclarationDTO> getHealthDeclarationByStudentCode(String studentCode) { // Changed from studentId to studentCode
            System.out.println("Mock Service (inline): Fetching health declaration for student Code: " + studentCode); // Changed from studentId to studentCode
            // Simulate fetching. Return empty or a mock DTO.
            // This needs to align with frontend expectations (one or list)
            // The frontend HealthDeclaration.js fetches and then setsFormValues, suggesting one declaration.
            // Let's return an empty Optional for now, or a very basic mock if needed for testing.
            // Example:
            // if (studentId.equals(1)) { // Assuming studentId 1 has a declaration
            //     HealthDeclarationDTO mockDto = new HealthDeclarationDTO();
            //     mockDto.setDeclarationId(101);
            //     mockDto.setStudentId(studentId);
            //     mockDto.setHasFever(false);
            //     mockDto.setHasCough(false);
            //     // ... set other relevant fields as expected by frontend
            //     return Optional.of(mockDto);
            // }
            return Optional.empty(); // Default to no declaration found
        }
    };


    @PostMapping
    @PreAuthorize("hasRole(\'ROLE_PARENT\')")
    public ResponseEntity<HealthDeclarationDTO> submitHealthDeclaration(@RequestBody HealthDeclarationDTO healthDeclarationDTO) {
        // Basic validation (can be expanded with @Valid and validation annotations on DTO)
        if (healthDeclarationDTO.getStudentCode() == null || healthDeclarationDTO.getStudentCode().isEmpty()) { // Changed from getStudentId to getStudentCode and added isEmpty check
            return ResponseEntity.badRequest().body(null); // Or a proper error DTO
        }
        try {
            HealthDeclarationDTO savedDeclaration = healthDeclarationService.saveHealthDeclaration(healthDeclarationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDeclaration);
        } catch (Exception e) {
            // Log exception e
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Or a proper error DTO
        }
    }

    @GetMapping
    @PreAuthorize("hasRole(\'ROLE_PARENT\') or hasRole(\'ROLE_NURSE\')")
    public ResponseEntity<HealthDeclarationDTO> getHealthDeclarationByStudent(@RequestParam String studentCode) { // Changed from Integer studentId to String studentCode
        // The frontend (HealthDeclaration.js) seems to expect a single object for a student to populate the form.
        // If a student can have multiple declarations, this might need to return the latest, or the frontend
        // might need to be adjusted to handle a list (e.g., to show history and allow editing a draft).
        // For now, aligning with the apparent expectation of a single current/draft declaration.
        Optional<HealthDeclarationDTO> declarationDTO = healthDeclarationService.getHealthDeclarationByStudentCode(studentCode); // Changed from getHealthDeclarationByStudentId to getHealthDeclarationByStudentCode
        if (declarationDTO.isPresent()) {
            return ResponseEntity.ok(declarationDTO.get());
        } else {
            // If no declaration is found, the frontend might expect an empty form or specific handling.
            // Returning 404 might be appropriate if a declaration is strictly expected.
            // Returning an empty DTO or null might also be options depending on frontend logic.
            // For now, let's return 404 if not found, as it implies the resource for that student doesn't exist.
            return ResponseEntity.notFound().build();
        }
    }
}
