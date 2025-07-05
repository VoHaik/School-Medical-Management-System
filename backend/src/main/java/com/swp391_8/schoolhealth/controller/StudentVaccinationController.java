package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.StudentVaccinationDTO;
import com.swp391_8.schoolhealth.dto.StudentVaccinationRequestDTO;
import com.swp391_8.schoolhealth.service.StudentVaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // For request body of administer vaccine
import org.springframework.security.core.Authentication; // Added import
import java.time.LocalDate; // Added import for LocalDate

@RestController
@RequestMapping("/api/student-vaccinations")
public class StudentVaccinationController {

    @Autowired
    private StudentVaccinationService studentVaccinationService;

    // Endpoint for a nurse or admin to create a new vaccination record for a student
    @PostMapping
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')") // Corrected role names
    public ResponseEntity<StudentVaccinationDTO> createStudentVaccination(@RequestBody StudentVaccinationRequestDTO requestDTO) {
        StudentVaccinationDTO createdVaccination = studentVaccinationService.createStudentVaccination(requestDTO);
        return new ResponseEntity<>(createdVaccination, HttpStatus.CREATED);
    }

    // Endpoint for parents to view their child's vaccination records
    // Or for nurses/admins to view all records for a specific student
    @GetMapping("/student/{studentCode}") // Changed studentId to studentCode
    @PreAuthorize("hasAnyRole('PARENT', 'SCHOOLNURSE', 'ADMIN')") // Corrected role names
    public ResponseEntity<List<StudentVaccinationDTO>> getStudentVaccinationsByStudentCode(@PathVariable String studentCode) { // Changed studentId to studentCode
        // Corrected service method name
        List<StudentVaccinationDTO> vaccinations = studentVaccinationService.getStudentVaccinationsByStudentCode(studentCode);
        return ResponseEntity.ok(vaccinations);
    }

    // Endpoint to get a specific student vaccination record by its ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PARENT', 'SCHOOLNURSE', 'ADMIN')") // Corrected role names
    public ResponseEntity<StudentVaccinationDTO> getStudentVaccinationById(@PathVariable Integer id) { // Changed String id to Integer id
        StudentVaccinationDTO vaccination = studentVaccinationService.getStudentVaccinationById(id);
        return ResponseEntity.ok(vaccination);
    }

    // Endpoint for a nurse or admin to update a vaccination record
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')") // Corrected role names
    public ResponseEntity<StudentVaccinationDTO> updateStudentVaccination(@PathVariable Integer id, @RequestBody StudentVaccinationRequestDTO requestDTO) { // Changed String id to Integer id
        StudentVaccinationDTO updatedVaccination = studentVaccinationService.updateStudentVaccination(id, requestDTO);
        return ResponseEntity.ok(updatedVaccination);
    }
    
    // Endpoint for a parent to provide consent for a vaccination
    @PostMapping("/{id}/consent")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<StudentVaccinationDTO> provideConsent(@PathVariable Integer id, 
                                                                @RequestParam String consentStatus, // Changed from boolean to String
                                                                @RequestParam(required = false) String notes, 
                                                                @RequestParam(required = false) String documentUrl,
                                                                Authentication authentication) { 
        // Corrected service method signature to match new parameters in StudentVaccinationService
        StudentVaccinationDTO updatedVaccination = studentVaccinationService.recordConsent(id, consentStatus, notes, documentUrl, authentication);
        return ResponseEntity.ok(updatedVaccination);
    }

    // Endpoint for a nurse to mark a vaccine as administered or verify
    @PostMapping("/{id}/action") // Changed from /administer to /action
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')") // Allow Admin as well
    public ResponseEntity<StudentVaccinationDTO> performVaccinationAction(
            @PathVariable Integer id, 
            @RequestParam String action, // "verify" or "administer"
            @RequestBody(required = false) Map<String, String> payload,
            Authentication authentication) { 
        // Extract details from payload, these are optional depending on action
        LocalDate vaccinationDate = payload != null && payload.get("vaccinationDate") != null ? LocalDate.parse(payload.get("vaccinationDate")) : null;
        String batchNumber = payload != null ? payload.get("batchNumber") : null;
        String administeringLocation = payload != null ? payload.get("administeringLocation") : null;
        String adminNotes = payload != null ? payload.get("adminNotes") : null;

        // Corrected service method signature to match new parameters in StudentVaccinationService
        StudentVaccinationDTO resultVaccination = studentVaccinationService.verifyOrAdministerVaccination(id, action, vaccinationDate, batchNumber, administeringLocation, adminNotes, authentication);
        return ResponseEntity.ok(resultVaccination);
    }

    // Endpoint for a nurse or admin to delete a vaccination record (use with caution)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')") // Corrected role names
    public ResponseEntity<Void> deleteStudentVaccination(@PathVariable Integer id) { // Changed String id to Integer id
        studentVaccinationService.deleteStudentVaccination(id);
        return ResponseEntity.noContent().build();
    }
}
