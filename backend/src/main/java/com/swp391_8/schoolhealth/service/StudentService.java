package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public List<Student> getStudentsByParentId(Integer parentId) {
        return parentStudentRelationshipRepository.findByParentUserId(parentId)
                .stream()
                .map(psr -> psr.getStudent())
                .collect(Collectors.toList());
    }

    @Transactional
    public Student createStudent(Student student, String gender) {
        if (student.getUser() != null) {
            User user = student.getUser();
            // Ensure user object is managed if it's new or detached, though typically handled by cascade if set up.
            // userRepository.save(user); // Might be needed if user is not persisted yet or to ensure it's managed.
            user.setGender(gender); // Set gender on the User object associated with Student
        }
        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(Integer id, Student studentDetails, String gender) {
        Student student = getStudentById(id);
        // student.setFullName(studentDetails.getFullName()); // Student entity does not have direct fullName
        // student.setDateOfBirth(studentDetails.getDateOfBirth()); // Student entity does not have direct dateOfBirth

        // Update User details through student.getUser()
        User user = student.getUser();
        if (user != null) {
            if (studentDetails.getUser() != null) { // Check if details are passed via a User object in studentDetails
                if (studentDetails.getUser().getFullName() != null) {
                    user.setFullName(studentDetails.getUser().getFullName());
                }
                // Removed user.setDob(studentDetails.getUser().getDob());
            }
            user.setGender(gender); // Set gender from the parameter
        }

        // Update Student specific details
        if (studentDetails.getDateOfBirth() != null) {
            student.setDateOfBirth(studentDetails.getDateOfBirth());
        }

        student.setClassName(studentDetails.getClassName());
        // student.setStudentCode(studentDetails.getStudentCode()); // If student code can be updated

        // userRepository.save(user); // Save user if changes were made and not cascaded
        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Integer id) {
        Student student = getStudentById(id);
        // Corrected method name
        parentStudentRelationshipRepository.deleteByStudentId(id);
        studentRepository.delete(student);
        // Also consider deleting the associated User if it's exclusively for this student
        // userRepository.delete(student.getUser()); 
    }
}