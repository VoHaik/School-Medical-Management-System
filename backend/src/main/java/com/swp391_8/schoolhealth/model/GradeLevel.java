package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "grade_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"students", "healthEvents"})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    @JsonIgnore
    private List<Student> students;

    // Many-to-Many relationship with HealthEvent - which health events target this grade
    @ManyToMany(mappedBy = "targetGradeLevels")
    @JsonIgnore
    private Set<HealthEvent> healthEvents = new HashSet<>();

    // Convenience method to get grade number from grade name
    public Integer getGradeNumber() {
        if (gradeName != null) {
            // Handle format like "6A", "7A", "8A", "9A"
            if (gradeName.matches("\\d+[A-Z]")) {
                try {
                    return Integer.parseInt(gradeName.substring(0, gradeName.length() - 1));
                } catch (NumberFormatException e) {
                    return null;
                }
            }
            // Handle format like "Grade 1", "Grade 2", etc.
            if (gradeName.startsWith("Grade ")) {
                try {
                    return Integer.parseInt(gradeName.substring(6));
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
        return null;
    }

    // Static method to generate standard grade names
    public static String generateGradeName(int gradeNumber) {
        return "Grade " + gradeNumber;
    }
}
