package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "ContentTypes")
public class ContentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id", nullable = false)
    private Integer typeId;

    @Nationalized
    @Column(name = "type_name", nullable = false, length = 50, unique = true)
    private String typeName;

    @Nationalized
    @Lob
    @Column(name = "description")
    private String description;
}