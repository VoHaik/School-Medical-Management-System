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
    @PreAuthorize("hasAuthority('Student') or hasAuthority('Parent')")
    public ResponseEntity<?> getStudentProfile() {
        // TODO: This method needs to be redesigned after removing user relationship from Student
        return ResponseEntity.badRequest().body(new MessageResponse("Student profile access method needs to be updated", false));
    }

    @PutMapping
    @PreAuthorize("hasAuthority('Student') or hasAuthority('Parent')")
    public ResponseEntity<?> updateStudentProfile(@RequestBody Map<String, Object> profileData) {
        // TODO: This method needs to be redesigned after removing user relationship from Student
        return ResponseEntity.badRequest().body(new MessageResponse("Student profile update method needs to be updated", false));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Student') or hasAuthority('Parent')")
    public ResponseEntity<?> createStudentProfile(@RequestBody Map<String, Object> profileData) {
        // TODO: This method needs to be redesigned after removing user relationship from Student
        return ResponseEntity.badRequest().body(new MessageResponse("Student profile creation method needs to be updated", false));
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

