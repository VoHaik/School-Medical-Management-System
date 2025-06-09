package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.MedicalEvent;
import com.swp391_8.schoolhealth.service.MedicalEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-events")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MedicalEventController {

    @Autowired
    private MedicalEventService medicalEventService;

    @GetMapping("/student/{studentId}")
    @PreAuthorize("@securityService.isParentOfStudent(authentication, #studentId) or hasRole('SCHOOLNURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicalEvent>> getMedicalEventsForStudent(@PathVariable Integer studentId) {
        List<MedicalEvent> events = medicalEventService.getMedicalEventsByStudentId(studentId);
        return ResponseEntity.ok(events);
    }

    // Endpoints for School Nurse will be added here later

}
