package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "ReportTypes")
public class ReportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_type_id", nullable = false)
    private Integer reportTypeId;

    @Nationalized
    @Column(name = "type_name", nullable = false, length = 50, unique = true)
    private String typeName;

    @Nationalized
    @Lob
    @Column(name = "description")
    private String description;

    @Nationalized
    @Column(name = "template_url", length = 255)
    private String templateUrl;
}