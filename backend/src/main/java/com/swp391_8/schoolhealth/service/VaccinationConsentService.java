package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.*;
import com.swp391_8.schoolhealth.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VaccinationConsentService {

    private final VaccinationConsentRepository consentRepository;
    private final StudentVaccinationRecordRepository vaccinationRecordRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final HealthEventRepository healthEventRepository;
    private final GradeLevelRepository gradeLevelRepository;
    private final EntityManager entityManager;

    /**
     * Send vaccination consent requests to all students in target grade levels for a vaccination event
     */
    @Transactional
    public void sendVaccinationConsentRequests(HealthEvent healthEvent) {
        log.info("🚀 STARTING vaccination consent requests for event: {} (Type: {})", 
                 healthEvent.getEventName(), healthEvent.getEventType());
        
        log.info("🔥 NEW DEBUG VERSION - UPDATED CODE IS RUNNING! Event ID: {}", healthEvent.getEventId());
        
        // Only send for vaccination events
        if (healthEvent.getEventType() != HealthEvent.EventType.VACCINATION) {
            log.info("❌ Event is not a vaccination event, skipping consent requests");
            return;
        }

        // DEBUG: Log the event ID we're querying for
        log.info("🔍 Looking for grade levels for event ID: {}", healthEvent.getEventId());
        
        // DEBUG: Try direct native query first to see what's happening
        try {
            @SuppressWarnings("unchecked")
            List<Object[]> directQueryResult = entityManager.createNativeQuery(
                "SELECT gl.* FROM grade_levels gl " +
                "INNER JOIN health_event_grade_levels hegl ON gl.grade_id = hegl.grade_id " +
                "WHERE hegl.event_id = ?")
                .setParameter(1, healthEvent.getEventId())
                .getResultList();
            
            log.info("🔍 Direct native query returned {} rows for event ID {}", directQueryResult.size(), healthEvent.getEventId());
            
            for (Object[] row : directQueryResult) {
                log.info("🔍 Found grade via direct query: grade_id={}, grade_name={}", row[0], row[1]);
            }
        } catch (Exception e) {
            log.error("❌ Direct native query failed: {}", e.getMessage());
        }
        
        // Get grade levels directly from repository instead of entity relationship
        List<GradeLevel> targetGrades = gradeLevelRepository.findGradeLevelsByEventId(healthEvent.getEventId());
        
        log.info("📚 Repository method returned {} target grade levels", targetGrades.size());
        try {
            @SuppressWarnings("unchecked")
            List<Object[]> rawResults = entityManager
                .createNativeQuery("SELECT gl.grade_id, gl.grade_name FROM grade_levels gl " +
                                 "INNER JOIN health_event_grade_levels hegl ON gl.grade_id = hegl.grade_id " +
                                 "WHERE hegl.event_id = ?")
                .setParameter(1, healthEvent.getEventId())
                .getResultList();
            log.info("🔬 Direct native query returned {} results for event {}", rawResults.size(), healthEvent.getEventId());
            for (Object[] row : rawResults) {
                log.info("🔬 Raw result: grade_id={}, grade_name={}", row[0], row[1]);
            }
        } catch (Exception e) {
            log.error("❌ Direct native query failed: {}", e.getMessage());
        }
        
        log.info("📚 Event has {} target grade levels", targetGrades.size());
        
        // DEBUG: Log the actual grade levels
        for (GradeLevel gl : targetGrades) {
            log.info("📝 Target Grade: ID={}, Name={}", gl.getGradeId(), gl.getGradeName());
        }
        
        // DEBUG: If no grades found, try to check the database state
        if (targetGrades.isEmpty()) {
            log.error("❌ No grade levels found! This suggests a database transaction issue.");
            log.error("💡 The grade levels might not be committed yet when this service is called.");
            
            // Try to get from the entity relationship as a fallback
            try {
                healthEvent = healthEventRepository.findById(healthEvent.getEventId()).orElse(healthEvent);
                if (healthEvent.getTargetGradeLevels() != null && !healthEvent.getTargetGradeLevels().isEmpty()) {
                    targetGrades = new ArrayList<>(healthEvent.getTargetGradeLevels());
                    log.info("✅ Found {} grade levels from entity relationship as fallback", targetGrades.size());
                }
            } catch (Exception e) {
                log.error("❌ Failed to get grade levels from entity relationship: {}", e.getMessage());
            }
        }

        if (targetGrades.isEmpty()) {
            log.warn("⚠️ No target grade levels found for vaccination event: {}", healthEvent.getEventName());
            return;
        }

        // Get all students in target grade levels
        List<Integer> gradeLevelIds = targetGrades.stream()
                .map(GradeLevel::getGradeId)
                .toList();
                
        log.info("🔍 Looking for students in grade level IDs: {}", gradeLevelIds);
        
        List<Student> students = studentRepository.findStudentsByGradeLevelIds(gradeLevelIds);
        
        log.info("👥 Found {} students in target grade levels for vaccination event", students.size());
        
        // DEBUG: Log each student found
        for (Student student : students) {
            log.info("👤 Found student: {} - {} (Grade: {})", 
                    student.getStudentCode(), 
                    student.getFullName(),
                    student.getGradeLevel() != null ? student.getGradeLevel().getGradeName() : "No Grade");
        }

        int consentCreated = 0;
        for (Student student : students) {
            log.debug("🔄 Processing consent for student: {}", student.getStudentCode());
            
            // Check if consent already exists
            Optional<VaccinationConsent> existingConsent = consentRepository.findByHealthEventAndStudent(healthEvent, student);
            if (existingConsent.isEmpty()) {
                // Create new consent request
                VaccinationConsent consent = new VaccinationConsent();
                consent.setHealthEvent(healthEvent);
                consent.setStudent(student);
                consent.setConsentStatus(VaccinationConsent.ConsentStatus.PENDING);
                
                try {
                    VaccinationConsent savedConsent = consentRepository.save(consent);
                    consentCreated++;
                    log.info("✅ Created vaccination consent request (ID: {}) for student: {}", 
                            savedConsent.getConsentId(), student.getStudentCode());

                    // Send notification to parent
                    sendConsentNotificationToParent(consent);
                } catch (Exception e) {
                    log.error("❌ Failed to create consent for student {}: {}", student.getStudentCode(), e.getMessage());
                }
            } else {
                log.info("⏭️ Consent already exists for student: {} (Status: {})", 
                        student.getStudentCode(), existingConsent.get().getConsentStatus());
            }
        }
        
        log.info("🎯 COMPLETED: Created {} new vaccination consents out of {} students", consentCreated, students.size());
    }

    /**
     * Process parent's consent response
     */
    @Transactional
    public void processConsentResponse(Integer consentId, VaccinationConsent.ConsentStatus status, String parentNotes) {
        VaccinationConsent consent = consentRepository.findById(consentId)
            .orElseThrow(() -> new RuntimeException("Consent not found"));

        consent.setConsentStatus(status);
        consent.setParentNotes(parentNotes);
        consent.setConsentDate(LocalDateTime.now());
        
        consentRepository.save(consent);

        // Create vaccination record for both approved and rejected consents
        // This allows nurse to see all responses in vaccination management
        createVaccinationRecord(consent, status);

        // Send confirmation notification to parent
        sendConsentConfirmationToParent(consent);
    }

    /**
     * Create vaccination record when consent is responded to (approved or rejected)
     */
    @Transactional
    public void createVaccinationRecord(VaccinationConsent consent, VaccinationConsent.ConsentStatus consentStatus) {
        // Check if vaccination record already exists
        if (vaccinationRecordRepository.findByHealthEventAndStudent(
                consent.getHealthEvent(), consent.getStudent()).isEmpty()) {
            
            StudentVaccinationRecord record = new StudentVaccinationRecord();
            record.setHealthEvent(consent.getHealthEvent());
            record.setStudent(consent.getStudent());
            record.setScheduledDate(consent.getHealthEvent().getScheduledDate());
            record.setConsentReceivedDate(consent.getConsentDate());
            
            // Set vaccination status based on consent response
            if (consentStatus == VaccinationConsent.ConsentStatus.APPROVED) {
                record.setVaccinationStatus(StudentVaccinationRecord.VaccinationStatus.SCHEDULED);
            } else if (consentStatus == VaccinationConsent.ConsentStatus.REJECTED) {
                // Use MISSED since CONSENT_DECLINED is not allowed by database constraint
                record.setVaccinationStatus(StudentVaccinationRecord.VaccinationStatus.MISSED);
            }
            
            // Copy parent notes to vaccination record
            record.setNotes(consent.getParentNotes());
            
            vaccinationRecordRepository.save(record);
            
            log.info("Created vaccination record for student {} with status: {}", 
                    consent.getStudent().getFullName(), record.getVaccinationStatus());
        }
    }

    /**
     * Send consent request notification to parent
     */
    private void sendConsentNotificationToParent(VaccinationConsent consent) {
        // TODO: Implement notification sending when parent-student relationship is established
        System.out.println("Vaccination consent notification would be sent to parent for student: " + 
                          consent.getStudent().getFullName());
    }

    /**
     * Send consent confirmation to parent
     */
    private void sendConsentConfirmationToParent(VaccinationConsent consent) {
        // TODO: Implement notification sending when parent-student relationship is established
        System.out.println("Vaccination consent confirmation would be sent to parent for student: " + 
                          consent.getStudent().getFullName() + 
                          " with status: " + consent.getConsentStatus());
    }

    /**
     * Get consent statistics for an event
     */
    public ConsentStatistics getConsentStatistics(Integer eventId) {
        long pending = consentRepository.countByEventIdAndStatus(eventId, VaccinationConsent.ConsentStatus.PENDING);
        long approved = consentRepository.countByEventIdAndStatus(eventId, VaccinationConsent.ConsentStatus.APPROVED);
        long rejected = consentRepository.countByEventIdAndStatus(eventId, VaccinationConsent.ConsentStatus.REJECTED);
        
        return new ConsentStatistics(pending, approved, rejected);
    }

    /**
     * Send reminders for pending consents
     */
    @Transactional
    public void sendConsentReminders() {
        LocalDateTime reminderThreshold = LocalDateTime.now().minusDays(3); // 3 days ago
        List<VaccinationConsent> consentsNeedingReminder = consentRepository.findConsentsNeedingReminder(reminderThreshold);
        
        for (VaccinationConsent consent : consentsNeedingReminder) {
            if (consent.getReminderCount() < 3) { // Max 3 reminders
                sendConsentNotificationToParent(consent);
                consent.setReminderCount(consent.getReminderCount() + 1);
                consent.setLastReminderDate(LocalDateTime.now());
                consentRepository.save(consent);
            }
        }
    }

    // Inner class for statistics
    public static class ConsentStatistics {
        public final long pending;
        public final long approved;
        public final long rejected;
        public final long total;

        public ConsentStatistics(long pending, long approved, long rejected) {
            this.pending = pending;
            this.approved = approved;
            this.rejected = rejected;
            this.total = pending + approved + rejected;
        }
    }
}
