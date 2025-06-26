package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "grade_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id")
    private Integer gradeId;

    @Nationalized
    @Column(name = "grade_name", nullable = false, length = 50)
    private String gradeName; // "Grade 1", "Grade 2", etc.

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // One-to-many relationship with Students
    @OneToMany(mappedBy = "gradeLevel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Student> students;

    // Many-to-Many relationship with VaccinationEvent - which events target this grade
    @ManyToMany(mappedBy = "targetGrades")
    private Set<VaccinationEvent> vaccinationEvents = new HashSet<>();

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

    // Static method to generate standard grade names
    public static String generateGradeName(int gradeNumber) {
        return "Grade " + gradeNumber;
    }
}
