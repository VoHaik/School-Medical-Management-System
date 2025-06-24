package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private String studentCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String className;
    // Add other fields as needed, but avoid complex objects or lazy-loaded entities directly
    // For example, if you need the user's username or ID associated with the student
    private String userUsername; // If the student has an associated User account
    private Integer userId;      // If the student has an associated User account

    // Constructor to map from Student entity
    public StudentDTO(com.swp391_8.schoolhealth.model.Student student) {
        this.studentCode = student.getStudentCode();
        this.fullName = student.getFullName();
        this.dateOfBirth = student.getDateOfBirth();
        this.gender = student.getGender();
        this.className = student.getClassName();
        if (student.getUser() != null) {
            this.userUsername = student.getUser().getUsername();
            this.userId = student.getUser().getUserId();
        }
    }
}
