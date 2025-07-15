package com.swp391_8.schoolhealth.dto;

public class EmergencyContactDTO {
    private Integer contactId;
    private String name;
    private String relationship;
    private String phoneNumber;
    private String alternativePhone;
    private String email;
    private String address;
    private Boolean isPrimary;
    private String notes;
    private boolean isEmergency; // For backwards compatibility

    // Default constructor
    public EmergencyContactDTO() {
    }

    // Parameterized constructor
    public EmergencyContactDTO(Integer contactId, String name, String relationship, String phoneNumber, 
                              String alternativePhone, String email, String address, 
                              Boolean isPrimary, String notes, boolean isEmergency) {
        this.contactId = contactId;
        this.name = name;
        this.relationship = relationship;
        this.phoneNumber = phoneNumber;
        this.alternativePhone = alternativePhone;
        this.email = email;
        this.address = address;
        this.isPrimary = isPrimary;
        this.notes = notes;
        this.isEmergency = isEmergency;
    }    // Getters and setters
    public Integer getContactId() {
        return contactId;
    }

    public void setContactId(Integer contactId) {
        this.contactId = contactId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhone() {
        return phoneNumber; // For backwards compatibility
    }

    public void setPhone(String phone) {
        this.phoneNumber = phone; // For backwards compatibility
    }

    public String getAlternativePhone() {
        return alternativePhone;
    }

    public void setAlternativePhone(String alternativePhone) {
        this.alternativePhone = alternativePhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isEmergency() {
        return isEmergency;
    }

    public void setEmergency(boolean isEmergency) {
        this.isEmergency = isEmergency;
    }
}
