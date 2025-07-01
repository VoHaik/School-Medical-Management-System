package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.VaccinationConsent;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class VaccinationConsentDetailDTO {
    private Integer consentId;
    private String studentCode;
    private String studentName;
    private Integer eventId;
    private String eventName;
    private String eventDescription;
    private LocalDate scheduledDate;
    private String location;
    private VaccinationConsent.ConsentStatus consentStatus;
    private String parentNotes;
    private LocalDateTime consentDate;
    private LocalDateTime sentDate;
    private Integer reminderCount;
    private LocalDateTime lastReminderDate;

    public VaccinationConsentDetailDTO(VaccinationConsent consent) {
        this.consentId = consent.getConsentId();
        this.studentCode = consent.getStudent().getStudentCode();
        this.studentName = consent.getStudent().getFullName();
        this.eventId = consent.getHealthEvent().getEventId();
        this.eventName = consent.getHealthEvent().getEventName();
        this.eventDescription = consent.getHealthEvent().getDescription();
        this.scheduledDate = consent.getHealthEvent().getScheduledDate();
        this.location = consent.getHealthEvent().getLocation();
        this.consentStatus = consent.getConsentStatus();
        this.parentNotes = consent.getParentNotes();
        this.consentDate = consent.getConsentDate();
        this.sentDate = consent.getSentDate();
        this.reminderCount = consent.getReminderCount();
        this.lastReminderDate = consent.getLastReminderDate();
    }
}
