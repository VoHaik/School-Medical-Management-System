package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Parent;
import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository;
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
    
    @Autowired
    private ParentRepository parentRepository;

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
            student.setGender((String) studentData.get("gender"));
        }
        
        if (studentData.containsKey("className")) {
            student.setClassName((String) studentData.get("className"));
        }

        // Generate a unique student code
        if (!studentData.containsKey("studentCode") || 
            ((String) studentData.get("studentCode")).isEmpty()) {
            // Consider a more robust unique code generation strategy if needed
            String studentCode = "STU" + System.currentTimeMillis() + "_" + parentUser.getId(); 
            student.setStudentCode(studentCode);
        } else {
            String providedStudentCode = (String) studentData.get("studentCode");
            // Optional: Check if studentCode already exists to prevent duplicates if it's user-provided
            if (studentRepository.findByStudentCode(providedStudentCode).isPresent()) {
                throw new RuntimeException("Student with code " + providedStudentCode + " already exists.");
            }
            student.setStudentCode(providedStudentCode);
        }

        // Save the student
        Student savedStudent = studentRepository.save(student);

        // Find or create Parent record for the User
        Optional<Parent> parentOptional = parentRepository.findByUserUserId(parentUser.getUserId());
        Parent parent;
        
        if (parentOptional.isPresent()) {
            parent = parentOptional.get();
        } else {
            // Create new Parent record if it doesn't exist
            parent = new Parent();
            parent.setUser(parentUser);
            parent.setParentCode("PARENT_" + parentUser.getUserCode()); // Use userCode if available
            parent = parentRepository.save(parent);
        }

        // Create parent-student relationship
        String relationshipType = "Parent"; // Default relationship type
        if (studentData.containsKey("relationshipType")) {
            relationshipType = (String) studentData.get("relationshipType");
        }

        ParentStudentRelationship relationship = new ParentStudentRelationship(
            parent, savedStudent, relationshipType
        );
        parentStudentRelationshipRepository.save(relationship);

        return savedStudent;
    }

    @Transactional
    public Student updateStudentForParent(Student studentToUpdate, Map<String, Object> studentData, Integer parentUserId) {
        // Find the parent by user ID
        Optional<Parent> parentOptional = parentRepository.findByUserUserId(parentUserId);
        if (!parentOptional.isPresent()) {
            throw new RuntimeException("Parent record not found for user ID: " + parentUserId);
        }
        Parent parent = parentOptional.get();
        
        // Verify that the parent has permission to update this student
        if (!parentStudentRelationshipRepository.existsByParentParentCodeAndStudentStudentCode(parent.getParentCode(), studentToUpdate.getStudentCode())) {
            throw new RuntimeException("Parent does not have permission to update this student or student code is invalid.");
        }

        // Update the student information
        if (studentData.containsKey("fullName")) {
            studentToUpdate.setFullName((String) studentData.get("fullName"));
        }
        
        if (studentData.containsKey("dateOfBirth")) {
            String dateOfBirthStr = (String) studentData.get("dateOfBirth");
            if (dateOfBirthStr != null && !dateOfBirthStr.isEmpty()) {
                try {
                    studentToUpdate.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr));
                } catch (Exception e) {
                    throw new RuntimeException("Invalid date format for dateOfBirth");
                }
            }
        }
        
        if (studentData.containsKey("gender")) {
            studentToUpdate.setGender((String) studentData.get("gender"));
        }
        
        if (studentData.containsKey("className")) {
            studentToUpdate.setClassName((String) studentData.get("className"));
        }

        return studentRepository.save(studentToUpdate);
    }

    public boolean isParentOfStudent(Integer parentUserId, String studentCode) {
        Optional<Parent> parentOptional = parentRepository.findByUserUserId(parentUserId);
        if (!parentOptional.isPresent()) {
            return false;
        }
        
        return parentStudentRelationshipRepository.existsByParentParentCodeAndStudentStudentCode(
            parentOptional.get().getParentCode(), studentCode);
    }

    public ParentStudentRelationship createParentStudentRelationship(Integer parentUserId, String studentCode, String relationshipType) {
        Optional<User> userOptional = userRepository.findById(parentUserId);
        Optional<Student> studentOptional = studentRepository.findByStudentCode(studentCode);

        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with id: " + parentUserId);
        }

        if (!studentOptional.isPresent()) {
            throw new RuntimeException("Student not found with code: " + studentCode);
        }
        
        // Find or create Parent record
        Optional<Parent> parentOptional = parentRepository.findByUserUserId(parentUserId);
        Parent parent;
        
        if (parentOptional.isPresent()) {
            parent = parentOptional.get();
        } else {
            // Create new Parent record
            User user = userOptional.get();
            parent = new Parent();
            parent.setUser(user);
            parent.setParentCode("PARENT_" + user.getUserCode()); // Use userCode if available
            parent = parentRepository.save(parent);
        }

        // Check if relationship already exists
        if (parentStudentRelationshipRepository.existsByParentParentCodeAndStudentStudentCode(
                parent.getParentCode(), studentCode)) {
            throw new RuntimeException("Parent-student relationship already exists");
        }

        ParentStudentRelationship relationship = new ParentStudentRelationship(
            parent, 
            studentOptional.get(), 
            relationshipType
        );

        return parentStudentRelationshipRepository.save(relationship);
    }
}
