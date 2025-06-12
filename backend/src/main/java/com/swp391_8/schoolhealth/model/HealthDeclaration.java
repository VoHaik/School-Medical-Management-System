package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "health_declaration")
public class HealthDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "declaration_id")
    private Integer declarationId;

    @ManyToOne
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_code", referencedColumnName = "parent_code") 
    private Parent parent;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "physician_name")
    private String physicianName;

    @Column(name = "physician_phone")
    private String physicianPhone;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "health_declaration_allergies", joinColumns = @JoinColumn(name = "declaration_id"))
    @Column(name = "allergy")
    private List<String> allergies;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "health_declaration_conditions", joinColumns = @JoinColumn(name = "declaration_id"))
    @Column(name = "medical_condition")
    private List<String> medicalConditions;

    @OneToMany(mappedBy = "healthDeclaration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VaccinationRecord> vaccinations = new ArrayList<>(); // Assuming VaccinationRecord entity

    @Column(name = "vision_screening_result")
    private String visionScreeningResult;

    @Column(name = "vision_screening_date")
    private LocalDate visionScreeningDate;

    @Column(name = "hearing_screening_result")
    private String hearingScreeningResult;

    @Column(name = "hearing_screening_date")
    private LocalDate hearingScreeningDate;

    @Column(name = "dental_screening_result")
    private String dentalScreeningResult;

    @Column(name = "dental_screening_date")
    private LocalDate dentalScreeningDate;

    @Column(name = "scoliosis_screening_result")
    private String scoliosisScreeningResult;

    @Column(name = "scoliosis_screening_date")
    private LocalDate scoliosisScreeningDate;

    @Lob
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "consent_signature")
    private Boolean consentSignature;

    @Column(name = "declaration_date")
    private LocalDate declarationDate;

    @Column(name = "is_draft")
    private Boolean isDraft = false; // For save as draft functionality

    @Column(name = "symptoms")
    private String symptoms;

    @Column(name = "has_symptoms")
    private boolean hasSymptoms;

    @Column(name = "close_contact")
    private boolean closeContact;

    @Column(name = "travel_history")
    private boolean travelHistory;

    @Column(name = "additional_info")
    private String additionalInfo;

    // Getters and Setters

    public Integer getDeclarationId() {
        return declarationId;
    }

    public void setDeclarationId(Integer declarationId) {
        this.declarationId = declarationId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
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

    public List<VaccinationRecord> getVaccinations() {
        return vaccinations;
    }

    public void setVaccinations(List<VaccinationRecord> vaccinations) {
        this.vaccinations = vaccinations;
        if (vaccinations != null) {
            for (VaccinationRecord vr : vaccinations) {
                vr.setHealthDeclaration(this);
            }
        }
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

    public Boolean getIsDraft() {
        return isDraft;
    }

    public void setIsDraft(Boolean isDraft) {
        this.isDraft = isDraft;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public boolean isHasSymptoms() { // Changed from getHasSymptoms to isHasSymptoms for boolean
        return hasSymptoms;
    }

    public void setHasSymptoms(boolean hasSymptoms) {
        this.hasSymptoms = hasSymptoms;
    }

    public boolean isCloseContact() { // Changed from getCloseContact to isCloseContact for boolean
        return closeContact;
    }

    public void setCloseContact(boolean closeContact) {
        this.closeContact = closeContact;
    }

    public boolean isTravelHistory() { // Changed from getTravelHistory to isTravelHistory for boolean
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
}
