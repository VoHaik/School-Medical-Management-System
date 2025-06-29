package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.GradeLevelDTO;
import com.swp391_8.schoolhealth.service.GradeLevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/grade-levels")
@RequiredArgsConstructor
public class GradeLevelController {

    private final GradeLevelService gradeLevelService;

    @GetMapping
    public ResponseEntity<List<GradeLevelDTO>> getAllActiveGradeLevels() {
        List<GradeLevelDTO> gradeLevels = gradeLevelService.getAllActiveGradeLevels();
        return ResponseEntity.ok(gradeLevels);
    }

    @GetMapping("/for-selection")
    public ResponseEntity<List<GradeLevelDTO>> getGradeLevelsForSelection() {
        List<GradeLevelDTO> gradeLevels = gradeLevelService.getAllActiveGradeLevels();
        return ResponseEntity.ok(gradeLevels);
    }

    @GetMapping("/{gradeId}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<GradeLevelDTO> getGradeLevelById(@PathVariable Integer gradeId) {
        GradeLevelDTO gradeLevel = gradeLevelService.getGradeLevelById(gradeId);
        return ResponseEntity.ok(gradeLevel);
    }

    @GetMapping("/number/{gradeNumber}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN', 'PARENT', 'STUDENT')")
    public ResponseEntity<GradeLevelDTO> getGradeLevelByNumber(@PathVariable Integer gradeNumber) {
        GradeLevelDTO gradeLevel = gradeLevelService.getGradeLevelByNumber(gradeNumber);
        return ResponseEntity.ok(gradeLevel);
    }

    @GetMapping("/range")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<GradeLevelDTO>> getGradeLevelsByRange(
            @RequestParam Integer minGrade,
            @RequestParam Integer maxGrade) {
        List<GradeLevelDTO> gradeLevels = gradeLevelService.getGradeLevelsByRange(minGrade, maxGrade);
        return ResponseEntity.ok(gradeLevels);
    }

    @GetMapping("/age/{age}")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN')")
    public ResponseEntity<List<GradeLevelDTO>> getGradeLevelsByAge(@PathVariable Integer age) {
        List<GradeLevelDTO> gradeLevels = gradeLevelService.getGradeLevelsByAge(age);
        return ResponseEntity.ok(gradeLevels);
    }

    @GetMapping("/display-options")
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN', 'PARENT', 'STUDENT')")
    public ResponseEntity<List<String>> getGradeDisplayOptions() {
        List<String> options = gradeLevelService.getGradeDisplayOptions();
        return ResponseEntity.ok(options);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<GradeLevelDTO> createGradeLevel(@Valid @RequestBody GradeLevelDTO gradeLevelDTO) {
        GradeLevelDTO createdGradeLevel = gradeLevelService.createGradeLevel(gradeLevelDTO);
        return ResponseEntity.ok(createdGradeLevel);
    }

    @PutMapping("/{gradeId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<GradeLevelDTO> updateGradeLevel(
            @PathVariable Integer gradeId,
            @Valid @RequestBody GradeLevelDTO gradeLevelDTO) {
        GradeLevelDTO updatedGradeLevel = gradeLevelService.updateGradeLevel(gradeId, gradeLevelDTO);
        return ResponseEntity.ok(updatedGradeLevel);
    }

    @DeleteMapping("/{gradeId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteGradeLevel(@PathVariable Integer gradeId) {
        gradeLevelService.deleteGradeLevel(gradeId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/initialize")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> initializeStandardGradeLevels() {
        gradeLevelService.initializeStandardGradeLevels();
        return ResponseEntity.ok("Standard grade levels (1-12) initialized successfully");
    }
}
