package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.VaccinationConsent;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class VaccinationConsentDetailDTO {
    private Integer consentId;
    private String studentCode;
    private String studentName;
    private Integer eventId;
    private String eventName;
    private String eventDescription;
    private List<String> vaccineNames; // List of vaccine names for this event
    private String vaccineName; // Primary vaccine name (for backward compatibility)
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
        
        // Get vaccine names from health_event_vaccines junction table
        if (consent.getHealthEvent().getHealthEventVaccines() != null && 
            !consent.getHealthEvent().getHealthEventVaccines().isEmpty()) {
            
            this.vaccineNames = consent.getHealthEvent().getHealthEventVaccines().stream()
                .map(hev -> hev.getVaccine().getName())
                .collect(Collectors.toList());
            
            // Set primary vaccine name (first vaccine for backward compatibility)
            this.vaccineName = this.vaccineNames.get(0);
        } else {
            // Fallback: Extract vaccine info from event name/description if no junction data
            this.vaccineNames = extractVaccineNamesFromEvent(consent.getHealthEvent());
            this.vaccineName = this.vaccineNames.isEmpty() ? "General Vaccination" : this.vaccineNames.get(0);
        }
        
        this.scheduledDate = consent.getHealthEvent().getScheduledDate();
        this.location = consent.getHealthEvent().getLocation();
        this.consentStatus = consent.getConsentStatus();
        this.parentNotes = consent.getParentNotes();
        this.consentDate = consent.getConsentDate();
        this.sentDate = consent.getSentDate();
        this.reminderCount = consent.getReminderCount();
        this.lastReminderDate = consent.getLastReminderDate();
    }
    
    /**
     * Create DTO from HealthEvent for displaying available vaccination events
     */
    public static VaccinationConsentDetailDTO fromHealthEvent(HealthEvent healthEvent) {
        VaccinationConsentDetailDTO dto = new VaccinationConsentDetailDTO();
        dto.eventId = healthEvent.getEventId();
        dto.eventName = healthEvent.getEventName();
        dto.eventDescription = healthEvent.getDescription();
        dto.scheduledDate = healthEvent.getScheduledDate();
        dto.location = healthEvent.getLocation();
        
        // Get vaccine names from health_event_vaccines junction table
        if (healthEvent.getHealthEventVaccines() != null && 
            !healthEvent.getHealthEventVaccines().isEmpty()) {
            
            dto.vaccineNames = healthEvent.getHealthEventVaccines().stream()
                .map(hev -> hev.getVaccine().getName())
                .collect(Collectors.toList());
            
            // Set primary vaccine name (first vaccine for backward compatibility)
            dto.vaccineName = dto.vaccineNames.get(0);
        } else {
            // Fallback: Extract vaccine info from event name/description if no junction data
            dto.vaccineNames = extractVaccineNamesFromEvent(healthEvent);
            dto.vaccineName = dto.vaccineNames.isEmpty() ? "General Vaccination" : dto.vaccineNames.get(0);
        }
        
        // Set consent status as null since this is for available events, not consents
        dto.consentStatus = null;
        dto.consentId = null;
        dto.studentCode = null;
        dto.studentName = null;
        dto.parentNotes = null;
        dto.consentDate = null;
        dto.sentDate = null;
        dto.reminderCount = null;
        dto.lastReminderDate = null;
        
        return dto;
    }
    
    /**
     * Fallback method to extract vaccine names from event name/description
     * when junction table data is not available
     */
    private static List<String> extractVaccineNamesFromEvent(HealthEvent healthEvent) {
        List<String> vaccineNames = new ArrayList<>();
        String eventName = healthEvent.getEventName().toLowerCase();
        String description = healthEvent.getDescription() != null ? healthEvent.getDescription().toLowerCase() : "";
        String combined = eventName + " " + description;
        
        // Common vaccine patterns
        if (combined.contains("bcg")) vaccineNames.add("BCG");
        if (combined.contains("dpt") || combined.contains("diphtheria")) vaccineNames.add("DPT");
        if (combined.contains("polio")) vaccineNames.add("Polio");
        if (combined.contains("measles") && !combined.contains("mmr")) vaccineNames.add("Measles");
        if (combined.contains("mmr")) vaccineNames.add("MMR");
        if (combined.contains("hepatitis b")) vaccineNames.add("Hepatitis B");
        if (combined.contains("japanese encephalitis")) vaccineNames.add("Japanese Encephalitis");
        if (combined.contains("influenza") || combined.contains("flu")) vaccineNames.add("Influenza");
        if (combined.contains("tetanus") && !combined.contains("dpt")) vaccineNames.add("Tetanus");
        if (combined.contains("varicella") || combined.contains("chickenpox")) vaccineNames.add("Varicella");
        
        return vaccineNames;
    }
}
