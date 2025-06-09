package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "EventTypes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"type_name"})
})
public class EventType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_type_id")
    private Integer eventTypeId;

    @Column(name = "type_name", nullable = false, length = 50)
    private String typeName;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    // Constructors, getters, and setters are handled by Lombok
}
