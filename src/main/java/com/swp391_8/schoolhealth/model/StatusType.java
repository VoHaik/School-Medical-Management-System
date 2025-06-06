package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "StatusTypes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Integer id;

    @Nationalized
    @Column(name = "status_name", nullable = false, unique = true, length = 50)
    private String statusName;

    @Nationalized
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    // Constructor for convenience
    public StatusType(String statusName, String category) {
        this.statusName = statusName;
        this.category = category;
    }
}
