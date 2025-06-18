package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_declaration_chronic_illnesses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationChronicIllness {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
      @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_declaration_id", nullable = false)
    private HealthDeclaration healthDeclaration;
    
    @Column(name = "chronic_illness")
    private String chronicIllness;
}
