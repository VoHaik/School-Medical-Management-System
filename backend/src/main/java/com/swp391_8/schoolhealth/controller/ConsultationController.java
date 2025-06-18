package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.ConsultationDTO;
import com.swp391_8.schoolhealth.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Updated CORS for consistency
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or @securityService.isParentOfStudentByConsultationId(authentication, #id)")
    public ResponseEntity<?> getConsultationById(@PathVariable Integer id) {
        try {
            ConsultationDTO consultation = consultationService.findById(id);
            return ResponseEntity.ok(consultation);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping("/student/{studentCode}") // Changed from studentId to studentCode
    // Assuming securityService.isParentOfStudentByCode(authentication, studentCode) or similar method exists for this check
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or @securityService.isParentOfStudentByCode(authentication, #studentCode)") // Updated to use isParentOfStudentByCode
    public ResponseEntity<?> getConsultationsByStudentId(@PathVariable String studentCode) { // Changed from Integer studentId to String studentCode
        try {
            List<ConsultationDTO> consultations = consultationService.findByStudentCode(studentCode); // Changed from findByStudentId to findByStudentCode
            if (consultations.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(consultations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> createConsultation(@RequestBody ConsultationDTO consultationDTO) {
        try {
            ConsultationDTO createdConsultation = consultationService.createConsultation(consultationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdConsultation);
        } catch (EntityNotFoundException e) { // Catch if student or checkup linked in DTO not found
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create consultation: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateConsultation(@PathVariable Integer id, @RequestBody ConsultationDTO consultationDTO) {
        try {
            ConsultationDTO updatedConsultation = consultationService.updateConsultation(id, consultationDTO);
            return ResponseEntity.ok(updatedConsultation);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update consultation: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteConsultation(@PathVariable Integer id) {
        try {
            consultationService.deleteConsultation(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete consultation: " + e.getMessage());
        }
    }
}