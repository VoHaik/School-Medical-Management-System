package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import com.swp391_8.schoolhealth.dto.StudentVaccinationDTO;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.HealthDeclarationService;
import com.swp391_8.schoolhealth.service.MedicalEventServiceInterface;
import com.swp391_8.schoolhealth.service.StudentVaccinationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, maxAge = 3600)
public class StudentDashboardController {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentDashboardController.class);
    
    @Autowired
    private HealthDeclarationService healthDeclarationService;
    
    @Autowired
    private MedicalEventServiceInterface medicalEventService;
    
    @Autowired
    private StudentVaccinationService studentVaccinationService;
    
    /**
     * Get health profile (accepted health declarations) for current student
     */
    @GetMapping("/health-profile")
    @PreAuthorize("hasAuthority('Student')")
    public ResponseEntity<?> getStudentHealthProfile(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String studentCode = userDetails.getUserCode(); // Use userCode instead of username
            
            logger.info("GET request for health profile of student: {}", studentCode);
            
            // Get accepted health declaration for the student
            Optional<HealthDeclarationDTO> declaration = healthDeclarationService.getAcceptedHealthDeclarationByStudentCode(studentCode);
            
            if (declaration.isPresent()) {
                return ResponseEntity.ok(declaration.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No accepted health declaration found", false));
            }
        } catch (Exception e) {
            logger.error("Error retrieving health profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving health profile", false));
        }
    }
    
    /**
     * Get medical history (medical events) for current student
     */
    @GetMapping("/medical-history")
    @PreAuthorize("hasAuthority('Student')")
    public ResponseEntity<?> getStudentMedicalHistory(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String studentCode = userDetails.getUserCode(); // Use userCode instead of username
            
            logger.info("GET request for medical history of student: {}", studentCode);
            
            // Get medical events for the student
            List<MedicalEventDTO> events = medicalEventService.getMedicalEventsByStudentStudentCode(studentCode);
            
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error retrieving medical history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving medical history", false));
        }
    }
    
    /**
     * Get vaccination records (completed vaccinations) for current student
     */
    @GetMapping("/vaccination-records")
    @PreAuthorize("hasAuthority('Student')")
    public ResponseEntity<?> getStudentVaccinationRecords(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String studentCode = userDetails.getUserCode(); // Use userCode instead of username
            
            logger.info("GET request for vaccination records of student: {}", studentCode);
            
            // Get completed vaccination records for the student
            List<StudentVaccinationDTO> vaccinations = studentVaccinationService.getCompletedVaccinationsByStudentCode(studentCode);
            
            return ResponseEntity.ok(vaccinations);
        } catch (Exception e) {
            logger.error("Error retrieving vaccination records", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving vaccination records", false));
        }
    }
    
    /**
     * Get dashboard statistics for current student
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('Student')")
    public ResponseEntity<?> getStudentDashboard(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String studentCode = userDetails.getUserCode();
            
            logger.info("GET request for dashboard data of student: {}", studentCode);
            
            // Prepare dashboard data
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Basic student info
            dashboardData.put("studentCode", studentCode);
            dashboardData.put("fullName", userDetails.getFullName());
            dashboardData.put("email", userDetails.getEmail());
            
            // Quick stats
            Map<String, Integer> quickStats = new HashMap<>();
            
            try {
                // Health declarations count
                List<HealthDeclarationDTO> declarations = healthDeclarationService.getAllHealthDeclarationsByStudentCode(studentCode);
                quickStats.put("healthDeclarations", declarations.size());
            } catch (Exception e) {
                logger.warn("Could not fetch health declarations for student {}: {}", studentCode, e.getMessage());
                quickStats.put("healthDeclarations", 0);
            }
            
            try {
                // Medical events/appointments count
                List<MedicalEventDTO> medicalEvents = medicalEventService.getMedicalEventsByStudentStudentCode(studentCode);
                quickStats.put("totalAppointments", medicalEvents.size());
            } catch (Exception e) {
                logger.warn("Could not fetch medical events for student {}: {}", studentCode, e.getMessage());
                quickStats.put("totalAppointments", 0);
            }
            
            try {
                // Vaccination records count
                List<StudentVaccinationDTO> vaccinations = studentVaccinationService.getCompletedVaccinationsByStudentCode(studentCode);
                quickStats.put("completedVaccinations", vaccinations.size());
                quickStats.put("pendingVaccinations", 0); // For now, just set to 0
            } catch (Exception e) {
                logger.warn("Could not fetch vaccination records for student {}: {}", studentCode, e.getMessage());
                quickStats.put("completedVaccinations", 0);
                quickStats.put("pendingVaccinations", 0);
            }
            
            // Placeholder for notifications (implement when notification system is ready)
            quickStats.put("unreadNotifications", 0);
            
            dashboardData.put("quickStats", quickStats);
            
            // Recent activities (simplified for now)
            List<Map<String, Object>> recentActivities = List.of(
                Map.of(
                    "id", 1,
                    "type", "success",
                    "title", "Health Profile Updated",
                    "description", "Your health information has been successfully updated.",
                    "timestamp", java.time.LocalDateTime.now().toString()
                ),
                Map.of(
                    "id", 2,
                    "type", "info", 
                    "title", "Vaccination Schedule Available",
                    "description", "Check your vaccination schedule for upcoming requirements.",
                    "timestamp", java.time.LocalDateTime.now().minusDays(1).toString()
                )
            );
            dashboardData.put("recentActivities", recentActivities);
            
            return ResponseEntity.ok(dashboardData);
            
        } catch (Exception e) {
            logger.error("Error retrieving student dashboard data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving dashboard data: " + e.getMessage(), false));
        }
    }
}
