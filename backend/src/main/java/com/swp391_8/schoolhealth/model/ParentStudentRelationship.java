package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "ParentStudentRelationships")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentStudentRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "relationship_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_code", referencedColumnName = "parent_code", nullable = false)
    private Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    private Student student;

    @Nationalized
    @Column(name = "relationship_type", length = 50)
    private String relationshipType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructor for convenience
    public ParentStudentRelationship(Parent parent, Student student, String relationshipType) {
        this.parent = parent;
        this.student = student;
        this.relationshipType = relationshipType;
    }
}
