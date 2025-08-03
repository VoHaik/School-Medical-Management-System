package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.HealthCheckup;
import com.swp391_8.schoolhealth.service.HealthCheckupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/health-checkup-records")
@Tag(name = "Health Checkups", description = "Health checkup record management for tracking student health examinations")
@SecurityRequirement(name = "Bearer Authentication")
public class HealthCheckupRecordsController {
    @Autowired
    private HealthCheckupService healthCheckupService;

    @Operation(
        summary = "Get All Health Checkups",
        description = "Retrieve all health checkup records in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Health checkups retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = HealthCheckup.class))
            )
        )
    })
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
