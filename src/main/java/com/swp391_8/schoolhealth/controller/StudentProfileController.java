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
        Optional<Student> studentOptional = studentRepository.findByUserId(user.getId());

        if (!studentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile not found", false));
        }

        Student student = studentOptional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("id", student.getId());
        response.put("fullName", student.getFullName());
        response.put("dateOfBirth", student.getDateOfBirth());
        response.put("gender", student.getGender());
        response.put("className", student.getClassName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());

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
        Optional<Student> studentOptional = studentRepository.findByUserId(user.getId());

        if (!studentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Student profile not found", false));
        }

        Student student = studentOptional.get();

        // Update user information
        if (profileData.containsKey("email")) {
            user.setEmail((String) profileData.get("email"));
        }

        if (profileData.containsKey("phone")) {
            user.setPhone((String) profileData.get("phone"));
        }

        // Update student information
        if (profileData.containsKey("fullName")) {
            student.setFullName((String) profileData.get("fullName"));
        }

        if (profileData.containsKey("gender")) {
            student.setGender((String) profileData.get("gender"));
        }

        if (profileData.containsKey("className")) {
            student.setClassName((String) profileData.get("className"));
        }

        userRepository.save(user);
        studentRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully", true));
    }
}
