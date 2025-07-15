package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.HealthCheckupTypeDTO;
import com.swp391_8.schoolhealth.service.HealthCheckupTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-checkup-types")
public class HealthCheckupTypeController {
    
    @Autowired
    private HealthCheckupTypeService healthCheckupTypeService;
    
    @GetMapping
    public ResponseEntity<List<HealthCheckupTypeDTO>> getAllCheckupTypes() {
        List<HealthCheckupTypeDTO> checkupTypes = healthCheckupTypeService.getAllActiveCheckupTypes();
        return ResponseEntity.ok(checkupTypes);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<HealthCheckupTypeDTO>> searchCheckupTypes(@RequestParam String term) {
        List<HealthCheckupTypeDTO> checkupTypes = healthCheckupTypeService.searchCheckupTypes(term);
        return ResponseEntity.ok(checkupTypes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HealthCheckupTypeDTO> getCheckupTypeById(@PathVariable Long id) {
        HealthCheckupTypeDTO checkupType = healthCheckupTypeService.getCheckupTypeById(id);
        if (checkupType != null) {
            return ResponseEntity.ok(checkupType);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<HealthCheckupTypeDTO> createCheckupType(@RequestBody HealthCheckupTypeDTO checkupTypeDTO) {
        try {
            HealthCheckupTypeDTO createdCheckupType = healthCheckupTypeService.createCheckupType(checkupTypeDTO);
            return ResponseEntity.ok(createdCheckupType);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HealthCheckupTypeDTO> updateCheckupType(@PathVariable Long id, @RequestBody HealthCheckupTypeDTO checkupTypeDTO) {
        try {
            HealthCheckupTypeDTO updatedCheckupType = healthCheckupTypeService.updateCheckupType(id, checkupTypeDTO);
            if (updatedCheckupType != null) {
                return ResponseEntity.ok(updatedCheckupType);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckupType(@PathVariable Long id) {
        boolean deleted = healthCheckupTypeService.deleteCheckupType(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
