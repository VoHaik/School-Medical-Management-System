package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.DeclaredVaccinationRecordDTO;
import com.swp391_8.schoolhealth.dto.DeclaredVaccinationRecordRequestDTO;
import com.swp391_8.schoolhealth.service.DeclaredVaccinationRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/declared-vaccinations")
public class DeclaredVaccinationRecordController {

    @Autowired
    private DeclaredVaccinationRecordService recordService;

    @PostMapping("/student/{studentCode}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<DeclaredVaccinationRecordDTO> submitDeclaredVaccination(
            @PathVariable String studentCode,
            @RequestPart("record") DeclaredVaccinationRecordRequestDTO requestDTO,
            @RequestPart(value = "document", required = false) MultipartFile document) {
        DeclaredVaccinationRecordDTO submittedRecord = recordService.submitDeclaredVaccination(requestDTO, studentCode, document);
        return new ResponseEntity<>(submittedRecord, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentCode}")
    @PreAuthorize("hasAnyRole('PARENT', 'SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<DeclaredVaccinationRecordDTO>> getDeclaredRecordsByStudentCode(@PathVariable String studentCode) {
        List<DeclaredVaccinationRecordDTO> records = recordService.getDeclaredRecordsByStudentCode(studentCode);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/pending-verification")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<DeclaredVaccinationRecordDTO>> getPendingVerificationRecords() {
        List<DeclaredVaccinationRecordDTO> records = recordService.getPendingVerificationRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{recordId}")
    @PreAuthorize("hasAnyRole('PARENT', 'SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<DeclaredVaccinationRecordDTO> getDeclaredRecordById(@PathVariable Integer recordId) {
        DeclaredVaccinationRecordDTO record = recordService.getDeclaredRecordById(recordId);
        return ResponseEntity.ok(record);
    }

    @PostMapping("/{recordId}/verify")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<DeclaredVaccinationRecordDTO> verifyOrRejectDeclaredRecord(
            @PathVariable Integer recordId,
            @RequestBody Map<String, Object> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String verifiedByUsername = authentication.getName();

        Boolean isVerified = (Boolean) payload.get("isVerified");
        String verificationNotes = (String) payload.get("verificationNotes");

        if (isVerified == null) {
            return ResponseEntity.badRequest().body(null);
        }

        DeclaredVaccinationRecordDTO updatedRecord = recordService.verifyOrRejectDeclaredRecord(recordId, verifiedByUsername, isVerified, verificationNotes);
        return ResponseEntity.ok(updatedRecord);
    }
    
    @DeleteMapping("/{recordId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDeclaredRecord(@PathVariable Integer recordId) {
        recordService.deleteDeclaredRecord(recordId);
        return ResponseEntity.noContent().build();
    }
}
