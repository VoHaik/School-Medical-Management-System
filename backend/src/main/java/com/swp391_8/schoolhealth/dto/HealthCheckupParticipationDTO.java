package com.swp391_8.schoolhealth.dto;

import java.time.LocalDateTime;

public class HealthCheckupParticipationDTO {
    private Long id;
    private Long eventId;
    private String eventName;
    private String eventType;
    private String checkupType;
    private String studentCode;
    private String studentName;
    private String className;
    private String participationStatus;
    private LocalDateTime scheduledTime;
    private LocalDateTime completedTime;
    private String notes;
    private String location;
    private String provider;
    
    // Checkup result details
    private Long checkupResultId;
    private Double height;
    private Double weight;
    private Double bmi;
    private String visionLeft;
    private String visionRight;
    private String hearingLeft;
    private String hearingRight;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer heartRate;
    private Double temperature;
    private String checkupNotes;
    private String checkupStatus;

    // Constructors
    public HealthCheckupParticipationDTO() {}

    public HealthCheckupParticipationDTO(Long id, Long eventId, String eventName, String studentCode, 
                                       String studentName, String participationStatus, LocalDateTime scheduledTime) {
        this.id = id;
        this.eventId = eventId;
        this.eventName = eventName;
        this.studentCode = studentCode;
        this.studentName = studentName;
        this.participationStatus = participationStatus;
        this.scheduledTime = scheduledTime;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getCheckupType() { return checkupType; }
    public void setCheckupType(String checkupType) { this.checkupType = checkupType; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getParticipationStatus() { return participationStatus; }
    public void setParticipationStatus(String participationStatus) { this.participationStatus = participationStatus; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public LocalDateTime getCompletedTime() { return completedTime; }
    public void setCompletedTime(LocalDateTime completedTime) { this.completedTime = completedTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Long getCheckupResultId() { return checkupResultId; }
    public void setCheckupResultId(Long checkupResultId) { this.checkupResultId = checkupResultId; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public String getVisionLeft() { return visionLeft; }
    public void setVisionLeft(String visionLeft) { this.visionLeft = visionLeft; }

    public String getVisionRight() { return visionRight; }
    public void setVisionRight(String visionRight) { this.visionRight = visionRight; }

    public String getHearingLeft() { return hearingLeft; }
    public void setHearingLeft(String hearingLeft) { this.hearingLeft = hearingLeft; }

    public String getHearingRight() { return hearingRight; }
    public void setHearingRight(String hearingRight) { this.hearingRight = hearingRight; }

    public Integer getBloodPressureSystolic() { return bloodPressureSystolic; }
    public void setBloodPressureSystolic(Integer bloodPressureSystolic) { this.bloodPressureSystolic = bloodPressureSystolic; }

    public Integer getBloodPressureDiastolic() { return bloodPressureDiastolic; }
    public void setBloodPressureDiastolic(Integer bloodPressureDiastolic) { this.bloodPressureDiastolic = bloodPressureDiastolic; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getCheckupNotes() { return checkupNotes; }
    public void setCheckupNotes(String checkupNotes) { this.checkupNotes = checkupNotes; }

    public String getCheckupStatus() { return checkupStatus; }
    public void setCheckupStatus(String checkupStatus) { this.checkupStatus = checkupStatus; }
}
