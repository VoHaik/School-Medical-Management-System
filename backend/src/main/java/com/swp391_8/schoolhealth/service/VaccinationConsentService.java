package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.*;
import com.swp391_8.schoolhealth.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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

    /**
     * Send vaccination consent requests to all students in target grade levels for a vaccination event
     */
    @Transactional
    public void sendVaccinationConsentRequests(HealthEvent healthEvent) {
        log.info("Processing vaccination consent requests for event: {} (Type: {})", 
                 healthEvent.getEventName(), healthEvent.getEventType());
        
        // Only send for vaccination events
        if (healthEvent.getEventType() != HealthEvent.EventType.VACCINATION) {
            log.info("Event is not a vaccination event, skipping consent requests");
            return;
        }

        // Fetch the event with grade levels to ensure they are loaded
        HealthEvent eventWithGradeLevels = healthEventRepository.findByIdWithGradeLevels(healthEvent.getEventId())
            .orElse(healthEvent);
        
        log.info("Event has {} target grade levels", 
                 eventWithGradeLevels.getTargetGradeLevels() != null ? eventWithGradeLevels.getTargetGradeLevels().size() : 0);

        if (eventWithGradeLevels.getTargetGradeLevels() == null || eventWithGradeLevels.getTargetGradeLevels().isEmpty()) {
            log.warn("No target grade levels found for vaccination event: {}", healthEvent.getEventName());
            return;
        }

        // Get all students in target grade levels
        List<Integer> gradeLevelIds = eventWithGradeLevels.getTargetGradeLevels().stream()
                .map(GradeLevel::getGradeId)
                .toList();
                
        log.info("Looking for students in grade level IDs: {}", gradeLevelIds);
        
        List<Student> students = studentRepository.findStudentsByGradeLevelIds(gradeLevelIds);
        
        log.info("Found {} students in target grade levels for vaccination event", students.size());

        for (Student student : students) {
            log.debug("Processing consent for student: {}", student.getStudentCode());
            
            // Check if consent already exists
            if (consentRepository.findByHealthEventAndStudent(healthEvent, student).isEmpty()) {
                // Create new consent request
                VaccinationConsent consent = new VaccinationConsent();
                consent.setHealthEvent(healthEvent);
                consent.setStudent(student);
                consent.setConsentStatus(VaccinationConsent.ConsentStatus.PENDING);
                
                consentRepository.save(consent);
                log.info("Created vaccination consent request for student: {}", student.getStudentCode());

                // Send notification to parent
                sendConsentNotificationToParent(consent);
            }
        }
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

        // If approved, create vaccination record
        if (status == VaccinationConsent.ConsentStatus.APPROVED) {
            createVaccinationRecord(consent);
        }

        // Send confirmation notification to parent
        sendConsentConfirmationToParent(consent);
    }

    /**
     * Create vaccination record when consent is approved
     */
    @Transactional
    public void createVaccinationRecord(VaccinationConsent consent) {
        // Check if vaccination record already exists
        if (vaccinationRecordRepository.findByHealthEventAndStudent(
                consent.getHealthEvent(), consent.getStudent()).isEmpty()) {
            
            StudentVaccinationRecord record = new StudentVaccinationRecord();
            record.setHealthEvent(consent.getHealthEvent());
            record.setStudent(consent.getStudent());
            record.setVaccinationStatus(StudentVaccinationRecord.VaccinationStatus.SCHEDULED);
            record.setScheduledDate(consent.getHealthEvent().getScheduledDate());
            record.setConsentReceivedDate(consent.getConsentDate());
            
            vaccinationRecordRepository.save(record);
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
