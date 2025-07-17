package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.service.MedicationRequestService;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import com.swp391_8.schoolhealth.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, maxAge = 3600)
public class NurseDashboardController {

    private static final Logger logger = LoggerFactory.getLogger(NurseDashboardController.class);

    @Autowired
    private MedicationRequestService medicationRequestService;

    @Autowired(required = false)
    private HealthDeclarationService healthDeclarationService;

    @Autowired
    private StudentService studentService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('ROLE_SCHOOLNURSE') or hasAuthority('Admin') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getNurseDashboard(Authentication authentication) {
        try {
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Get pending medication requests count
            try {
                var pendingRequests = medicationRequestService.getAllPendingMedicationRequests(authentication);
                dashboardData.put("pendingMedicationRequests", pendingRequests.size());
                dashboardData.put("recentMedicationRequests", pendingRequests.stream().limit(5).toList());
            } catch (Exception e) {
                dashboardData.put("pendingMedicationRequests", 0);
                dashboardData.put("recentMedicationRequests", java.util.Collections.emptyList());
            }

            // Get health declaration count if service is available
            try {
                if (healthDeclarationService != null) {
                    var pendingDeclarations = healthDeclarationService.getPendingHealthDeclarations();
                    dashboardData.put("pendingHealthDeclarations", pendingDeclarations.size());
                } else {
                    dashboardData.put("pendingHealthDeclarations", 0);
                }
            } catch (Exception e) {
                dashboardData.put("pendingHealthDeclarations", 0);
            }

            // Get total students count
            try {
                var students = studentService.getAllStudents();
                dashboardData.put("totalStudents", students.size());
            } catch (Exception e) {
                dashboardData.put("totalStudents", 0);
            }

            dashboardData.put("todayEvents", 0);
            dashboardData.put("completedToday", 0);

            return ResponseEntity.ok(dashboardData);
            
        } catch (Exception e) {
            logger.error("Error retrieving nurse dashboard data", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Could not retrieve dashboard data"
            ));
        }
    }

    @GetMapping("/quick-stats")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('ROLE_SCHOOLNURSE') or hasAuthority('Admin') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getQuickStats(Authentication authentication) {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Medication requests count
            try {
                var pendingRequests = medicationRequestService.getAllPendingMedicationRequests(authentication);
                stats.put("pendingMedicationRequests", pendingRequests.size());
            } catch (Exception e) {
                stats.put("pendingMedicationRequests", 0);
            }

            // Students count
            try {
                var students = studentService.getAllStudents();
                stats.put("totalStudents", students.size());
            } catch (Exception e) {
                stats.put("totalStudents", 0);
            }

            stats.put("pendingHealthDeclarations", 0);
            stats.put("todayEvents", 0);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error retrieving quick stats", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Could not retrieve quick stats"
            ));
        }
    }

    @GetMapping("/health-declarations")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('ROLE_SCHOOLNURSE') or hasAuthority('Admin') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllHealthDeclarations(Authentication authentication) {
        try {
            if (healthDeclarationService != null) {
                var declarations = healthDeclarationService.getAllHealthDeclarations();
                return ResponseEntity.ok(declarations);
            } else {
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }
        } catch (Exception e) {
            logger.error("Error fetching health declarations", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Could not retrieve health declarations"
            ));
        }
    }
}
