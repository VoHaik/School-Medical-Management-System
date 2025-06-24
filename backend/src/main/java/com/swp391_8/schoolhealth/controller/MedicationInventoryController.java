package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MedicationInventoryDTO;
import com.swp391_8.schoolhealth.service.MedicationInventoryService;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medications/inventory")
public class MedicationInventoryController {

    @Autowired
    private MedicationInventoryService medicationInventoryService;
    
    @GetMapping("")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<MedicationInventoryDTO>> getAllMedications() {
        List<MedicationInventoryDTO> medications = medicationInventoryService.getAllMedications();
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> getMedicationById(@PathVariable Integer id) {
        MedicationInventoryDTO medication = medicationInventoryService.getMedicationById(id);
        if (medication != null) {
            return ResponseEntity.ok(medication);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "Medication with ID " + id + " not found"));
    }
    
    @PostMapping("")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> createMedication(@RequestBody MedicationInventoryDTO medicationDTO, 
                                             Authentication authentication) {
        try {
            medicationDTO.setMedicationId(null); // Đảm bảo đây là tạo mới, không phải cập nhật
            MedicationInventoryDTO savedMedication = medicationInventoryService.saveMedication(medicationDTO, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMedication);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create medication: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> updateMedication(@PathVariable Integer id, 
                                             @RequestBody MedicationInventoryDTO medicationDTO,
                                             Authentication authentication) {
        try {
            medicationDTO.setMedicationId(id);
            MedicationInventoryDTO updatedMedication = medicationInventoryService.saveMedication(medicationDTO, authentication);
            return ResponseEntity.ok(updatedMedication);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update medication: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMedication(@PathVariable Integer id) {
        try {
            medicationInventoryService.deleteMedication(id);
            return ResponseEntity.ok(Map.of("message", "Medication deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Failed to delete medication: " + e.getMessage()));
        }
    }
    
    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<MedicationInventoryDTO>> getLowStockMedications(
            @RequestParam(defaultValue = "20") int threshold) {
        List<MedicationInventoryDTO> medications = medicationInventoryService.getLowStockMedications(threshold);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/expiring")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<MedicationInventoryDTO>> getExpiringMedications(
            @RequestParam(defaultValue = "30") int daysThreshold) {
        List<MedicationInventoryDTO> medications = medicationInventoryService.getExpiringMedications(daysThreshold);
        return ResponseEntity.ok(medications);
    }
      @PutMapping("/{id}/quantity")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Integer id,
            @RequestParam int change,
            Authentication authentication) {
        try {
            MedicationInventoryDTO medication = medicationInventoryService.updateMedicationQuantity(id, change, authentication);
            return ResponseEntity.ok(medication);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Failed to update quantity: " + e.getMessage()));
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> testMedicationInventory(Authentication authentication) {
        try {
            // Create a test medication with all required fields explicitly set
            MedicationInventoryDTO testMedication = new MedicationInventoryDTO();
            testMedication.setMedicationName("Test Medication API");
            testMedication.setDosage("10mg");
            testMedication.setForm("Tablet");
            testMedication.setBatchNumber("TEST123");
            testMedication.setExpiryDate(LocalDate.now().plusYears(1));
            testMedication.setQuantity(50);
            testMedication.setPrescriptionRequired(false); // Set explicitly to avoid null
            testMedication.setManufacturer("Test Manufacturer");
            testMedication.setStorageLocation("Test Cabinet");
            testMedication.setUnitCost(10.0);
            
            // Try to save it
            MedicationInventoryDTO savedMedication = medicationInventoryService.saveMedication(testMedication, authentication);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "Test medication created successfully",
                    "medication", savedMedication
                ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Failed to create test medication",
                    "message", e.getMessage(),
                    "stackTrace", e.getStackTrace()
                ));
        }
    }
}
