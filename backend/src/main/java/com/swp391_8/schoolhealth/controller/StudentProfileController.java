package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

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
                    
                    // Also get the corresponding User data for email and phone
                    Optional<User> userOpt = userRepository.findByUserCode(userCode);
                    
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
                    
                    // Add email and phone from User entity if available
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        response.put("email", user.getEmail());
                        response.put("phone", user.getPhoneNumber());
                        logger.info("=== GET PROFILE DEBUG - User found: email={}, phone={} ===", user.getEmail(), user.getPhoneNumber());
                    } else {
                        response.put("email", null);
                        response.put("phone", null);
                        logger.warn("=== GET PROFILE DEBUG - User NOT found for userCode: {} ===", userCode);
                    }
                    
                    logger.info("=== GET PROFILE DEBUG - Response data: {} ===", response);
                    
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.status(404)
                        .body(new MessageResponse("Student profile not found", false));
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
            
            // Debug logging
            logger.info("=== UPDATE STUDENT PROFILE DEBUG ===");
            logger.info("UserCode: {}", userCode);
            logger.info("Received profileData: {}", profileData);
            
            // For student role, userCode is the student code
            if (userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("Student"))) {
                
                Optional<Student> studentOpt = studentRepository.findByStudentCode(userCode);
                if (studentOpt.isPresent()) {
                    Student student = studentOpt.get();
                    
                    logger.info("Found student: {}", student.getStudentCode());
                    
                    // Update Student entity fields
                    if (profileData.containsKey("fullName")) {
                        student.setFullName((String) profileData.get("fullName"));
                        logger.info("Updated fullName: {}", profileData.get("fullName"));
                    }
                    if (profileData.containsKey("gender")) {
                        student.setGender((String) profileData.get("gender"));
                        logger.info("Updated gender: {}", profileData.get("gender"));
                    }
                    if (profileData.containsKey("className")) {
                        student.setClassName((String) profileData.get("className"));
                        logger.info("Updated className: {}", profileData.get("className"));
                    }
                    if (profileData.containsKey("dateOfBirth")) {
                        // Handle dateOfBirth conversion if needed
                        Object dobValue = profileData.get("dateOfBirth");
                        if (dobValue != null && !dobValue.toString().isEmpty()) {
                            try {
                                if (dobValue instanceof String) {
                                    student.setDateOfBirth(java.time.LocalDate.parse((String) dobValue));
                                    logger.info("Updated dateOfBirth: {}", dobValue);
                                }
                            } catch (Exception e) {
                                logger.warn("Failed to parse dateOfBirth: {}", dobValue);
                            }
                        }
                    }
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
                    logger.info("Student entity saved successfully");
                    
                    // Update User entity fields (email, phone, and fullName)
                    Optional<User> userOpt = userRepository.findByUserCode(userCode);
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        boolean userUpdated = false;
                        
                        logger.info("Found user: {} - Current email: {}, phone: {}", user.getUsername(), user.getEmail(), user.getPhoneNumber());
                        
                        if (profileData.containsKey("fullName")) {
                            user.setFullName((String) profileData.get("fullName"));
                            userUpdated = true;
                            logger.info("Updated user fullName: {}", profileData.get("fullName"));
                        }
                        if (profileData.containsKey("email")) {
                            user.setEmail((String) profileData.get("email"));
                            userUpdated = true;
                            logger.info("Updated user email: {}", profileData.get("email"));
                        }
                        if (profileData.containsKey("phone")) {
                            user.setPhoneNumber((String) profileData.get("phone"));
                            userUpdated = true;
                            logger.info("Updated user phone: {}", profileData.get("phone"));
                        }
                        
                        if (userUpdated) {
                            userRepository.save(user);
                            logger.info("User entity saved successfully - New email: {}, phone: {}", user.getEmail(), user.getPhoneNumber());
                        } else {
                            logger.info("No user updates needed");
                        }
                    } else {
                        logger.warn("User not found for userCode: {}", userCode);
                    }
                    
                    return ResponseEntity.ok(new MessageResponse("Student profile updated successfully", true));
                } else {
                    return ResponseEntity.status(404)
                        .body(new MessageResponse("Student profile not found", false));
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
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> createStudentProfile(@RequestBody Map<String, Object> profileData) {
        // Only admin can create student profiles
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Student profile creation is restricted to admin roles", false));
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

