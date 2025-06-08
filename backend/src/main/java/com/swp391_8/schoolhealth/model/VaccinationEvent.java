package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vaccination_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationEvent {    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String vaccineName;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    private String description;

    private String status; // PLANNED, APPROVED, COMPLETED

    @ManyToMany
    @JoinTable(
            name = "vaccination_students",
            joinColumns = @JoinColumn(name = "vaccination_event_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private User coordinator;
}