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
        List<ParentStudentRelationship> relationships = parentStudentRelationshipRepository.findByParentUserId(parentId);
        // Ensure that the Student entity is fetched within the transaction before mapping
        return relationships.stream()
                            .map(ParentStudentRelationship::getStudent) // Get Student entity
                            .map(StudentDTO::new) // Then map to StudentDTO
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