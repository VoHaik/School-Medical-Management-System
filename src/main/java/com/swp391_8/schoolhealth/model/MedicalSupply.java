package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_supplies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalSupply {    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supply_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private MedicalEvent event;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "quantity_used", nullable = false)
    private Integer quantityUsed;

    @Column(length = 50)
    private String unit;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}