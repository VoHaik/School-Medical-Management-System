package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

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

    @Nationalized
    @Column(name = "contact_name", nullable = false)
    private String contactName;

    @Nationalized
    @Column(name = "relationship")
    private String relationship;

    @Nationalized
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Nationalized
    @Column(name = "alternative_phone")
    private String alternativePhone;

    @Nationalized
    @Column(name = "email")
    private String email;

    @Nationalized
    @Column(name = "address")
    private String address;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Nationalized
    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    // Explicit getter methods to ensure proper naming
    public String getContactName() {
        return contactName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}
