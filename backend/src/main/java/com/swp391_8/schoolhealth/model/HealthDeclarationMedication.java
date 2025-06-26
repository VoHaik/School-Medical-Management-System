package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;
import java.util.Date;

@Entity
@Table(name = "health_declaration_medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationMedication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id")
    private Integer medicationId;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_declaration_id", nullable = false)
    private HealthDeclaration healthDeclaration;

    @Nationalized
    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Nationalized
    @Column(name = "dosage", nullable = false)
    private String dosage;

    @Nationalized
    @Column(name = "frequency", nullable = false)
    private String frequency;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Nationalized
    @Column(name = "reason", columnDefinition = "NVARCHAR(MAX)")
    private String reason;

    @Nationalized
    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;
}
