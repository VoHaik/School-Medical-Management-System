package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "CheckupTypes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"type_name"})
})
public class CheckupType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkup_type_id")
    private Integer checkupTypeId;

    @Column(name = "type_name", nullable = false, length = 100)
    private String typeName;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    // Constructors, getters, and setters are handled by Lombok
}
