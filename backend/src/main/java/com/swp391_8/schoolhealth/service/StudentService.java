package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
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

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentByCode(String studentCode) {
        return studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + studentCode));
    }

    @Transactional(readOnly = true)
    public List<Student> getStudentsByParentId(Integer parentId) {
        List<ParentStudentRelationship> relationships = parentStudentRelationshipRepository.findByParentUserId(parentId);
        return relationships.stream()
                            .map(ParentStudentRelationship::getStudent)
                            .collect(Collectors.toList());
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(String studentCode, Student studentDetails) {
        Student student = getStudentByCode(studentCode);
        student.setFullName(studentDetails.getFullName());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setGender(studentDetails.getGender());
        student.setClassName(studentDetails.getClassName());
        return studentRepository.save(student);
    }

    public void deleteStudent(String studentCode) {
        Student student = getStudentByCode(studentCode);
        studentRepository.delete(student);
    }
}