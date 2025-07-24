package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationInventoryDTO;
import com.swp391_8.schoolhealth.model.MedicationInventory;
import com.swp391_8.schoolhealth.repository.MedicationInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service đơn giản hóa cho MedicationInventory
 */
@Service
public class MedicationInventoryService {
    
    @Autowired
    private MedicationInventoryRepository medicationInventoryRepository;
    
    public List<MedicationInventoryDTO> getAllMedications() {
        return medicationInventoryRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public MedicationInventoryDTO getMedicationById(Integer id) {
        return medicationInventoryRepository.findById(id)
            .map(this::convertToDTO)
            .orElse(null);
    }
  @Transactional
    public MedicationInventoryDTO saveMedication(MedicationInventoryDTO medicationDTO, Authentication authentication) {
        try {
            MedicationInventory medication = convertToEntity(medicationDTO);
            
            // Get username from authentication if available
            String username = authentication != null ? authentication.getName() : "system";
            
            // Set default values for all required fields to prevent NULL constraint errors
            medication.setPrescriptionRequired(medication.getPrescriptionRequired() != null ? medication.getPrescriptionRequired() : false);
            medication.setManufacturer(medication.getManufacturer() != null ? medication.getManufacturer() : "");
            medication.setStorageLocation(medication.getStorageLocation() != null ? medication.getStorageLocation() : "");
            medication.setUnitCost(medication.getUnitCost() != null ? medication.getUnitCost() : 0.0);
            
            if (medicationDTO.getMedicationId() == null) {
                // New medication case
                medication.setCreatedBy(username);
                // createdAt will be set by @PrePersist
            } else {
                // Update case
                MedicationInventory existingMedication = medicationInventoryRepository.findById(medicationDTO.getMedicationId())
                    .orElseThrow(() -> new RuntimeException("Medication not found"));
                    
                medication.setCreatedAt(existingMedication.getCreatedAt());
                medication.setCreatedBy(existingMedication.getCreatedBy() != null ? existingMedication.getCreatedBy() : username);
                medication.setUpdatedBy(username);
                // updatedAt will be set by @PreUpdate
            }
            
            // Print debugging information
            System.out.println("Saving medication with values:");
            System.out.println("- medicationId: " + medication.getMedicationId());
            System.out.println("- medicationName: " + medication.getMedicationName());
            System.out.println("- prescriptionRequired: " + medication.getPrescriptionRequired());
            System.out.println("- quantity: " + medication.getQuantity());
            
            MedicationInventory savedMedication = medicationInventoryRepository.save(medication);
            return convertToDTO(savedMedication);
        } catch (Exception e) {
            System.err.println("Error saving medication: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public void deleteMedication(Integer id) {
        medicationInventoryRepository.deleteById(id);
    }
    
    public List<MedicationInventoryDTO> getLowStockMedications(int threshold) {
        return medicationInventoryRepository.findByQuantityLessThan(threshold).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<MedicationInventoryDTO> getExpiringMedications(int daysThreshold) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysThreshold);
        return medicationInventoryRepository.findByExpiryDateBefore(thresholdDate).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
      @Transactional
    public MedicationInventoryDTO updateMedicationQuantity(Integer id, int quantityChange, Authentication authentication) {
        MedicationInventory medication = medicationInventoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medication not found"));
            
        // Kiểm tra số lượng còn lại
        if (medication.getQuantity() + quantityChange < 0) {
            throw new IllegalStateException("Not enough medication in stock");
        }
        
        // Cập nhật số lượng
        medication.setQuantity(medication.getQuantity() + quantityChange);
        
        MedicationInventory updatedMedication = medicationInventoryRepository.save(medication);
        return convertToDTO(updatedMedication);
    }    // Helper methods to convert between Entity and DTO
    private MedicationInventoryDTO convertToDTO(MedicationInventory medication) {
        MedicationInventoryDTO dto = new MedicationInventoryDTO();
        dto.setMedicationId(medication.getMedicationId());
        dto.setMedicationName(medication.getMedicationName());
        dto.setDosage(medication.getDosage());
        dto.setForm(medication.getForm());
        dto.setBatchNumber(medication.getBatchNumber());
        dto.setExpiryDate(medication.getExpiryDate());
        dto.setQuantity(medication.getQuantity());
        dto.setPrescriptionRequired(medication.getPrescriptionRequired());
        dto.setManufacturer(medication.getManufacturer());
        dto.setStorageLocation(medication.getStorageLocation());
        dto.setUnitCost(medication.getUnitCost());
        dto.setCreatedBy(medication.getCreatedBy());
        dto.setUpdatedBy(medication.getUpdatedBy());
        dto.setCreatedAt(medication.getCreatedAt());
        dto.setUpdatedAt(medication.getUpdatedAt());
        
        return dto;
    }
    
    private MedicationInventory convertToEntity(MedicationInventoryDTO dto) {
        MedicationInventory medication = new MedicationInventory();
        medication.setMedicationId(dto.getMedicationId());
        medication.setMedicationName(dto.getMedicationName());
        medication.setDosage(dto.getDosage());
        medication.setForm(dto.getForm());
        medication.setBatchNumber(dto.getBatchNumber());
        medication.setExpiryDate(dto.getExpiryDate());
        medication.setQuantity(dto.getQuantity());
        medication.setPrescriptionRequired(dto.getPrescriptionRequired() != null ? dto.getPrescriptionRequired() : false);
        medication.setManufacturer(dto.getManufacturer());
        medication.setStorageLocation(dto.getStorageLocation());
        medication.setUnitCost(dto.getUnitCost());
        medication.setCreatedBy(dto.getCreatedBy());
        medication.setUpdatedBy(dto.getUpdatedBy());
        
        return medication;
    }
}
