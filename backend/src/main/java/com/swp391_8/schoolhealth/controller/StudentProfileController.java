package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-profile")
public class StudentProfileController {

    private static final Logger logger = LoggerFactory.getLogger(StudentProfileController.class);

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('Student') or hasAuthority('Parent')")
    public ResponseEntity<?> getStudentProfile(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String userCode = userDetails.getUserCode();
            String username = userDetails.getUsername();
            
            logger.info("DEBUG: Username = {}, UserCode = {}", username, userCode);
            
            // For student role, userCode is the student code
            if (userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("Student"))) {
                
                Optional<Student> studentOpt = studentRepository.findByStudentCode(userCode);
                if (studentOpt.isPresent()) {
                    Student student = studentOpt.get();
                    
                    // Create response with student profile data
                    Map<String, Object> response = new HashMap<>();
                    response.put("studentCode", student.getStudentCode());
                    response.put("fullName", student.getFullName());
                    response.put("firstName", student.getFirstName());
                    response.put("lastName", student.getLastName());
                    response.put("dateOfBirth", student.getDateOfBirth());
                    response.put("gender", student.getGender());
                    response.put("className", student.getClassName());
                    response.put("schoolYear", student.getSchoolYear());
                    response.put("allergies", student.getAllergies());
                    response.put("medicalConditions", student.getMedicalConditions());
                    response.put("emergencyContactName", student.getEmergencyContactName());
                    response.put("emergencyContactPhone", student.getEmergencyContactPhone());
                    response.put("createdAt", student.getCreatedAt());
                    response.put("updatedAt", student.getUpdatedAt());
                    
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.notFound().build();
                }
            } else {
                // For parent role, return error for now as this needs student code parameter
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Parent access requires student code parameter", false));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Error retrieving student profile: " + e.getMessage(), false));
        }
    }

    @PutMapping
    @PreAuthorize("hasAuthority('Student') or hasAuthority('Parent')")
    public ResponseEntity<?> updateStudentProfile(@RequestBody Map<String, Object> profileData, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String userCode = userDetails.getUserCode();
            
            // For student role, userCode is the student code
            if (userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("Student"))) {
                
                Optional<Student> studentOpt = studentRepository.findByStudentCode(userCode);
                if (studentOpt.isPresent()) {
                    Student student = studentOpt.get();
                    
                    // Update allowed fields
                    if (profileData.containsKey("emergencyContactName")) {
                        student.setEmergencyContactName((String) profileData.get("emergencyContactName"));
                    }
                    if (profileData.containsKey("emergencyContactPhone")) {
                        student.setEmergencyContactPhone((String) profileData.get("emergencyContactPhone"));
                    }
                    if (profileData.containsKey("allergies")) {
                        student.setAllergies((String) profileData.get("allergies"));
                    }
                    if (profileData.containsKey("medicalConditions")) {
                        student.setMedicalConditions((String) profileData.get("medicalConditions"));
                    }
                    
                    studentRepository.save(student);
                    
                    return ResponseEntity.ok(new MessageResponse("Student profile updated successfully", true));
                } else {
                    return ResponseEntity.notFound().build();
                }
            } else {
                // For parent role, return error for now
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Parent cannot update student profile directly", false));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Error updating student profile: " + e.getMessage(), false));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Admin') or hasAuthority('Manager')")
    public ResponseEntity<?> createStudentProfile(@RequestBody Map<String, Object> profileData) {
        // Only admin/manager can create student profiles
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Student profile creation is restricted to admin/manager roles", false));
    }

    @GetMapping("/by-parent")
    @PreAuthorize("hasAuthority('Parent')")
    public ResponseEntity<?> getStudentsForParent(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String parentUsername = userDetails.getUsername();
        // Lấy danh sách học sinh liên kết với phụ huynh này
        var students = studentRepository.findStudentsByParentUsername(parentUsername);
        // Trả về danh sách studentCode và fullName
        return ResponseEntity.ok(students.stream().map(s -> Map.of(
            "studentCode", s.getStudentCode(),
            "fullName", s.getFullName()
        )).toList());
    }
}

