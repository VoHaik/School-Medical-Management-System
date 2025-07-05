package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassDTO {
    private String classId;
    private String className;
    private String gradeLevel;
    private String academicYear;
    private String teacherName;
}
