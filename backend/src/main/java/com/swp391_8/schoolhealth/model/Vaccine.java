package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.util.Set;

@Entity
@Table(name = "vaccines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccine_id")
    private Integer vaccineId;

    @Nationalized
    @Column(name = "vaccine_name", nullable = false, unique = true, length = 150)
    private String name;

    @Nationalized
    @Column(name = "disease_targeted", length = 255)
    private String diseaseTargeted; // e.g., "Influenza", "Measles, Mumps, Rubella"

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Nationalized
    @Column(length = 100)
    private String manufacturer;

    @Column(name = "standard_doses")
    private Integer standardDoses; // Number of doses in a standard series, if applicable

    // Future: Could add typical age range, or interval between doses

    // Inverse side for relationships
    @OneToMany(mappedBy = "vaccine")
    private Set<StudentVaccination> studentVaccinations;

    @OneToMany(mappedBy = "vaccine")
    private Set<DeclaredVaccinationRecord> declaredVaccinationRecords;

    // Note: VaccinationEvent is now replaced by HealthEvent with EventType.VACCINATION
}
