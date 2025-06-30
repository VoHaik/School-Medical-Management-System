package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.StudentHealthCheckupDTO;
import com.swp391_8.schoolhealth.dto.StudentHealthCheckupRequestDTO;
import com.swp391_8.schoolhealth.service.StudentHealthCheckupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/health-checkups")
@RequiredArgsConstructor
public class HealthCheckupController {

    private final StudentHealthCheckupService checkupService;

    @GetMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<StudentHealthCheckupDTO>> getHealthCheckups(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String studentCode,
            @RequestParam(required = false) Integer eventId,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<StudentHealthCheckupDTO> checkups;
        
        if (eventId != null) {
            checkups = checkupService.getCheckupsByEventId(eventId);
        } else if (studentCode != null) {
            checkups = checkupService.getCheckupsByStudentCode(studentCode);
        } else {
            // Get all checkups with optional filtering
            checkups = checkupService.getAllHealthCheckups(status, grade, startDate, endDate);
        }
        
        return ResponseEntity.ok(checkups);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<StudentHealthCheckupDTO> createHealthCheckup(
            @Valid @RequestBody StudentHealthCheckupRequestDTO requestDTO,
            Authentication authentication) {
        StudentHealthCheckupDTO createdCheckup = checkupService.createStudentHealthCheckup(requestDTO, authentication);
        return new ResponseEntity<>(createdCheckup, HttpStatus.CREATED);
    }

    @GetMapping("/{checkupId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('Parent') or hasAuthority('Student')")
    public ResponseEntity<StudentHealthCheckupDTO> getHealthCheckupById(@PathVariable Integer checkupId) {
        StudentHealthCheckupDTO checkup = checkupService.getStudentHealthCheckupById(checkupId);
        return ResponseEntity.ok(checkup);
    }

    @PutMapping("/{checkupId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<StudentHealthCheckupDTO> updateHealthCheckup(
            @PathVariable Integer checkupId,
            @Valid @RequestBody StudentHealthCheckupRequestDTO requestDTO,
            Authentication authentication) {
        StudentHealthCheckupDTO updatedCheckup = checkupService.updateStudentHealthCheckup(checkupId, requestDTO, authentication);
        return ResponseEntity.ok(updatedCheckup);
    }

    @DeleteMapping("/{checkupId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Void> deleteHealthCheckup(@PathVariable Integer checkupId) {
        checkupService.deleteStudentHealthCheckup(checkupId);
        return ResponseEntity.noContent().build();
    }
}
