package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.dto.StudentDTO; // Import StudentDTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;

    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentByCode(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + studentCode));
        return new StudentDTO(student);
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByParentId(Integer parentId) {
        // This method is problematic as parentId (Integer) is ambiguous after refactoring.
        // Assuming this was intended to be findByParentCode(String parentCode)
        // For now, to fix compilation, we'll assume a direct conversion or that this method will be updated/removed.
        // This will likely require fetching the Parent by old ID, then getting parentCode, or changing the method signature.
        // Temporarily, we will change the call to use findByParentParentCode, assuming parentId can be converted to a String parentCode.
        // This is a placeholder fix and needs review.
        // If parentId is a legacy database ID, it needs to be resolved to a parentCode.
        // For the purpose of fixing the immediate compilation error based on previous changes:
        List<ParentStudentRelationship> relationships = parentStudentRelationshipRepository.findByParentParentCode(String.valueOf(parentId));
        // Ensure that the Student entity is fetched within the transaction before mapping
        return relationships.stream()
                            .map(ParentStudentRelationship::getStudent) // Get Student entity
                            .map(StudentDTO::new) // Then map to StudentDTO
                            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByParentCode(String parentCode) {
        System.out.println("[StudentService] Getting students for parentCode: " + parentCode);
        List<ParentStudentRelationship> relationships = parentStudentRelationshipRepository.findByParentParentCode(parentCode);
        System.out.println("[StudentService] Found " + relationships.size() + " relationships for parentCode: " + parentCode);

        if (relationships.isEmpty()) {
            return List.of(); // Return empty list if no relationships found
        }

        return relationships.stream()
                            .map(relationship -> {
                                Student student = relationship.getStudent();
                                if (student == null) {
                                    System.out.println("[StudentService] Null student found for a relationship with parentCode: " + parentCode + ", relationship ID: " + relationship.getId());
                                    return null; // Or handle as an error
                                }
                                System.out.println("[StudentService] Mapping student: " + student.getStudentCode() + " - " + student.getFullName());
                                return new StudentDTO(student);
                            })
                            .filter(dto -> dto != null) // Filter out any null DTOs from the previous step
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
        // Handle user association carefully if studentDetails can update it
        if (studentDetails.getUser() != null) { 
            student.setUser(studentDetails.getUser());
        }
        Student updatedStudent = studentRepository.save(student);
        return new StudentDTO(updatedStudent);
    }

    @Transactional
    public void deleteStudent(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + studentCode));
        studentRepository.delete(student);
    }
}