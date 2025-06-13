package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "vaccination_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declaration_id", nullable = false)
    private HealthDeclaration healthDeclaration;

    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @Column(name = "dose_number")
    private Integer doseNumber; // e.g., 1, 2, or null if not applicable

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String dosage;

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }
}
