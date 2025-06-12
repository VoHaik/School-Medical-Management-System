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
import java.time.LocalDate; // Ensure LocalDate is imported

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

    @GetMapping("/{studentCode}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or @securityService.isParentOfStudentByCode(authentication, #studentCode)")
    public ResponseEntity<Student> getStudentByCode(@PathVariable String studentCode) {
        Student student = studentService.getStudentByCode(studentCode);
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
            
            boolean isParent = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_PARENT"));
            
            Student newStudent;
            
            if (isParent) {
                Optional<User> parentUserOptional = userRepository.findById(userDetails.getId());
                if (!parentUserOptional.isPresent()) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Parent user not found", false));
                }
                User parentUser = parentUserOptional.get();
                newStudent = parentStudentService.createStudentForParent(studentData, parentUser);
            } else {
                newStudent = studentService.createStudent(convertMapToStudent(studentData));
            }
            
            return ResponseEntity.ok(newStudent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating student: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{studentCode}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN') or @securityService.isParentOfStudentByCode(authentication, #studentCode)")
    public ResponseEntity<?> updateStudent(@PathVariable String studentCode, @RequestBody Map<String, Object> studentData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            boolean isParent = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_PARENT"));
            
            Student updatedStudent;
            Student studentToUpdate = studentService.getStudentByCode(studentCode); 

            if (isParent) {
                updatedStudent = parentStudentService.updateStudentForParent(studentToUpdate, studentData, userDetails.getId());
            } else {
                // For admin/staff, studentCode is path variable, studentDetails from request body
                updatedStudent = studentService.updateStudent(studentCode, convertMapToStudent(studentData, studentCode)); 
            }
            
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating student: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{studentCode}")
    @PreAuthorize("hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable String studentCode) {
        try {
            studentService.deleteStudent(studentCode);
            return ResponseEntity.ok(new MessageResponse("Student deleted successfully!", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error deleting student: " + e.getMessage(), false));
        }
    }

    private Student convertMapToStudent(Map<String, Object> studentData) {
        Student student = new Student();
        if (studentData.containsKey("studentCode")) {
            student.setStudentCode((String) studentData.get("studentCode"));
        }
        if (studentData.containsKey("fullName")) {
            student.setFullName((String) studentData.get("fullName"));
        }
        if (studentData.containsKey("dateOfBirth") && studentData.get("dateOfBirth") != null) {
            try {
                 student.setDateOfBirth(LocalDate.parse((String)studentData.get("dateOfBirth")));
            } catch (Exception e) { /* Handle parsing error if necessary */ }
        }
        if (studentData.containsKey("gender")) {
            student.setGender((String) studentData.get("gender"));
        }
        if (studentData.containsKey("className")) {
            student.setClassName((String) studentData.get("className"));
        }
        // Add other fields as necessary
        return student;
    }
    
    private Student convertMapToStudent(Map<String, Object> studentData, String existingStudentCode) {
        Student student = new Student();
        student.setStudentCode(existingStudentCode);
        if (studentData.containsKey("fullName")) {
            student.setFullName((String) studentData.get("fullName"));
        }
        if (studentData.containsKey("dateOfBirth") && studentData.get("dateOfBirth") != null) {
             try {
                 student.setDateOfBirth(LocalDate.parse((String)studentData.get("dateOfBirth")));
            } catch (Exception e) { /* Handle parsing error if necessary */ }
        }
        if (studentData.containsKey("gender")) {
            student.setGender((String) studentData.get("gender"));
        }
        if (studentData.containsKey("className")) {
            student.setClassName((String) studentData.get("className"));
        }
        // Add other fields as necessary
        return student;
    }
}