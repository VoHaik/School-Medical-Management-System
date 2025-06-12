package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthCheckupDTO;
import com.swp391_8.schoolhealth.service.HealthCheckupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/health-checkups")
public class HealthCheckupController {

    @Autowired
    private HealthCheckupService healthCheckupService;

    @PostMapping
    @PreAuthorize("hasRole('SchoolNurse') or hasRole('ADMIN')")
    public ResponseEntity<HealthCheckupDTO> createHealthCheckup(@RequestBody HealthCheckupDTO healthCheckupDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String creatorUsername = userDetails.getUsername();
        HealthCheckupDTO createdCheckup = healthCheckupService.createHealthCheckup(healthCheckupDTO, creatorUsername);
        return new ResponseEntity<>(createdCheckup, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SchoolNurse', 'ADMIN', 'TEACHER', 'PARENT')")
    public ResponseEntity<List<HealthCheckupDTO>> getAllHealthCheckups(
            @RequestParam(required = false) String studentCode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String checkupType,
            @RequestParam(required = false) String status
    ) {
        List<HealthCheckupDTO> healthCheckups = healthCheckupService.getAllHealthCheckups(studentCode, startDate, endDate, checkupType, status);
        return ResponseEntity.ok(healthCheckups);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SchoolNurse', 'ADMIN', 'TEACHER', 'PARENT')")
    public ResponseEntity<HealthCheckupDTO> getHealthCheckupById(@PathVariable Long id) {
        HealthCheckupDTO healthCheckupDTO = healthCheckupService.getHealthCheckupById(id);
        return ResponseEntity.ok(healthCheckupDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SchoolNurse') or hasRole('ADMIN')")
    public ResponseEntity<HealthCheckupDTO> updateHealthCheckup(@PathVariable Long id, @RequestBody HealthCheckupDTO healthCheckupDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String updaterUsername = userDetails.getUsername();
        HealthCheckupDTO updatedCheckup = healthCheckupService.updateHealthCheckup(id, healthCheckupDTO, updaterUsername);
        return ResponseEntity.ok(updatedCheckup);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SchoolNurse') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHealthCheckup(@PathVariable Long id) {
        healthCheckupService.deleteHealthCheckup(id);
        return ResponseEntity.noContent().build();
    }
}
