package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.VaccineDTO;
import com.swp391_8.schoolhealth.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccines")
public class VaccineController {

    @Autowired
    private VaccineService vaccineService;

    @PostMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')") // Assuming ADMIN can also manage this
    public ResponseEntity<VaccineDTO> createVaccine(@RequestBody VaccineDTO vaccineDTO) {
        try {
            VaccineDTO createdVaccine = vaccineService.createVaccine(vaccineDTO);
            return new ResponseEntity<>(createdVaccine, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Or return error message
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Parent') or hasAuthority('Admin')") // Parents might need to list vaccines
    public ResponseEntity<List<VaccineDTO>> getAllVaccines() {
        List<VaccineDTO> vaccines = vaccineService.getAllVaccines();
        return ResponseEntity.ok(vaccines);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Parent') or hasAuthority('Admin')")
    public ResponseEntity<VaccineDTO> getVaccineById(@PathVariable Integer id) {
        try {
            VaccineDTO vaccine = vaccineService.getVaccineById(id);
            return ResponseEntity.ok(vaccine);
        } catch (RuntimeException e) { // Catch ResourceNotFoundException specifically if defined
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<VaccineDTO> updateVaccine(@PathVariable Integer id, @RequestBody VaccineDTO vaccineDTO) {
        try {
            VaccineDTO updatedVaccine = vaccineService.updateVaccine(id, vaccineDTO);
            return ResponseEntity.ok(updatedVaccine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Or return error message
        } catch (RuntimeException e) { // Catch ResourceNotFoundException
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Void> deleteVaccine(@PathVariable Integer id) {
        try {
            vaccineService.deleteVaccine(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) { // Catch ResourceNotFoundException or others like DataIntegrityViolationException
            return ResponseEntity.notFound().build(); // Or internal server error if it's a constraint violation
        }
    }
}
