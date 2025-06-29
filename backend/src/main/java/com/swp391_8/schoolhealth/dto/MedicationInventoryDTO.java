package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO đơn giản hóa cho MedicationInventory
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationInventoryDTO {
    private Integer medicationId;
    private String medicationName;
    private String dosage;
    private String form;    private String batchNumber;
    private LocalDate expiryDate;
    private Integer quantity;
    private Boolean prescriptionRequired = false;
    private String manufacturer;
    private String storageLocation;
    private Double unitCost;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
