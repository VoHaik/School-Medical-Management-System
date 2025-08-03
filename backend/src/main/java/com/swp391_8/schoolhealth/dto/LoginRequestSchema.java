package com.swp391_8.schoolhealth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for user login")
public class LoginRequestSchema {
    
    @Schema(description = "Username or email", example = "admin@school.com", required = true)
    private String username;
    
    @Schema(description = "User password", example = "password123", required = true)
    private String password;
    
    // Constructors
    public LoginRequestSchema() {}
    
    public LoginRequestSchema(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    // Getters and setters
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
}
