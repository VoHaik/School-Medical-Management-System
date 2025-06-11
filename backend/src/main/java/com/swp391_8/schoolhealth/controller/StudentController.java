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
import java.time.LocalDate; // Added for date parsing

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

    // Helper method to convert Map to Student object, potentially updating an existing User
    private Student convertMapToStudent(Map<String, Object> studentData, User userToUpdateOrCreate, Student studentToUpdate) {
        User user = (userToUpdateOrCreate != null) ? userToUpdateOrCreate : new User();

        // Populate User fields from studentData
        if (studentData.containsKey("username")) {
            user.setUsername((String) studentData.get("username"));
        }
        if (studentData.containsKey("password")) {
            // Password should be handled (e.g., hashed) by the service layer if it's a new user or password change
            user.setPassword((String) studentData.get("password"));
        }
        if (studentData.containsKey("email")) {
            user.setEmail((String) studentData.get("email"));
        }
        if (studentData.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) studentData.get("phoneNumber"));
        }
        if (studentData.containsKey("fullName")) {
            user.setFullName((String) studentData.get("fullName"));
        }
        // Add gender extraction for user from studentData map
        if (studentData.containsKey("gender")) {
            user.setGender((String) studentData.get("gender"));
        }

        Student student = (studentToUpdate != null) ? studentToUpdate : new Student();
        student.setUser(user); // Associate the user with the student

        // Populate Student specific fields
        if (studentData.containsKey("studentCode")) {
            student.setStudentCode((String) studentData.get("studentCode"));
        }
        if (studentData.containsKey("schoolClass")) {
            student.setSchoolClass((String) studentData.get("schoolClass"));
        }
        if (studentData.containsKey("dob")) {
            // Assuming dob is sent as a string in "yyyy-MM-dd" format
            // You might need a more robust date parsing mechanism
            try {
                student.setDateOfBirth(LocalDate.parse((String) studentData.get("dob"))); // Set DoB on Student entity
            } catch (Exception e) {
                // Handle parsing exception, e.g., log it or throw a custom exception
                System.err.println("Error parsing DOB: " + studentData.get("dob") + " - " + e.getMessage());
            }
        }
        // ... any other student-specific fields

        return student;
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
                // Assuming parentStudentService.createStudentForParent handles User and Student creation appropriately
                newStudent = parentStudentService.createStudentForParent(studentData, parentUser);
            } else {
                // Admin or School Nurse creating student
                Student studentToCreate = convertMapToStudent(studentData, new User(), new Student()); // Pass new User and new Student for creation
                String gender = (String) studentData.get("gender"); // Extract gender
                newStudent = studentService.createStudent(studentToCreate, gender); // Pass gender
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
            
            boolean isParent = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_PARENT"));
            
            Student updatedStudent;
            
            if (isParent) {
                // Parent updating their child's record
                // Assuming parentStudentService.updateStudentForParent handles User and Student updates
                updatedStudent = parentStudentService.updateStudentForParent(id, studentData, userDetails.getId());
            } else {
                // Admin or School Nurse updating student
                // Fetch existing student to get the associated User, if any, to update
                Student existingStudent = studentService.getStudentById(id);
                if (existingStudent == null) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Student not found for update", false));
                }
                User userToUpdate = existingStudent.getUser(); // Get the user associated with this student
                if (userToUpdate == null) { // If student somehow has no user, create one to associate
                    userToUpdate = new User();
                }

                Student studentWithUpdates = convertMapToStudent(studentData, userToUpdate, existingStudent);
                String gender = (String) studentData.get("gender"); // Extract gender
                updatedStudent = studentService.updateStudent(id, studentWithUpdates, gender); // Pass gender
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
}