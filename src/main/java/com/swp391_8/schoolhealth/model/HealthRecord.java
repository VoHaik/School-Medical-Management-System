package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

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

    @OneToMany(mappedBy = "healthRecord", cascade = CascadeType.ALL)
    private Set<Vaccination> vaccinations = new HashSet<>();    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}