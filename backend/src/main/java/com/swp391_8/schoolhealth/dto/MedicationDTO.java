package com.swp391_8.schoolhealth.dto;

import java.util.Date;

public class MedicationDTO {
    private Integer medicationId;
    private String medicationName;
    private String dosage;
    private String frequency;
    private Date startDate;
    private Date endDate;
    private String reason;
    private String notes;
    private String instructions;

    // Default constructor
    public MedicationDTO() {
    }

    // Parameterized constructor
    public MedicationDTO(Integer medicationId, String medicationName, String dosage, String frequency, 
                         Date startDate, Date endDate, String reason, String notes, String instructions) {
        this.medicationId = medicationId;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.notes = notes;
        this.instructions = instructions;
    }    // Getters and setters
    public Integer getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(Integer medicationId) {
        this.medicationId = medicationId;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getName() {
        return medicationName; // For backwards compatibility
    }

    public void setName(String name) {
        this.medicationName = name; // For backwards compatibility
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }
    
    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
