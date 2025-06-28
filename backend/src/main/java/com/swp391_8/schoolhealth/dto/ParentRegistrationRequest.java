package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentRegistrationRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    
    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 10, message = "Gender must not exceed 10 characters")
    private String gender;
    
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
    
    @Size(max = 50, message = "Emergency contact must not exceed 50 characters")
    private String emergencyContact;
    
    @NotBlank(message = "Relationship with student is required")
    @Size(max = 50, message = "Relationship must not exceed 50 characters")
    private String relationshipWithStudent;
    
    @NotBlank(message = "Parent code is required")
    @Size(max = 50, message = "Parent code must not exceed 50 characters")
    private String parentCode;
    
    // Thông tin học sinh để xác thực
    @NotBlank(message = "Student code is required")
    @Size(max = 50, message = "Student code must not exceed 50 characters")
    private String studentCode;
    
    @NotBlank(message = "Student full name is required")
    @Size(max = 100, message = "Student full name must not exceed 100 characters")
    private String studentFullName;
    
    @NotNull(message = "Student date of birth is required")
    private String studentDateOfBirth; // Sẽ được parse thành LocalDateTime
    
    @Size(max = 50, message = "Student class must not exceed 50 characters")
    private String studentClass;
}
