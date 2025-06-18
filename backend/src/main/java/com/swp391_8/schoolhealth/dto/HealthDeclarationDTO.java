package com.swp391_8.schoolhealth.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class HealthDeclarationDTO {
    private Integer declarationId;
    private String studentCode;
    // parentUsername is not directly part of HealthDeclaration, it's contextual from the service call
    // private String parentUsername;    // Các trường emergency_contact_name và emergency_contact_phone đã được thay thế bởi emergencyContacts
    // Chỉ giữ lại để đảm bảo tương thích ngược
    @Deprecated
    private String emergencyContactName;
    @Deprecated
    private String emergencyContactPhone;
    
    private String physicianName;
    private String physicianPhone;
    private List<String> allergies;
    
    // Bảng health_declaration_conditions đã được thay thế bằng health_declaration_chronic_illnesses
    @Deprecated
    private List<String> medicalConditions; 
    private List<String> chronicIllnesses; // Sử dụng trường này thay vì medicalConditions
    private List<MedicationDTO> medications; // Added to match frontend
    private List<EmergencyContactDTO> emergencyContacts; // Added to match frontend
    private List<DeclaredVaccinationRecordDTO> vaccinations;
    private String visionScreeningResult;
    private LocalDate visionScreeningDate;
    private String hearingScreeningResult;
    private LocalDate hearingScreeningDate;
    private String dentalScreeningResult;
    private LocalDate dentalScreeningDate;
    private String scoliosisScreeningResult;
    private LocalDate scoliosisScreeningDate;
    private String notes;
    private Boolean consentSignature;
    private LocalDate declarationDate;
    private boolean isDraft;
    private String symptoms;
    private boolean hasSymptoms;
    private boolean closeContact;
    private boolean travelHistory;
    private String additionalInfo;
    
    // Thêm các trường liên quan đến phê duyệt
    private String status; // PENDING, APPROVED, REJECTED, DRAFT
    private Integer reviewedByUserId;
    private String reviewedByUsername;
    private String reviewedByName;
    private LocalDate reviewedAt;
    private String reviewNotes;
    
    // Added fields to match frontend form
    private String visionStatus;
    private String hearingStatus;
    private String specialNeeds;
    private String physicalLimitations;
    private String mentalHealthConcerns;
    private String dietaryRestrictions;
    private String medicalHistory;
    
    // Constructor to initialize Lists to prevent NullPointerException
    public HealthDeclarationDTO() {
        this.allergies = new ArrayList<>();
        this.medicalConditions = new ArrayList<>();
        this.chronicIllnesses = new ArrayList<>();
        this.medications = new ArrayList<>();
        this.emergencyContacts = new ArrayList<>();
        this.vaccinations = new ArrayList<>();
    }
    
    // Getters and Setters

    public Integer getDeclarationId() {
        return declarationId;
    }

    public void setDeclarationId(Integer declarationId) {
        this.declarationId = declarationId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }    /**
     * @deprecated Sử dụng danh sách emergencyContacts thay thế. 
     * Method này trả về tên liên hệ đầu tiên trong danh sách emergencyContacts.
     */
    @Deprecated
    public String getEmergencyContactName() {
        if (emergencyContacts != null && !emergencyContacts.isEmpty()) {
            return emergencyContacts.get(0).getName();
        }
        return emergencyContactName;
    }

    /**
     * @deprecated Sử dụng danh sách emergencyContacts thay thế.
     */
    @Deprecated
    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    /**
     * @deprecated Sử dụng danh sách emergencyContacts thay thế.
     * Method này trả về số điện thoại liên hệ đầu tiên trong danh sách emergencyContacts.
     */
    @Deprecated
    public String getEmergencyContactPhone() {
        if (emergencyContacts != null && !emergencyContacts.isEmpty()) {
            return emergencyContacts.get(0).getPhone();
        }
        return emergencyContactPhone;
    }

    /**
     * @deprecated Sử dụng danh sách emergencyContacts thay thế.
     */
    @Deprecated
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
        return allergies != null ? allergies : new ArrayList<>();
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public List<String> getMedicalConditions() {
        return medicalConditions != null ? medicalConditions : new ArrayList<>();
    }

    public void setMedicalConditions(List<String> medicalConditions) {
        this.medicalConditions = medicalConditions;
    }

    public List<DeclaredVaccinationRecordDTO> getVaccinations() {
        return vaccinations != null ? vaccinations : new ArrayList<>();
    }

    public void setVaccinations(List<DeclaredVaccinationRecordDTO> vaccinations) {
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

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean isDraft) {
        this.isDraft = isDraft;
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
    
    // New fields getters and setters
    public List<String> getChronicIllnesses() {
        return chronicIllnesses != null ? chronicIllnesses : new ArrayList<>();
    }

    public void setChronicIllnesses(List<String> chronicIllnesses) {
        this.chronicIllnesses = chronicIllnesses;
    }

    public List<MedicationDTO> getMedications() {
        return medications != null ? medications : new ArrayList<>();
    }

    public void setMedications(List<MedicationDTO> medications) {
        this.medications = medications;
    }

    public List<EmergencyContactDTO> getEmergencyContacts() {
        return emergencyContacts != null ? emergencyContacts : new ArrayList<>();
    }

    public void setEmergencyContacts(List<EmergencyContactDTO> emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }

    public String getVisionStatus() {
        return visionStatus;
    }

    public void setVisionStatus(String visionStatus) {
        this.visionStatus = visionStatus;
    }

    public String getHearingStatus() {
        return hearingStatus;
    }

    public void setHearingStatus(String hearingStatus) {
        this.hearingStatus = hearingStatus;
    }

    public String getSpecialNeeds() {
        return specialNeeds;
    }

    public void setSpecialNeeds(String specialNeeds) {
        this.specialNeeds = specialNeeds;
    }

    public String getPhysicalLimitations() {
        return physicalLimitations;
    }

    public void setPhysicalLimitations(String physicalLimitations) {
        this.physicalLimitations = physicalLimitations;
    }

    public String getMentalHealthConcerns() {
        return mentalHealthConcerns;
    }

    public void setMentalHealthConcerns(String mentalHealthConcerns) {
        this.mentalHealthConcerns = mentalHealthConcerns;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getReviewedByUserId() {
        return reviewedByUserId;
    }

    public void setReviewedByUserId(Integer reviewedByUserId) {
        this.reviewedByUserId = reviewedByUserId;
    }

    public String getReviewedByUsername() {
        return reviewedByUsername;
    }

    public void setReviewedByUsername(String reviewedByUsername) {
        this.reviewedByUsername = reviewedByUsername;
    }

    public String getReviewedByName() {
        return reviewedByName;
    }

    public void setReviewedByName(String reviewedByName) {
        this.reviewedByName = reviewedByName;
    }

    public LocalDate getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDate reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewNotes() {
        return reviewNotes;
    }

    public void setReviewNotes(String reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
}
