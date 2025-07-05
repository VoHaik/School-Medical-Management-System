package com.swp391_8.schoolhealth.dto;

import lombok.Data;

@Data
public class GradeLevelDTO {
    private Integer gradeId;
    private String gradeName; // "Grade 1", "Grade 2", etc.
    private Boolean isActive;
    
    // Convenience method to get grade number from grade name
    public Integer getGradeNumber() {
        if (gradeName != null && gradeName.startsWith("Grade ")) {
            try {
                return Integer.parseInt(gradeName.substring(6));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}
