package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "EventTypes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_type_id")
    private Integer eventTypeId;

    @Nationalized
    @Column(name = "type_name", nullable = false, unique = true, length = 50)
    private String typeName;

    @Nationalized
    @Lob
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
}
