package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.HealthCheckup;
import com.swp391_8.schoolhealth.service.HealthCheckupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/health-checkup-records")
public class HealthCheckupRecordsController {
    @Autowired
    private HealthCheckupService healthCheckupService;

    @GetMapping
    public ResponseEntity<List<HealthCheckup>> getAllCheckups() {
        List<HealthCheckup> checkups = healthCheckupService.getAll();
        return ResponseEntity.ok(checkups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthCheckup> getCheckupById(@PathVariable Long id) {
        Optional<HealthCheckup> checkup = healthCheckupService.getById(id);
        return checkup.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<HealthCheckup>> getCheckupsByStudent(@PathVariable String studentId) {
        List<HealthCheckup> checkups = healthCheckupService.getByStudentId(studentId);
        return ResponseEntity.ok(checkups);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<HealthCheckup>> getCheckupsByEvent(@PathVariable Long eventId) {
        List<HealthCheckup> checkups = healthCheckupService.getByEventId(eventId);
        return ResponseEntity.ok(checkups);
    }

    @PostMapping
    public ResponseEntity<HealthCheckup> createCheckup(@RequestBody HealthCheckup checkup) {
        HealthCheckup savedCheckup = healthCheckupService.save(checkup);
        return ResponseEntity.ok(savedCheckup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthCheckup> updateCheckup(@PathVariable Long id, @RequestBody HealthCheckup checkup) {
        checkup.setCheckupId(id);
        HealthCheckup updatedCheckup = healthCheckupService.save(checkup);
        return ResponseEntity.ok(updatedCheckup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckup(@PathVariable Long id) {
        healthCheckupService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
