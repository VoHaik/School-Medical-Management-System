package com.swp391_8.schoolhealth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity đơn giản hóa cho bảng medication_inventory
 * Chỉ bao gồm các trường cần thiết cho quản lý thuốc cơ bản
 */
@Entity
@Table(name = "medication_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id")
    private Integer medicationId;

    @Column(name = "medication_name", nullable = false, length = 255)
    private String medicationName;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(nullable = false, length = 50)
    private String form; // Viên nén, Siro, Kem bôi, v.v.    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;
    
    @Column(nullable = false)
    private Integer quantity;
      @Column(name = "prescription_required", nullable = false)    private Boolean prescriptionRequired = Boolean.FALSE; // Explicitly use Boolean.FALSE to ensure it's not null
    
    @Column(name = "manufacturer", length = 255, nullable = true)
    private String manufacturer;
    
    @Column(name = "storage_location", length = 100, nullable = true)
    private String storageLocation;
    
    @Column(name = "unit_cost", nullable = true)
    private Double unitCost;
      @Column(name = "created_by", nullable = true)
    private String createdBy;
    
    @Column(name = "updated_by", nullable = true)
    private String updatedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;@PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        
        // Set default values for required fields if they're null
        if (this.prescriptionRequired == null) {
            this.prescriptionRequired = Boolean.FALSE;
        }
        
        if (this.manufacturer == null) {
            this.manufacturer = "";
        }
        
        if (this.storageLocation == null) {
            this.storageLocation = "";
        }
        
        if (this.unitCost == null) {
            this.unitCost = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        
        // Set default values for required fields if they're null
        if (this.prescriptionRequired == null) {
            this.prescriptionRequired = Boolean.FALSE;
        }
    }
}
