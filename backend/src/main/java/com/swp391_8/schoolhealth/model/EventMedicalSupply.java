package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "EventMedicalSupplies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventMedicalSupply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_supply_id")
    private Integer eventSupplyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private MedicalEvent event;

    @Nationalized
    @Column(name = "supply_name", nullable = false, length = 100)
    private String supplyName;

    @Column(name = "quantity_used", nullable = false)
    private Integer quantityUsed;

    @Nationalized
    @Column(name = "unit", length = 50)
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_user_id")
    private User recordedBy;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        recordedAt = LocalDateTime.now();
    }
}
