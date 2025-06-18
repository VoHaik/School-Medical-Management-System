package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_declaration_emergency_contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationEmergencyContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Integer contactId;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_declaration_id", nullable = false)
    private HealthDeclaration healthDeclaration;

    @Column(name = "contact_name", nullable = false)
    private String contactName;

    @Column(name = "relationship")
    private String relationship;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "alternative_phone")
    private String alternativePhone;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;
}
