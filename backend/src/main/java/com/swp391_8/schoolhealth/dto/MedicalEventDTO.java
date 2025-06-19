package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.MedicalEvent.EventType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MedicalEventDTO {
    private Integer id;
    private String studentCode; // Changed from studentId
    private EventType eventType;
    private String description;
    private LocalDateTime eventDate;
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

    // Constructors, getters, and setters are handled by Lombok @Data
}
