package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "student_checkup_id") // Updated column name for clarity
    private StudentHealthCheckup studentHealthCheckup; // Changed from HealthCheckup to StudentHealthCheckup

    @Column(name = "consultation_date", nullable = false)
    private LocalDateTime consultationDate;

    @Nationalized
    @Column(length = 100)
    private String location;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String result;
}