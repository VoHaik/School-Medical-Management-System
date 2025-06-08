package com.swp391_8.schoolhealth.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class HealthDeclarationDTO {
    private Integer studentId;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String physicianName;
    private String physicianPhone;
    private List<String> allergies;
    private List<String> medicalConditions;
    private List<VaccinationDTO> vaccinations;
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
    // Add other fields as necessary from HealthDeclaration.js

    // Getters and Setters

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
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

    public List<VaccinationDTO> getVaccinations() {
        return vaccinations;
    }

    public void setVaccinations(List<VaccinationDTO> vaccinations) {
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

    // Inner DTO for Vaccinations to match the structure in HealthDeclaration.js
    public static class VaccinationDTO {
        private String vaccineName;
        private List<String> doses; // Assuming doses are represented as a list of dates or descriptions

        public String getVaccineName() {
            return vaccineName;
        }

        public void setVaccineName(String vaccineName) {
            this.vaccineName = vaccineName;
        }

        public List<String> getDoses() {
            return doses;
        }

        public void setDoses(List<String> doses) {
            this.doses = doses;
        }
    }
}
