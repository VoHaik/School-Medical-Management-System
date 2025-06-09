package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecord {    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String allergies;

    private String chronicDiseases;

    private String medicalHistory;

    private String vision;

    private String hearing;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}