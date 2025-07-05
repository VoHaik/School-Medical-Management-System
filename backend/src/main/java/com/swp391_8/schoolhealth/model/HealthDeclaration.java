package com.swp391_8.schoolhealth.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.swp391_8.schoolhealth.model.DeclaredVaccinationRecord;

@Entity
@Table(name = "health_declaration")
public class HealthDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "declaration_id")
    private Integer declarationId;    @ManyToOne
    @JoinColumn(name = "student_code", referencedColumnName = "student_code", nullable = false)
    private Student student;
      // Các trường emergency_contact_name và emergency_contact_phone đã hoàn toàn bị loại bỏ
    // và được thay thế bằng bảng health_declaration_emergency_contacts

    @Nationalized
    @Column(name = "physician_name")
    private String physicianName;

    @Nationalized
    @Column(name = "physician_phone")
    private String physicianPhone;    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "health_declaration_allergies", joinColumns = @JoinColumn(name = "declaration_id"))
    @Column(name = "allergy")
    @Nationalized
    private List<String> allergies;
    
    // Bảng health_declaration_conditions đã được thay thế hoàn toàn bằng health_declaration_chronic_illnesses
    // Trường này chỉ giữ lại để tương thích ngược, nên sử dụng chronicIllnesses thay thế
    @Deprecated
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "health_declaration_chronic_illnesses", joinColumns = @JoinColumn(name = "health_declaration_id"))
    @Column(name = "chronic_illness")
    @Nationalized
    private List<String> medicalConditions;

    @OneToMany(mappedBy = "healthDeclaration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeclaredVaccinationRecord> vaccinations = new ArrayList<>(); // Assuming DeclaredVaccinationRecord entity

    // Thêm mối quan hệ với bảng health_declaration_medications
    @OneToMany(mappedBy = "healthDeclaration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HealthDeclarationMedication> medications = new ArrayList<>();

    // Thêm mối quan hệ với bảng health_declaration_emergency_contacts
    @OneToMany(mappedBy = "healthDeclaration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HealthDeclarationEmergencyContact> emergencyContacts = new ArrayList<>();
    
    // Thêm mối quan hệ với bảng health_declaration_chronic_illnesses
    @OneToMany(mappedBy = "healthDeclaration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HealthDeclarationChronicIllness> chronicIllnesses = new ArrayList<>();    @Nationalized
    @Column(name = "vision_screening_result")
    private String visionScreeningResult;

    @Column(name = "vision_screening_date")
    private LocalDate visionScreeningDate;

    @Nationalized
    @Column(name = "hearing_screening_result")
    private String hearingScreeningResult;

    @Column(name = "hearing_screening_date")
    private LocalDate hearingScreeningDate;

    @Nationalized
    @Column(name = "dental_screening_result")
    private String dentalScreeningResult;

    @Column(name = "dental_screening_date")
    private LocalDate dentalScreeningDate;

    @Nationalized
    @Column(name = "scoliosis_screening_result")
    private String scoliosisScreeningResult;

    @Column(name = "scoliosis_screening_date")
    private LocalDate scoliosisScreeningDate;

    @Lob
    @Nationalized
    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(name = "consent_signature")
    private Boolean consentSignature;

    @Column(name = "declaration_date")
    private LocalDate declarationDate;

    @Column(name = "is_draft")
    private Boolean isDraft = false; // For save as draft functionality    // Các trường liên quan đến COVID-19 có thể xem xét loại bỏ trong tương lai nếu không còn cần thiết
    
    @Nationalized
    @Column(name = "symptoms")
    private String symptoms;

    @Column(name = "has_symptoms")
    private boolean hasSymptoms;

    @Column(name = "close_contact")
    private boolean closeContact;    @Column(name = "travel_history")
    private boolean travelHistory;

    @Nationalized
    @Column(name = "additional_info")
    private String additionalInfo;
    
    // Các trường bổ sung theo form frontend
    @Nationalized
    @Column(name = "vision_status")
    private String visionStatus;
    
    @Nationalized
    @Column(name = "hearing_status")
    private String hearingStatus;
    
    @Nationalized
    @Column(name = "special_needs")
    private String specialNeeds;
    
    @Nationalized
    @Column(name = "physical_limitations")
    private String physicalLimitations;
    
    @Nationalized
    @Column(name = "mental_health_concerns")
    private String mentalHealthConcerns;
    
    @Nationalized
    @Column(name = "dietary_restrictions")
    private String dietaryRestrictions;
    
    @Nationalized
    @Column(name = "medical_history")
    private String medicalHistory;
    
    // Thêm trường status để quản lý trạng thái phê duyệt
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private HealthDeclarationStatus status = HealthDeclarationStatus.PENDING;
    
    // Thêm thông tin về người duyệt/từ chối
    @ManyToOne
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedBy;
    
    // Thêm ngày duyệt/từ chối
    @Column(name = "reviewed_at")
    private LocalDate reviewedAt;    // Thêm ghi chú từ người duyệt
    @Nationalized
    @Column(name = "review_notes")
    private String reviewNotes;
    
    // Thêm trường để tracking chỉnh sửa bởi y tá
    @Column(name = "last_modified_date")
    private LocalDate lastModifiedDate;
    
    @Nationalized
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
    
    // Enum cho trạng thái khai báo sức khỏe
    public enum HealthDeclarationStatus {
        PENDING, // Đang chờ phê duyệt
        APPROVED, // Đã được phê duyệt
        REJECTED, // Đã bị từ chối
        DRAFT // Bản nháp (chưa gửi)
    }

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
    }    /**
     * @deprecated Các trường emergency_contact_name và emergency_contact_phone đã được chuyển sang bảng health_declaration_emergency_contacts
     * và hãy sử dụng mối quan hệ emergencyContacts thay thế. Sẽ bị loại bỏ trong tương lai.
     */
    @Deprecated
    public String getEmergencyContactName() {
        if (emergencyContacts != null && !emergencyContacts.isEmpty()) {
            return emergencyContacts.get(0).getContactName();
        }
        return null;
    }

    /**
     * @deprecated Các trường emergency_contact_name và emergency_contact_phone đã được chuyển sang bảng health_declaration_emergency_contacts
     * và hãy sử dụng mối quan hệ emergencyContacts thay thế. Sẽ bị loại bỏ trong tương lai.
     */
    @Deprecated
    public void setEmergencyContactName(String emergencyContactName) {
        // Method giữ lại để đảm bảo tương thích ngược, không làm gì
    }

    /**
     * @deprecated Các trường emergency_contact_name và emergency_contact_phone đã được chuyển sang bảng health_declaration_emergency_contacts
     * và hãy sử dụng mối quan hệ emergencyContacts thay thế. Sẽ bị loại bỏ trong tương lai.
     */
    @Deprecated
    public String getEmergencyContactPhone() {
        if (emergencyContacts != null && !emergencyContacts.isEmpty()) {
            return emergencyContacts.get(0).getPhoneNumber();
        }
        return null;
    }

    /**
     * @deprecated Các trường emergency_contact_name và emergency_contact_phone đã được chuyển sang bảng health_declaration_emergency_contacts
     * và hãy sử dụng mối quan hệ emergencyContacts thay thế. Sẽ bị loại bỏ trong tương lai.
     */
    @Deprecated
    public void setEmergencyContactPhone(String emergencyContactPhone) {
        // Method giữ lại để đảm bảo tương thích ngược, không làm gì
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
    }    /**
     * @deprecated Sử dụng getChronicIllnesses() thay thế. 
     * Trường này chỉ giữ lại để tương thích ngược với mã cũ.
     */
    @Deprecated
    public List<String> getMedicalConditions() {
        return medicalConditions;
    }

    /**
     * @deprecated Sử dụng setChronicIllnesses() thay thế. 
     * Trường này chỉ giữ lại để tương thích ngược với mã cũ.
     */
    @Deprecated
    public void setMedicalConditions(List<String> medicalConditions) {
        this.medicalConditions = medicalConditions;
    }

    public List<DeclaredVaccinationRecord> getVaccinations() {
        return vaccinations;
    }

    public void setVaccinations(List<DeclaredVaccinationRecord> vaccinations) {
        this.vaccinations = vaccinations;
    }

    public List<HealthDeclarationMedication> getMedications() {
        return medications;
    }

    public void setMedications(List<HealthDeclarationMedication> medications) {
        this.medications = medications;
    }

    public List<HealthDeclarationEmergencyContact> getEmergencyContacts() {
        return emergencyContacts;
    }

    public void setEmergencyContacts(List<HealthDeclarationEmergencyContact> emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }

    public List<HealthDeclarationChronicIllness> getChronicIllnesses() {
        return chronicIllnesses;
    }

    public void setChronicIllnesses(List<HealthDeclarationChronicIllness> chronicIllnesses) {
        this.chronicIllnesses = chronicIllnesses;
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

    public HealthDeclarationStatus getStatus() {
        return status;
    }

    public void setStatus(HealthDeclarationStatus status) {
        this.status = status;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDate getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDate reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewNotes() {
        return reviewNotes;
    }    public void setReviewNotes(String reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
    
    // Getter và setter cho các trường mới
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
    }    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }
    
    public LocalDate getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDate lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }
}
