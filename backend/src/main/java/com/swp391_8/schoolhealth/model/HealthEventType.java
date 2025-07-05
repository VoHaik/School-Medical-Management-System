package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_event_types")
@IdClass(HealthEventTypeId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthEventType {
    
    @Id
    @Column(name = "event_id")
    private Integer eventId;
    
    @Id
    @Column(name = "checkup_type_id")
    private Integer checkupTypeId;
    
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = true;
    
    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder = 1;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private HealthEvent healthEvent;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "checkup_type_id", insertable = false, updatable = false)
    private HealthCheckupType healthCheckupType;
}
