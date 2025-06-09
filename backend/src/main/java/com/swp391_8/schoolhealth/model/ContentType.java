package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ContentTypes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"type_name"})
})
public class ContentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_type_id")
    private Integer contentTypeId;

    @Column(name = "type_name", nullable = false, length = 50)
    private String typeName;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    // Constructors, getters, and setters are handled by Lombok
}
