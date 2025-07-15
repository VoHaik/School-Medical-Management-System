package com.swp391_8.schoolhealth.dto;

import com.swp391_8.schoolhealth.service.UserService.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(min = 3, max = 50)
    private String fullName;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private String phone;

    private String gender; // Added gender
    private String relationship; // Added relationship (for Parent)

    private UserRole role = UserRole.Student; // Default role

    // Manual getters/setters for compatibility
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() { // Added getter for gender
        return gender;
    }

    public void setGender(String gender) { // Added setter for gender
        this.gender = gender;
    }

    public String getRelationship() { // Added getter for relationship
        return relationship;
    }

    public void setRelationship(String relationship) { // Added setter for relationship
        this.relationship = relationship;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
