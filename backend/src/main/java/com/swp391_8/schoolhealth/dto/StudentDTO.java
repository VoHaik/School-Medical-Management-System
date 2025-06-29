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
    private String gradeName; // Changed from 'grade' to 'gradeName' to be more explicit
    private String schoolYear;
    private String allergies;
    private String medicalConditions;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private Integer parentId;
    private String parentName;
    
    // Constructor to map from Student entity
    public StudentDTO(com.swp391_8.schoolhealth.model.Student student) {
        this.studentCode = student.getStudentCode();
        this.fullName = student.getFullName();
        this.dateOfBirth = student.getDateOfBirth();
        this.gender = student.getGender();
        this.className = student.getClassName();
        // Get grade name from the gradeLevel relationship
        this.gradeName = student.getGradeLevel() != null ? student.getGradeLevel().getGradeName() : null;
        this.schoolYear = student.getSchoolYear();
        this.allergies = student.getAllergies();
        this.medicalConditions = student.getMedicalConditions();
        this.emergencyContactName = student.getEmergencyContactName();
        this.emergencyContactPhone = student.getEmergencyContactPhone();
        // parentId and parentName will be set separately if needed
    }
}
