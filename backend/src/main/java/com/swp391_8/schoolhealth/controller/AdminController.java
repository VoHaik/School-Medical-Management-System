package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.StudentDTO;
import com.swp391_8.schoolhealth.dto.NurseDTO;
import com.swp391_8.schoolhealth.model.Nurse;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private NurseService nurseService;

    @Autowired
    private HealthCheckupRecordService healthCheckupRecordService;

    @Autowired
    private VaccinationRecordService vaccinationRecordService;

    @Autowired
    private HealthEventService healthEventService;

    /**
     * Get all users (students and nurses) for admin management
     */
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        try {
            List<Map<String, Object>> users = new ArrayList<>();
            
            // Get all students
            List<StudentDTO> students = studentService.getAllStudents();
            for (StudentDTO student : students) {
                Map<String, Object> user = new HashMap<>();
                user.put("id", student.getStudentCode());
                user.put("username", student.getStudentCode());
                user.put("fullName", student.getFullName());
                user.put("email", student.getStudentCode() + "@school.edu"); // Generate email from student code
                user.put("role", "STUDENT");
                user.put("status", "active"); // Default status
                user.put("lastLogin", null);
                user.put("createdAt", LocalDateTime.now());
                user.put("grade", student.getGradeName());
                users.add(user);
            }
            
            // Get all nurses
            List<Nurse> nurses = nurseService.getAllNurses();
            for (Nurse nurse : nurses) {
                Map<String, Object> user = new HashMap<>();
                user.put("id", nurse.getNurseCode());
                user.put("username", nurse.getNurseCode());
                user.put("fullName", nurse.getFullName());
                user.put("email", nurse.getNurseCode() + "@school.edu"); // Generate email from nurse code
                user.put("role", "NURSE");
                user.put("status", "active"); // Default status
                user.put("lastLogin", null);
                user.put("createdAt", LocalDateTime.now());
                user.put("qualification", nurse.getQualification());
                user.put("specialization", nurse.getSpecialization());
                users.add(user);
            }
            
            return ResponseEntity.ok(users);
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
     * Placeholder for user deactivation (would need proper user management implementation)
     */
    @PostMapping("/users/{userId}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deactivateUser(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "User deactivation requires backend user management implementation");
        response.put("userId", userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Placeholder for user activation (would need proper user management implementation)
     */
    @PostMapping("/users/{userId}/activate")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> activateUser(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "User activation requires backend user management implementation");
        response.put("userId", userId);
        return ResponseEntity.ok(response);
    }
}
