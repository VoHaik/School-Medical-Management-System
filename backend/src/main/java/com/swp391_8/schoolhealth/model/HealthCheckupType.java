package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "health_checkup_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheckupType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "checkup_type_id")
    private Long checkupTypeId;
    
    @Column(name = "type_name", nullable = false, unique = true, length = 100)
    private String typeName;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "is_required_measurement")
    private Boolean isRequiredMeasurement = false;
    
    @Column(name = "is_required_vital_signs")
    private Boolean isRequiredVitalSigns = false;
    
    @Column(name = "is_required_vision_test")
    private Boolean isRequiredVisionTest = false;
    
    @Column(name = "is_required_hearing_test")
    private Boolean isRequiredHearingTest = false;
    
    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes = 30;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
