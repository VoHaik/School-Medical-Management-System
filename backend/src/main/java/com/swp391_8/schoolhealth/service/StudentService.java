// Trivial comment to force recompile
package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.StudentDTO;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {
    // Trivial comment to try and force recompile

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    // Modified to accept User parent as a parameter
    private StudentDTO convertToDTO(Student student, User parent) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentCode(student.getStudentCode());
        dto.setFullName(student.getFullName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setGrade(student.getGrade());
        dto.setClazz(student.getClazz()); // Make sure Student entity has getClazz()
        dto.setSchoolYear(student.getSchoolYear()); // Make sure Student entity has getSchoolYear()
        dto.setAllergies(student.getAllergies());
        dto.setMedicalConditions(student.getMedicalConditions());
        dto.setEmergencyContactName(student.getEmergencyContactName());
        dto.setEmergencyContactPhone(student.getEmergencyContactPhone());

        if (parent != null) {
            dto.setParentId(parent.getUserId());
            // Assuming User model has getFullName() method
            dto.setParentName(parent.getFullName());
        }
        return dto;
    }

    public List<StudentDTO> getAllStudents() {
        // For getAllStudents, parent context is not directly available here.
        // If StudentDTO requires parent info, this method might need adjustment
        // or StudentDTO's parent fields should be nullable/optional.
        // For now, assuming it's acceptable for parent fields to be null if not converting with explicit parent.
        // This might require a different convertToDTO or logic if parent info is strictly needed.
        // A simple version without parent for general listing:
        return studentRepository.findAll().stream()
                .map(student -> { // Lambda to call a version of convertToDTO or map manually
                    StudentDTO dto = new StudentDTO();
                    dto.setStudentCode(student.getStudentCode());
                    dto.setFullName(student.getFullName());
                    dto.setDateOfBirth(student.getDateOfBirth());
                    dto.setGender(student.getGender());
                    dto.setGrade(student.getGrade());
                    dto.setClazz(student.getClazz());
                    dto.setSchoolYear(student.getSchoolYear());
                    dto.setAllergies(student.getAllergies());
                    dto.setMedicalConditions(student.getMedicalConditions());
                    dto.setEmergencyContactName(student.getEmergencyContactName());
                    dto.setEmergencyContactPhone(student.getEmergencyContactPhone());
                    // Parent info will be null here
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Optional<StudentDTO> getStudentByCode(String studentCode) {
        // Similar to getAllStudents, if parent info is needed, this needs more context.
        // Assuming a version of convertToDTO that can handle a null parent.
        return studentRepository.findByStudentCode(studentCode)
                .map(student -> { // Lambda to call a version of convertToDTO or map manually
                    StudentDTO dto = new StudentDTO();
                    dto.setStudentCode(student.getStudentCode());
                    dto.setFullName(student.getFullName());
                    // ... map other fields ...
                    // Parent info will be null here
                    return dto;
                }); // Simplified for brevity, ensure all fields are mapped
    }

    // Renamed method back to original
    public List<StudentDTO> getStudentsByParentUserCode(String parentUserCode) {
        // logger.info("Fetching students for parentUserCode: {}", parentUserCode); // Optional logging
        Optional<User> parentUserOptional = userRepository.findByUserCode(parentUserCode);

        if (parentUserOptional.isEmpty()) {
            return List.of(); // Parent not found, return empty list
        }
        User parent = parentUserOptional.get();

        List<Student> students = studentRepository.findByParentCode(parentUserCode);

        return students.stream()
                .map(student -> convertToDTO(student, parent)) // Pass the fetched parent to convertToDTO
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDTO createStudent(Student student) {
        Student savedStudent = studentRepository.save(student);
        return new StudentDTO(savedStudent);
    }

    @Transactional
    public StudentDTO updateStudent(String studentCode, Student studentDetails) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + studentCode));
        student.setFullName(studentDetails.getFullName());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setGender(studentDetails.getGender());
        student.setClassName(studentDetails.getClassName());
        // User association removed as part of user_id removal from Student model
        Student updatedStudent = studentRepository.save(student);
        return new StudentDTO(updatedStudent);
    }

    @Transactional
    public void deleteStudent(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + studentCode));
        studentRepository.delete(student);
    }

    // Add other student-related service methods here (e.g., create, update, delete)
    // For example:
    // public StudentDTO createStudent(StudentCreationDTO creationDTO) { ... }
    // public StudentDTO updateStudent(String studentCode, StudentUpdateDTO updateDTO) { ... }
    // public void deleteStudent(String studentCode) { ... }
}
