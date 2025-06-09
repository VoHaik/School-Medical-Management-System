package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import com.swp391_8.schoolhealth.service.StudentService;
import com.swp391_8.schoolhealth.service.ParentStudentService;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ParentStudentService parentStudentService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or @securityService.isParentOfStudent(authentication, #id)")
    public ResponseEntity<Student> getStudentById(@PathVariable Integer id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/parent/{parentId}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or authentication.principal.id == #parentId")
    public ResponseEntity<List<Student>> getStudentsByParentId(@PathVariable Integer parentId) {
        List<Student> students = studentService.getStudentsByParentId(parentId);
        return ResponseEntity.ok(students);
    }

    @PostMapping
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or hasRole('PARENT')")
    public ResponseEntity<?> createStudent(@RequestBody Map<String, Object> studentData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Check if the authenticated user has PARENT role
            boolean isParent = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_PARENT"));
            
            Student newStudent;
            
            if (isParent) {
                // Parent creating a child record
                Optional<User> parentUserOptional = userRepository.findById(userDetails.getId());
                if (!parentUserOptional.isPresent()) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Parent user not found", false));
                }
                
                User parentUser = parentUserOptional.get();
                newStudent = parentStudentService.createStudentForParent(studentData, parentUser);
            } else {
                // Medical staff or admin creating student
                newStudent = studentService.createStudent(convertMapToStudent(studentData));
            }
            
            return ResponseEntity.ok(newStudent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating student: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or @securityService.isParentOfStudent(authentication, #id)")
    public ResponseEntity<?> updateStudent(@PathVariable Integer id, @RequestBody Map<String, Object> studentData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Check if the authenticated user has PARENT role
            boolean isParent = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_PARENT"));
            
            Student updatedStudent;
            
            if (isParent) {
                // Parent updating their child's record
                updatedStudent = parentStudentService.updateStudentForParent(id, studentData, userDetails.getId());
            } else {
                // Medical staff or admin updating student
                updatedStudent = studentService.updateStudent(id, convertMapToStudent(studentData));
            }
            
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating student: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Integer id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    // Helper method to convert Map to Student object
    private Student convertMapToStudent(Map<String, Object> studentData) {
        Student student = new Student();
        
        if (studentData.containsKey("fullName")) {
            student.setFullName((String) studentData.get("fullName"));
        }
        
        if (studentData.containsKey("dateOfBirth")) {
            String dateOfBirthStr = (String) studentData.get("dateOfBirth");
            if (dateOfBirthStr != null && !dateOfBirthStr.isEmpty()) {
                try {
                    student.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr));
                } catch (Exception e) {
                    throw new RuntimeException("Invalid date format for dateOfBirth");
                }
            }
        }
        
        if (studentData.containsKey("gender")) {
            student.setGender((String) studentData.get("gender"));
        }
        
        if (studentData.containsKey("className")) {
            student.setClassName((String) studentData.get("className"));
        }
        
        if (studentData.containsKey("studentCode")) {
            student.setStudentCode((String) studentData.get("studentCode"));
        }
        
        return student;
    }
}