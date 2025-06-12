package com.swp391_8.schoolhealth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swp391_8.schoolhealth.dto.MedicationSubmissionDTO;
import com.swp391_8.schoolhealth.service.MedicationSubmissionService; // Actual service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medication-submissions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MedicationSubmissionController {

    @Autowired
    private MedicationSubmissionService medicationSubmissionService; // Use the actual service

    @Autowired
    private ObjectMapper objectMapper; // For deserializing JSON string

    @PostMapping
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> submitMedication(
            @RequestPart("submission") String submissionDtoString,
            @RequestPart(value = "doctorNote", required = false) MultipartFile doctorNoteFile) {
        try {
            MedicationSubmissionDTO submissionDTO = objectMapper.readValue(submissionDtoString, MedicationSubmissionDTO.class);
            
            // Log received DTO and file
            System.out.println("Received MedicationSubmissionDTO: " + submissionDTO);
            if (doctorNoteFile != null && !doctorNoteFile.isEmpty()) {
                System.out.println("Received doctorNoteFile: " + doctorNoteFile.getOriginalFilename() + ", size: " + doctorNoteFile.getSize());
            } else {
                System.out.println("No doctorNoteFile received or file is empty.");
            }

            MedicationSubmissionDTO savedSubmission = medicationSubmissionService.saveMedicationSubmission(submissionDTO, doctorNoteFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSubmission);
        } catch (IOException e) {
            // Log the exception details
            System.err.println("Error deserializing submissionDtoString: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid submission data format: " + e.getMessage());
        } catch (RuntimeException e) {
            // Log the exception details
            System.err.println("Error saving medication submission: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving medication submission: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('PARENT') or hasRole('TEACHER') or hasRole('STAFF')")
    public ResponseEntity<List<MedicationSubmissionDTO>> getMedicationSubmissionsByStudentCode(@RequestParam String studentCode) { // Changed from studentId to studentCode, and Long to String
        // Log the request
        System.out.println("Fetching medication submissions for studentCode: " + studentCode);
        try {
            List<MedicationSubmissionDTO> submissions = medicationSubmissionService.getMedicationSubmissionsByStudentCode(studentCode); // Changed from getMedicationSubmissionsByStudentId to getMedicationSubmissionsByStudentCode
            if (submissions.isEmpty()) {
                System.out.println("No medication submissions found for studentCode: " + studentCode);
                return ResponseEntity.noContent().build();
            }
            System.out.println("Found " + submissions.size() + " submissions for studentCode: " + studentCode);
            return ResponseEntity.ok(submissions);
        } catch (RuntimeException e) {
            // Log the exception details
            System.err.println("Error fetching medication submissions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Or an error DTO
        }
    }
}
