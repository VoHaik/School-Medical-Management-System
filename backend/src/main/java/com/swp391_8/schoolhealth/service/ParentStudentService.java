package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class ParentStudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Student createStudentForParent(Map<String, Object> studentData, User parentUser) {
        // Create new student record
        Student student = new Student();
        
        // Set basic information
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
            // student.setGender((String) studentData.get("gender")); // Removed as gender is now in User
            User studentUser = student.getUser();
            if (studentUser != null) {
                studentUser.setGender((String) studentData.get("gender"));
            } else {
                // Handle case where student.getUser() is null, perhaps log a warning or error
                // For now, we'll assume a User object should exist or be created if gender is provided
                // This might require fetching/creating the User entity if it's not already associated
            }
        }
        
        if (studentData.containsKey("className")) {
            student.setClassName((String) studentData.get("className"));
        }

        // Generate a unique student code
        if (!studentData.containsKey("studentCode") || 
            ((String) studentData.get("studentCode")).isEmpty()) {
            String studentCode = "STU" + System.currentTimeMillis();
            student.setStudentCode(studentCode);
        } else {
            student.setStudentCode((String) studentData.get("studentCode"));
        }

        // Save the student
        Student savedStudent = studentRepository.save(student);

        // Create parent-student relationship
        String relationshipType = "Parent"; // Default relationship type
        if (studentData.containsKey("relationshipType")) {
            relationshipType = (String) studentData.get("relationshipType");
        }

        ParentStudentRelationship relationship = new ParentStudentRelationship(
            parentUser, savedStudent, relationshipType
        );
        parentStudentRelationshipRepository.save(relationship);

        return savedStudent;
    }

    @Transactional
    public Student updateStudentForParent(Integer studentId, Map<String, Object> studentData, Integer parentUserId) {
        // Verify that the parent has permission to update this student
        if (!parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentId(parentUserId, studentId)) {
            throw new RuntimeException("Parent does not have permission to update this student");
        }

        // Get the existing student
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        if (!studentOptional.isPresent()) {
            throw new RuntimeException("Student not found with id: " + studentId);
        }

        Student student = studentOptional.get();

        // Update the student information
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
            // student.setGender((String) studentData.get("gender")); // Removed as gender is now in User
            User studentUser = student.getUser();
            if (studentUser != null) {
                studentUser.setGender((String) studentData.get("gender"));
                // userRepository.save(studentUser); // Consider if user needs to be explicitly saved
            } else {
                 // Handle case where student.getUser() is null
            }
        }
        
        if (studentData.containsKey("className")) {
            student.setClassName((String) studentData.get("className"));
        }

        return studentRepository.save(student);
    }

    public boolean isParentOfStudent(Integer parentUserId, Integer studentId) {
        return parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentId(parentUserId, studentId);
    }

    public ParentStudentRelationship createParentStudentRelationship(Integer parentUserId, Integer studentId, String relationshipType) {
        Optional<User> parentOptional = userRepository.findById(parentUserId);
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (!parentOptional.isPresent()) {
            throw new RuntimeException("Parent user not found with id: " + parentUserId);
        }

        if (!studentOptional.isPresent()) {
            throw new RuntimeException("Student not found with id: " + studentId);
        }

        // Check if relationship already exists
        if (parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentId(parentUserId, studentId)) {
            throw new RuntimeException("Parent-student relationship already exists");
        }

        ParentStudentRelationship relationship = new ParentStudentRelationship(
            parentOptional.get(), 
            studentOptional.get(), 
            relationshipType
        );

        return parentStudentRelationshipRepository.save(relationship);
    }
}
