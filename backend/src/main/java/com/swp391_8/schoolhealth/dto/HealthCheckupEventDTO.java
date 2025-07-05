package com.swp391_8.schoolhealth.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HealthCheckupEventDTO {
    private Long eventId;
    private String eventName;
    private String eventType;
    private String description;
    private String location;
    private LocalDateTime scheduledDate;
    private LocalDateTime endDate;
    private String status;
    private String checkupType;
    private String provider;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdByUserId;
    private List<String> targetGrades;
    private int totalStudents;
    private int completedStudents;
    private int scheduledStudents;
    private List<HealthCheckupEventTypeDTO> checkupTypes;

    // Constructors
    public HealthCheckupEventDTO() {}

    public HealthCheckupEventDTO(Long eventId, String eventName, String description, String location,
                                LocalDateTime scheduledDate, LocalDateTime endDate, String status,
                                String checkupType, String provider) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.description = description;
        this.location = location;
        this.scheduledDate = scheduledDate;
        this.endDate = endDate;
        this.status = status;
        this.checkupType = checkupType;
        this.provider = provider;
    }

    // Getters and Setters
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCheckupType() { return checkupType; }
    public void setCheckupType(String checkupType) { this.checkupType = checkupType; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }

    public List<String> getTargetGrades() { return targetGrades; }
    public void setTargetGrades(List<String> targetGrades) { this.targetGrades = targetGrades; }

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }

    public int getCompletedStudents() { return completedStudents; }
    public void setCompletedStudents(int completedStudents) { this.completedStudents = completedStudents; }

    public int getScheduledStudents() { return scheduledStudents; }
    public void setScheduledStudents(int scheduledStudents) { this.scheduledStudents = scheduledStudents; }

    public List<HealthCheckupEventTypeDTO> getCheckupTypes() { return checkupTypes; }
    public void setCheckupTypes(List<HealthCheckupEventTypeDTO> checkupTypes) { this.checkupTypes = checkupTypes; }
}
