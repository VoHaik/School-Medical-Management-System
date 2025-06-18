package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.MedicalEvent.EventType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MedicalEventDTO {
    private Integer id;
    private String studentCode; // Changed from studentId
    private String eventType; // Changed to String to match entity
    private String description;
    private LocalDateTime eventDatetime; // Changed from eventDate to eventDatetime to match entity
    private String handledByUsername; // Username of the User who handled the event
    private List<String> symptoms; // Assuming symptoms are stored as a list of strings
    private String severity;
    private String actionTaken;
    private String medicationGiven;
    private Boolean parentNotified;
    private String referredTo;
    private Boolean followUpRequired;
    private LocalDateTime followUpDate;
    private String status; // e.g., active, resolved, follow_up

    // Additional method to convert string to enum for convenience
    public EventType getEventTypeEnum() {
        if (eventType == null) return null;
        try {
            return EventType.valueOf(eventType);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
    
    // Setter for convenience when working with enum
    public void setEventTypeEnum(EventType eventTypeEnum) {
        if (eventTypeEnum != null) {
            this.eventType = eventTypeEnum.name();
        }
    }

    // Compatibility method for older code
    public LocalDateTime getEventDate() {
        return eventDatetime;
    }
    
    public void setEventDate(LocalDateTime date) {
        this.eventDatetime = date;
    }
}
