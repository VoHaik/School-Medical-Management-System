package com.swp391_8.schoolhealth.dto;

import java.time.LocalDate;
import java.util.List;

public class HealthDeclarationDTO {
    private Integer declarationId; // Added
    private boolean isDraft; // Added
    private String studentCode; // Changed from Integer studentId to String studentCode
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String physicianName;
    private String physicianPhone;
    private List<String> allergies;
    private List<String> medicalConditions;
    private List<VaccinationRecordDTO> vaccinations; // Changed from VaccinationDTO
    private String visionScreeningResult;
    private LocalDate visionScreeningDate;
    private String hearingScreeningResult;
    private LocalDate hearingScreeningDate;
    private String dentalScreeningResult;
    private LocalDate dentalScreeningDate;
    private String scoliosisScreeningResult;
    private LocalDate scoliosisScreeningDate;
    private String notes;
    private Boolean consentSignature; // Representing the checkbox
    private LocalDate declarationDate;
    private String symptoms;
    private boolean hasSymptoms;
    private boolean closeContact;
    private boolean travelHistory;
    private String additionalInfo;
    // Add other fields as necessary from HealthDeclaration.js

    // Getters and Setters

    public Integer getDeclarationId() { // Added
        return declarationId;
    }

    public void setDeclarationId(Integer declarationId) { // Added
        this.declarationId = declarationId;
    }

    public boolean isDraft() { // Added
        return isDraft;
    }

    public void setDraft(boolean isDraft) { // Added
        this.isDraft = isDraft;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }

    public String getPhysicianName() {
        return physicianName;
    }

    public void setPhysicianName(String physicianName) {
        this.physicianName = physicianName;
    }

    public String getPhysicianPhone() {
        return physicianPhone;
    }

    public void setPhysicianPhone(String physicianPhone) {
        this.physicianPhone = physicianPhone;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public List<String> getMedicalConditions() {
        return medicalConditions;
    }

    public void setMedicalConditions(List<String> medicalConditions) {
        this.medicalConditions = medicalConditions;
    }

    public List<VaccinationRecordDTO> getVaccinations() { // Changed from VaccinationDTO
        return vaccinations;
    }

    public void setVaccinations(List<VaccinationRecordDTO> vaccinations) { // Changed from VaccinationDTO
        this.vaccinations = vaccinations;
    }

    public String getVisionScreeningResult() {
        return visionScreeningResult;
    }

    public void setVisionScreeningResult(String visionScreeningResult) {
        this.visionScreeningResult = visionScreeningResult;
    }

    public LocalDate getVisionScreeningDate() {
        return visionScreeningDate;
    }

    public void setVisionScreeningDate(LocalDate visionScreeningDate) {
        this.visionScreeningDate = visionScreeningDate;
    }

    public String getHearingScreeningResult() {
        return hearingScreeningResult;
    }

    public void setHearingScreeningResult(String hearingScreeningResult) {
        this.hearingScreeningResult = hearingScreeningResult;
    }

    public LocalDate getHearingScreeningDate() {
        return hearingScreeningDate;
    }

    public void setHearingScreeningDate(LocalDate hearingScreeningDate) {
        this.hearingScreeningDate = hearingScreeningDate;
    }

    public String getDentalScreeningResult() {
        return dentalScreeningResult;
    }

    public void setDentalScreeningResult(String dentalScreeningResult) {
        this.dentalScreeningResult = dentalScreeningResult;
    }

    public LocalDate getDentalScreeningDate() {
        return dentalScreeningDate;
    }

    public void setDentalScreeningDate(LocalDate dentalScreeningDate) {
        this.dentalScreeningDate = dentalScreeningDate;
    }

    public String getScoliosisScreeningResult() {
        return scoliosisScreeningResult;
    }

    public void setScoliosisScreeningResult(String scoliosisScreeningResult) {
        this.scoliosisScreeningResult = scoliosisScreeningResult;
    }

    public LocalDate getScoliosisScreeningDate() {
        return scoliosisScreeningDate;
    }

    public void setScoliosisScreeningDate(LocalDate scoliosisScreeningDate) {
        this.scoliosisScreeningDate = scoliosisScreeningDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getConsentSignature() {
        return consentSignature;
    }

    public void setConsentSignature(Boolean consentSignature) {
        this.consentSignature = consentSignature;
    }

    public LocalDate getDeclarationDate() {
        return declarationDate;
    }

    public void setDeclarationDate(LocalDate declarationDate) {
        this.declarationDate = declarationDate;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public boolean isHasSymptoms() {
        return hasSymptoms;
    }

    public void setHasSymptoms(boolean hasSymptoms) {
        this.hasSymptoms = hasSymptoms;
    }

    public boolean isCloseContact() {
        return closeContact;
    }

    public void setCloseContact(boolean closeContact) {
        this.closeContact = closeContact;
    }

    public boolean isTravelHistory() {
        return travelHistory;
    }

    public void setTravelHistory(boolean travelHistory) {
        this.travelHistory = travelHistory;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    // Removed Inner DTO for Vaccinations - It should be a top-level class com.swp391_8.schoolhealth.dto.VaccinationRecordDTO
}
