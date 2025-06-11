package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-profile")
public class StudentProfileController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<?> getStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found", false));
        }

        User user = userOptional.get();
        Optional<Student> studentOptional = studentRepository.findByUserId(user.getUserId());

        if (!studentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile not found", false));
        }

        Student student = studentOptional.get();
        User studentUser = student.getUser(); // Get the associated User object

        Map<String, Object> response = new HashMap<>();
        response.put("studentId", student.getStudentId()); // Use studentId from Student entity
        response.put("fullName", studentUser.getFullName()); // Corrected: Use getFullName()
        response.put("dateOfBirth", student.getDateOfBirth()); // Get DoB from Student entity
        response.put("gender", studentUser.getGender()); // Get gender from User entity
        response.put("className", student.getSchoolClass()); // Use schoolClass from Student entity
        response.put("email", studentUser.getEmail());
        response.put("phone", studentUser.getPhone());
        response.put("studentCode", student.getStudentCode());

        return ResponseEntity.ok(response);
    }

    @PutMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<?> updateStudentProfile(@RequestBody Map<String, Object> profileData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found", false));
        }

        User user = userOptional.get();
        Optional<Student> studentOptional = studentRepository.findByUserId(user.getUserId());

        if (!studentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile not found", false));
        }

        Student student = studentOptional.get();
        User studentUser = student.getUser(); // Get the associated User object for updates

        // Update user information
        if (profileData.containsKey("email")) {
            studentUser.setEmail((String) profileData.get("email"));
        }
        if (profileData.containsKey("phone")) {
            studentUser.setPhone((String) profileData.get("phone"));
        }
        if (profileData.containsKey("fullName")) { // Added for fullName
            studentUser.setFullName((String) profileData.get("fullName"));
        }
        if (profileData.containsKey("gender")) {
            studentUser.setGender((String) profileData.get("gender"));
        }
        
        // Update student information
        if (profileData.containsKey("dateOfBirth")) {
            String dateOfBirthStr = (String) profileData.get("dateOfBirth");
            if (dateOfBirthStr != null && !dateOfBirthStr.isEmpty()) {
                try {
                    student.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr)); // Set DoB on Student entity
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Invalid date format for dateOfBirth. Use YYYY-MM-DD.", false));
                }
            }
        }
        if (profileData.containsKey("className")) {
            student.setSchoolClass((String) profileData.get("className")); // Corrected field name
        }

        userRepository.save(studentUser); // Save changes to User entity
        studentRepository.save(student); // Save changes to Student entity

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully", true));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<?> createStudentProfile(@RequestBody Map<String, Object> profileData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found", false));
        }

        User user = userOptional.get();

        // Check if student profile already exists
        Optional<Student> existingStudent = studentRepository.findByUserId(user.getUserId());
        if (existingStudent.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile already exists", false));
        }

        // Update user information from profileData if provided
        if (profileData.containsKey("email")) {
            user.setEmail((String) profileData.get("email"));
        }
        if (profileData.containsKey("phone")) {
            user.setPhone((String) profileData.get("phone"));
        }
        if (profileData.containsKey("fullName")) { // Added for fullName
            user.setFullName((String) profileData.get("fullName"));
        }
        if (profileData.containsKey("gender")) {
            user.setGender((String) profileData.get("gender"));
        }
        
        // Create new student profile
        Student student = new Student();
        student.setUser(user);

        if (profileData.containsKey("dateOfBirth")) {
            String dateOfBirthStr = (String) profileData.get("dateOfBirth");
            if (dateOfBirthStr != null && !dateOfBirthStr.isEmpty()) {
                try {
                    student.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr)); // Set DoB on Student entity
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Invalid date format for dateOfBirth. Use YYYY-MM-DD.", false));
                }
            }
        }

        if (profileData.containsKey("className")) {
            student.setSchoolClass((String) profileData.get("className")); // Corrected field name
        }

        // Generate a unique student code if not provided
        if (profileData.containsKey("studentCode") && profileData.get("studentCode") != null) {
             student.setStudentCode((String) profileData.get("studentCode"));
        } else {
            String studentCode = "STU" + System.currentTimeMillis(); // Consider a more robust generation strategy
            student.setStudentCode(studentCode);
        }

        userRepository.save(user); // Save updated user info
        studentRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Profile created successfully", true));
    }
}
