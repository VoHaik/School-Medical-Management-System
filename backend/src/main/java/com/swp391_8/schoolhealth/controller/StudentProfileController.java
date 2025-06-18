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
        Optional<Student> studentOptional = studentRepository.findByUser(user);

        if (!studentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile not found", false));
        }

        Student student = studentOptional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("studentCode", student.getStudentCode()); // Changed from getId to getStudentCode
        response.put("fullName", student.getFullName());
        response.put("dateOfBirth", student.getDateOfBirth());
        response.put("gender", student.getGender());
        response.put("className", student.getClassName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhoneNumber()); // Changed from getPhone() to getPhoneNumber()

        return ResponseEntity.ok(response);
    }    @PutMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<?> updateStudentProfile(@RequestBody Map<String, Object> profileData) {
        // Debug: Log all received data
        System.out.println("=== PUT REQUEST DEBUG ===");
        System.out.println("Received profileData keys: " + profileData.keySet());
        for (Map.Entry<String, Object> entry : profileData.entrySet()) {
            System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue() + ", Type: " + (entry.getValue() != null ? entry.getValue().getClass().getSimpleName() : "null"));
        }
        System.out.println("========================");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found", false));
        }

        User user = userOptional.get();
        Optional<Student> studentOptional = studentRepository.findByUser(user);

        if (!studentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile not found", false));
        }

        Student student = studentOptional.get();

        // Update user information
        if (profileData.containsKey("email")) {
            user.setEmail((String) profileData.get("email"));
        }

        if (profileData.containsKey("phone")) {
            user.setPhoneNumber((String) profileData.get("phone")); // Changed from setPhone() to setPhoneNumber()
        }        // Update student information
        if (profileData.containsKey("fullName")) {
            student.setFullName((String) profileData.get("fullName"));
        }

        if (profileData.containsKey("gender")) {
            student.setGender((String) profileData.get("gender"));
        }

        if (profileData.containsKey("className")) {
            student.setClassName((String) profileData.get("className"));
        }        // Add missing dateOfBirth handling for PUT method
        if (profileData.containsKey("dateOfBirth")) {
            System.out.println("=== DATEOFBIRTH PROCESSING ===");
            Object dateOfBirthObj = profileData.get("dateOfBirth");
            System.out.println("dateOfBirth found! Value: " + dateOfBirthObj + ", Type: " + (dateOfBirthObj != null ? dateOfBirthObj.getClass().getSimpleName() : "null"));
            
            if (dateOfBirthObj == null || dateOfBirthObj.toString().isEmpty() || dateOfBirthObj.toString().equals("null")) {
                System.out.println("Setting dateOfBirth to null");
                student.setDateOfBirth(null); // Cho phép xóa ngày sinh
            } else {
                try {
                    System.out.println("Attempting to parse dateOfBirth: " + dateOfBirthObj.toString());
                    student.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthObj.toString()));
                    System.out.println("Successfully set dateOfBirth to: " + student.getDateOfBirth());
                } catch (Exception e) {
                    System.err.println("Error parsing dateOfBirth: " + e.getMessage());
                    return ResponseEntity.badRequest().body(new MessageResponse("Invalid date format for dateOfBirth", false));
                }
            }
            System.out.println("==============================");
        } else {
            System.out.println("dateOfBirth key NOT FOUND in request data");
        }

        userRepository.save(user);
        studentRepository.save(student);

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
        Optional<Student> existingStudent = studentRepository.findByUser(user);
        if (existingStudent.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile already exists", false));
        }

        // Update user information
        if (profileData.containsKey("email")) {
            user.setEmail((String) profileData.get("email"));
        }

        if (profileData.containsKey("phone")) {
            user.setPhoneNumber((String) profileData.get("phone")); // Changed from setPhone() to setPhoneNumber()
        }

        // Create new student profile
        Student student = new Student();
        student.setUser(user);
        
        if (profileData.containsKey("fullName")) {
            student.setFullName((String) profileData.get("fullName"));
        } else {
            student.setFullName(user.getFullName()); // Use user's full name as default
        }

        if (profileData.containsKey("gender")) {
            student.setGender((String) profileData.get("gender"));
        }

        if (profileData.containsKey("className")) {
            student.setClassName((String) profileData.get("className"));
        }        if (profileData.containsKey("dateOfBirth")) {
            Object dateOfBirthObj = profileData.get("dateOfBirth");
            System.out.println("Received dateOfBirth for POST: " + dateOfBirthObj + " (type: " + (dateOfBirthObj != null ? dateOfBirthObj.getClass().getSimpleName() : "null") + ")");
            
            if (dateOfBirthObj != null) {
                String dateOfBirthStr = dateOfBirthObj.toString();
                if (!dateOfBirthStr.isEmpty() && !dateOfBirthStr.equals("null")) {
                    try {
                        student.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr));
                        System.out.println("Successfully set dateOfBirth for POST: " + dateOfBirthStr);
                    } catch (Exception e) {
                        System.err.println("Error parsing dateOfBirth for POST: " + e.getMessage());
                        return ResponseEntity.badRequest().body(new MessageResponse("Invalid date format for dateOfBirth: " + dateOfBirthStr, false));
                    }
                }
            }
        }

        // Generate a unique student code
        String studentCode = "STU" + System.currentTimeMillis();
        student.setStudentCode(studentCode);

        userRepository.save(user);
        studentRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Profile created successfully", true));
    }

}
