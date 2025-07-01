package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.model.StudentVaccinationRecord;
import com.swp391_8.schoolhealth.model.VaccinationConsent;
import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.GradeLevel;
import com.swp391_8.schoolhealth.repository.StudentVaccinationRecordRepository;
import com.swp391_8.schoolhealth.repository.VaccinationConsentRepository;
import com.swp391_8.schoolhealth.repository.HealthEventRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.GradeLevelRepository;
import com.swp391_8.schoolhealth.service.VaccinationConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/vaccination-management")
@RequiredArgsConstructor
public class VaccinationManagementController {

    private final StudentVaccinationRecordRepository vaccinationRecordRepository;
    private final VaccinationConsentRepository consentRepository;
    private final VaccinationConsentService consentService;
    private final HealthEventRepository healthEventRepository;
    private final StudentRepository studentRepository;
    private final GradeLevelRepository gradeLevelRepository;

    /**
     * Get all students scheduled for vaccination for a specific event
     */
    @GetMapping("/event/{eventId}/students")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<StudentVaccinationRecord>> getStudentsForVaccinationEvent(@PathVariable Integer eventId) {
        List<StudentVaccinationRecord> records = vaccinationRecordRepository.findByEventId(eventId);
        return ResponseEntity.ok(records);
    }

    /**
     * Get vaccination records by status for an event
     */
    @GetMapping("/event/{eventId}/status/{status}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<StudentVaccinationRecord>> getVaccinationRecordsByStatus(
            @PathVariable Integer eventId, 
            @PathVariable String status) {
        try {
            StudentVaccinationRecord.VaccinationStatus vaccinationStatus = 
                StudentVaccinationRecord.VaccinationStatus.valueOf(status.toUpperCase());
            
            List<StudentVaccinationRecord> records = vaccinationRecordRepository.findByEventId(eventId)
                .stream()
                .filter(record -> record.getVaccinationStatus() == vaccinationStatus)
                .toList();
            
            return ResponseEntity.ok(records);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update vaccination record (mark as completed, add notes, etc.)
     */
    @PutMapping("/record/{recordId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<MessageResponse> updateVaccinationRecord(
            @PathVariable Integer recordId,
            @RequestBody Map<String, Object> updateData) {
        
        StudentVaccinationRecord record = vaccinationRecordRepository.findById(recordId)
            .orElse(null);
        
        if (record == null) {
            return ResponseEntity.notFound().build();
        }

        // Update vaccination status
        if (updateData.containsKey("vaccinationStatus")) {
            try {
                StudentVaccinationRecord.VaccinationStatus status = 
                    StudentVaccinationRecord.VaccinationStatus.valueOf(
                        updateData.get("vaccinationStatus").toString().toUpperCase());
                record.setVaccinationStatus(status);
                
                if (status == StudentVaccinationRecord.VaccinationStatus.COMPLETED) {
                    record.setVaccinationDate(LocalDate.now());
                }
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid vaccination status", false));
            }
        }

        // Update other fields
        if (updateData.containsKey("vaccineName")) {
            record.setVaccineName(updateData.get("vaccineName").toString());
        }
        if (updateData.containsKey("vaccineBatch")) {
            record.setVaccineBatch(updateData.get("vaccineBatch").toString());
        }
        if (updateData.containsKey("vaccineManufacturer")) {
            record.setVaccineManufacturer(updateData.get("vaccineManufacturer").toString());
        }
        if (updateData.containsKey("administeredBy")) {
            record.setAdministeredBy(updateData.get("administeredBy").toString());
        }
        if (updateData.containsKey("administrationSite")) {
            record.setAdministrationSite(updateData.get("administrationSite").toString());
        }
        if (updateData.containsKey("adverseReactions")) {
            record.setAdverseReactions(updateData.get("adverseReactions").toString());
        }
        if (updateData.containsKey("notes")) {
            record.setNotes(updateData.get("notes").toString());
        }
        if (updateData.containsKey("vaccinationDate") && updateData.get("vaccinationDate") != null) {
            try {
                String dateString = updateData.get("vaccinationDate").toString();
                LocalDate vaccinationDate;
                
                // Try to parse as ISO date-time string first (e.g., "2025-06-17T17:00:00.000Z")
                if (dateString.contains("T")) {
                    vaccinationDate = OffsetDateTime.parse(dateString).toLocalDate();
                } else {
                    // Parse as simple date string (e.g., "2025-06-17")
                    vaccinationDate = LocalDate.parse(dateString);
                }
                
                record.setVaccinationDate(vaccinationDate);
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid date format: " + updateData.get("vaccinationDate"), false));
            }
        }

        vaccinationRecordRepository.save(record);
        
        return ResponseEntity.ok(new MessageResponse("Vaccination record updated successfully", true));
    }

    /**
     * Get scheduled vaccinations for a specific date
     */
    @GetMapping("/scheduled/{date}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<StudentVaccinationRecord>> getScheduledVaccinations(@PathVariable String date) {
        try {
            LocalDate scheduledDate = LocalDate.parse(date);
            List<StudentVaccinationRecord> records = vaccinationRecordRepository.findScheduledVaccinationsForDate(scheduledDate);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get consent statistics for an event
     */
    @GetMapping("/event/{eventId}/consent-statistics")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<VaccinationConsentService.ConsentStatistics> getConsentStatistics(@PathVariable Integer eventId) {
        VaccinationConsentService.ConsentStatistics stats = consentService.getConsentStatistics(eventId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get consent requests for an event
     */
    @GetMapping("/event/{eventId}/consents")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<VaccinationConsent>> getConsentRequestsForEvent(@PathVariable Integer eventId) {
        List<VaccinationConsent> consents = consentRepository.findPendingConsentsByEventId(eventId);
        return ResponseEntity.ok(consents);
    }

    /**
     * Get vaccination history for a student
     */
    @GetMapping("/student/{studentCode}/history")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('Parent')")
    public ResponseEntity<List<StudentVaccinationRecord>> getStudentVaccinationHistory(@PathVariable String studentCode) {
        List<StudentVaccinationRecord> history = vaccinationRecordRepository.findVaccinationHistoryByStudentCode(studentCode);
        return ResponseEntity.ok(history);
    }

    /**
     * Get overdue vaccinations
     */
    @GetMapping("/overdue")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<StudentVaccinationRecord>> getOverdueVaccinations() {
        List<StudentVaccinationRecord> overdueRecords = vaccinationRecordRepository.findOverdueVaccinations(LocalDate.now());
        return ResponseEntity.ok(overdueRecords);
    }

    /**
     * Debug endpoint to check vaccination data
     */
    @GetMapping("/debug/vaccination-data")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Map<String, Object>> debugVaccinationData() {
        Map<String, Object> debugInfo = new HashMap<>();
        
        // Get all vaccination events
        List<HealthEvent> vaccinationEvents = healthEventRepository.findByEventType(HealthEvent.EventType.VACCINATION);
        debugInfo.put("vaccinationEventsCount", vaccinationEvents.size());
        debugInfo.put("vaccinationEvents", vaccinationEvents.stream()
            .map(event -> Map.of(
                "eventId", event.getEventId(),
                "eventName", event.getEventName(),
                "scheduledDate", event.getScheduledDate(),
                "gradeLevelsCount", event.getTargetGradeLevels() != null ? event.getTargetGradeLevels().size() : 0
            )).toList());
        
        // Get total students count
        long totalStudents = studentRepository.count();
        debugInfo.put("totalStudentsCount", totalStudents);
        
        // Get students sample with grade levels
        List<Student> sampleStudents = studentRepository.findAll().stream().limit(5).toList();
        debugInfo.put("sampleStudents", sampleStudents.stream()
            .map(student -> Map.of(
                "studentCode", student.getStudentCode(),
                "fullName", student.getFullName(),
                "gradeLevel", student.getGradeLevel() != null ? student.getGradeLevel().getGradeName() : "No Grade Level"
            )).toList());
        
        // Get vaccination consents count
        long totalConsents = consentRepository.count();
        debugInfo.put("vaccinationConsentsCount", totalConsents);
        
        // Get all vaccination consents
        List<VaccinationConsent> allConsents = consentRepository.findAll();
        debugInfo.put("allConsents", allConsents.stream()
            .map(consent -> Map.of(
                "consentId", consent.getConsentId(),
                "eventId", consent.getHealthEvent() != null ? consent.getHealthEvent().getEventId() : "No Event",
                "studentCode", consent.getStudent() != null ? consent.getStudent().getStudentCode() : "No Student",
                "status", consent.getConsentStatus().toString()
            )).toList());
        
        return ResponseEntity.ok(debugInfo);
    }

    /**
     * Debug endpoint to manually trigger vaccination consent creation for an event
     */
    @PostMapping("/debug/trigger-consent/{eventId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Map<String, Object>> triggerVaccinationConsent(@PathVariable Integer eventId) {
        try {
            HealthEvent event = healthEventRepository.findByIdWithGradeLevels(eventId)
                .orElse(null);
            
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            
            consentService.sendVaccinationConsentRequests(event);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Vaccination consent requests triggered for event: " + event.getEventName());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * Debug endpoint to manually trigger vaccination consent creation for existing events
     */
    @PostMapping("/debug/trigger-consents/{eventId}")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Map<String, Object>> triggerVaccinationConsents(@PathVariable Integer eventId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            HealthEvent event = healthEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
            
            if (event.getEventType() != HealthEvent.EventType.VACCINATION) {
                result.put("error", "Event is not a vaccination event");
                return ResponseEntity.badRequest().body(result);
            }
            
            // Manually trigger consent creation
            consentService.sendVaccinationConsentRequests(event);
            
            result.put("success", true);
            result.put("message", "Vaccination consents triggered for event: " + event.getEventName());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * Manually send vaccination consent requests for a vaccination event
     */
    @PostMapping("/event/{eventId}/send-consents")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<MessageResponse> sendVaccinationConsents(@PathVariable Integer eventId) {
        try {
            HealthEvent healthEvent = healthEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Health Event not found"));
            
            if (healthEvent.getEventType() != HealthEvent.EventType.VACCINATION) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Event is not a vaccination event", false));
            }
            
            consentService.sendVaccinationConsentRequests(healthEvent);
            
            return ResponseEntity.ok(new MessageResponse("Vaccination consent requests sent successfully", true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Failed to send consent requests: " + e.getMessage(), false));
        }
    }

    /**
     * Debug endpoint to check why no vaccination consents are created
     */
    @GetMapping("/debug/student-grade-vaccination-data")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin') or hasAuthority('Parent')")
    public ResponseEntity<Map<String, Object>> debugStudentGradeVaccinationData() {
        Map<String, Object> debugInfo = new HashMap<>();
        
        // Check student STU001 and their grade level
        Student student = studentRepository.findByStudentCode("STU001").orElse(null);
        if (student != null) {
            debugInfo.put("student", Map.of(
                "studentCode", student.getStudentCode(),
                "fullName", student.getFullName(),
                "gradeLevel", student.getGradeLevel() != null ? student.getGradeLevel().getGradeName() : "No Grade Level",
                "gradeLevelId", student.getGradeLevel() != null ? student.getGradeLevel().getGradeId() : "No Grade Level ID"
            ));
        } else {
            debugInfo.put("student", "STU001 not found");
        }
        
        // Check vaccination events and their target grade levels
        List<HealthEvent> vaccinationEvents = healthEventRepository.findByEventType(HealthEvent.EventType.VACCINATION);
        debugInfo.put("vaccinationEventsCount", vaccinationEvents.size());
        debugInfo.put("vaccinationEvents", vaccinationEvents.stream()
            .map(event -> {
                // Fetch grade levels manually using repository method
                List<GradeLevel> gradeLevels = gradeLevelRepository.findGradeLevelsByEventId(event.getEventId());
                List<String> gradeNames = gradeLevels.stream()
                    .map(GradeLevel::getGradeName)
                    .toList();
                return Map.of(
                    "eventId", event.getEventId(),
                    "eventName", event.getEventName(),
                    "targetGradeNames", gradeNames
                );
            }).toList());
        
        // Check if there are any vaccination consents
        long totalConsents = consentRepository.count();
        debugInfo.put("totalVaccinationConsents", totalConsents);
        
        return ResponseEntity.ok(debugInfo);
    }

    /**
     * Get all vaccination records for vaccination management
     */
    @GetMapping("/records")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<List<Map<String, Object>>> getAllVaccinationRecords() {
        List<StudentVaccinationRecord> records = vaccinationRecordRepository.findAllWithDetails();
        
        // Transform records to include consent status
        List<Map<String, Object>> recordsWithConsent = records.stream()
            .map(record -> {
                Map<String, Object> recordMap = new HashMap<>();
                
                // Basic record information
                recordMap.put("vaccinationRecordId", record.getVaccinationRecordId());
                recordMap.put("vaccinationStatus", record.getVaccinationStatus().toString());
                recordMap.put("scheduledDate", record.getScheduledDate());
                recordMap.put("vaccinationDate", record.getVaccinationDate());
                recordMap.put("vaccineName", record.getVaccineName());
                recordMap.put("vaccineBatch", record.getVaccineBatch());
                recordMap.put("vaccineManufacturer", record.getVaccineManufacturer());
                recordMap.put("administeredBy", record.getAdministeredBy());
                recordMap.put("administrationSite", record.getAdministrationSite());
                recordMap.put("adverseReactions", record.getAdverseReactions());
                recordMap.put("notes", record.getNotes());
                recordMap.put("consentReceivedDate", record.getConsentReceivedDate());
                
                // Student information
                if (record.getStudent() != null) {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("studentCode", record.getStudent().getStudentCode());
                    studentMap.put("fullName", record.getStudent().getFullName());
                    
                    if (record.getStudent().getGradeLevel() != null) {
                        Map<String, Object> gradeLevelMap = new HashMap<>();
                        gradeLevelMap.put("gradeName", record.getStudent().getGradeLevel().getGradeName());
                        studentMap.put("gradeLevel", gradeLevelMap);
                    }
                    recordMap.put("student", studentMap);
                }
                
                // Health event information
                if (record.getHealthEvent() != null) {
                    Map<String, Object> eventMap = new HashMap<>();
                    eventMap.put("eventId", record.getHealthEvent().getEventId());
                    eventMap.put("eventName", record.getHealthEvent().getEventName());
                    eventMap.put("eventType", record.getHealthEvent().getEventType().toString());
                    eventMap.put("description", record.getHealthEvent().getDescription());
                    recordMap.put("healthEvent", eventMap);
                    
                    // Get consent status for this student and event
                    if (record.getStudent() != null) {
                        VaccinationConsent consent = consentRepository
                            .findByHealthEventAndStudent(record.getHealthEvent(), record.getStudent())
                            .orElse(null);
                        
                        if (consent != null) {
                            recordMap.put("consentStatus", consent.getConsentStatus().toString());
                            recordMap.put("consentDate", consent.getConsentDate());
                        } else {
                            recordMap.put("consentStatus", "PENDING");
                            recordMap.put("consentDate", null);
                        }
                    }
                } else {
                    recordMap.put("consentStatus", "PENDING");
                    recordMap.put("consentDate", null);
                }
                
                return recordMap;
            })
            .toList();
        
        return ResponseEntity.ok(recordsWithConsent);
    }

    /**
     * Get vaccination statistics for dashboard
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('SchoolNurse') or hasAuthority('Admin')")
    public ResponseEntity<Map<String, Object>> getVaccinationStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count total vaccination records
        long totalRecords = vaccinationRecordRepository.count();
        stats.put("totalVaccinations", totalRecords);
        
        // Count by status
        long scheduledCount = vaccinationRecordRepository.countByVaccinationStatus(
            StudentVaccinationRecord.VaccinationStatus.SCHEDULED);
        long completedCount = vaccinationRecordRepository.countByVaccinationStatus(
            StudentVaccinationRecord.VaccinationStatus.COMPLETED);
        long missedCount = vaccinationRecordRepository.countByVaccinationStatus(
            StudentVaccinationRecord.VaccinationStatus.MISSED);
        
        stats.put("scheduledCount", scheduledCount);
        stats.put("completedCount", completedCount);
        stats.put("missedCount", missedCount);
        
        // Calculate vaccination completion rate (completed / total records)
        double vaccinationRate = totalRecords > 0 ? 
            (double) completedCount / totalRecords * 100 : 0;
        stats.put("vaccinationRate", Math.round(vaccinationRate));
        
        // Count active vaccination events
        long activeEvents = healthEventRepository.countByEventTypeAndStatus(
            HealthEvent.EventType.VACCINATION, HealthEvent.Status.SCHEDULED);
        stats.put("activeCampaigns", activeEvents);
        
        // Count total students in system
        long totalStudents = studentRepository.count();
        stats.put("totalStudents", totalStudents);
        
        // Count students with vaccination records
        long studentsWithVaccinations = vaccinationRecordRepository.countDistinctStudents();
        stats.put("studentsWithVaccinations", studentsWithVaccinations);
        
        // Calculate student vaccination coverage (students with records / total students)
        double studentCoverage = totalStudents > 0 ? 
            (double) studentsWithVaccinations / totalStudents * 100 : 0;
        stats.put("studentCoverage", Math.round(studentCoverage));
        
        return ResponseEntity.ok(stats);
    }
}
