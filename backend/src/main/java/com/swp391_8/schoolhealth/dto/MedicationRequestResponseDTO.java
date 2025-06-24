package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.model.MedicationRequest; // For status enum
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicationRequestResponseDTO {
    private Integer requestId;
    private String studentCode;
    private String studentName; // For easier display
    private String parentName; // Name of the user who requested (parent)
    private String medicationName;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String notes; // Parent's notes for the request
    private String status;
    private LocalDateTime requestDate;
    private String approvedByName; // Name of the user who approved (nurse)
    private LocalDateTime approvalDate;
    private String administeredByName; // Name of the user who administered (nurse)
    private LocalDateTime administeredAt;
    private String administrationNotes; // Nurse's notes during administration
    
    // New fields for clearly identifying students and parents
    private String studentFullName; // Student's full name without any prefixes
    private String parentFullName; // Parent's full name without any prefixes
    private String requestedByName; // Alias for parentName to maintain consistency

    public MedicationRequestResponseDTO() {
    }

    // Constructor to map from MedicationRequest entity (implementation will be in the service)
    public MedicationRequestResponseDTO(
            Integer requestId, String studentCode, String studentName, String parentName,
            String medicationName, String dosage, String frequency,
            LocalDate startDate, LocalDate endDate, String reason, String notes,
            String status, LocalDateTime requestDate,
            String approvedByName, LocalDateTime approvalDate,
            String administeredByName, LocalDateTime administeredAt, String administrationNotes) {
        this.requestId = requestId;
        this.studentCode = studentCode;
        this.studentName = studentName;
        this.parentName = parentName;
        this.requestedByName = parentName; // Alias for backward compatibility
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.notes = notes;
        this.status = status;
        this.requestDate = requestDate;
        this.approvedByName = approvedByName;
        this.approvalDate = approvalDate;
        this.administeredByName = administeredByName;
        this.administeredAt = administeredAt;
        this.administrationNotes = administrationNotes;
        
        // Default these to the same values to maintain backward compatibility
        this.studentFullName = studentName;
        this.parentFullName = parentName;
    }

    // Getters and Setters for all fields

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public String getApprovedByName() {
        return approvedByName;
    }

    public void setApprovedByName(String approvedByName) {
        this.approvedByName = approvedByName;
    }

    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }

    public String getAdministeredByName() {
        return administeredByName;
    }

    public void setAdministeredByName(String administeredByName) {
        this.administeredByName = administeredByName;
    }

    public LocalDateTime getAdministeredAt() {
        return administeredAt;
    }

    public void setAdministeredAt(LocalDateTime administeredAt) {
        this.administeredAt = administeredAt;
    }

    public String getAdministrationNotes() {
        return administrationNotes;
    }

    public void setAdministrationNotes(String administrationNotes) {
        this.administrationNotes = administrationNotes;
    }

    // Add getters and setters for new fields
    
    public String getStudentFullName() {
        return studentFullName;
    }

    public void setStudentFullName(String studentFullName) {
        this.studentFullName = studentFullName;
    }

    public String getParentFullName() {
        return parentFullName;
    }

    public void setParentFullName(String parentFullName) {
        this.parentFullName = parentFullName;
    }
    
    public String getRequestedByName() {
        return requestedByName;
    }

    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }
}
