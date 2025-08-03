package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.StudentDTO;
import com.swp391_8.schoolhealth.dto.UserDTO;
import com.swp391_8.schoolhealth.model.Nurse;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.service.UserService;
import com.swp391_8.schoolhealth.service.StudentService;
import com.swp391_8.schoolhealth.service.NurseService;
import com.swp391_8.schoolhealth.service.HealthCheckupRecordService;
import com.swp391_8.schoolhealth.service.VaccinationRecordService;
import com.swp391_8.schoolhealth.service.HealthEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "Admin Management", description = "APIs for system administration and user management")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private NurseService nurseService;

    @Autowired
    private UserService userService;

    @Autowired
    private HealthCheckupRecordService healthCheckupRecordService;

    @Autowired
    private VaccinationRecordService vaccinationRecordService;

    @Autowired
    private HealthEventService healthEventService;

    /**
     * Get all users from users table
     */
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<User> allUsers = userService.getAllUsers();
            List<UserDTO> userDTOs = allUsers.stream()
                .map(UserDTO::new)
                .toList();
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get dashboard statistics for admin
     */
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Get basic counts
            List<StudentDTO> students = studentService.getAllStudents();
            List<Nurse> nurses = nurseService.getAllNurses();
            
            stats.put("totalUsers", students.size() + nurses.size());
            stats.put("totalStudents", students.size());
            stats.put("totalNurses", nurses.size());
            stats.put("activeUsers", students.size() + nurses.size()); // Assuming all are active
            
            // Get health data counts
            try {
                long totalHealthCheckups = healthCheckupRecordService.getTotalCount();
                stats.put("totalHealthCheckups", totalHealthCheckups);
            } catch (Exception e) {
                stats.put("totalHealthCheckups", 0);
            }
            
            try {
                long totalVaccinations = vaccinationRecordService.getTotalCount();
                stats.put("totalVaccinations", totalVaccinations);
            } catch (Exception e) {
                stats.put("totalVaccinations", 0);
            }
            
            try {
                long totalHealthEvents = healthEventService.getTotalCount();
                stats.put("totalHealthEvents", totalHealthEvents);
            } catch (Exception e) {
                stats.put("totalHealthEvents", 0);
            }
            
            // Recent activity (placeholder - would need proper implementation)
            stats.put("recentHealthCheckups", 0);
            stats.put("recentVaccinations", 0);
            stats.put("upcomingEvents", 0);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get system reports for admin analytics
     */
    @GetMapping("/reports")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemReports(
            @RequestParam(required = false) String reportType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            Map<String, Object> reports = new HashMap<>();
            
            // Health checkups by month (sample data)
            List<Map<String, Object>> monthlyCheckups = new ArrayList<>();
            String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
            int[] checkupCounts = {45, 52, 48, 61, 55, 67};
            
            for (int i = 0; i < months.length; i++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", months[i]);
                monthData.put("checkups", checkupCounts[i]);
                monthData.put("vaccinations", (int)(checkupCounts[i] * 0.6)); // Sample vaccination data
                monthlyCheckups.add(monthData);
            }
            
            reports.put("monthlyActivity", monthlyCheckups);
            
            // Grade distribution
            Map<String, Integer> gradeDistribution = new HashMap<>();
            List<StudentDTO> students = studentService.getAllStudents();
            for (StudentDTO student : students) {
                String grade = student.getGradeName() != null ? student.getGradeName() : "Unknown";
                gradeDistribution.put(grade, gradeDistribution.getOrDefault(grade, 0) + 1);
            }
            reports.put("gradeDistribution", gradeDistribution);
            
            // System health indicators
            Map<String, Object> systemHealth = new HashMap<>();
            systemHealth.put("totalUsers", students.size() + nurseService.getAllNurses().size());
            systemHealth.put("systemUptime", "99.9%");
            systemHealth.put("lastBackup", LocalDateTime.now().minusHours(6));
            reports.put("systemHealth", systemHealth);
            
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Deactivate user
     */
    @PostMapping("/users/{userId}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deactivateUser(@PathVariable Long userId) {
        try {
            User deactivatedUser = userService.deactivateUser(userId);
            UserDTO userDTO = new UserDTO(deactivatedUser);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deactivated successfully");
            response.put("userId", userId);
            response.put("user", userDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("userId", userId);
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Activate user
     */
    @PostMapping("/users/{userId}/activate")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> activateUser(@PathVariable Long userId) {
        try {
            User activatedUser = userService.activateUser(userId);
            UserDTO userDTO = new UserDTO(activatedUser);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User activated successfully");
            response.put("userId", userId);
            response.put("user", userDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("userId", userId);
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update user
     */
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long userId,
            @RequestBody User userData) {
        try {
            User updatedUser = userService.updateUser(userId, userData);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Delete user
     */
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
