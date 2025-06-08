package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "checkup_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckupResult {    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate checkupDate;

    private String height;

    private String weight;

    private String bmi;

    private String bloodPressure;

    private String vision;

    private String hearing;

    private String dentalHealth;

    private String physicalAssessment;

    private boolean requiresFollowUp;

    private String followUpDetails;

    private LocalDate followUpDate;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "health_checkup_id")
    private HealthCheckup healthCheckup;

    @ManyToOne
    @JoinColumn(name = "medical_staff_id")
    private User medicalStaff;
}