package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('MEDICAL_STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MEDICAL_STAFF') or hasRole('ADMIN') or @securityService.isParentOfStudent(authentication, #id)")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/parent/{parentId}")
    @PreAuthorize("hasRole('MEDICAL_STAFF') or hasRole('ADMIN') or authentication.principal.id == #parentId")
    public ResponseEntity<List<Student>> getStudentsByParentId(@PathVariable Long parentId) {
        List<Student> students = studentService.getStudentsByParentId(parentId);
        return ResponseEntity.ok(students);
    }

    @PostMapping
    @PreAuthorize("hasRole('MEDICAL_STAFF') or hasRole('ADMIN')")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        Student newStudent = studentService.createStudent(student);
        return ResponseEntity.ok(newStudent);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MEDICAL_STAFF') or hasRole('ADMIN')")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        Student updatedStudent = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }
}